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
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          let tasksOrdered = res.data.data.requests.sort((a, b) => a.id <= b.id ? 1 : -1)
          this.setState({tasks : tasksOrdered, dataResponse: res.data.data});
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
    return (
      this.state.dataResponse ?
      <div className="task-section">
        <div className="block-title">
          <h4 className="title text-uppercase">{t("RequestManagement")}</h4>
        </div>
        <RequestTaskList tasks={this.state.tasks} page="request"/>         
      </div> : 
      <LoadingSpinner />
    )
  }
}

export default withTranslation()(RequestComponent)
