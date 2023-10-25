import React from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"
import moment from 'moment'
import Select from 'react-select'
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation } from "react-i18next"

class ExportModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {},
          fromDate: new Date(),
          toDate: new Date(),
          status:null,
          disabledDownloadBtn: false,
        }
    }
  
    componentDidMount() {
      this.setState({ disabledDownloadBtn: false });
    }

    handleSelectChange(name, value) {
      this.setState({ [name]: value })
    }

    setFromDate = (date)=>{
      this.setState({fromDate: date})
    }

    setToDate = (date)=>{
      this.setState({toDate: date})
    }
    exportExcel = () => {
      let type = this.props.exportType == "consent" ? "appraiser" : "approver";
      let fileName = `RequestHistory_${moment(new Date(),'MM-DD-YYYY_HHmmss').format('MM-DD-YYYY_HHmmss')}.xlsx`
      
      const config = {
        responseType: 'blob',
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/octet-stream'
        },
        params: {
          type: type,
          status: this.state.status ? this.state.status.value : 0,
          companyCode: localStorage.getItem("companyCode"),
          fromDate: moment(this.state.fromDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
          toDate: moment(this.state.toDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
          divisionId: null,
          regionId: null,
          unitId: null
        }
      }
      this.setState({ disabledDownloadBtn: true });
      const HOST = this.props.requestCategory == 1 ? process.env.REACT_APP_REQUEST_URL : process.env.REACT_APP_REQUEST_SERVICE_URL;
      axios.get(`${HOST}Request/ExportExcel`, config)
      .then(res => {
        var blob = new Blob([res.data], { type: "application/octetstream" });
 
        //Check the Browser type and download the File.
        var isIE = false || !!document.documentMode;

        if (isIE) {
          window.navigator.msSaveBlob(blob, fileName);
        } 
        else {
          var url = window.URL || window.webkitURL;
          let link = url.createObjectURL(blob);
          var a = document.createElement("a");

          a.setAttribute("download", fileName);
          a.setAttribute("href", link);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          setTimeout(() => {  this.hideExportModal() }, 1000);  
          this.setState({ disabledDownloadBtn: false });
          
        }
      }).catch(error => {
  
      });
    }

    errorDate = (fromDate, toDate) => {
      return fromDate > toDate ? "Vui lòng chọn Từ ngày nhỏ hơn Đến ngày" : null
    }
    hideExportModal() {
      this.props.onHide()
    }
    render() {
        const { t } = this.props
        return (
            <Modal backdrop="static" keyboard={false}
                size="lg"
                className='info-modal-common position-apply-modal'
                centered show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header className="apply-position-modal bg-approved" closeButton>
                    <Modal.Title>{t("LabelDownloadReport")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="time-area row">
                  <div className="col-6">
                    <div className="content input-container">
                      <label className="mb-1">Từ ngày</label>
                      <label>
                        <DatePicker 
                          selectsStart 
                          autoComplete="off"
                          dateFormat="dd/MM/yyyy"
                          selected={ moment(this.state.fromDate, 'DD/MM/YYYY').toDate()} 
                          onChange={date => this.setFromDate(date)} 
                          className="form-control input" 
                          placeholderText={t('Select')} /> 
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="content input-container">
                    <label className="mb-1">Đến ngày</label>
                      <label>
                        <DatePicker
                          selectsStart 
                          autoComplete="off"
                          dateFormat="dd/MM/yyyy"
                          selected={ moment(this.state.toDate, 'DD/MM/YYYY').toDate()} 
                          onChange={date => this.setToDate(date)} 
                          className="form-control input" 
                          placeholderText={t('Select')}/> 
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                  </div>
                </div> 
                <span className='text-danger'>{this.errorDate(this.state.fromDate,this.state.toDate)}</span>
                <div className="check_tatus_area w-100 mt-2">
                <label className="mb-1">Tình trạng</label>
                <Select name="status" 
                   className="w-100" 
                   defaultValue={this.props.statusOptions[0]}
                   value={this.state.status || this.props.statusOptions[0]} 
                   isClearable={false}
                   onChange={status => this.handleSelectChange('status', status)} 
                   placeholder={t('SortByStatus')} key="status" options={this.props.statusOptions} 
                   theme={theme => ({
                   ...theme,
                   colors: {
                       ...theme.colors,
                       primary25: '#F9C20A',
                       primary: '#F9C20A',
                   },
                   })}/>                 
                </div>
                <div className="clearfix mt-2">
                  <button type="button" className='btn btn-primary w-25 float-right'  disabled={this.state.disabledDownloadBtn} onClick={this.exportExcel}>
                  {!this.state.disabledDownloadBtn ? t("Dowload") :
                   <Spinner
                   as="span"
                   animation="border"
                   size="sm"
                   role="status"
                   aria-hidden="true"
                  />}                 
                  </button>
                  <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide}>{t("Cancel2")}</button>
                </div>
                </Modal.Body>
                </Modal>
        )
    }
}

export default withTranslation()(ExportModal)
