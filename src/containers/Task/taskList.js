import React from 'react'
import editButton from '../../assets/img/Icon-edit.png'
import notetButton from '../../assets/img/icon-note.png'
import commentButton from '../../assets/img/Icon-comment.png'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Select from 'react-select'

class TaskList extends React.Component {

    constructor() {
        super();
        this.state = {
          tasks: [],
          pageNumber: 1,
          requestTypes: {
              1: 'Chỉnh sửa hồ sơ cơ bản'
          }
        }
    }

    onChangePage (index) {
        this.setState({ pageNumber: index})
    }

    onChangeStatus (value) {

    }

    showStatus (value) {
        const customStylesStatus = {
            control: base => ({
              ...base,
              width: 160,
              height: 35,
              minHeight: 35
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
              return {
                ...styles
              };
            },
          }

        const status = {
            2: {label: 'Đã phê duyệt', className: 'request-status success' } , 3: {label: 'Từ chối', className: 'request-status fail'}
        }

        const options = [
           { value: 1, label: 'Đang chờ xử lý'},
           { value: 2, label: 'Đã phê duyệt'},
           { value: 3, label: 'Từ chối'}
        ]

        
        return status[value] 
        ? <span className={status[value].className}>{status[value].label}</span> 
        : <Select defaultValue={options[0]} options={options} onChange={value => this.onChangeStatus(value)} styles={customStylesStatus}/>
    }

    render() {
        const recordPerPage =  25
        const tasks = TableUtil.updateData(this.props.tasks, this.state.pageNumber - 1, recordPerPage)
        
      return (
      <div className="task-list ">
          <table class="table table-borderless table-hover table-striped shadow">
            <thead>
                <tr>
                    <th scope="col" className="content">ND chỉnh sửa / Yêu cầu</th>
                    <th scope="col" className="code">Mã yêu cầu</th>
                    <th scope="col" className="request-type">Loại yêu cầu</th>
                    <th scope="col" className="request-date">Thời gian gửi yêu cầu</th>
                    <th scope="col" className="approval-date">Thời gian phê duyệt</th>
                    <th scope="col" className="status">Trạng thái</th>
                    <th scope="col" className="tool">Ý kiến/Phản hồi/Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task, index) => {
                    return (
                        <tr>
                            <th>{task.content}</th>
                            <td>{task.code}</td>
                            <td>{this.state.requestTypes[task.requestType]}</td>
                            <td>{task.requestDate}</td>
                            <td>{task.approvalDate}</td>
                            <td className="status">{this.showStatus(task.status)}</td>
                            <td>
                            {task.requestNote ? <OverlayTrigger 
                                trigger="click"
                                placement="left" 
                                overlay={<Popover id={'note-task-' + index}>
                                        <Popover.Title as="h3">Ý kiến của cán bộ nhân viên</Popover.Title>
                                        <Popover.Content>
                                            {task.requestNote}
                                        </Popover.Content>
                                    </Popover>}>
                                <img alt="Note task" src={notetButton} title="Ý kiến của CBNV"/>
                            </OverlayTrigger> : <img alt="Note task" src={notetButton} title="Ý kiến của CBNV" className="disabled"/>}

                            {task.hrNote ? <OverlayTrigger 
                                trigger="click"
                                placement="left" 
                                overlay={<Popover id={'comment-task-' + index}>
                                        <Popover.Title as="h3">Phản hồi của nhân sự</Popover.Title>
                                        <Popover.Content>
                                            {task.hrNote}
                                        </Popover.Content>
                                    </Popover>}>
                                    <img alt="comment task" src={commentButton} title="Phản hồi của Nhân sự"/>
                            </OverlayTrigger> : <img alt="Note task" src={notetButton} className="disabled" title="Phản hồi của Nhân sự"/>}

                                <a href="/tasks/request/1"><img alt="Edit task" src={editButton} title="Chỉnh sửa thông tin"/></a>
                            </td>
                        </tr>
                    )
                } )}
                
            </tbody>
        </table>

        {tasks.length > 0 ? <div className="row paging">
            <div className="col-sm"></div>
            <div className="col-sm">
                <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={this.props.tasks.length} />
            </div>
            <div className="col-sm text-right">Total: {this.props.tasks.length}</div>
          </div>: null }
      </div>)
    }
  }
export default TaskList