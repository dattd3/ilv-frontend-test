import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import processingDataReq from "../../Utils/Common"


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
    let params = `pageIndex=${Constants.TASK_PAGE_INDEX_DEFAULT}&pageSize=${Constants.TASK_PAGE_SIZE_DEFAULT}&`;
    this.requestRemoteData(params);
  }

  requestRemoteData = (params) => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    let item = {};
    axios.get(`${process.env.REACT_APP_REQUEST_URL}request/assessing?${params}companyCode=`+localStorage.getItem("companyCode"), config)
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
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_NO_CONSENTED , label: t("Rejected") },
      // { value: Constants.STATUS_REVOCATION , label: t("Canceled") },
      { value: Constants.STATUS_OB_SELF_EVALUATION , label:'Tự đánh giá' },
      { value: Constants.STATUS_OB_APPRAISER_EVALUATION , label: "Người đánh giá" },
      { value: Constants.STATUS_OB_SUPERVISOR_EVALUATION , label: "QLTT đánh giá" },
      { value: Constants.STATUS_OB_APPROVER_EVALUATION , label: "CBLĐ phê duyệt" },
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
