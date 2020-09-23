import React from 'react';
import axios from 'axios';
import Constants from '../../../commons/Constants';
import TaskList from '../taskList';

class RequestComponent extends React.Component {
    constructor() {
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
          console.log(res.data.data);
          if (result.code != Constants.API_ERROR_CODE) {
            this.setState({tasks : res.data.data.listUserProfileHistories});
          }
        }
      }).catch(error => {
        this.setState({tasks : []});
      });
    }

    // saveData = () => {
    //   const config = {
    //     headers: {
    //       'Authorization': `${localStorage.getItem('accessToken')}`
    //     }
    //   }

    //   let formData = new FormData()
    //     formData.append('Code', 1)
    //     formData.append('Name', 'Họ tên - Bằng cấp - Gia đình')
    //     formData.append('Comment', 'Tôi muốn update Họ tên, Bằng cấp, Gia đình')
    //     formData.append('HRComment', '')
    //     formData.append('UserProfileInfo', '')
    //     formData.append('UserProfileDocuments', null)

    //   axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories`, formData, config)
    //   .then(res => {
        
    //   }).catch(error => {

    //   });
    // }

    render() {
      return (
      <div className="task-section">
        <h4 className="title text-uppercase">Quản lý thông tin yêu cầu</h4>
        <TaskList tasks={this.state.tasks}/>
      </div>)
    }
  }
export default RequestComponent
