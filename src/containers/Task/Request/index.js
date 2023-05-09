import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import processingDataReq from "../../Utils/Common"
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import RequestTaskList from '../requestTaskList';
import HOCComponent from '../../../components/Common/HOCComponent'
import { getValueParamByQueryString, setURLSearchParam } from 'commons/Utils'
import { REQUEST_CATEGORIES } from '../Constants'
import LoadingModal from 'components/Common/LoadingModal'

class RequestComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: false,
      tasks: [],
      totalRecord: 0,
      dataResponse: {}
    }
  }

  componentDidMount() {
    const params = `pageIndex=${Constants.TASK_PAGE_INDEX_DEFAULT}&pageSize=${Constants.TASK_PAGE_SIZE_DEFAULT}&`;
    const currentRequestCategory = getValueParamByQueryString(window.location.search, "requestCategory") || REQUEST_CATEGORIES.CATEGORY_1;

    this.requestRemoteData(params, currentRequestCategory);
  }

  exportToExcel = () => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
    }
    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/export-to-excel?tabs=request`, null, config)
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
  requestRemoteData = (params, category = 1) => {
    const HOST = category == 1 ? process.env.REACT_APP_REQUEST_URL : process.env.REACT_APP_REQUEST_SERVICE_URL;
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    this.setState({
      isLoading: true
    })
    config.timeout = Constants.timeoutForSpecificApis
    axios.get(`${HOST}request/list?${params}companyCode=`+localStorage.getItem("companyCode") , config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered = res.data.data.requests
          let taskList = processingDataReq(tasksOrdered,"request")
          this.setState({tasks : taskList, totalRecord: res.data.data.total, dataResponse: res.data.data});
        }
      }
    }).catch(error => { 
      console.log(error);
      this.setState({tasks : [], totalRecord: 0});
    }).finally(() => {
      this.setState({
        isLoading: false
      })
    });
    setURLSearchParam("requestCategory", category)
  }

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: 0, label: t("All") },
      { value: Constants.STATUS_WAITING_CONSENTED , label: t("PendingConsent") },
      { value: Constants.STATUS_WAITING , label: t("PendingApproval") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      { value: Constants.STATUS_PARTIALLY_SUCCESSFUL , label: t("PartiallySuccessful") },
      { value: Constants.STATUS_NOT_APPROVED , label: t("Rejected") },
      // { value: Constants.STATUS_NO_CONSENTED , label: t("NotConsent") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_REVOCATION , label: t("Canceled") }
    ]
    return (<>
      <LoadingModal show={this.state.isLoading} />
      {this.state.dataResponse ?
      <div className="task-section">
        <RequestTaskList tasks={this.state.tasks} requestRemoteData ={this.requestRemoteData} total ={this.state.totalRecord} filterdata={statusFiler} title={t("RequestManagement")} page="request"/>         
      </div> : 
      <LoadingSpinner />}
      </>
    )
  }
}

export default HOCComponent(withTranslation()(RequestComponent))
