import React from 'react'
import editButton from '../../assets/img/Icon-edit.png'
import notetButton from '../../assets/img/icon-note.png'
import commentButton from '../../assets/img/Icon-comment.png'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Select from 'react-select'
import Moment from 'react-moment'

class TaskList extends React.Component {
    constructor() {
        super();
        this.state = {
          tasks: [],
          dataToModalConfirm: null,
          isShowModalConfirm: false,
          messageModalConfirm: "",
          pageNumber: 1
        }
    }

    onChangePage = index => {
        this.setState({ pageNumber: index})
    }

    onChangeStatus = (userProfileId, selectedOption) => {
        const data = {
          keyUserProfileId: userProfileId,
          value: selectedOption.value
        };

        const message = "Bạn có thật sự muốn chuyển sang trạng thái '" + selectedOption.label + "' ?";
        this.setState({
            dataToModalConfirm: data,
            isShowModalConfirm: true,
            messageModalConfirm: message
        });
    }

    showStatus = (userProfileHistoryId, value) => {
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
            0: {label: 'Đang chờ xử lý', className: 'request-status'},
            1: {label: 'Đã phê duyệt', className: 'request-status success'},
            2: {label: 'Từ chối', className: 'request-status fail'}
        }

        const options = [
           { value: 0, label: 'Đang chờ xử lý'},
           { value: 1, label: 'Đã phê duyệt'},
           { value: 2, label: 'Từ chối'}
        ]

        if (this.props.page === "approval") {
            if (value == 0) {
                return <Select defaultValue={options[0]} options={options} onChange={value => this.onChangeStatus(value)} styles={customStylesStatus} />
            }
            return <span className={status[value].className}>{status[value].label}</span>
        }
        return <span className={status[value].className}>{status[value].label}</span>
        
        // return status[value] && this.props.page === "approval"
        // ? <span className={status[value].className}>{status[value].label}</span> 
        // : <Select defaultValue={options[0]} options={options} onChange={value => this.onChangeStatus(value)} styles={customStylesStatus} />
    }

    getTaskCode = code => {
        if (code > 0 && code < 10) {
            return "0000" + code;
        } else if (code >= 10 && code < 100) {
            return "000" + code;
        } else if (code >= 100 && code < 1000) {
            return "00" + code;
        } else if (code >= 1000 && code < 10000) {
            return "0" + code;
        } else {
            return code;
        }
    }

    render() {
        const recordPerPage =  25
        const tasks = TableUtil.updateData(this.props.tasks, this.state.pageNumber - 1, recordPerPage)
        
      return (
      <div className="task-list ">
          <table className="table table-borderless table-hover table-striped shadow">
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
                    const isShowEditButton = task.status == 1 ? false : true;
                    return (
                        <tr key={index}>
                            <th>{task.name}</th>
                            <td>{this.getTaskCode(task.id)}</td>
                            <td>{task.requestType.name}</td>
                            <td><Moment format="DD/MM/YYYY">{task.createdDate}</Moment></td>
                            <td><Moment format="DD/MM/YYYY">{task.approvalDate}</Moment></td>
                            <td className="status">{this.showStatus(task.id, task.status)}</td>
                            <td>
                            {task.comment ? <OverlayTrigger 
                                trigger="click"
                                placement="left" 
                                overlay={<Popover id={'note-task-' + index}>
                                        <Popover.Title as="h3">Ý kiến của cán bộ nhân viên</Popover.Title>
                                        <Popover.Content>
                                            {task.comment}
                                        </Popover.Content>
                                    </Popover>}>
                                <img alt="Note task" src={notetButton} title="Ý kiến của CBNV"/>
                            </OverlayTrigger> : <img alt="Note task" src={notetButton} title="Ý kiến của CBNV" className="disabled"/>}
                            {task.hrComment ? <OverlayTrigger 
                                trigger="click"
                                placement="left" 
                                overlay={<Popover id={'comment-task-' + index}>
                                        <Popover.Title as="h3">Phản hồi của nhân sự</Popover.Title>
                                        <Popover.Content>
                                            {task.hrComment}
                                        </Popover.Content>
                                    </Popover>}>
                                    <img alt="comment task" src={commentButton} title="Phản hồi của Nhân sự"/>
                            </OverlayTrigger> : <img alt="Note task" src={notetButton} className="disabled" title="Phản hồi của Nhân sự"/>}
                                { isShowEditButton ?
                                <a href="/tasks/request/1"><img alt="Edit task" src={editButton} title="Chỉnh sửa thông tin"/></a>
                                : null
                                }
                            </td>
                        </tr>
                    )
                })}
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
