import React from 'react'
import editButton from '../../assets/img/Icon-edit.png'
import deleteButton from '../../assets/img/icon-delete.svg'
import evictionButton from '../../assets/img/eviction.svg'
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
import ConfirmationModal from '../../containers/Registration/ConfirmationModal'
import Constants from '../../commons/Constants'
import RegistrationConfirmationModal from '../Registration/ConfirmationModal'
import {InputGroup, FormControl} from 'react-bootstrap'
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
            isShowModalConfirm: false,
            modalTitle: "",
            modalMessage: "",
            typeRequest: 1,
            pageNumber: 1,
            taskId: null,
            requestUrl: "",
            requestTypeId: null,
            dataToPrepareToSAP: {},
            dataToUpdate: [],
            isShowModalRegistrationConfirm: false,
            statusSelected:null,
            query: null
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

    componentDidMount()
    {
        this.setState({tasks: this.props.tasks})
    }
    
    componentWillReceiveProps()
    {
        this.setState({tasks: this.props.tasks})
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

    evictionRequest = (requestTypeId, child) => {
        let prepareDataForRevoke =
            {
                id: parseInt(child.id.split(".")[0]),
                requestTypeId: requestTypeId,
                sub: [
                    {
                        id: child.id,
                    }
                ]
            }
        this.setState({
            modalTitle: "Xác nhận thu hồi",
            modalMessage: "Lý do thu hồi yêu cầu",
            isShowModalConfirm: true,
            typeRequest: Constants.STATUS_EVICTION,
            dataToUpdate: prepareDataForRevoke
        });
    }

    deleteRequest = (requestTypeId, child) => {
        let prepareDataForCancel =
            {
                id: parseInt(child.id.split(".")[0]),
                requestTypeId: requestTypeId,
                sub: [
                    {
                        id: child.id,
                    }
                ]
            }
        // console.log(prepareDataForCancel);
        this.setState({
            modalTitle: "Xác nhận hủy yêu cầu",
            modalMessage: "Bạn có đồng ý hủy yêu cầu này ?",
            isShowModalConfirm: true,
            typeRequest: Constants.STATUS_REVOCATION,
            dataToUpdate: prepareDataForCancel
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
        
        if(taskData.account != null && statusOriginal == 5) {
            statusOriginal = 6;
        }
        return <span className={status[statusOriginal]?.className}>{status[statusOriginal]?.label}</span>
    }

    getLinkUserProfileHistory = (id) => {
        return this.props.page === "approval" ? `/registration/${id}/1` : `/registration/${id}/1/request`
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

    isShowEditButton = (status, requestTypeId) => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if ((requestTypeId != 4 && requestTypeId != 5) && (status == 2 || status == 3)) {
                isShow = true;
            } else {
                isShow = false;
            }
        }
        return isShow;
    }

    isShowDeleteButton = (status, appraiser, requestTypeId) => {

        return (requestTypeId != 4 && requestTypeId != 5) && ((status == 5 && appraiser.account == null) || status == 8) ? true : false;
        
    }
    
    isShowEvictionButton = (status, appraiser, requestTypeId) => {
        let isShow = true;
        if (this.props.page == "approval") {
            isShow = false;
        } else {
            if ((requestTypeId != 4 && requestTypeId != 5) && (status == 2 || (status == 5 && appraiser.account))){
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
        // this.props.handleChange(this.state.taskChecked);
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
    handleSelectChange(name, value) {
        this.setState({ [name]: value })
        let cloneTask = this.props.tasks;
        let result = [];
        if(value && value.value)
        {
            result = cloneTask.filter(req => {
                if (value.value == 8)
                {
                    return req.processStatusId == 5 || req.processStatusId == 8
                }
                else if(value.value == 5)
                {
                    return req.processStatusId == 5 && req.appraiser.account
                }
                else
                {
                    return req.processStatusId == value.value
                }
            });   
            this.setState({statusSelected:value.value, tasks:result, taskFiltered : result});
        }
        else{
            this.setState({statusSelected:null, tasks:this.props.tasks, taskFiltered : this.props.tasks});
        }
    }

    handleInputChange = (event) => {
        let data = null;
        let cloneTask = this.state.taskFiltered ? this.state.taskFiltered : this.props.tasks;
        this.setState({
            query: event.target.value
          }, () => {
              if(this.state.query)
              {
                data = cloneTask.filter(x => x.id.includes(this.state.query));
              }
              else if (this.state.statusSelected){
                data = cloneTask.filter(x => x.processStatusId == this.state.statusSelected)
              }
              else {
                data = this.props.tasks
              }
            
            this.setState({tasks:data});
          })
    }

    render() {
        const recordPerPage = 10
        const { t } = this.props
        let tasksRaw = this.state.tasks.length > 0 || this.state.statusSelected || this.state.query ? this.state.tasks : this.props.tasks
        let tasks = TableUtil.updateData(tasksRaw || [], this.state.pageNumber - 1, recordPerPage)
        const dataToSap = this.getDataToSAP(this.state.requestTypeId, this.state.dataToPrepareToSAP)
        return (
            <>
                {/* <ConfirmationModal show={this.state.isShowModalConfirm} manager={this.manager} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage}
                    taskId={this.state.taskId} onHide={this.onHideModalConfirm} /> */}
                     <ConfirmationModal
                        dataToSap={this.state.dataToUpdate}
                        id={this.props.id}
                        show={this.state.isShowModalConfirm}
                        title={this.state.modalTitle}
                        type={this.state.typeRequest}
                        message={this.state.modalMessage}
                        onHide={this.onHideModalConfirm.bind(this)}
                    />
                <RegistrationConfirmationModal show={this.state.isShowModalRegistrationConfirm} id={this.state.taskId} title={this.state.modalTitle} message={this.state.modalMessage}
                    type={this.state.typeRequest} urlName={this.state.requestUrl} dataToSap={dataToSap} onHide={this.onHideModalRegistrationConfirm} />
                <div className="row w-75 mt-2 mb-3">
                    <div className="col-xl-6">
                        <InputGroup className="d-flex">
                        <InputGroup.Prepend className="">
                            <InputGroup.Text id="basic-addon1"><i className="fas fa-filter"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <Select name="absenceType" 
                                className="w-75" 
                                value={this.state.absenceType || ""} 
                                isClearable={true}
                                onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} 
                                placeholder={t('SortByStatus')} key="absenceType" options={this.props.filterdata} 
                                theme={theme => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#F9C20A',
                                    primary: '#F9C20A',
                                },
                                })}/>
                        </InputGroup>
                    </div>
                    <div className="col-xl-6">
                    <InputGroup className="">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder={t('Tìm kiếm mã yêu cầu')}
                        aria-label="SearchRequester"
                        aria-describedby="basic-addon2"
                        onChange={this.handleInputChange}
                        />
                    </InputGroup>
                    </div>
                </div>
                <div className="block-title">
                    <h4 className="title text-uppercase">{this.props.title}</h4>
                </div>
                <div className="task-list shadow">
                    <table className="table table-borderless table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col" className="check-box">
                                    
                                </th>
                                <th scope="col" className="code">{t("RequestNo")}</th>
                                <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                <th scope="col" className="day-off">{t("DayOff")}</th>
                                <th scope="col" className="break-time text-center">{t("TotalLeaveTime")}</th>
                                <th scope="col" className="status text-center">{t("Status")}</th>
                                <th scope="col" className="tool text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {tasks.length > 0 ?
                            tasks.map((child, index) => {
                                let isShowEditButton = this.isShowEditButton(child.processStatusId, child.requestType.id);
                                let isShowEvictionButton = this.isShowEvictionButton(child.processStatusId, child.appraiser, child.requestType.id);
                                let isShowDeleteButton = this.isShowDeleteButton(child.processStatusId, child.appraiser, child.requestType.id);
                                let totalTime = null;
                                let editLink = null
                                if (child.requestTypeId == 2 || child.requestTypeId == 3) {
                                    totalTime = child.days >= 1 ? child.days + " ngày" : child.hours + " giờ";
                                }
                                if(child.requestType.id == 4 || child.requestType.id == 5)
                                {
                                    editLink = null;
                                }
                                else{
                                    editLink = [Constants.STATUS_WAITING,Constants.STATUS_WAITING_CONSENTED,Constants.STATUS_APPROVED].includes(child.processStatusId) ? `/tasks-request/${child.id.split(".")[0]}/${child.id.split(".")[1]}/edit` : this.getLinkRegistration(child.id.split(".")[0],child.id.split(".")[1])
                                }
                                return (
                                    <tr key={index}>
                                        <td scope="col" className="check-box">
                                            
                                        </td>
                                        <td className="code">{this.getTaskCode(child.id)}</td>
                                        <td className="request-type"><a href={child.requestType.id == 4 || child.requestType.id == 5  ? this.getLinkUserProfileHistory(child.id) : this.getLinkRegistration(child.id.split(".")[0],child.id.split(".")[1])} title={child.requestType.name} className="task-title">{child.requestTypeId == 2 ? child.absenceType.label : child.requestType.name}</a></td>
                                        <td className="day-off">{child.startDate}</td>
                                        <td className="break-time text-center">{totalTime}</td>
                                        <td className="status text-center">{this.showStatus(child.id, child.processStatusId, child.requestType.id, child.appraiser)}</td>
                                        <td className="tool">
                                            {
                                                isShowEditButton ? 
                                                    <>
                                                        <a href={editLink} title="Chỉnh sửa thông tin"><img alt="Edit task" src={editButton} /></a>
                                                    </>
                                                : null
                                            }
                                            {
                                                isShowEvictionButton ?
                                                    <span title="Thu hồi hồ sơ" onClick={e => this.evictionRequest(child.requestTypeId, child)}><img alt="Edit task" src={evictionButton} /></span>
                                                    : null
                                            }
                                            {
                                                isShowDeleteButton ?
                                                    <span title="Hủy" onClick={e => this.deleteRequest(child.requestTypeId, child)}><img alt="Edit task" src={deleteButton} /></span>
                                                    : null
                                            }
                                        </td>
                                    </tr>
                                )
                            })           
                            : <tr className="text-center"><th colSpan={9}>{t("NoDataFound")}</th></tr>
                        }
                        </tbody>
                    </table>
                </div>
                {tasks.length > 0 ? <div className="row paging mt-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={tasksRaw.length} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {tasksRaw.length}</div>
                </div> : null}
            </>)
    }
}

export default withTranslation()(RequestTaskList)
