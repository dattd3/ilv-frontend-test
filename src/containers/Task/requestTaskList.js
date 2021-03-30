import React from 'react'
import editButton from '../../assets/img/Icon-edit.png'
import deleteButton from '../../assets/img/icon-delete.svg'
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
import { withTranslation } from "react-i18next"

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class RequestTaskList extends React.Component {
    constructor() {
        super();
        this.state = {
            tasks: [],
            taskChecked: [],
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

    deleteRequest = id => {
        this.setState({
            modalTitle: "Yêu cầu hủy phê duyệt",
            modalMessage: "Bạn có đồng ý hủy yêu cầu này ?",
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
            1: { label: this.props.t('Rejected'), className: 'request-status fail' },
            2: { label: this.props.t('Approved'), className: 'request-status success' },
            3: { label: this.props.t('Recalled'), className: 'request-status' },
            4: { label: this.props.t('Đã hủy'), className: 'request-status' },
            5: { label: this.props.t("Waiting"), className: 'request-status' },
            6: { label: this.props.t("Đã thẩm định"), className: 'request-status' },
            7: { label: this.props.t("Từ chối thẩm định"), className: 'request-status' },
            8: { label: this.props.t("Waiting"), className: 'request-status' }
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
        return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page === "approval" ? `/tasks-approval/${id}` : `/tasks-request/${id}`
    }

    getLinkRegistration(id,childId) {
        return this.props.page === "approval" ? `/registration/${id}/${childId}/approval` : `/registration/${id}/${childId}/request`
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

    isShowDeleteButton = status => {
        return status == Constants.STATUS_APPROVED ? true : false;
        
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

    handleAllChecked = event => {
        let tasks = this.props.tasks;
        tasks.forEach((task,index) => {
            task.isChecked = event.target.checked
            if(task.isChecked)
            {
                this.state.taskChecked.push(task.id);
            }
            else
            {
                this.state.taskChecked.splice(this.state.taskChecked.indexOf(task.id),1);
            }
        });
        this.setState({ tasks: tasks });
        this.props.handleChange(this.state.taskChecked);
    };
    
    handleCheckChieldElement = event => {
        let tasks = this.props.tasks;
        tasks.forEach((task,index) => {
          if (task.id == event.target.value)
          {
            task.isChecked = event.target.checked;
            if(task.isChecked)
            {
                this.state.taskChecked.push(task.id);
            }
            else
            {
                this.state.taskChecked.splice(this.state.taskChecked.indexOf(task.id),1);
            }
          }
        });
        this.setState({ tasks: tasks });
        this.props.handleChange(this.state.taskChecked);
    };

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
                    let startTime = timesheet[startTimeName] ? moment(timesheet[startTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[startTimeNameOld]) ? moment(timesheet[startTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
                    if (startTime) {
                        dataToSAP.push({
                            MYVP_ID: 'TEV' + '0'.repeat(7 - data.id.toString().length) + data.id + `${index}${n}`,
                            PERNR: data.userProfileInfo.user.employeeNo,
                            LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
                            SATZA: 'P10',
                            LTIME: startTime,
                            DALLF: '+',
                            ACTIO: 'INS'
                        })
                    }
                }

                if (true) {
                    let endTime = timesheet[endTimeName] ? moment(timesheet[endTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[endTimeNameOld]) ? moment(timesheet[endTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
                    if (endTime) {
                        dataToSAP.push({
                            MYVP_ID: 'TEV' + '0'.repeat(7 - data.id.toString().length) + data.id + `${index}${n}`,
                            PERNR: data.userProfileInfo.user.employeeNo,
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
        const { t } = this.props
        let tasks = TableUtil.updateData(this.props.tasks || [], this.state.pageNumber - 1, recordPerPage)
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
                            <tr>
                                <th scope="col" className="check-box">
                                    <input type="checkbox" onClick={this.handleAllChecked} value="checkedall"/>{" "}
                                </th>
                                <th scope="col" className="code">{t("RequestNo")}</th>
                                <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                <th scope="col" className="day-off">{t("DayOff")}</th>
                                <th scope="col" className="break-time">{t("TotalLeaveTime")}</th>
                                <th scope="col" className="status text-center">{t("Status")}</th>
                                <th scope="col" className="tool"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {tasks.length > 0 ?
                                tasks.map((task) => {
                                    let isShowEditButton = this.isShowEditButton(task.status);
                                    let isShowEvictionButton = this.isShowEvictionButton(task.status);
                                    let isShowDeleteButton = this.isShowDeleteButton(task.status);
                                    let userId = "";
                                    let userManagerId = "";
                                    if (task.user.userId) {
                                        userId = task.userId.split("@")[0];
                                    }
                                    return (
                                        task.requestInfo && task.requestInfo.map((child, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td scope="col" className="check-box">
                                                        <input type="checkbox"  onChange={this.handleCheckChieldElement} checked={!!task.isChecked} value={task.id}/>
                                                    </td>
                                                    <td className="code">{this.getTaskCode(child.id)}</td>
                                                    <td className="request-type"><a href={task.requestType.id == 1 ? this.getLinkUserProfileHistory(task.id) : this.getLinkRegistration(task.id)} title={task.requestType.name} className="task-title">{task.requestType.name}</a></td>
                                                    <td className="day-off">{moment(child.startDate).format("DD/MM/YYYY")}</td>
                                                    <td className="break-time">{(child.days ||  child.hours) ? child.days +" ngày "+ child.hours + " giờ" : 0}</td>
                                                    <td className="status text-center">{this.showStatus(child.id, child.processStatusId, task.requestType.id, task.userProfileInfo)}</td>
                                                    <td className="tool">
                                                        {
                                                            isShowEditButton ? <>
                                                                <a href={task.requestTypeId == 1 ? `/tasks-request/${task.id}/edit` : this.getLinkRegistration(task.id,child.id.split(".")[1])} title="Chỉnh sửa thông tin"><img alt="Edit task" src={editButton} /></a>
                                                                
                                                                </>
                                                            : null
                                                        }
                                                        {
                                                            isShowEvictionButton ?
                                                                <span title="Thu hồi hồ sơ" onClick={e => this.evictionRequest(task.id)} className="eviction"><i className='fas fa-undo-alt'></i></span>
                                                                : null
                                                        }
                                                        {
                                                            isShowDeleteButton ?
                                                                <span title="Xóa" onClick={e => this.deleteRequest(task.id)}><img alt="Edit task" src={deleteButton} /></span>
                                                                : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )})
                                : <tr className="text-center"><th colSpan={9}>{t("NoDataFound")}</th></tr>
                            }
                        </tbody>
                    </table>
                </div>
                {tasks.length > 0 ? <div className="row paging mt-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={this.props.tasks.length} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {this.props.tasks.length}</div>
                </div> : null}
            </>)
    }
}

export default withTranslation()(RequestTaskList)
