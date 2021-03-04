import React from 'react'
import editButton from '../../assets/img/Icon-edit.png'
import notetButton from '../../assets/img/icon-note.png'
import commentButton from '../../assets/img/Icon-comment.png'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Popover from 'react-bootstrap/Popover'
import Select from 'react-select'
import Moment from 'react-moment'
import moment from 'moment'
import _ from 'lodash'
import ConfirmationModal from '../PersonalInfo/edit/ConfirmationModal'
import Constants from '../../commons/Constants'
import RegistrationConfirmationModal from '../Registration/ConfirmationModal'

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
            taskId: null,
            requestUrl: "",
            requestTypeId: null,
            dataToPrepareToSAP: {},
            isShowModalRegistrationConfirm: false
        }

        this.manager = {
            code: localStorage.getItem('employeeNo') || "",
            fullName: localStorage.getItem('fullName') || "",
            title: localStorage.getItem('jobTitle') || "",
            department: localStorage.getItem('department') || ""
        };

        this.requestRegistraion = {
            2: { request: "Đăng ký nghỉ", requestUrl: "requestabsence" },
            3: { request: "Đăng ký Công tác/Đào tạo", requestUrl: "requestattendance" },
            4: { request: "Thay đổi phân ca", requestUrl: "requestsubstitution" },
            5: { request: "Sửa giờ vào - ra", requestUrl: "requesttimekeeping" }
        }

        this.typeFeedbackMapping = {
            1: "Phản hồi của Nhân sự",
            2: "Phản hồi của CBLĐ",
            3: "Phản hồi của CBLĐ",
            4: "Phản hồi của CBLĐ",
            5: "Phản hồi của CBLĐ"
        }
    }

    onChangePage = index => {
        this.setState({ pageNumber: index })
    }

    onChangeStatus = (option, taskId, request, status, taskData, statusOriginal) => {
        const value = option.value
        const label = option.label
        const registrationDataToPrepareToSAP = {
            id: taskId,
            status: statusOriginal,
            userProfileInfo: taskData
        }
        this.setState({ taskId: taskId, requestTypeId: request, dataToPrepareToSAP: { ...registrationDataToPrepareToSAP } })
        this.showModalConfirm(value, request)
    }

    showModalConfirm = (status, requestId) => {
        const requestUpdateProfile = 1
        if (requestId == requestUpdateProfile) {
            this.setState({
                modalTitle: status == Constants.STATUS_NOT_APPROVED ? "Xác nhận không phê duyệt" : "Xác nhận phê duyệt",
                modalMessage: status == Constants.STATUS_NOT_APPROVED ? "Lý do không phê duyệt (Bắt buộc)" : "Bạn có đồng ý phê duyệt thay đổi này ?",
                isShowModalConfirm: true,
                typeRequest: status == Constants.STATUS_NOT_APPROVED ? Constants.STATUS_NOT_APPROVED : Constants.STATUS_APPROVED
            });
        } else {
            this.setState({
                modalTitle: status == Constants.STATUS_NOT_APPROVED ? "Xác nhận không phê duyệt" : "Xác nhận phê duyệt",
                modalMessage: status == Constants.STATUS_NOT_APPROVED ? "Lý do không phê duyệt (Bắt buộc)" : "Bạn có đồng ý phê duyệt " + this.requestRegistraion[requestId].request + " này ?",
                isShowModalRegistrationConfirm: true,
                typeRequest: status == Constants.STATUS_NOT_APPROVED ? Constants.STATUS_NOT_APPROVED : Constants.STATUS_APPROVED,
                requestUrl: this.requestRegistraion[requestId].requestUrl
            });
        }
    }

    evictionRequest = id => {
        this.setState({
            modalTitle: "Xác nhận thu hồi",
            modalMessage: "Bạn có đồng ý thu hồi yêu cầu này ?",
            isShowModalConfirm: true,
            typeRequest: Constants.STATUS_EVICTION,
            taskId: id
        });
    }

    onHideModalConfirm = () => {
        this.setState({ isShowModalConfirm: false });
    }

    onHideModalRegistrationConfirm = () => {
        this.setState({ isShowModalRegistrationConfirm: false });
    }

    showStatus = (taskId, statusOriginal, request, taskData) => {
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
            0: { label: 'Đang chờ xử lý', className: 'request-status' },
            1: { label: 'Từ chối', className: 'request-status fail' },
            2: { label: 'Đã phê duyệt', className: 'request-status success' },
            3: { label: 'Đã thu hồi', className: 'request-status' }
        }

        const options = [
            { value: 0, label: 'Đang chờ xử lý' },
            { value: 1, label: 'Từ chối' },
            { value: 2, label: 'Phê duyệt' }
        ]

        if (this.props.page === "approval") {
            if (statusOriginal == 0) {
                return <Select defaultValue={options[0]} options={options} isSearchable={false} onChange={value => this.onChangeStatus(value, taskId, request, value, taskData, statusOriginal)} styles={customStylesStatus} />
            }
            return <span className={status[statusOriginal].className}>{status[statusOriginal].label}</span>
        }
        return <span className={status[statusOriginal].className}>{status[statusOriginal].label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page === "approval" ? `/tasks-approval/${id}` : `/tasks-request/${id}`
    }

    getLinkRegistration(id) {
        return this.props.page === "approval" ? `/registration/${id}/approval` : `/registration/${id}/request`
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
            if (status == 0 || status == 2 || status == 3) {
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

    getDataToSAP = (request, data) => {
        let jsonData = []
        switch (request) {
            case Constants.LEAVE_OF_ABSENCE:
                jsonData = this.getLeaveOfAbsenceToSAp(data)
                break;
            case Constants.BUSINESS_TRIP:
                jsonData = this.getBusinessTripToSAp(data)
                break;
            case Constants.SUBSTITUTION:
                jsonData = this.getSubstitutionToSAp(data)
                break;
            case Constants.IN_OUT_TIME_UPDATE:
                jsonData = this.getInOutUpdateToSAp(data)
                break;
        }
        return jsonData
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    getInOutUpdateToSAp = data => {
        let dataToSAP = []
        data.userProfileInfo.timesheets.filter(t => t.isEdit).forEach((timesheet, index) => {
            ['1', '2'].forEach(n => {
                const startTimeName = `start_time${n}_fact_update`
                const endTimeName = `end_time${n}_fact_update`
                const startTimeNameOld = `start_time${n}_fact`
                const endTimeNameOld = `end_time${n}_fact`
                const startPlanTimeName = `from_time${n}`
                const endPlanTimeName = `to_time${n}`
                if (!timesheet[startTimeName] && !timesheet[endTimeName]) return
                if (true) {
                  let startTime = timesheet[startTimeName] ? moment(timesheet[startTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (timesheet[startTimeNameOld] ? moment(timesheet[startTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
                  if (startTime) {
                    dataToSAP.push({
                      MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
                      PERNR: this.props.inOutTimeUpdate.userProfileInfo.user.employeeNo,
                      LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
                      SATZA: 'P10',
                      LTIME: startTime,
                      DALLF: '+',
                      ACTIO: 'INS'
                    })
                  }
                }
        
                if (true) {
                  let endTime = timesheet[endTimeName] ? moment(timesheet[endTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (timesheet[endTimeNameOld] ? moment(timesheet[endTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
                  if (endTime) {
                    dataToSAP.push({
                      MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
                      PERNR: this.props.inOutTimeUpdate.userProfileInfo.user.employeeNo,
                      LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
                      SATZA: 'P20',
                      LTIME: endTime,
                      DALLF: endTime > timesheet[startPlanTimeName] ? '+' : '-',
                      ACTIO: 'INS'
                    })
                  }
                }
              })
        })
        return dataToSAP
    }

    getSubstitutionToSAp = data => {
        return data.userProfileInfo.timesheets.filter(t => t.isEdit).map((timesheet, index) => {
            return {
                MYVP_ID: 'SUB' + '0'.repeat(8 - data.id.toString().length) + data.id + index,
                PERNR: data.userProfileInfo.user.employeeNo,
                BEGDA: moment(timesheet.date, Constants.SUBSTITUTION_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                ENDDA: moment(timesheet.date, Constants.SUBSTITUTION_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                TPROG: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ? timesheet.shiftId : '',
                BEGUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.startTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
                ENDUZ: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? moment(timesheet.endTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
                VTART: timesheet.substitutionType.value,
                PBEG1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null ? moment(timesheet.startBreakTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
                PEND1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.endBreakTime !== null ? moment(timesheet.endBreakTime, Constants.SUBSTITUTION_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : '',
                PBEZ1: '',
                PUNB1: timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE && timesheet.startBreakTime !== null && timesheet.endBreakTime !== null ? this.calTime(timesheet.startBreakTime, timesheet.endBreakTime) : '',
                TPKLA: parseFloat(timesheet.shiftHours) > 4 && timesheet.shiftType == Constants.SUBSTITUTION_SHIFT_UPDATE ? Constants.SUBSTITUTION_TPKLA_FULL_DAY : Constants.SUBSTITUTION_TPKLA_HALF_DAY
            }
        })
    }

    calTime = (start, end) => {
        if (start == null || end == null) {
            return ""
        }
        const differenceInMs = moment(end, Constants.SUBSTITUTION_TIME_FORMAT).diff(moment(start, Constants.SUBSTITUTION_TIME_FORMAT))
        return moment.duration(differenceInMs).asHours()
    }

    getLeaveOfAbsenceToSAp = data => {
        let dataToSAP = []
        if (data.status === 0) {
            dataToSAP.push(
                {
                    MYVP_ID: 'ABS' + '0'.repeat(9 - data.id.toString().length) + data.id,
                    PERNR: data.userProfileInfo.user ? data.userProfileInfo.user.employeeNo : "",
                    BEGDA: moment(data.userProfileInfo.startDate, Constants.LEAVE_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                    ENDDA: moment(data.userProfileInfo.endDate, Constants.LEAVE_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                    SUBTY: data.userProfileInfo.absenceType ? data.userProfileInfo.absenceType.value : "",
                    BEGUZ: data.userProfileInfo.startTime ? moment(data.userProfileInfo.startTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
                    ENDUZ: data.userProfileInfo.endTime ? moment(data.userProfileInfo.endTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
                    ACTIO: 'INS'
                }
            )
        }
        return dataToSAP
    }

    getBusinessTripToSAp(data) {
        let dataToSAP = []
        if (data.status === 0) {
            dataToSAP.push(
                {
                    MYVP_ID: 'ATT' + '0'.repeat(9 - data.id.toString().length) + data.id,
                    PERNR: data.userProfileInfo.user.employeeNo,
                    BEGDA: moment(data.userProfileInfo.startDate, Constants.BUSINESS_TRIP_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                    ENDDA: moment(data.userProfileInfo.endDate, Constants.BUSINESS_TRIP_DATE_FORMAT).format(Constants.DATE_OF_SAP_FORMAT),
                    SUBTY: data.userProfileInfo.attendanceQuotaType.value,
                    BEGUZ: data.userProfileInfo.startTime ? moment(data.userProfileInfo.startTime, Constants.BUSINESS_TRIP_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
                    ENDUZ: data.userProfileInfo.endTime ? moment(data.userProfileInfo.endTime, Constants.BUSINESS_TRIP_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT) : null,
                    ACTIO: 'INS'
                }
            )
        }
        return dataToSAP
    }

    render() {
        const recordPerPage = 10
        const tasks = TableUtil.updateData(this.props.tasks || [], this.state.pageNumber - 1, recordPerPage)
        const dataToSap = this.getDataToSAP(this.state.requestTypeId, this.state.dataToPrepareToSAP)

        return (
            <>
                <ConfirmationModal show={this.state.isShowModalConfirm} manager={this.manager} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage}
                    taskId={this.state.taskId} onHide={this.onHideModalConfirm} />
                <RegistrationConfirmationModal show={this.state.isShowModalRegistrationConfirm} id={this.state.taskId} title={this.state.modalTitle} message={this.state.modalMessage}
                    type={this.state.typeRequest} urlName={this.state.requestUrl} dataToSap={dataToSap} onHide={this.onHideModalRegistrationConfirm} />
                <div className="task-list shadow">
                    <table className="table table-borderless table-hover table-striped">
                        <thead>
                            <tr className="text-center">
                                <th scope="col" className="code">Mã yêu cầu</th>
                                <th scope="col" className="request-type">Loại yêu cầu</th>
                                <th scope="col" className="content">ND chỉnh sửa / Yêu cầu</th>
                                {
                                    !['V073'].includes(localStorage.getItem("companyCode"))
                                        ? <th scope="col" className="user-request">Người gửi</th>
                                        : null
                                }
                                <th scope="col" className="request-date">Thời gian</th>
                                <th scope="col" className="user-approved">Người phê duyệt</th>
                                <th scope="col" className="approval-date">Thời gian phê duyệt</th>
                                <th scope="col" className="status">Trạng thái</th>
                                <th scope="col" className="tool text-center">Lý do/ Phản hồi/ Chỉnh sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ?
                                tasks.map((task, index) => {
                                    const approvalDate = task.approvalDate == null ? "" : <Moment format="DD/MM/YYYY">{task.approvalDate}</Moment>;
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
                                            <td className="request-type"><a href={task.requestTypeId == 1 ? this.getLinkUserProfileHistory(task.id) : this.getLinkRegistration(task.id)} title={task.requestType.name} className="task-title">{task.requestType.name}</a></td>
                                            <td className="content">{task.requestTypeId == 1 ? task.name : task.comment || ""}</td>
                                            {!['V073'].includes(localStorage.getItem("companyCode")) ? <td className="user-request text-center">{userId}</td> : null}
                                            <td className="request-date text-center"><Moment format="DD/MM/YYYY">{task.createdDate}</Moment></td>
                                            <td className="user-approved text-center">{userManagerId}</td>
                                            <td className="approval-date text-center">{approvalDate}</td>
                                            <td className="status">{this.showStatus(task.id, task.status, task.requestTypeId, task.userProfileInfo)}</td>
                                            <td className="tool">
                                                {task.comment ? <OverlayTrigger
                                                    rootClose
                                                    trigger="click"
                                                    placement="left"
                                                    overlay={<Popover id={'note-task-' + index}>
                                                        <Popover.Title as="h3">Lý do</Popover.Title>
                                                        <Popover.Content>
                                                            {task.comment}
                                                        </Popover.Content>
                                                    </Popover>}>
                                                    <img alt="Note task" src={notetButton} title="Lý do" />
                                                </OverlayTrigger> : <img alt="Note task" src={notetButton} title="Lý do" className="disabled" />}
                                                {task.hrComment ? <OverlayTrigger
                                                    rootClose
                                                    trigger="click"
                                                    placement="left"
                                                    overlay={<Popover id={'comment-task-' + index}>
                                                        <Popover.Title as="h3">{this.typeFeedbackMapping[task.requestTypeId]}</Popover.Title>
                                                        <Popover.Content>
                                                            {task.hrComment}
                                                        </Popover.Content>
                                                    </Popover>}>
                                                    <img alt="comment task" src={commentButton} title={this.typeFeedbackMapping[task.requestTypeId]} />
                                                </OverlayTrigger> : <img alt="Note task" src={notetButton} className="disabled" title={this.typeFeedbackMapping[task.requestTypeId]} />}
                                                {
                                                    // isShowEditButton ?
                                                    //     <a href={task.requestTypeId == 1 ? `/tasks-request/${task.id}/edit` : this.getLinkRegistration(task.id)} title="Chỉnh sửa thông tin"><img alt="Edit task" src={editButton} /></a>
                                                    // : null
                                                }
                                                {
                                                    isShowEvictionButton ?
                                                        <span title="Thu hồi hồ sơ" onClick={e => this.evictionRequest(task.id)} className="eviction"><i className='fas fa-undo-alt'></i></span>
                                                        : null
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                                : <tr className="text-center"><th colSpan={9}>Không có dữ liệu</th></tr>
                            }
                        </tbody>
                    </table>
                </div>
                {tasks.length > 0 ? <div className="row paging mt-2">
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={this.props.tasks.length} />
                    </div>
                    <div className="col-sm text-right">Total: {this.props.tasks.length}</div>
                </div> : null}
            </>)
    }
}

export default TaskList
