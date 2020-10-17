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
import ConfirmationModal from '../PersonalInfo/edit/ConfirmationModal'

class TaskList extends React.Component {
    constructor() {
        super();
        this.state = {
          tasks: [],
          dataToModalConfirm: null,
          isShowModalConfirm: false,
          modalTitle: "",
          modalMessage: "",
          typeRequest: 1,
          messageModalConfirm: "",
          pageNumber: 1,
          userProfileHistoryId: 0
        }
        
        this.disapproval = 1;
        this.approval = 2;
    }

    onChangePage = index => {
        this.setState({ pageNumber: index})
    }

    onChangeStatus = (option, userProfileHistoryId) => {
        const value = option.value;
        const label = option.label;
        this.setState({userProfileHistoryId: userProfileHistoryId});

        if (value == this.disapproval) {
            this.setState({
                modalTitle: "Xác nhận không duyệt",
                modalMessage: "Thêm ghi chú (Không bắt buộc)",
                isShowModalConfirm: true,
                typeRequest: 1
            });
        } else if (value == this.approval) {
            this.setState({
                modalTitle: "Xác nhận phê duyệt",
                modalMessage: "Bạn có đồng ý phê duyệt thay đổi này ?",
                isShowModalConfirm: true,
                typeRequest: 2
            });
        }
    }

    evictionRequest = id => {
        this.setState({
            modalTitle: "Xác nhận thu hồi",
            modalMessage: "Bạn có đồng ý thu hồi yêu cầu này ?",
            isShowModalConfirm: true,
            typeRequest: 3,
            userProfileHistoryId: id
        });
    }

    onHideModalConfirm = () => {
        this.setState({isShowModalConfirm: false});
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
            1: {label: 'Từ chối', className: 'request-status fail'},
            2: {label: 'Đã phê duyệt', className: 'request-status success'},
            3: {label: 'Đã thu hồi', className: 'request-status'}
        }

        const options = [
           { value: 0, label: 'Đang chờ xử lý'},
           { value: 1, label: 'Từ chối'},
           { value: 2, label: 'Phê duyệt'}
        ]

        if (this.props.page === "approval") {
            if (value == 0) {
                return <Select defaultValue={options[0]} options={options} onChange={value => this.onChangeStatus(value, userProfileHistoryId)} styles={customStylesStatus} />
            }
            return <span className={status[value].className}>{status[value].label}</span>
        }
        return <span className={status[value].className}>{status[value].label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page === "approval" ? `/tasks-approval/${id}` : `/tasks-request/${id}`
    }

    getLinkRegistration (id) {
        return this.props.page === "approval" ? `/registration/${id}` : `/registration/${id}/edit`
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

    isShowEditButton = status => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if (status == 2 || status == 3) {
                isShow = false;
            } else {
                isShow = true;
            }
        }
        return isShow;
    }

    isShowEvictionButton = status => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if (status == 0) {
                isShow = true;
            } else {
                isShow = false;
            }
        }
        return isShow;
    }

    getTaskLink = id => {
        if (this.props.page == "approval") {
            return `/tasks-approval/${id}`;
        }
        return `/tasks-request/${id}`;
    }

    render() {
        const recordPerPage =  25
        const tasks = TableUtil.updateData(this.props.tasks, this.state.pageNumber - 1, recordPerPage)
        
    return (
        <>
        <ConfirmationModal show={this.state.isShowModalConfirm} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage} 
        userProfileHistoryId={this.state.userProfileHistoryId} onHide={this.onHideModalConfirm} />
        <div className="task-list ">
            <table className="table table-borderless table-hover table-striped shadow">
            <thead>
                <tr>
                    <th scope="col" className="code">Mã yêu cầu</th>
                    <th scope="col" className="request-type">Loại yêu cầu</th>
                    <th scope="col" className="content">ND chỉnh sửa / Yêu cầu</th>
                    <th scope="col" className="user-request">Người gửi yêu cầu</th>
                    <th scope="col" className="request-date">Thời gian gửi yêu cầu</th>
                    <th scope="col" className="user-approved">Người gửi phê duyệt</th>
                    <th scope="col" className="approval-date">Thời gian phê duyệt</th>
                    <th scope="col" className="status">Trạng thái</th>
                    <th scope="col" className="tool">Ý kiến/Phản hồi/Chỉnh sửa</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((task, index) => {
                    const approvalDate = task.approvalDate == "0001-01-01T00:00:00" ? "" : <Moment format="DD/MM/YYYY">{task.approvalDate}</Moment>;
                    let isShowEditButton = this.isShowEditButton(task.status);
                    let isShowEvictionButton = this.isShowEvictionButton(task.status);
                    let userId = "";
                    let userManagerId = "";
                    if (task.userId) {
                        userId = task.userId.split("@")[0];
                    }
                    if (task.userManagerId) {
                        userManagerId = task.userManagerId.split("@")[0];
                    }
                    return (
                        <tr key={index}>
                            <td className="code"><a href={task.requestTypeId == 1 ? this.getLinkUserProfileHistory(task.id) : this.getLinkRegistration(task.id)} title={task.name} className="task-title">{this.getTaskCode(task.id)}</a></td>
                            <td className="request-type">{task.requestType.name}</td>
                            <td className="content">{task.name}</td>
                            <td className="user-request">{userId}</td>
                            <td className="request-date"><Moment format="DD/MM/YYYY">{task.createdDate}</Moment></td>
                            <td className="user-approved">{userManagerId}</td>
                            <td className="approval-date">{approvalDate}</td>
                            <td className="status">{this.showStatus(task.id, task.status)}</td>
                            <td className="tool">
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
                            {
                                isShowEditButton ?
                                <a href={task.requestTypeId == 1 ? `/tasks-request/${task.id}/edit` : this.getLinkRegistration(task.id)} title="Chỉnh sửa thông tin"><img alt="Edit task" src={editButton} /></a>
                                : null
                            }
                            {
                                isShowEvictionButton ?
                                <span title="Thu hồi hồ sơ" onClick={e => this.evictionRequest(task.id)} className="eviction"><i className='fas fa-undo-alt'></i></span>
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
        </div>
      </>)
    }
}

export default TaskList
