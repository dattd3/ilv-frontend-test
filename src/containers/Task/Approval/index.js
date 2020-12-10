import React from 'react'
import axios from 'axios'
import TaskList from '../taskList'

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
  }

  exportToExcel = () => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/export-to-excel?tabs=approval`, null, config)
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
      <div className="task-section">
        <div className="block-title">
          <h4 className="title text-uppercase">Quản lý thông tin phê duyệt</h4>
          <button type="button" className="btn btn-outline-primary" onClick={this.exportToExcel}><i className='fas fa-file-export ic-export'></i>Export</button>
        </div>
        <TaskList tasks={this.props.tasks} page="approval" />
      </div>
    )
  }
}

export default ApprovalComponent
