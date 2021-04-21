import React from 'react'
import { Modal } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"
import moment from 'moment'
import Select from 'react-select'
import { withTranslation } from "react-i18next"

class ExportModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {},
          fromDate: new Date(),
          toDate: new Date(),
          status:null
        }
    }
  
    componentDidMount() {
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        },
        params:{
          id: this.props.taskId,
          subid: this.props.subId
        }
      }
      if(this.props.taskId)
      {
        axios.get(`${process.env.REACT_APP_REQUEST_URL}request/detail`, config)
        .then(res => {
          if (res && res.data) {
            const data = res.data
            if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
              return window.location.href = map.NotFound;
            }
            const response = data.data
            this.setState({data: response })
            console.log(this.state.data);
          }
        }).catch(error => {
          console.log(error)
        });
      }
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
      let type = this.props.exportType == "consent" ? "Appraiser" : "Approver";
      
      const config = {
        headers: {
          'Authorization': `${localStorage.getItem('accessToken')}`
        },
        params: {
          Type: type,
          ProcessStatusId: this.state.status.value,
          companyCode: localStorage.getItem("companyCode"),
          fromDate: moment(this.state.fromDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
          toDate: moment(this.state.toDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
          divisionId: null,
          regionId: null,
          unitId: null
        }
      }
      
      debugger
      axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/ExportExcel`, config)
      .then(res => {
        const fileUrl = res.data
        if (fileUrl) {
          window.open(fileUrl);
        }
      }).catch(error => {
  
      });
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
                    <Modal.Title>Tải về báo cáo</Modal.Title>
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
                <div className="check_tatus_area w-100 mt-2">
                <label className="mb-1">Tình trạng</label>
                <Select name="status" 
                   className="w-100" 
                   value={this.state.status || ""} 
                   isClearable={true}
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
                  <button type="button" className='btn btn-primary w-25 float-right' onClick={this.exportExcel}>Tải về</button>
                  <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide}>Hủy</button>
                </div>
                </Modal.Body>
                </Modal>
        )
    }
}

export default withTranslation()(ExportModal)
