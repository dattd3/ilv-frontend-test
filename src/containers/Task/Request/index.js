import React from 'react'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import TaskList from '../taskList'

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
      axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/approval`, config)
      .then(res => {
        if (res && res.data && res.data.data && res.data.result) {
          const result = res.data.result;
          if (result.code != Constants.API_ERROR_CODE) {
            this.setState({tasks : res.data.data.listUserProfileHistories});
          }
        }
      }).catch(error => {
        this.props.sendData(null);
        this.setState({tasks : []});
      });
    }

    render() {
      return (
      <div className="task-section">
          <h4 className="title text-uppercase">Quản lý thông tin phê duyệt</h4>
          <TaskList tasks={this.state.tasks} page="request" />
      </div>
      )
    }
  }
export default ApprovalComponent