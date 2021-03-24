import React from 'react'
import axios from 'axios'
import {InputGroup, FormControl} from 'react-bootstrap'
import Select from 'react-select'
import { withTranslation } from "react-i18next"
import TaskList from '../taskList'
import ConfirmRequestModal from '../ConfirmRequestModal'
import Constants from '../../../commons/Constants'

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      disabled: "disabled",
      dataToSap: [],
      isConfirmShow: false,
      modalTitle: "",
      modalMessage: "",
      typeRequest: 1
    }
  }
  
  approval = () => {
    const { t } = this.props
    console.log(this.state.tasks);
    this.setState({ isConfirmShow: true, modalTitle: "Xác nhận phê duyệt", modalMessage: "Bạn có đồng ý phê duyệt những yêu cầu này?", typeRequest: Constants.STATUS_APPROVED })
  }

  disApproval = () => {
      const { t } = this.props
      this.setState({ isConfirmShow: true, modalTitle: "Xác nhận không phê duyệt", modalMessage: "Lý do không phê duyệt (Bắt buộc)", typeRequest: Constants.STATUS_NOT_APPROVED })
  }
  
  onHideModalConfirm() {
    this.setState({ isConfirmShow: false })
  }

  updateData() {
    this.props.updateData()
  }

  exportToExcel = () => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/export-to-excel?tabs=approval`, null, config)
    .then(res => {
      const fileUrl = res.data
      if (fileUrl) {
        window.open(fileUrl);
      }
    }).catch(error => {

    });
  }
  handleChange = (selectedTask) => {
    if(selectedTask.length)
    {
      this.setState({ disabled:"", dataToSap: selectedTask })
    }
    else
    {
      this.setState({ disabled:"disabled", tasks:[] })
    }
  }

  updateTaskStatus = (id, status) =>{
    // setTimeout(() => {  window.location.reload(); }, 1000);
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {
    const {t} = this.props;
    let absenceTypes = [
      { value: 'IN01', label: 'Đang xử lý' },
      { value: 'UN01', label: 'Đã phê duyệt' },
      { value: 'UN01', label: 'Đã thu hồi' }
    ]
    return (
      <>
      <ConfirmRequestModal
                urlName={'requestabsence'}
                dataToSap={this.state.dataToSap}
                id="total"
                show={this.state.isConfirmShow}
                title={this.state.modalTitle}
                type={this.state.typeRequest}
                updateData={this.updateData.bind(this)}
                message={this.state.modalMessage}
                onHide={this.onHideModalConfirm.bind(this)}
                updateTask = {this.updateTaskStatus}
            />
      <div className="task-section">
        <div className="row w-50 mt-2 mb-3">
          <div className="col-xl-6">
            <InputGroup className="d-flex">
              <InputGroup.Prepend className="">
                <InputGroup.Text id="basic-addon1"><i className="fas fa-filter"></i></InputGroup.Text>
              </InputGroup.Prepend>
              <Select name="absenceType" className="w-75" value={this.state.absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} placeholder={t('SortByStatus')} key="absenceType" options={absenceTypes} />
            </InputGroup>
          </div>
          <div className="col-xl-6">
          <InputGroup className="">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
            placeholder={t('SearchRequester')}
            aria-label="SearchRequester"
            aria-describedby="basic-addon2"
            />
          </InputGroup>
          </div>
        </div> 
        <div className="block-title">
          <h4 className="title text-uppercase">Quản lý thông tin phê duyệt</h4>
          {/* <button type="button" className="btn btn-outline-primary" onClick={this.exportToExcel}><i className='fas fa-file-export ic-export'></i>Export</button> */}
        </div>
        <TaskList tasks={this.props.tasks} page="approval" handleChange={this.handleChange}/>
        <div className="bg-white d-flex justify-content-center mt-2 mb-3 p-3">
          <button type="button" className="btn btn-danger mr-3" onClick={this.disApproval.bind(this)} disabled={this.state.disabled}><i className='fas fa-times mr-2'></i>Không phê duyệt</button>
          <button type="button" className="btn btn-success"  onClick={this.approval.bind(this)} disabled={this.state.disabled}><i className='fas fa-check mr-2'></i>Phê duyệt</button>
        </div> 
      </div>
      </>
    )
  }
}

export default withTranslation()(ApprovalComponent)
