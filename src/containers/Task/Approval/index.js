import React from 'react'
import TaskList from '../taskList'

class ApprovalComponent extends React.Component {

    constructor() {
        super();
        this.state = {
          tasks: [
            {
              content: 'Họ và Tên',
              code: '001',
              requestType: 1,
              requestDate: '20/07/2020',
              approvalDate: '20/07/2020',
              status: 1,
              requestNote: 'Ý kiến của CBNV',
              hrNote: 'Ý kiến phản hồi nhân sự'
            },
            {
              content: 'Số sổ bảo hiểm',
              code: '002',
              requestType: 1,
              requestDate: '15/08/2020',
              approvalDate: '20/08/2020',
              status: 2,
              requestNote: '',
              hrNote: 'Ý kiến phản hồi nhân sự'
            },
            {
              content: 'Địa chỉ thường trú',
              code: '003',
              requestType: 1,
              requestDate: '18/08/2020',
              approvalDate: '20/08/2020',
              status: 3,
              requestNote: 'Ý kiến của CBNV',
              hrNote: ''
            },
            {
              content: 'Địa chỉ thường trú',
              code: '004',
              requestType: 1,
              requestDate: '19/08/2020',
              approvalDate: '26/08/2020',
              status: 1,
              requestNote: '',
              hrNote: ''
            }
        ]
        }
    }

    render() {
      return (
      <div className="task-section">
          <h4 className="title text-uppercase">Quản lý thông tin phê duyệt</h4>
          <TaskList tasks={this.state.tasks}/>
      </div>
      )
    }
  }
export default ApprovalComponent