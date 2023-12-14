import React from 'react'
import editButton from '../../assets/img/icon/Icon-edit.svg'
import deleteButton from '../../assets/img/icon-delete.svg'
import evictionButton from '../../assets/img/eviction.svg'
import IconSync from '../../assets/img/icon/Icon_Sync.svg'
import CustomPaging from '../../components/Common/CustomPaging'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import Select from 'react-select'
import moment from 'moment'
import purify from "dompurify"
import _ from 'lodash'
import ConfirmationModal from '../../containers/Registration/ConfirmationModal'
import Constants from '../../commons/Constants'
import RegistrationConfirmationModal from '../Registration/ConfirmationModal'
import { FormControl, Form, Button } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import { showRangeDateGroupByArrayDate, generateTaskCodeByCode, getValueParamByQueryString, setURLSearchParam, getRequestTypesList } from "../../commons/Utils"
import { REQUEST_CATEGORIES, absenceRequestTypes, requestTypes } from "../Task/Constants"
// import IconInformation from "assets/img/icon/icon-blue-information.svg"
import IconFilter from "assets/img/icon/icon-filter.svg"
import IconSearch from "assets/img/icon/icon-search.svg"
import IconCalender from "assets/img/icon/icon-calender.svg"

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

// Tab yêu cầu
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
            tmpRequestTypesSelect: getValueParamByQueryString(window.location.search, "requestTypes")?.split(","),
            isShowRequestTypesSelect: false,            
            dataForSearch: {
                pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
                pageSize: Constants.TASK_PAGE_SIZE_DEFAULT,
                id: '',
                status: 0,
                needRefresh: false,
                fromDate: moment().subtract(30, "days").format("YYYYMMDD"),
                toDate: moment().format("YYYYMMDD"),
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
        this.requestTypesSelectRef = React.createRef();
        this.handleClickOutsideRequestTypesSelect = this.handleClickOutsideRequestTypesSelect.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutsideRequestTypesSelect);
        this.setState({tasks: this.props.tasks})
    }

    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleClickOutsideRequestTypesSelect);
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

    syncRequest = (requestTypeId, child) => {
        const { t } = this.props

        const prepareDataToSync =
        {
            id: parseInt(child.id.split(".")[0]),
            requestTypeId: requestTypeId,
            sub: [
                {
                    id: child?.id,
                    processStatusId: Constants.STATUS_APPROVED,
                    comment: 'Synchronized approval',
                }
            ]
        }

        this.setState({
            modalTitle: t("SyncRequestConfirmation"),
            modalMessage: t("RemindSync"),
            isShowModalConfirm: true,
            typeRequest: Constants.STATUS_REVOCATION,
            dataToUpdate: prepareDataToSync,
            isSyncFromEmployee: true
        })
    }

    onHideModalConfirm = () => {
        this.setState({ isShowModalConfirm: false });
    }

    onHideModalRegistrationConfirm = () => {
        this.setState({ isShowModalRegistrationConfirm: false });
    }

    showStatus = (statusOriginal, request, approverData, statusName) => {
        // const customStylesStatus = {
        //   control: (base) => ({
        //     ...base,
        //     width: 160,
        //     height: 35,
        //     minHeight: 35,
        //   }),
        //   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        //     return {
        //       ...styles,
        //     };
        //   },
        // };

        const { t } = this.props,
            status = {
                1: { label: t('Rejected'), className: 'request-status fail' },
                2: { label: t('Approved'), className: 'request-status success' },
                3: { label: t('Canceled'), className: 'request-status' },
                4: { label: t('Canceled'), className: 'request-status' },
                5: { label: t("PendingApproval"), className: 'request-status' },
                6: { label: t("PartiallySuccessful"), className: 'request-status warning' },
                7: { label: t("Rejected"), className: 'request-status fail' },
                8: { label: t("PendingConsent"), className: 'request-status' },
                20: { label: t("Consented"), className: 'request-status' },
                100: { label: t("Waiting"), className: 'request-status' },
                [Constants.STATUS_WORK_DAY_LOCKED_CREATE]: { label: t("PaidDayLocked"), className: 'request-status work-day_locked' },
                [Constants.STATUS_WORK_DAY_LOCKED_APPRAISAL]: { label: t("PaidDayLocked"), className: 'request-status work-day_locked' },
                [Constants.STATUS_WORK_DAY_LOCKED_APPROVAL]: { label: t("PaidDayLocked"), className: 'request-status work-day_locked' },
            }
            // options = [
            //     { value: 0, label: 'Đang chờ xử lý' },
            //     { value: 1, label: 'Từ chối' },
            //     { value: 2, label: 'Phê duyệt' }
            // ];
            
        if([Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT, Constants.INSURANCE_SOCIAL].includes(request)) {
            if(statusName) {
                let statusLabel = t(statusName),
                    tmp = Object.keys(status).filter(key => status[key].label == statusLabel );
                statusOriginal = tmp?.length > 0 ? tmp[0] : statusOriginal;
            } else {
                statusOriginal = statusOriginal == 21 || statusOriginal == 22 ? 100 : statusOriginal;
            }
        }

        // if (page === "approval") {
        //     if (statusOriginal == 0) {
        //         return (
        //           <Select
        //             defaultValue={options[0]}
        //             options={options}
        //             isSearchable={false}
        //             onChange={(value) =>
        //               this.onChangeStatus(
        //                 value,
        //                 taskId,
        //                 request,
        //                 value,
        //                 taskData,
        //                 statusOriginal
        //               )
        //             }
        //             styles={customStylesStatus}
        //           />
        //         );
        //     }
        //     return <span className={status[statusOriginal].className}>{status[statusOriginal].label}</span>
        // }
        
        if((!approverData?.account && request != Constants.WELFARE_REFUND) && statusOriginal === 5 && request !== Constants.UPDATE_PROFILE) {
            statusOriginal = 6;
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
        const { page } = this.props,
            idLengthWrapSub = 2,
            ids = id.toString()?.split(".");
        let mainId = id, subId = 1; // subId default

        if (ids && ids.length === idLengthWrapSub) {
            mainId = ids[0] // is first item
            subId = ids[1] // is second item
        }

        if (page === 'approval') {
            return requestTypeId === Constants.UPDATE_PROFILE ? `/registration/${mainId}/${subId}/approval` : `/registration/${mainId}/${subId}`
        }
        return `/registration/${mainId}/${subId}/request`
    }

    getSalaryProposeLink = (request) => {
        let url = '',
          transferAppoints = {
            '14-1': 'registration-transfer',
            '15-1': 'registration-transfer',
            '14-2': 'proposed-transfer',
            '15-2': 'proposed-appointment',
          };
        if(request?.requestTypeId == Constants.INSURANCE_SOCIAL_INFO) {
            url = `social-contribute/${request?.salaryId}/request`;
        } else if (request?.requestTypeId == Constants.SOCIAL_SUPPORT) {
            url = `social-support/${request?.salaryId}/request`;
        } else if(request?.requestTypeId == Constants.WELFARE_REFUND) {
            url = `benefit-claim-request`;
        } else if (request?.requestTypeId == Constants.INSURANCE_SOCIAL) {
            url = `insurance-manager/detail/${request?.salaryId}/request`;
        } else if (request?.requestTypeId == Constants.TAX_FINALIZATION) {
            url = `tax-finalization/${request?.salaryId}/request`;
        } else if (request.parentRequestHistoryId) {
          //xu ly mot nguoi
          url = `salarypropse/${request.parentRequestHistoryId}/${request.salaryId}/request`;
        } else {
          //xu ly nhieu nguoi
          url = `${[14, 15].includes(request?.requestTypeId) ? transferAppoints[`${request?.requestTypeId}-${request?.formType}`] : 'salaryadjustment'}/${request.salaryId}/request`;
        }
        return url;
    }

    getRequestEditLink = (id, requestTypeId, processStatusId) => {
        if ([Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.UPDATE_PROFILE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET, Constants.OT_REQUEST].includes(requestTypeId)) {
            return null;
        } else {
            const idLengthWrapSub = 2, ids = id.toString()?.split(".");
            let mainId = id, subId = 1; // subId default

            if (ids && ids.length == idLengthWrapSub) {
                mainId = ids[0] // is first item
                subId = ids[1] // is second item
            }
            return [Constants.STATUS_WAITING, Constants.STATUS_WAITING_CONSENTED, Constants.STATUS_APPROVED].includes(processStatusId) ? `/tasks-request/${mainId}/${subId}/edit` : ""
        }
    }

    getMaxDayOfMonth = () => {
      const today = moment(),
        year = today.year(),
        month = today.month() + 1; // Need + 1 because issue January is 0 and December is 11
      const isLeapYear = year % 4 === 0 && year % 100 !== 0,
        month31Days = [1, 3, 5, 7, 8, 10, 12],
        month30Days = [4, 6, 9, 11];

      if (month31Days.includes(month)) return 31;
      if (month30Days.includes(month)) return 30;
      if (month === 2) {
        if (isLeapYear) {
          return 29;
        }
        return 28;
      }
      return 30;
    }

    isDateValidForUpdateAndRecall = (startDate) => { // startDate phải có định dạng là YYYYMMDD
        try {
            const currentDate = moment()
            let minDate = moment().set('date', 26)
            if (currentDate.date() < 29) {
              minDate = minDate.subtract(1, 'month')
            }
            return startDate >= minDate.format('YYYYMMDD')
        } catch {
            return false
        }
    }

    isShowEditButton = (status, requestTypeId, startDate, isEditOnceTime) => {
        const { page } = this.props
        if (page === "approval" || !isEditOnceTime) {
            return false
        }
        if (status == Constants.STATUS_APPROVED && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(requestTypeId)) {
            const firstStartDate = startDate?.length > 0 ? startDate[0] : null
            if (this.isDateValidForUpdateAndRecall(moment(firstStartDate, 'DD/MM/YYYY')?.isValid() ? moment(firstStartDate, 'DD/MM/YYYY').format('YYYYMMDD') : null)) {
                return true
            }
        }
        return false
    }

    isShowEvictionButton = (status, requestTypeId, startDate) => {
        const { page } = this.props
        if (page === "approval") {
            return false
        }
        const firstStartDate = startDate?.length > 0 ? startDate[0] : null
        if (status == Constants.STATUS_APPROVED) {
            if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(requestTypeId) && this.isDateValidForUpdateAndRecall(moment(firstStartDate, 'DD/MM/YYYY')?.isValid() ? moment(firstStartDate, 'DD/MM/YYYY').format('YYYYMMDD') : null)) {
                return true
            }
            if (requestTypeId === Constants.OT_REQUEST && startDate?.split(", ")?.every(item => this.isDateValidForUpdateAndRecall(moment(item, 'DD/MM/YYYY')?.isValid() ? moment(firstStartDate, 'DD/MM/YYYY').format('YYYYMMDD') : null))) {
                return true
            }
        }
        return false
    }

    isShowDeleteButton = (status, appraiser, requestTypeId, actionType, updateField = 0) => {
        const { page } = this.props
        if (page === "approval") {
            return false
        } else {
            if ([Constants.STATUS_WAITING_CONSENTED, Constants.STATUS_WAITING, Constants.STATUS_PARTIALLY_SUCCESSFUL].includes(status)) {
                if (((status == Constants.STATUS_WAITING_CONSENTED && actionType !== 'DEL') || (status == Constants.STATUS_WAITING && appraiser && _.size(appraiser) > 0 && actionType !== 'DEL'))  
                    && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET, Constants.OT_REQUEST].includes(requestTypeId)) {
                    return true
                }
                if (status == Constants.STATUS_WAITING && (!appraiser || _.size(appraiser) === 0) && actionType !== 'DEL'
                    && [Constants.UPDATE_PROFILE, Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.CHANGE_DIVISON_SHIFT, Constants.DEPARTMENT_TIMESHEET].includes(requestTypeId)) {
                    return true
                }
                if (status == Constants.STATUS_PARTIALLY_SUCCESSFUL && ![Constants.CHANGE_DIVISON_SHIFT, Constants.SUBSTITUTION, Constants.WELFARE_REFUND].includes(requestTypeId)) {
                    return true
                }
                // Case Self Resign
                if (((status == Constants.STATUS_WAITING_CONSENTED && actionType !== 'DEL') || (status == Constants.STATUS_WAITING && appraiser && _.size(appraiser) > 0 && actionType !== 'DEL')) && requestTypeId == Constants.RESIGN_SELF && updateField == 1) {
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
        params += dataForSearch.fromDate ? `fromDate=${dataForSearch.fromDate}&` : '';
        params += dataForSearch.toDate ? `toDate=${dataForSearch.toDate}&` : '';
        this.setState({
            dataForSearch: {
                ...dataForSearch,
                needRefresh: needRefresh
            }
        })
        this.props.requestRemoteData(params);
    }
  
    handleRequestTypesChange = (type, checked) => {
      let newTypesSelect = [...this.state.tmpRequestTypesSelect];
      if (checked && !newTypesSelect.includes(type)) {
        newTypesSelect.push(type)
      } else if (!checked && newTypesSelect.includes(type) && newTypesSelect.length > 1) {
        newTypesSelect = newTypesSelect.filter(item => item !== type)
      }
      this.setState({
        tmpRequestTypesSelect: newTypesSelect,
      })
    }

    cancelRequestTypesSelect = () => {
      this.setState({
        isShowRequestTypesSelect: false,
        tmpRequestTypesSelect: getValueParamByQueryString(window.location.search, "requestTypes")?.split(",")
      })
    }

    applyRequestTypesSelect = () => {
      setURLSearchParam("requestTypes", this.state.tmpRequestTypesSelect?.join(","))
      this.searchRemoteData(true);
      this.setState({
        isShowRequestTypesSelect: false,
      })
    }

    showRequestTypesSelect = () => {
      this.setState({
        isShowRequestTypesSelect: true,
      })
    }

    handleClickOutsideRequestTypesSelect = (event) => {
      if (this.requestTypesSelectRef && this.requestTypesSelectRef.current 
        && !this.requestTypesSelectRef.current.contains(event.target) 
        && this.state.isShowRequestTypesSelect
      ) {
        this.cancelRequestTypesSelect()
      }
    }

    handleRequestCategorySelect = (category) => {
      this.setState({
        tmpRequestTypesSelect: getRequestTypesList(category, true)
      })
    }

    handleChangeDateFilter = (date, type = "fromDate") => {
      const { dataForSearch } = this.state;
      if ( type === "fromDate") {
        date ? this.setState({
          dataForSearch: {
            ...dataForSearch,
            fromDate: moment(date).format("YYYYMMDD")
          }
        }) : this.setState({dataForSearch: {
          ...dataForSearch,
          fromDate: null
        }});
      } else {
        date ? this.setState({
          dataForSearch: {
            ...dataForSearch,
            toDate: moment(date).format("YYYYMMDD")
          }
        }) : this.setState({
          dataForSearch: {
            ...dataForSearch,
            toDate: null
          }
        });
      }
    }

    render() {
        const { t, total, tasks } = this.props
        const { pageNumber, isSyncFromEmployee, dataForSearch } = this.state
        const dataToSap = this.getDataToSAP(this.state.requestTypeId, this.state.dataToPrepareToSAP)
        const fullDay = 1
        const requestTypesSelected = getValueParamByQueryString(window.location.search, "requestTypes")?.split(",")
        const requestCategorySelected = Constants.REQUEST_CATEGORY_2_LIST[this.state.tmpRequestTypesSelect?.[0]*1 || requestTypesSelected?.[0]*1] ? 2 : 1

        const getRequestTypeLabel = (requestType, absenceTypeValue) => {
            if (requestType.id == Constants.LEAVE_OF_ABSENCE) {
                const absenceType = absenceRequestTypes.find(item => item.value == absenceTypeValue)
                return absenceType ? t(absenceType.label) : ""
            }

            const requestTypeObj = requestTypes.find(item => item.value == requestType.id)
            return requestTypeObj ? t(requestTypeObj.label) : ""
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
                    isSyncFromEmployee={isSyncFromEmployee}
                    onHide={this.onHideModalConfirm.bind(this)}
                />
                <RegistrationConfirmationModal show={this.state.isShowModalRegistrationConfirm} id={this.state.taskId} title={this.state.modalTitle} message={this.state.modalMessage}
                    type={this.state.typeRequest} urlName={this.state.requestUrl} dataToSap={dataToSap} onHide={this.onHideModalRegistrationConfirm} />
                <div className="row w-100 mt-2 mb-3 search-block">
                    <div className="w-180px position-relative">
                          <img src={IconFilter} alt="" className="icon-prefix-select" />
                          <div onClick={this.showRequestTypesSelect}>
                            <Select name="requestCategory"
                              className="w-100"
                              placeholder={t("TypeOfRequest")} 
                              key="requestCategory"
                              classNamePrefix="filter-select"
                              inputValue={requestCategorySelected === REQUEST_CATEGORIES.CATEGORY_1 ? `${t("Type")} I` : `${t("Type")} II`}
                              noOptionsMessage={() => null}
                            />
                          </div>
                          {
                            this.state.isShowRequestTypesSelect && <div className="request-category-guide-container" ref={this.requestTypesSelectRef}>
                              <div className="request-category-guide-body">
                                <div className="category-title">
                                  <b>
                                    {t("TypeOfRequest")}
                                  </b>
                                </div>
                                <Form.Check
                                  label={`${t("Type")} I`}
                                  id={`type-1-radio`}
                                  name="category-radio-group"
                                  type="radio"
                                  onChange={e => {}}
                                  onClick={() => this.handleRequestCategorySelect(REQUEST_CATEGORIES.CATEGORY_1)}
                                  checked={requestCategorySelected === REQUEST_CATEGORIES.CATEGORY_1}
                                />
                                <ul className="type-list-ul">
                                  {getRequestTypesList(REQUEST_CATEGORIES.CATEGORY_1, true)?.sort((a,b) => Constants.REQUEST_CATEGORY_1_LIST_ORDER.indexOf(a * 1) - Constants.REQUEST_CATEGORY_1_LIST_ORDER.indexOf(b * 1) )?.map(key => <div className="category-item" key={key}>
                                    <input 
                                      type="checkbox" 
                                      onChange={(e) => this.handleRequestTypesChange(key, e.currentTarget.checked)} 
                                      checked={this.state.tmpRequestTypesSelect.includes(key)}
                                      disabled={requestCategorySelected !== REQUEST_CATEGORIES.CATEGORY_1}
                                      id={key}
                                    />
                                    <label htmlFor={key}>{t(Constants.REQUEST_CATEGORY_1_LIST[key])}</label>
                                  </div>)}
                                </ul>
                                <Form.Check
                                  label={`${t("Type")} II`}
                                  id={`type-2-radio`}
                                  name="category-radio-group"
                                  type="radio"
                                  onChange={e => {}}
                                  onClick={() => this.handleRequestCategorySelect(REQUEST_CATEGORIES.CATEGORY_2)}
                                  checked={requestCategorySelected === REQUEST_CATEGORIES.CATEGORY_2}
                                />
                                <ul className="type-list-ul">
                                  {getRequestTypesList(REQUEST_CATEGORIES.CATEGORY_2, true).map(key => <div className="category-item" key={key}>
                                    <input 
                                      type="checkbox" 
                                      onChange={(e) => this.handleRequestTypesChange(key, e.currentTarget.checked)}
                                      checked={this.state.tmpRequestTypesSelect.includes(key)}
                                      disabled={requestCategorySelected !== REQUEST_CATEGORIES.CATEGORY_2}
                                      id={key}
                                    />
                                    <label htmlFor={key}>{t(Constants.REQUEST_CATEGORY_2_LIST[key])}</label>
                                  </div>)}
                                </ul>
                              </div>
                              <div className="request-category-guide-footer">
                                <Button className="cancel-btn" onClick={this.cancelRequestTypesSelect}>
                                  <i className="fas fa-times mr-2"></i>
                                  {t('Cancel')}
                                </Button>
                                <Button className="apply-btn"  onClick={this.applyRequestTypesSelect}>
                                  <i className="fas fa-check mr-2"></i>
                                  {t('ApplySearch')}
                                </Button>
                              </div>
                            </div>
                          }
                        </div>
                    <div className="w-180px position-relative">
                        <img src={IconFilter} alt="" className="icon-prefix-select" />
                        <Select name="absenceType"
                            // defaultValue={this.props.filterdata[0]}
                            value={this.state.absenceType || ""}
                            isClearable={false}
                            onChange={absenceType => this.handleSelectChange('absenceType', absenceType)}
                            placeholder={t('Status')} key="absenceType" options={this.props.filterdata}
                            styles={{
                                menu: provided => ({ ...provided, zIndex: 2 })
                            }}
                            classNamePrefix="filter-select"
                          />
                    </div>
                    <div className="flex-1 position-relative">
                        <img src={IconSearch} alt="" className="icon-prefix-select" />
                        <FormControl
                            placeholder={t('SearchRequester')}
                            aria-label="SearchRequester"
                            aria-describedby="basic-addon2"
                            className="request-user"
                            onChange={this.handleInputChange}
                        />
                    </div>
                    <div className="line-break" />
                    <div className="w-120px position-relative date-picker-container">
                        <DatePicker 
                          name="fromDate"
                          selectsStart
                          autoComplete="off"
                          selected={
                            dataForSearch.fromDate ? moment( dataForSearch.fromDate, "YYYYMMDD").toDate() : null
                          }
                          maxDate={
                            dataForSearch.toDate ? moment(dataForSearch.toDate, "YYYYMMDD").toDate() : null
                          }
                          minDate={
                            moment().subtract(6, "months").toDate()
                          }
                          onChange={(date) => this.handleChangeDateFilter(date, "fromDate")}
                          showDisabledMonthNavigation
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t("From")}
                          locale={"vi"}
                          shouldCloseOnSelect={true}
                          className="form-control input"
                        />
                        <img src={IconCalender} alt="" className="calender-icon" />
                    </div>
                    <div className="w-120px position-relative date-picker-container">
                        <DatePicker 
                          name="endDate"
                          selectsEnd
                          autoComplete="off"
                          selected={
                            dataForSearch.toDate ? moment(dataForSearch.toDate, "YYYYMMDD").toDate() : null
                          }
                          minDate={
                            dataForSearch.fromDate ? moment(dataForSearch.fromDate, "YYYYMMDD").toDate() : moment().subtract(6, "months").toDate()
                          }
                          onChange={(date) => this.handleChangeDateFilter(date, "toDate")}
                          showDisabledMonthNavigation
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t("To")}
                          locale={"vi"}
                          shouldCloseOnSelect={true}
                          className="form-control input"
                        />
                        <img src={IconCalender} alt="" className="calender-icon" />
                    </div>
                    <div className="w-120px search-btn-container">
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
                                        <th scope="col" className="status">{t("operation")}</th>
                                        <th scope="col" className="status text-center">{t("Status")}</th>
                                        <th scope="col" className="tool text-center">{t("action2")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tasks.map((child, index) => {
                                            let isShowEditButton = this.isShowEditButton(child?.processStatusId, child?.requestTypeId, child?.startDate, child?.isEdit)
                                            const isShowEvictionButton = this.isShowEvictionButton(child?.processStatusId, 
                                              child?.requestTypeId, 
                                              child?.requestTypeId === Constants.OT_REQUEST ? child?.dateRange : child?.startDate, 
                                            );
                                            let actionType = child?.actionType || null
                                            if (child?.requestTypeId == Constants.RESIGN_SELF) {
                                                const requestItem = child.requestInfo ? child.requestInfo[0] : null // BE xác nhận chỉ có duy nhất 1 item trong requestInfo
                                                actionType = requestItem ? requestItem.actionType : null
                                            }
                                            let isShowDeleteButton = this.isShowDeleteButton(child.processStatusId, child.appraiserId, child.requestTypeId, actionType, child.createField)
                                            let totalTime = null

                                            if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                totalTime = child.days >= fullDay ? `${child.days} ${t('DayUnit')}` : `${child.hours} ${t('HourUnit')}`
                                            } else if ([Constants.OT_REQUEST].includes(child.requestTypeId)) {
                                              totalTime = `${child.totalTime} ${t('HourUnit')}`
                                            }

                                            let editLink = this.getRequestEditLink(child.id, child.requestTypeId, child.processStatusId)
                                            let detailLink = [Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT, Constants.WELFARE_REFUND, Constants.INSURANCE_SOCIAL, Constants.INSURANCE_SOCIAL_INFO, Constants.SOCIAL_SUPPORT, Constants.TAX_FINALIZATION].includes(child.requestTypeId) ? this.getSalaryProposeLink(child) : this.getRequestDetailLink(child.id, child.requestTypeId)
                                            let dateChanged = showRangeDateGroupByArrayDate(child.startDate)

                                            if ([Constants.OT_REQUEST].includes(child.requestTypeId)) {
                                              dateChanged = child.dateRange;
                                            }
                                            let isShowSyncRequest = child?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL 
                                            && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.OT_REQUEST, Constants.WELFARE_REFUND].includes(child?.requestTypeId)

                                            // let isWorkOutSideGroup = false
                                            // if ([Constants.UPDATE_PROFILE].includes(child?.requestTypeId)) {
                                            //     const updateField = JSON.parse(child?.updateField || '{}')
                                            //     isWorkOutSideGroup = updateField?.UpdateField?.length === 1 && updateField?.UpdateField[0] === 'WorkOutside'
                                            // }

                                            return (
                                                <tr key={index}>
                                                    <td className="code"><a href={detailLink} title={child.requestType.name} className="task-title">{generateTaskCodeByCode(child.id)}</a></td>
                                                    <td className="request-type">{getRequestTypeLabel(child.requestType, child.absenceType?.value)}</td>
                                                    <td className="day-off">
                                                        <div dangerouslySetInnerHTML={{
                                                            __html: purify.sanitize(dateChanged || ''),
                                                        }} />
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subDateChanged = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subDateChanged = showRangeDateGroupByArrayDate([moment(item?.startDate, 'YYYYMMDD').format('DD/MM/YYYY'), moment(item?.endDate, 'YYYYMMDD').format('DD/MM/YYYY')])
                                                                } 
                                                                return (
                                                                    <div key={`sub-date-${itemIndex}`} dangerouslySetInnerHTML={{
                                                                        __html: purify.sanitize(subDateChanged || ''),
                                                                    }} style={{marginTop: 5}} />
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td className="break-time text-center">
                                                        <div>{totalTime}</div>
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subTotalTime = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subTotalTime = item?.days >= fullDay ? `${item?.days} ${t('DayUnit')}` : `${item?.hours} ${t('HourUnit')}`
                                                                }
                                                                return (
                                                                    <div key={`sub-break-time-${itemIndex}`} style={{marginTop: 5}}>{subTotalTime}</div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td className="status">{t(`operationType.${child.operationType?.toLowerCase()}`)}</td>
                                                    <td className="status text-center">{this.showStatus(child.processStatusId, child.requestType.id, child.approver, child.statusName)}</td>
                                                    <td className="tool">
                                                        {isShowEditButton && (<a href={editLink} title={t("Edit")}><img alt={t("Edit")} src={editButton} /></a>)}
                                                        {isShowEvictionButton && (<span title={t("Recall")} onClick={e => this.evictionRequest(child.requestTypeId, child)}><img alt={t("Recall")} src={evictionButton} /></span>)}
                                                        {isShowDeleteButton && <span title={t("Cancel2")} onClick={e => this.deleteRequest(child.requestTypeId, child)}><img alt={t("Cancel2")} src={deleteButton} /></span>}
                                                        {isShowSyncRequest && <span title={t("Sync")} onClick={e => this.syncRequest(child.requestTypeId, child)}><img alt={t("Sync")} src={IconSync} /></span>}
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
