import React from 'react'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: []
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      }
    }
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/request`, config)
    .then(res => {
      if (res && res.data && res.data.data && res.data.result) {
        const result = res.data.result;
        if (result.code != Constants.API_ERROR_CODE) {
          this.setState({tasks : res.data.data.listUserProfileHistories});
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
    return (
      this.state.tasks && this.state.tasks.length  ?
      <div className="task-section">
        <div className="block-title">
          <h4 className="title text-uppercase">Quản lý thông tin yêu cầu</h4>
          {/* <button type="button" className="btn btn-outline-primary" onClick={this.exportToExcel}><i className='fas fa-file-export ic-export'></i>Export</button> */}
        </div>
        <TaskList tasks={this.state.tasks} page="request" />         
      </div> : 
      <LoadingSpinner />
    )
  }
}

export default ApprovalComponent
