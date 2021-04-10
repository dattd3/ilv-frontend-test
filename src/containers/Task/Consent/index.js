import React from 'react'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
// import RequestTaskList from '../requestTaskList';
import ResultModal from '../../Registration/ResultModal'


class ConsentComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      taskCheckeds: [],
      dataResponse: {},
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}request/assessing?companyCode=`+localStorage.getItem("companyCode"), config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered =res.data.data.requests
          let taskList = [];
          tasksOrdered.forEach(element => {
            element.requestInfo.forEach(e => {
                e.user = element.user
                e.appraiser = element.appraiser
                e.requestType = element.requestType
                e.requestTypeId = element.requestTypeId
                if(element.requestTypeId == 5 || element.requestTypeId == 4)
                {
                  e.timesheets.forEach(ts => {
                    // e.startDate = ts.startDate
                    e.id = element.id
                  })
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

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: Constants.STATUS_WAITING_CONSENTED , label: t("Waiting") },
      { value: Constants.STATUS_WAITING , label: t("Đã thẩm định") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_NO_CONSENTED , label: t("Từ chối") },
    ]
    return (
      this.state.dataResponse ?
      <>
      {/* <ResultModal show={this.state.isShowStatusModal} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} /> */}
      <div className="task-section">
        <TaskList tasks={this.state.tasks} filterdata={statusFiler} page="consent" title={t("ConsentManagement")}/>       
      </div>
      </> : 
      <LoadingSpinner />
    )
  }
}

export default withTranslation()(ConsentComponent)
