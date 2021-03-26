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
          let tasksOrdered =res.data.data.requests.sort((a, b) => a.id <= b.id ? 1 : -1)
          this.setState({tasks : tasksOrdered, dataResponse: res.data.data});
        }
      }
    }).catch(error => {
      this.setState({tasks : []});
    });
  }

  render() {
    const { t } = this.props
    return (
      this.state.dataResponse ?
      <>
      {/* <ResultModal show={this.state.isShowStatusModal} title={this.state.resultTitle} message={this.state.resultMessage} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} /> */}
      <div className="task-section">
        <TaskList tasks={this.state.tasks} page="consent" title={t("ConsentManagement")}/>       
      </div>
      </> : 
      <LoadingSpinner />
    )
  }
}

export default withTranslation()(ConsentComponent)
