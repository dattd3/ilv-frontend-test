import React from 'react'
import editButton from '../../assets/img/icon/Icon-edit.svg'
import deleteButton from '../../assets/img/icon-delete.svg'
import evictionButton from '../../assets/img/eviction.svg'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Popover from 'react-bootstrap/Popover'
import Select from 'react-select'
import moment from 'moment'
import _ from 'lodash'
import ConfirmationModal from '../../containers/Registration/ConfirmationModal'
import Constants from '../../commons/Constants'
import RegistrationConfirmationModal from '../Registration/ConfirmationModal'
import { InputGroup, FormControl } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import { showRangeDateGroupByArrayDate, generateTaskCodeByCode } from "../../commons/Utils"
import { absenceRequestTypes, requestTypes } from "../Task/Constants"
import { MOTHER_LEAVE_KEY } from "./Constants"

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class RequestTaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks,
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
            statusSelected: null,
            query: null,
            dataForSearch: {
                pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
                pageSize: Constants.TASK_PAGE_SIZE_DEFAULT,
                id: '',
                status: 0,
                needRefresh: false
            }
        }

        this.manager = {
            code: localStorage.getItem('employeeNo') || "",
            fullName: localStorage.getItem('fullName') || "",
            title: localStorage.getItem('jobTitle') || "",
            department: localStorage.getItem('department') || ""
        };

        this.requestRegistraion = {
            [Constants.LEAVE_OF_ABSENCE]: { request: "Đăng ký nghỉ", requestUrl: "requestabsence" },
            [Constants.BUSINESS_TRIP]: { request: "Đăng ký Công tác/Đào tạo", requestUrl: "requestattendance" },
            [Constants.SUBSTITUTION]: { request: "Thay đổi phân ca", requestUrl: "requestsubstitution" },
            [Constants.IN_OUT_TIME_UPDATE]: { request: "Sửa giờ vào - ra", requestUrl: "requesttimekeeping" }
        }

        this.typeFeedbackMapping = {
            1: "Phản hồi của Nhân sự",
            2: "Phản hồi của CBLĐ",
            3: "Phản hồi của CBLĐ",
            4: "Phản hồi của CBLĐ",
            5: "Phản hồi của CBLĐ"
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tasks !== this.props.tasks) {
            this.setState({ tasks: nextProps.tasks })
        }
    }

    onChangePage = index => {
        index = index < Constants.TASK_PAGE_INDEX_DEFAULT ? Constants.TASK_PAGE_INDEX_DEFAULT : index;
        index = index * this.state.dataForSearch.pageSize > this.props.total ? (1 + parseInt(this.props.total / this.state.dataForSearch.pageSize)) : index;
        this.setState({
            pageNumber: index, dataForSearch: {
                ...this.state.dataForSearch,
                pageIndex: index
            }
        }, () => {
            this.searchRemoteData(false);
        });
        //this.setState({ pageNumber: index })
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
        const { t } = this.props;
        const requestUpdateProfile = 1
        if (requestId == requestUpdateProfile) {
            this.setState({
                modalTitle: status == Constants.STATUS_NOT_APPROVED ? t("RejectApproveRequest") : t("ApproveRequest"),
                modalMessage: status == Constants.STATUS_NOT_APPROVED ? t("ReasonRejectingRequest") : t("ConfirmApproveChangeRequest"),
                isShowModalConfirm: true,
                typeRequest: status == Constants.STATUS_NOT_APPROVED ? Constants.STATUS_NOT_APPROVED : Constants.STATUS_APPROVED
            });
        } else {
            this.setState({
                modalTitle: status == Constants.STATUS_NOT_APPROVED ? t("RejectApproveRequest") : t("ApproveRequest"),
                modalMessage: status == Constants.STATUS_NOT_APPROVED ? t("ReasonRejectingRequest") : t("ConfirmApproveRequestHolder", { name: t(this.requestRegistraion[requestId].request) }),
                isShowModalRegistrationConfirm: true,
                typeRequest: status == Constants.STATUS_NOT_APPROVED ? Constants.STATUS_NOT_APPROVED : Constants.STATUS_APPROVED,
                requestUrl: this.requestRegistraion[requestId].requestUrl
            });
        }
    }

    evictionRequest = (requestTypeId, child) => {
        const { t } = this.props;
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
            modalTitle: t("ConfirmRequestRecall"),
            modalMessage: t("SureApprovalRecall"),
            isShowModalConfirm: true,
            typeRequest: Constants.STATUS_EVICTION,
            dataToUpdate: prepareDataForRevoke
        });
    }

    deleteRequest = (requestTypeId, child) => {
        const { t } = this.props;
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

        this.setState({
            modalTitle: t("CancelRequest"),
            modalMessage: t("ConfirmCancelRequest"),
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
            3: { label: this.props.t('Canceled'), className: 'request-status' },
            4: { label: this.props.t('Canceled'), className: 'request-status' },
            5: { label: this.props.t("PendingApproval"), className: 'request-status' },
            6: { label: this.props.t("PartiallySuccessful"), className: 'request-status warning' },
            7: { label: this.props.t("Rejected"), className: 'request-status fail' },
            8: { label: this.props.t("PendingConsent"), className: 'request-status' },
            20: { label: this.props.t("Consented"), className: 'request-status' }
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
        return this.props.page === "approval" ? `/registration/${id}/1` : `/registration/${id}/1/request`
    }

    getLinkRegistration(id, childId) {
        return this.props.page === "approval" ? `/registration/${id}/${childId}/approval` : `/registration/${id}/${childId}/request`
    }

    getRequestDetailLink = (id, requestTypeId) => {
        const { page } = this.props
        const idLengthWrapSub = 2
        let mainId = id
        let subId = 1 // subId default
        const ids = id.split(".")
        if (ids && ids.length == idLengthWrapSub) {
            mainId = ids[0] // is first item
            subId = ids[1] // is second item
        }

        if (page === 'approval') {
            return requestTypeId == Constants.UPDATE_PROFILE ? `/registration/${mainId}/${subId}/approval` : `/registration/${mainId}/${subId}`
        }
        return `/registration/${mainId}/${subId}/request`
    }

    getRequestEditLink = (id, requestTypeId, processStatusId) => {
        if ([Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.UPDATE_PROFILE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET].includes(requestTypeId)) {
            return null
        } else {
            const idLengthWrapSub = 2
            let mainId = id
            let subId = 1 // subId default
            const ids = id.split(".")
            if (ids && ids.length == idLengthWrapSub) {
                mainId = ids[0] // is first item
                subId = ids[1] // is second item
            }
            return [Constants.STATUS_WAITING, Constants.STATUS_WAITING_CONSENTED, Constants.STATUS_APPROVED].includes(processStatusId) ? `/tasks-request/${mainId}/${subId}/edit` : ""
        }
    }

    getMaxDayOfMonth = () => {
        const today = moment()
        const year = today.year()
        const month = today.month() + 1 // Need + 1 because issue January is 0 and December is 11
        const isLeapYear = year % 4 === 0 && year % 100 !== 0

        const month31Days = [1, 3, 5, 7, 8, 10, 12]
        const month30Days = [4, 6, 9, 11]
        if (month31Days.includes(month)) return 31
        if (month30Days.includes(month)) return 30
        if (month === 2) {
            if (isLeapYear) {
                return 29
            }
            return 28
        }
        return 30
    }

    checkDateLessThanPayPeriod = (date) => {
        const endOfMonth = this.getMaxDayOfMonth()
        const convertedDate = moment(date, 'DD/MM/YYYY')
        let minDate = null
        const today = new Date()
        const currentDay = today.getDate()
        const year = today.getFullYear()
        const month = today.getMonth()

        if (currentDay < endOfMonth && currentDay >= 26) { // Ngày sửa/thu hồi 26 đến trước ngày trả lương
            if (month === 0) {
                minDate = new Date(year - 1, 11, 26)
            } else {
                minDate = new Date(year, month - 1, 26)
            }
        } else if (currentDay === endOfMonth) { // Ngày sửa/thu hồi vào ngày trả lương
            minDate = new Date(year, month, 26)
        } else { // Ngày sửa/thu hồi 1,..,25
            if (month === 0) {
                minDate = new Date(year - 1, 11, 26)
            } else {
                minDate = new Date(year, month - 1, 26)
            }
        }
        return convertedDate < minDate ? false : true
    }

    isShowEditButton = (status, appraiser, requestTypeId, startDate, isEditOnceTime) => {
        const { page } = this.props

        if (page === "approval" || !isEditOnceTime) {
            return false
        } else {
            if (status == Constants.STATUS_APPROVED && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(requestTypeId)) {
                if (status == Constants.STATUS_APPROVED) {
                    const firstStartDate = startDate?.length > 0 ? startDate[0] : null
                    if (this.checkDateLessThanPayPeriod(firstStartDate)) {
                        return true
                    }
                    return false
                }
                return true
            }
            return false
        }
    }

    isShowEvictionButton = (status, requestTypeId, startDate) => {
        const { page } = this.props

        if (page === "approval") {
            return false
        } else {
            const firstStartDate = startDate?.length > 0 ? startDate[0] : null
            if (status == Constants.STATUS_APPROVED && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(requestTypeId) && this.checkDateLessThanPayPeriod(firstStartDate)) {
                return true
            }
            return false
        }
    }

    isShowDeleteButton = (status, appraiser, requestTypeId, actionType) => {
        const { page } = this.props

        if (page === "approval") {
            return false
        } else {
            if ([Constants.STATUS_WAITING_CONSENTED, Constants.STATUS_WAITING, Constants.STATUS_PARTIALLY_SUCCESSFUL].includes(status)) {
                if (((status == Constants.STATUS_WAITING_CONSENTED && actionType !== 'DEL') || (status == Constants.STATUS_WAITING && appraiser && _.size(appraiser) > 0 && actionType !== 'DEL'))
                    && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET].includes(requestTypeId)) {
                    return true
                }
                if (status == Constants.STATUS_WAITING && (!appraiser || _.size(appraiser) === 0) && actionType !== 'DEL'
                    && [Constants.UPDATE_PROFILE, Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET].includes(requestTypeId)) {
                    return true
                }
                if (status == Constants.STATUS_PARTIALLY_SUCCESSFUL && [Constants.UPDATE_PROFILE].includes(requestTypeId)) {
                    return true
                }
                return false
            }
            return false
        }
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
        this.setState({
            [name]: value, dataForSearch: {
                ...this.state.dataForSearch,
                status: value,
                pageIndex: 1
            }
        });

    }

    //re code
    handleInputChange = (event) => {
        this.setState({
            query: event.target.value, dataForSearch: {
                ...this.state.dataForSearch,
                id: event.target.value,
                pageIndex: 1
            }
        });
    }

    searchRemoteData = (isSearch) => {
        const dataForSearch = this.state.dataForSearch;
        let needRefresh = false;
        if (isSearch) {
            dataForSearch.pageIndex = 1;
            needRefresh = true;
        }
        let params = `pageIndex=${dataForSearch.pageIndex}&pageSize=${dataForSearch.pageSize}&`;
        params += dataForSearch.id ? `id=${dataForSearch.id}&` : '';
        params += dataForSearch.status && dataForSearch.status.value ? `status=${dataForSearch.status.value}&` : '';
        this.setState({
            dataForSearch: {
                ...dataForSearch,
                needRefresh: needRefresh
            }
        })
        this.props.requestRemoteData(params);
    }

    render() {
        const { t, total, tasks } = this.props
        const { pageNumber } = this.state
        const dataToSap = this.getDataToSAP(this.state.requestTypeId, this.state.dataToPrepareToSAP)
        const fullDay = 1

        const getRequestTypeLabel = (requestType, absenceTypeValue) => {
            if (requestType.id == Constants.LEAVE_OF_ABSENCE) {
                const absenceType = absenceRequestTypes.find(item => item.value == absenceTypeValue)
                return absenceType ? t(absenceType.label) : ""
            } else {
                const requestTypeObj = requestTypes.find(item => item.value == requestType.id)
                return requestTypeObj ? t(requestTypeObj.label) : ""
            }
        }

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
                <div className="row w-100 mt-2 mb-3 search-block">
                    <div className="col-xl-4">
                        <InputGroup className="d-flex">
                            <InputGroup.Prepend className="">
                                <InputGroup.Text id="basic-addon1"><i className="fas fa-filter"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Select name="absenceType"
                                className="w-75"
                                // defaultValue={this.props.filterdata[0]}
                                value={this.state.absenceType || ""}
                                isClearable={false}
                                onChange={absenceType => this.handleSelectChange('absenceType', absenceType)}
                                placeholder={t('SortByStatus')} key="absenceType" options={this.props.filterdata}
                                styles={{
                                    menu: provided => ({ ...provided, zIndex: 2 })
                                }}
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: '#F9C20A',
                                        primary: '#F9C20A',
                                    },
                                })} />
                        </InputGroup>
                    </div>
                    <div className="col-xl-4">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder={t('SearchRequester')}
                                aria-label="SearchRequester"
                                aria-describedby="basic-addon2"
                                className="request-user"
                                onChange={this.handleInputChange}
                            />
                        </InputGroup>
                    </div>
                    <div className="col-4">
                        <button type="button" onClick={() => this.searchRemoteData(true)} className="btn btn-warning w-100">{t("Search")}</button>
                    </div>
                </div>
                <div className="block-title">
                    <h4 className="content-page-header">{this.props.title}</h4>
                </div>
                <div className="task-list request-list shadow">
                    {
                        tasks.length > 0 ?
                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th scope="col" className="code">{t("RequestNo")}</th>
                                        <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                        <th scope="col" className="day-off">{t("Times")}</th>
                                        <th scope="col" className="break-time text-center">{t("TotalLeaveTime")}</th>
                                        <th scope="col" className="status text-center">{t("Status")}</th>
                                        <th scope="col" className="tool text-center">{t("action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.map((child, index) => {
                                            let isShowEditButton = this.isShowEditButton(child.processStatusId, child.appraiserId, child.requestTypeId, child.startDate, child.isEdit)
                                            let isShowEvictionButton = this.isShowEvictionButton(child.processStatusId, child.requestTypeId, child.startDate)
                                            let actionType = child?.actionType || null
                                            if (requestTypeId == Constants.RESIGN_SELF) {
                                                const requestItem = child.requestInfo[0] // BE xác nhận chỉ có duy nhất 1 item trong requestInfo
                                                actionType = requestItem ? requestItem.actionType : null
                                            }
                                            let isShowDeleteButton = this.isShowDeleteButton(child.processStatusId, child.appraiserId, child.requestTypeId, actionType)
                                            let totalTime = null

                                            if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                totalTime = child.days >= fullDay ? `${child.days} ${t('DayUnit')}` : `${child.hours} ${t('HourUnit')}`
                                            }

                                            let editLink = this.getRequestEditLink(child.id, child.requestTypeId, child.processStatusId)
                                            let detailLink = this.getRequestDetailLink(child.id, child.requestTypeId)
                                            let dateChanged = showRangeDateGroupByArrayDate(child.startDate)

                                            return (
                                                <tr key={index}>
                                                    <td className="code"><a href={detailLink} title={child.requestType.name} className="task-title">{generateTaskCodeByCode(child.id)}</a></td>
                                                    <td className="request-type">{getRequestTypeLabel(child.requestType, child.absenceType?.value)}</td>
                                                    <td className="day-off"><div dangerouslySetInnerHTML={{ __html: dateChanged }} /></td>
                                                    <td className="break-time text-center">{totalTime}</td>
                                                    <td className="status text-center">{this.showStatus(child.id, child.processStatusId, child.requestType.id, child.appraiserId)}</td>
                                                    <td className="tool">
                                                        { (isShowEditButton && child?.absenceType?.value != MOTHER_LEAVE_KEY) && <a href={editLink} title={t("Edit")}><img alt="Sửa" src={editButton} /></a> }
                                                        { isShowEvictionButton && child.absenceType?.value != MOTHER_LEAVE_KEY
                                                            && <span title="Thu hồi hồ sơ" onClick={e => this.evictionRequest(child.requestTypeId, child)}><img alt="Thu hồi" src={evictionButton} /></span> }
                                                        { isShowDeleteButton && <span title="Hủy" onClick={e => this.deleteRequest(child.requestTypeId, child)}><img alt="Hủy" src={deleteButton} /></span> }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            : <div className="data-not-found">{t("NoDataFound")}</div>
                    }
                </div>
                {(tasks.length > 0 || Math.ceil(total/Constants.TASK_PAGE_SIZE_DEFAULT) == pageNumber) ? <div className="row paging mt-4">
                    <div className="col-sm"></div>
                    <div className="col-sm"></div>
                    <div className="col-sm">
                        <CustomPaging pageSize={this.state.dataForSearch.pageSize} onChangePage={this.onChangePage.bind(this)} totalRecords={total} needRefresh={this.state.dataForSearch.needRefresh} />
                    </div>
                    <div className="col-sm"></div>
                    <div className="col-sm text-right">{t("Total")}: {total}</div>
                </div> : null}
            </>
        )
    }
}

export default withTranslation()(RequestTaskList)
