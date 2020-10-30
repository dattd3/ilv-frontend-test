import React from 'react'
import TaskList from '../taskList'

class ApprovalComponent extends React.Component {
    render() {
      return (
      <div className="task-section">
          <h4 className="title text-uppercase">Quản lý thông tin phê duyệt</h4>
          <TaskList tasks={this.props.tasks} page="approval" />
      </div>
      )
    }
  }
export default ApprovalComponent