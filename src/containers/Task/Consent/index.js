import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import processingDataReq from "../../Utils/Common"
import { checkIsExactPnL } from '../../../commons/commonFunctions'


class ConsentComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      taskCheckeds: [],
      dataResponse: {},
      totalRecord: 0
    }
  }

  componentDidMount() {
    let params = `pageIndex=${Constants.TASK_PAGE_INDEX_DEFAULT}&pageSize=${Constants.TASK_PAGE_SIZE_DEFAULT}&status=${Constants.STATUS_WAITING_CONSENTED}&`;
    this.requestRemoteData(params, 1);
  }

  // 1: other requests
  // 2: salary
  requestRemoteData = (params, category = 1) => {
    const HOST = category === 1 ? process.env.REACT_APP_REQUEST_URL : process.env.REACT_APP_SALARY_URL;
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    config.timeout = Constants.timeoutForSpecificApis
    axios.get(`${HOST}request/assessing?${params}companyCode=`+localStorage.getItem("companyCode"), config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered =res.data.data.requests
          let taskList = processingDataReq(tasksOrdered,"consent")
          this.setState({tasks : taskList, totalRecord: res.data.data.total, dataResponse: res.data.data});
        }
      }
    }).catch(error => {
      this.setState({tasks : [], totalRecord: 0});
    });
  }

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: 0, label: t("All") },
      { value: Constants.STATUS_WAITING_CONSENTED , label: t("Waiting") },
      { value: Constants.STATUS_WAITING , label: t("Consented") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      { value: Constants.STATUS_PARTIALLY_SUCCESSFUL , label: t("PartiallySuccessful") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_NO_CONSENTED , label: t("Rejected") },
      // { value: Constants.STATUS_REVOCATION , label: t("Canceled") },
    ]
    return (
      this.state.dataResponse ?
      <>
        <div className="task-section">
          <TaskList tasks={this.state.tasks} filterdata={statusFiler} requestRemoteData ={this.requestRemoteData} total ={this.state.totalRecord} page="consent" title={t("ConsentManagement")}/>
        </div>
      </> : 
      <LoadingSpinner />
    )
  }
}

export default withTranslation()(ConsentComponent)
