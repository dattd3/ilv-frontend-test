import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import processingDataReq from "../../Utils/Common"
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import RequestTaskList from '../requestTaskList';

class RequestComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      dataResponse: {}
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}request/list?companyCode=`+localStorage.getItem("companyCode"), config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered = res.data.data.requests
          let taskList = processingDataReq(tasksOrdered,"request")
          this.setState({tasks : taskList, dataResponse: res.data.data});
        }
      }
    }).catch(error => { 
      this.setState({tasks : []});
    });
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

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: 0, label: t("All") },
      { value: Constants.STATUS_WAITING_CONSENTED , label: t("Waiting") },
      { value: Constants.STATUS_WAITING , label: t("Consented") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      { value: Constants.STATUS_NOT_APPROVED , label: t("Rejected") },
      // { value: Constants.STATUS_NO_CONSENTED , label: t("NotConsent") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_REVOCATION , label: t("Canceled") }
    ]
    return (
      this.state.dataResponse ?
      <div className="task-section">
        <RequestTaskList tasks={this.state.tasks} filterdata={statusFiler} title={t("RequestManagement")} page="request"/>         
      </div> : 
      <LoadingSpinner />
    )
  }
}

export default withTranslation()(RequestComponent)
