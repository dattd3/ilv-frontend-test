import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import moment from "moment"
import TaskList from '../taskList'
import Constants from '../../../commons/Constants'
import processingDataReq from "../../Utils/Common"
import HOCComponent from '../../../components/Common/HOCComponent'
import { getRequestTypesList, getValueParamByQueryString, setURLSearchParam } from 'commons/Utils'
import { REQUEST_CATEGORIES } from '../Constants'
import LoadingModal from 'components/Common/LoadingModal'

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: false,
      tasks: [],
      dataToSap: [],
      totalRecord: 0
    }
    if (!getValueParamByQueryString(window.location.search, "requestTypes")) {
      setURLSearchParam("requestTypes", getRequestTypesList(REQUEST_CATEGORIES.CATEGORY_1, false)?.join(","))
    }
  }

  componentDidMount() {
    const params = `pageIndex=${Constants.TASK_PAGE_INDEX_DEFAULT}&pageSize=${Constants.TASK_PAGE_SIZE_DEFAULT}&status=${Constants.STATUS_WAITING}&fromDate=${moment().subtract(7, "days").format("YYYYMMDD")}&toDate=${moment().format("YYYYMMDD")}&`;
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
  // 1: other requests
  // 2: salary
  requestRemoteData = (params) => {
    const requestTypes = getValueParamByQueryString(window.location.search, "requestTypes")?.split(",")
    const category = Constants.REQUEST_CATEGORY_2_LIST[requestTypes?.[0]*1] ? REQUEST_CATEGORIES.CATEGORY_2 : REQUEST_CATEGORIES.CATEGORY_1
    const HOST = category === 1 ? process.env.REACT_APP_REQUEST_URL : process.env.REACT_APP_REQUEST_SERVICE_URL
    this.setState({
      isLoading: true
    })
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    config.timeout = Constants.timeoutForSpecificApis
    axios.get(`${HOST}request/approval?${params}companyCode=${localStorage.getItem("companyCode")}&requestTypes=${getValueParamByQueryString(window.location.search, "requestTypes")}`, config)
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
    }).finally(() => {
      this.setState({
        isLoading: false
      })
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
    ]
    return (
      <>
        <LoadingModal show={this.state.isLoading} />
        <div className="task-section">
          <TaskList tasks={this.state.tasks} requestRemoteData ={this.requestRemoteData} total ={this.state.totalRecord} filterdata={statusFiler} page="approval" title={t("ApprovalManagement")}/>
        </div>
      </>
    )
  }
}

export default HOCComponent(withTranslation()(ApprovalComponent))
