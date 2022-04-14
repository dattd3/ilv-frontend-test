import React from 'react'
import axios from 'axios'
import {InputGroup, FormControl} from 'react-bootstrap'
import Select from 'react-select'
import { withTranslation } from "react-i18next"
import TaskList from '../taskList'
import ConfirmRequestModal from '../ConfirmRequestModal'
import Constants from '../../../commons/Constants'
import processingDataReq from "../../Utils/Common"

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      dataToSap: [],
      totalRecord: 0
    }
  }

  componentDidMount() {
    let params = `pageIndex=${Constants.TASK_PAGE_INDEX_DEFAULT}&pageSize=${Constants.TASK_PAGE_SIZE_DEFAULT}&status=${Constants.STATUS_WAITING}&`;
    this.requestRemoteData(params);
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

  requestRemoteData = (params) => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}request/approval?${params}companyCode=`+localStorage.getItem("companyCode"), config)
        .then(res => {
          if (res && res.data && res.data.data && res.data.result) {
            const result = res.data.result;
            if (result.code != Constants.API_ERROR_CODE) {
              let tasksOrdered = res.data.data.requests
              let taskList = processingDataReq(tasksOrdered, "approval")
              this.setState({tasks : taskList, totalRecord: res.data.data.total});
            }
          }
    }).catch(error => {
      this.setState({tasks : [], totalRecord: 0});
    })
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: 0, label: t("All") },
      { value: Constants.STATUS_WAITING , label: t("Waiting") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      { value: Constants.STATUS_PARTIALLY_SUCCESSFUL , label: t("PartiallySuccessful") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_NOT_APPROVED , label: t("Rejected") },
      // { value: Constants.STATUS_REVOCATION , label: t("Canceled") },
      { value: Constants.STATUS_OB_APPROVER_EVALUATION , label: "CBLĐ phê duyệt" },
    ]
    return (
      <>
        <div className="task-section">
          <TaskList tasks={this.state.tasks} requestRemoteData ={this.requestRemoteData} total ={this.state.totalRecord} filterdata={statusFiler} page="approval" title={t("ApprovalManagement")}/>
        </div>
      </>
    )
  }
}

export default withTranslation()(ApprovalComponent)
