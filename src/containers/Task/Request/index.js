import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'
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
        // debugger
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered = res.data.data.requests
          let taskList = [];
          
          tasksOrdered.forEach(element => {
            element.requestInfo.forEach(e => {
                e.user = element.user
                e.appraiser = element.appraiser
                e.requestType = element.requestType
                e.requestTypeId = element.requestTypeId
                if(element.requestTypeId == 5 || element.requestTypeId == 4)
                {
                  e.processStatusId = element.processStatusId
                  e.id = element.id.toString()
                  e.startDate = e.date
                }
                taskList.push(e);
            })
          });
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
      { value: Constants.STATUS_WAITING_CONSENTED , label: t("Waiting") },
      { value: Constants.STATUS_WAITING , label: t("Đã thẩm định") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      { value: Constants.STATUS_NOT_APPROVED , label: t("Từ chối phê duyệt") },
      { value: Constants.STATUS_NO_CONSENTED , label: t("Từ chối thẩm định") },
      { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_REVOCATION , label: t("Đã hủy") }
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
