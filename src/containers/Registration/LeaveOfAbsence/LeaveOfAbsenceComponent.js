import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'
import _ from 'lodash'
import map from '../../../../src/containers/map.config'
import Constants from '../../../commons/Constants'
import { withTranslation } from "react-i18next";
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations, getRegistrationMinDateByConditions, isVinFast } from "../../../commons/Utils"
import NoteModal from '../NoteModal'
import { checkIsExactPnL } from '../../../commons/commonFunctions';
import { absenceRequestTypes, PN03List, MATERNITY_LEAVE_KEY, MARRIAGE_FUNERAL_LEAVE_KEY, MOTHER_LEAVE_KEY, FOREIGN_SICK_LEAVE, ANNUAL_LEAVE_KEY, ADVANCE_ABSENCE_LEAVE_KEY, COMPENSATORY_LEAVE_KEY } from "../../Task/Constants"

const FULL_DAY = 1
const DURING_THE_DAY = 2
const absenceTypesAndDaysOffMapping = {
    1: { day: 3, time: 24 },
    2: { day: 1, time: 8 },
    3: { day: 3, time: 24 }
}
const totalDaysForSameDay = 1
const queryString = window.location.search
const currentEmployeeNo = localStorage.getItem('employeeNo')

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            approver: null,
            appraiser: null,
            annualLeaveSummary: null,
            files: [],
            isUpdateFiles: false,
            isEdit: props.isEdit,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            isShowNoteModal: false,
            dateRequest: getValueParamByQueryString(queryString, 'date'),
            requestInfo: [
                {
                    isShowHintLeaveForMother: false,
                    groupItem: 1,
                    startDate: getValueParamByQueryString(queryString, 'date'),
                    startTime: null,
                    endDate: getValueParamByQueryString(queryString, 'date'),
                    endTime: null,
                    comment: null,
                    totalTimes: 0,
                    totalDays: getValueParamByQueryString(queryString, 'date') ? totalDaysForSameDay : 0,
                    absenceType: null,
                    isAllDay: true,
                    funeralWeddingInfo: null,
                    groupId: 1,
                    errors: {},
                }
            ],
            errors: {},
            needReload: true,
            totalPendingLeaves: null,
            totalPendingTOILs: null,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { leaveOfAbsence } = nextProps
        if (leaveOfAbsence) {
            return ({
                approver: leaveOfAbsence.approver,
                appraiser: leaveOfAbsence.appraiser
            })
        }
        return prevState
    }

    componentDidMount() {
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        muleSoftConfig['params'] = {
            date: moment().format('YYYYMMDD')
        }

        const { leaveOfAbsence, t } = this.props
        registerLocale("vi", t("locale") === "vi" ? vi : enUS)

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/currentabsence`, muleSoftConfig)
            .then(res => {
                if (res && res.data) {
                    const annualLeaveSummary = res.data.data
                    this.setState({ annualLeaveSummary: annualLeaveSummary })
                }
            }).catch(error => {
            })

        if (leaveOfAbsence && leaveOfAbsence && leaveOfAbsence.requestInfo) {
            const { groupID, days, id, startDate, startTime, processStatusId, endDate, endTime, hours, absenceType, leaveType, isAllDay, comment } = leaveOfAbsence.requestInfo[0]
            const { appraiser, approver, requestDocuments } = leaveOfAbsence
            this.setState({
                approver: approver,
                appraiser: appraiser,
                requestInfo: [
                    {
                        id: id,
                        subid: id,
                        groupItem: 0,
                        startDate: moment(startDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                        startTime: startTime ? moment(startTime, 'HHmm00').format('HH:mm') : null,
                        endDate: moment(endDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                        endTime: endTime ? moment(endTime, 'HHmm00').format('HH:mm') : null,
                        totalTimes: hours,
                        totalDays: days,
                        processStatusId: processStatusId,
                        absenceType: absenceType,
                        leaveType: leaveType,
                        comment: comment,
                        isAllDay: isAllDay,
                        funeralWeddingInfo: null,
                        groupId: parseInt(groupID),
                        errors: {},
                    }
                ],
                files: requestDocuments.length > 0 ? requestDocuments.map(file => {
                    return {
                        id: file.id,
                        name: file.fileName,
                        fileSize: file.fileSize,
                        fileType: file.fileType,
                        fileUrl: file.fileUrl
                    }
                }) : [],
            })
        }

        const config = getRequestConfigurations()
        axios.get(`${process.env.REACT_APP_REQUEST_URL}request/pendings`, config)
        .then(res => {
            if (res && res?.data && res?.data?.data) {
                const { totalPendingLeaves, totalPendingTOILs } = res?.data?.data
                this.setState({ totalPendingLeaves, totalPendingTOILs })
            }
        }).catch(error => {
        })
    }

    getStartDate() {
        let dd = (new Date()).getMonth();
        let yyyy = (new Date()).getFullYear();
        return `${yyyy}${dd + 1}6`;
    }

    isPass(startDate) {
        let dateOfPreviousMonth = moment(new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, '26')).format(Constants.LEAVE_DATE_FORMAT);
        let dateCurrentMonth = new Date((new Date()).getFullYear(), (new Date()).getMonth(), '25');
        if (moment(startDate).format(Constants.LEAVE_DATE_FORMAT) >= dateOfPreviousMonth && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) <= dateCurrentMonth) {
            return true;
        } else {
            return false;
        }
    }

    setStartDate(startDate, groupId, groupItem, isShowHintLeaveForMother) {
        const requestInfo = [...this.state.requestInfo]
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem);
        const { endDate, startTime, endTime } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = moment(startDate).isValid() ? moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : null
        const end = endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) > endDate)
            || !requestInfo[indexReq].isAllDay ? moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : endDate
        requestInfo[indexReq].startDate = start

        if (isShowHintLeaveForMother === true) {
            requestInfo[indexReq].endDate = endDate
        } else {
            requestInfo[indexReq].endDate = end
        }

        requestInfo[indexReq].errors.startDate = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({requestInfo: requestInfo})
        this.calculateTotalTime(start, end, startTime, endTime, indexReq)
    }

    setEndDate(endDate, groupId, groupItem, isShowHintLeaveForMother) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startDate, startTime, endTime } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = !requestInfo[indexReq].isAllDay ? moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT) : startDate
        const end = moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT)

        if (isShowHintLeaveForMother === true) {
            requestInfo[indexReq].startDate = startDate
        } else {
            requestInfo[indexReq].startDate = start
        }

        requestInfo[indexReq].endDate = end
        requestInfo[indexReq].errors.endDate = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        this.calculateTotalTime(start, end, startTime, endTime, indexReq)
    }

    onBlurStartTime(groupId, groupItem) {
        const checkVinmec = checkIsExactPnL(Constants.PnLCODE.Vinmec);
        if (checkVinmec === true) {
            let { requestInfo } = this.state
            const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
            const { startDate, endDate } = request
            const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
            const time = moment(requestInfo[indexReq].startTime, Constants.LEAVE_TIME_FORMAT);
            let m = time.minutes();
            if (m > 30) {
                time.set('minute', 30);
                const start = time.format(Constants.LEAVE_TIME_FORMAT);
                requestInfo[indexReq].startTime = start;
                this.setState({ requestInfo })
            }
            else if (m < 30 && m > 0) {
                time.set('minute', 0);
                const start = time.format(Constants.LEAVE_TIME_FORMAT);
                requestInfo[indexReq].startTime = start;
                this.setState({ requestInfo })
            }
            
            this.calculateTotalTime(startDate, endDate, requestInfo[indexReq].startTime, requestInfo[indexReq].endTime, indexReq)
        }
    }

    setStartTime(startTime, groupId, groupItem) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startDate, endDate } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
        requestInfo[indexReq].startTime = start
        requestInfo[indexReq].errors.startTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        const checkVinmec = checkIsExactPnL(Constants.PnLCODE.Vinmec);
        if (checkVinmec === false)
            this.calculateTotalTime(startDate, endDate, start, requestInfo[indexReq].endTime, indexReq)
    }

    onBlurEndTime(groupId, groupItem) {
        const checkVinmec = checkIsExactPnL(Constants.PnLCODE.Vinmec);
        if (checkVinmec === true) {
            let { requestInfo } = this.state
            const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
            const { startDate, endDate } = request
            const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
            const time = moment(requestInfo[indexReq].endTime, Constants.LEAVE_TIME_FORMAT);
            let h = time.hours();
            let m = time.minutes();
            if (m > 30) {
                if (h < 24) {
                    h = h + 1;
                    m = 0;
                    time.set('hour', h);
                    time.set('minute', m);
                    const end = time.format(Constants.LEAVE_TIME_FORMAT);
                    requestInfo[indexReq].endTime = end;
                    this.setState({ requestInfo })
                    
                }
            }
            else if (m < 30 && m > 0) {
                time.set('minute', 30);
                const end = time.format(Constants.LEAVE_TIME_FORMAT);
                requestInfo[indexReq].endTime = end;
                this.setState({ requestInfo })
            }
            // Trường hợp vinmec tính thời gian khi lost focus
            this.calculateTotalTime(startDate, endDate, requestInfo[indexReq].startTime, requestInfo[indexReq].endTime, indexReq)
        }
    }

    setEndTime(endTime, groupId, groupItem) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startDate, endDate } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)

        const end = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        requestInfo[indexReq].endTime = end
        requestInfo[indexReq].errors.endTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        const checkVinmec = checkIsExactPnL(Constants.PnLCODE.Vinmec);
        if (checkVinmec === false) // Trường hợp vinmec tính thời gian khi lost focus
            this.calculateTotalTime(startDate, endDate, requestInfo[indexReq].startTime, end, indexReq)
    }

    isOverlapDateTime(startDateTime, endDateTime, indexReq) {
        let { requestInfo } = this.state

        const hasOverlap = requestInfo.flat().filter(req => {
            const start = moment(`${req.startDate} ${req.startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
            const end = moment(`${req.endDate} ${req.endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')
            if ((startDateTime >= start && startDateTime < end) || (endDateTime > start && endDateTime <= end) || (startDateTime <= start && endDateTime >= end) && start < end) {
                return req
            }
        })
        return Boolean(hasOverlap.length > 1)
    }

    calculateTotalTime(startDate, endDate, startTime, endTime, indexReq) {
        const requestInfo = [...this.state.requestInfo]
        const { isAllDay, isAllDayCheckbox } = requestInfo[indexReq]
        if (isAllDay && isAllDayCheckbox && (!startDate || !endDate)) return
        if (!isAllDay && !isAllDayCheckbox && (!startDate || !endDate || !startTime || !endTime)) return

        const startDateTime = moment(`${startDate} ${startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
        const endDateTime = moment(`${endDate} ${endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')
        const isOverlapDateTime = this.isOverlapDateTime(startDateTime, endDateTime, indexReq)
        if (isOverlapDateTime) {
            requestInfo[indexReq].errors.totalDaysOff = "Trùng với thời gian nghỉ đã chọn trước đó. Vui lòng chọn lại thời gian!"
            return this.setState({ requestInfo })
        }
        
        this.validateTimeRequest(requestInfo, indexReq)
    }

    validateTimeRequest(requestInfo, indexItem) {
        const config = getRequestConfigurations()
        let times = [];
        requestInfo.forEach(req => {
            const startTime = req.startTime ? moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null
            const endTime = req.endTime ? moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null
            if (req.startDate && req.endDate && ((!req.isAllDay && !req.isAllDayCheckbox && startTime && startTime) || req.isAllDay || req.isAllDayCheckbox)) {
                times.push({
                    id: req.groupItem,
                    // subid:req.id,
                    subid: req.id,
                    from_date: moment(req.startDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
                    from_time: !req.isAllDay && !req.isAllDayCheckbox ? startTime : "",
                    to_date: moment(req.endDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
                    to_time: !req.isAllDay && !req.isAllDayCheckbox ? endTime : "",
                    leave_type: req.absenceType?.value || "",
                    group_id: req.groupId
                })
            }
        })

        if (times.length === 0) return

        const { isEdit } = this.state

        if (isEdit) {
            times = times.map(item => {
                return {
                    id: item?.id,
                    from_date: item?.from_date || '',
                    from_time: item?.from_time || '',
                    to_date: item?.to_date || '',
                    to_time: item?.to_time || '',
                    leave_type: item?.leave_type || '',
                    group_id: item?.group_id,
                }
            })
        }

        axios.post(`${process.env.REACT_APP_REQUEST_URL}request/validate`, {perno: currentEmployeeNo, ...(isEdit && { requestId: this.props.taskId }), times: times}, config)
            .then(res => {
                if (res && res.data && res.data.data && res.data.data.times.length > 0) {
                    const newRequestInfo = requestInfo.map((req, index) => {
                        let errors = req.errors
                        let totalTimes
                        let totalDays
                        res.data.data.times.map(time => {
                            if (parseInt(time.group_id) === req.groupId && parseInt(time.id) === req.groupItem) {
                                errors.totalDaysOff = !time.is_valid ? time.message : null
                                totalTimes = time.hours
                                totalDays = time.days
                            }
                        })

                        if (index == indexItem) {
                            errors['funeralWeddingInfo'] = null
                            if (req.isAllDay && req.absenceType && req.funeralWeddingInfo && req.startDate && req.endDate && totalDays > absenceTypesAndDaysOffMapping[req?.funeralWeddingInfo?.value].day) {
                                let days = absenceTypesAndDaysOffMapping[req?.funeralWeddingInfo?.value].day
                                errors['funeralWeddingInfo'] = `Thời gian được đăng ký nghỉ tối đa là ${days} ngày`
                            }
                        }

                        return {
                            ...req,
                            errors,
                            totalTimes,
                            totalDays
                        }
                    })
                    this.setState({ requestInfo: newRequestInfo })
                }
                else {
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.totalDaysOff = res.data.result.message
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            }).catch(error => {
                if (error.response?.status == 401) {
                    window.location.reload();
                }
                else {
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.totalDaysOff = "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!"
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            })
    }

    calFullDay(timesheets) {
        const hours = timesheets.filter(timesheet => timesheet.shift_id !== Constants.SHIFT_CODE_OFF).reduce((accumulator, currentValue) => {
            return accumulator + parseFloat(currentValue.hours)
        }, 0)

        return hours ? (hours / 8) : 0
    }

    updateFiles(files) {
        this.setState({ files: files })
    }

    updateAppraiser(appraiser, isAppraiser) {
        this.setState({ appraiser: appraiser })
        const errors = { ...this.state.errors }
        if (!isAppraiser) {
            errors.appraiser = this.props.t("InvalidAppraiser")
        } else {
            errors.appraiser = null
        }
        this.setState({ errors: errors })
    }

    updateApprover(approver, isApprover) {
        this.setState({ approver: approver })
        const errors = { ...this.state.errors }
        if (!isApprover) {
            errors.approver = this.props.t("InvalidApprover")
        } else {
            errors.approver = null
        }
        this.setState({ errors: errors })
    }

    handleInputChange(event, groupId) {
        let { requestInfo } = this.state
        const newRequestInfo = requestInfo.map(req => {
            const errors = {
                ...req.errors,
                comment: null
            }
            if (req.groupId === groupId) {
                return {
                    ...req,
                    comment: event.target.value,
                    errors
                }
            }
            return { ...req }
        })
        this.setState({ requestInfo: newRequestInfo })
    }

    handleSelectChange(name, value, groupId) {
        const requestInfo = [...this.state.requestInfo]
        const index = groupId - 1 // groupId bắt đầu từ 1. Cần trừ đi 1 để đúng với index của mảng

        // console.log("==============================")
        // console.log(requestInfo)
        // console.log(name)
        // console.log(value)
        // console.log(groupId)

        let newRequestInfo = []
        if (name === "absenceType") {
            const check = value.value === MOTHER_LEAVE_KEY
            newRequestInfo = requestInfo.map(item => {
                return item.groupId === groupId ? {
                    ...item,
                    absenceType: value,
                    isShowHintLeaveForMother: check,
                    isAllDayCheckbox: item.isChecked,
                    startDate: check ? null : item.startDate,
                    endDate: check ? null : item.endDate
                }
                : {...item}
            })
        } else if (name === "funeralWeddingInfo") {
            newRequestInfo = requestInfo.map(item => {
                let errors = item.errors
                errors['funeralWeddingInfo'] = null
                if (item.isAllDay && item.totalDays > absenceTypesAndDaysOffMapping[value.value].day) {
                    const days = absenceTypesAndDaysOffMapping[value.value].day
                    errors['funeralWeddingInfo'] = `Thời gian được đăng ký nghỉ tối đa là ${days} ngày`
                }

                return item.groupId === groupId ? {
                    ...item,
                    funeralWeddingInfo: value,
                    errors
                }
                : {...item}
            })
        }
        this.setState({ requestInfo: newRequestInfo })
        this.validateTimeRequest(newRequestInfo, index)
    }

    verifyInput() {
        let { requestInfo, approver, appraiser, errors } = this.state;
        const { t } = this.props

        if (approver?.account?.trim() && appraiser?.account?.trim() && approver?.account?.trim()?.toLowerCase() === appraiser?.account?.trim()?.toLowerCase()) {
            this.showStatusModal(t("Notification"), t("ApproverAndConsenterCannotBeIdentical"), false)
            this.setState({ needReload: false })
            return false
        }

        requestInfo.forEach((req, indexReq) => {
            req.errors["startDate"] = null
            if (!req.startDate) {
                req.errors["startDate"] = this.props.t('Required')
            }
            req.errors["endDate"] = null
            if (!req.endDate) {
                req.errors["endDate"] = this.props.t('Required')
            }
            req.errors["startTime"] = null
            if (!req.startTime && !req.isAllDay && !req.isAllDayCheckbox) {
                req.errors["startTime"] = this.props.t('Required')
            }
            req.errors["endTime"] = null
            if (!req.endTime && !req.isAllDay && !req.isAllDayCheckbox) {
                req.errors["endTime"] = this.props.t('Required')
            }
            req.errors["absenceType"] = null
            if (!req.absenceType) {
                req.errors["absenceType"] = this.props.t('Required')
            }
            req.errors["comment"] = null
            if (!req.comment) {
                req.errors["comment"] = this.props.t('Required')
            }
            req.errors['pn03'] = (req.absenceType && req.absenceType?.value === MARRIAGE_FUNERAL_LEAVE_KEY && _.isNull(req['pn03'])) ? this.props.t('Required') : null
        })
        const employeeLevel = localStorage.getItem("employeeLevel")

        this.setState({
            requestInfo,
            errors: {
                approver: !approver ? this.props.t('Required') : errors.approver,
                // appraiser: !appraiser && employeeLevel === "N0" ? this.props.t('Required') : errors.appraiser
            }
        })

        const listError = requestInfo.map(req => _.compact(_.valuesIn(req.errors))).flat()
        if (listError.length > 0 || errors.approver) { //|| (errors.appraiser && employeeLevel === "N0")
            return false
        }
        return true
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status });
    }

    addMultiDateTime(groupId, requestItem, isAllDay, absenceType, comment, funeralWeddingInfo) {
        const { requestInfo, dateRequest } = this.state;
        const maxIndex = _.maxBy(requestItem, 'groupItem') ? _.maxBy(requestItem, 'groupItem').groupItem : 1;
        requestInfo.push({
            groupItem: maxIndex + 1,
            startDate: dateRequest,
            startTime: null,
            endDate: dateRequest,
            endTime: null,
            comment: comment,
            totalTimes: 0,
            totalDays: dateRequest ? totalDaysForSameDay : 0,
            absenceType: absenceType,
            isAllDay: isAllDay,
            funeralWeddingInfo: funeralWeddingInfo,
            groupId: groupId,
            errors: {},
        })
        this.setState({ requestInfo })
    }

    onAddLeave() {
        const { dateRequest } = this.state;
        let requestInfo = [...this.state.requestInfo]
        const maxGroup = _.maxBy(requestInfo, 'groupId').groupId;
        const maxGroupItem = _.maxBy(requestInfo, 'groupItem').groupItem;
        requestInfo = requestInfo.concat({
            startDate: dateRequest,
            startTime: null,
            endDate: dateRequest,
            endTime: null,
            comment: null,
            totalTimes: 0,
            totalDays: dateRequest ? totalDaysForSameDay : 0,
            absenceType: null,
            isAllDay: true,
            funeralWeddingInfo: null,
            groupId: maxGroup + 1,
            groupItem: maxGroupItem + 1,
            errors: {},
        })
        document.querySelector('.list-inline').scrollIntoView({
            behavior: 'smooth'
        });
        this.setState({requestInfo: requestInfo})
    }

    onRemoveLeave(groupId, groupItem) {
        let { requestInfo } = this.state;
        let newRequestInfo = []
        if (!groupItem) {
            newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
        } else {
            newRequestInfo = requestInfo.filter(req => req.groupId !== groupId || req.groupItem !== groupItem)
        }
        this.setState({ requestInfo: newRequestInfo })
    }

    submit() {
        const { t } = this.props
        const { files, isEdit, requestInfo } = this.state
        const err = this.verifyInput()

        this.setDisabledSubmitButton(true)
        if (!err) {
            this.setDisabledSubmitButton(false)
            return
        }

        const dataRequestInfo = requestInfo.map(req => {
            let reqItem = {
                startDate: moment(req.startDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
                startTime: !req.isAllDay && !req.isAllDayCheckbox ? moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null,
                endDate: moment(req.endDate, "DD/MM/YYYY").format('YYYYMMDD').toString(),
                endTime: !req.isAllDay && !req.isAllDayCheckbox ? moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null,
                comment: req.comment,
                hours: req.totalTimes,
                days: req.totalDays,
                absenceType: req.absenceType,
                isAllDay: req.isAllDay,
                funeralWeddingInfo: req.funeralWeddingInfo,
                groupId: req.groupId,
            }
            if (isEdit) {
                reqItem = {
                    ...reqItem,
                    processStatusId: req?.processStatusId ? req?.processStatusId : requestInfo[0]?.processStatusId,
                    id: req?.id ? req?.id : requestInfo[0]?.id
                }
            }
            return reqItem
        })

        const approver = { ...this.state.approver }
        const appraiser = { ...this.state.appraiser }
        delete approver.avatar
        delete appraiser.avatar

        let bodyFormData = new FormData();
        bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
        bodyFormData.append('fullName', localStorage.getItem('fullName'))
        bodyFormData.append('jobTitle', localStorage.getItem('jobTitle'))
        bodyFormData.append('department', localStorage.getItem('department'))
        bodyFormData.append('employeeNo', currentEmployeeNo)
        bodyFormData.append("divisionId", !this.isNullCustomize(localStorage.getItem('divisionId')) ? localStorage.getItem('divisionId') : "")
        bodyFormData.append("division", !this.isNullCustomize(localStorage.getItem('division')) ? localStorage.getItem('division') : "")
        bodyFormData.append("regionId", !this.isNullCustomize(localStorage.getItem('regionId')) ? localStorage.getItem('regionId') : "")
        bodyFormData.append("region", !this.isNullCustomize(localStorage.getItem('region')) ? localStorage.getItem('region') : "")
        bodyFormData.append("unitId", !this.isNullCustomize(localStorage.getItem('unitId')) ? localStorage.getItem('unitId') : "")
        bodyFormData.append("unit", !this.isNullCustomize(localStorage.getItem('unit')) ? localStorage.getItem('unit') : "")
        bodyFormData.append("partId", !this.isNullCustomize(localStorage.getItem('partId')) ? localStorage.getItem('partId') : "")
        bodyFormData.append("part", !this.isNullCustomize(localStorage.getItem('part')) ? localStorage.getItem('part') : "")
        bodyFormData.append('approver', JSON.stringify(approver))
        bodyFormData.append('appraiser', JSON.stringify(appraiser))
        bodyFormData.append('RequestType', JSON.stringify({
            id: Constants.LEAVE_OF_ABSENCE,
            name: "Đăng ký nghỉ"
        }))
        bodyFormData.append('requestInfo', JSON.stringify(dataRequestInfo))
        if (isEdit) {
            bodyFormData.append('id', this.props.leaveOfAbsence.id)
        }

        if (!isEdit) {
            files.forEach(file => {
                bodyFormData.append('Files', file)
            })
        }

        axios({
            method: 'POST',
            url: isEdit ? `${process.env.REACT_APP_REQUEST_URL}Request/edit` : `${process.env.REACT_APP_REQUEST_URL}Request/absence/register`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(response => {
            const result = response?.data?.result
            
            if (result?.code === Constants.API_SUCCESS_CODE) {
                this.showStatusModal(t("Successful"), t("RequestSent"), true)
                this.setState({ needReload: true })
            } else {
                this.setState({ needReload: false })
                this.showStatusModal(t("Notification"), response?.data?.result?.message, false)
            }
        })
        .catch(response => {
            this.setState({ needReload: false })
            this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        })
        .finally(() => {
            this.setDisabledSubmitButton(false)
        })
    }

    error(name, groupId, groupItem) {
        const { requestInfo } = this.state
        let indexReq
        if (groupItem) {
            indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)
        } else {
            indexReq = requestInfo.findIndex(req => req.groupId === groupId)
        }
        const errorMsg = requestInfo[indexReq].errors[name]
        return errorMsg ? <p className="text-danger p-2">{errorMsg}</p> : null
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        const { isEdit, needReload } = this.state
        this.setState({ isShowStatusModal: false })

        if (needReload) {
            if (isEdit) {
                window.location.replace("/tasks")
            } else {
                window.location.href = map.Registration
            }
        }
    }

    updateLeaveType(isAllDay, groupId) {
        const { dateRequest, isEdit } = this.state
        const requestInfo = [...this.state.requestInfo]

        if (isEdit) {
            const indexEditing = _.findIndex(requestInfo, ['groupId', groupId])
            requestInfo[indexEditing].startDate = null
            requestInfo[indexEditing].startTime = null
            requestInfo[indexEditing].endDate = null
            requestInfo[indexEditing].endTime = null
            requestInfo[indexEditing].comment = ''
            requestInfo[indexEditing].totalTimes = 0
            requestInfo[indexEditing].totalDays = 0
            requestInfo[indexEditing].absenceType = null
            requestInfo[indexEditing].isAllDay = isAllDay
            requestInfo[indexEditing].funeralWeddingInfo = null
            requestInfo[indexEditing].errors = {}
            this.setState({ requestInfo: requestInfo })
        } else {
            const newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
            newRequestInfo.push({
                groupItem: 1,
                startDate: dateRequest,
                startTime: null,
                endDate: dateRequest,
                endTime: null,
                comment: null,
                totalTimes: 0,
                totalDays: dateRequest ? totalDaysForSameDay : 0,
                absenceType: null,
                isAllDay: isAllDay,
                funeralWeddingInfo: null,
                groupId: groupId,
                errors: {},
            })
            this.setState({ requestInfo: newRequestInfo })
        }
    }

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    getIsUpdateStatus = (status) => {
        this.setState({ isUpdateFiles: status })
    }

    hideNoteModal = () => {
        this.setState({ isShowNoteModal: false });
    }

    handleCheckboxChange = (e) => {
        const { requestInfo } = this.state
        requestInfo.forEach(req => {
            if (e.target.value.split(".")[0] == req.groupId && e.target.value.split(".")[1] == req.groupItem) {
                req.startTime = null
                req.endTime = null
                req.isAllDayCheckbox = e.target.checked
                req.isChecked = e.target.checked
            }
        });

        this.setState({ requestInfo: requestInfo })
        this.validateTimeRequest(requestInfo)
    }

    getMinDate() {
        let currentDay = new Date().getDate();
        return moment(new Date((new Date()).getFullYear(), (new Date().getMonth()), currentDay), Constants.LEAVE_DATE_FORMAT).toDate();
    }

    getMaxDate() {
        let currentDay = new Date().getDate();
        return moment(new Date((new Date()).getFullYear(), (new Date().getMonth() + 1), currentDay), Constants.LEAVE_DATE_FORMAT).toDate();
    }

    addDays(date, days) {
        const copy = new Date(moment(date, Constants.LEAVE_DATE_FORMAT).toDate())
        copy.setDate(copy.getDate() + days)
        return copy
    }

    formatDayUnitByValue = (val) => {
        const { t } = this.props

        if (Number(val) > 1) {
            return t("DayMultiplicity")
        }

        return t("Day")
    }

    showPendingTimeNote = (absenceTypeCode, isAllDay) => {
        const { totalPendingLeaves, totalPendingTOILs } = this.state
        const { t } = this.props
        const labelNoteMapping = {
            [ANNUAL_LEAVE_KEY]: t("TotalLeavesPendingRequestWaitingApproval"),
            [ADVANCE_ABSENCE_LEAVE_KEY]: t("TotalLeavesPendingRequestWaitingApproval"),
            [COMPENSATORY_LEAVE_KEY]: t("TotalTOILPendingRequestWaitingApproval"),
        }

        const showTimePending = () => {
            if ([ANNUAL_LEAVE_KEY, ADVANCE_ABSENCE_LEAVE_KEY].includes(absenceTypeCode)) {
                if (isAllDay) {
                    return `${totalPendingLeaves?.day || 0} ${this.formatDayUnitByValue(totalPendingLeaves?.day || 0)}`
                }

                return `${totalPendingLeaves?.hour || 0} ${t("Hour")}`
            }

            if (isAllDay) {
                return `${totalPendingTOILs?.day || 0} ${this.formatDayUnitByValue(totalPendingTOILs?.day || 0)}`
            }

            return `${totalPendingTOILs?.hour || 0} ${t("Hour")}`
        }

        return (
            [ANNUAL_LEAVE_KEY, ADVANCE_ABSENCE_LEAVE_KEY, COMPENSATORY_LEAVE_KEY].includes(absenceTypeCode) && (
                <>
                    <p className="title">{labelNoteMapping[absenceTypeCode]}</p>
                    <input type="text" className="form-control" style={{ height: 38, borderRadius: 4, padding: '0 15px' }} value={showTimePending()} disabled />
                </>
            )
        )
    }

    render() {
        const { t, leaveOfAbsence, recentlyManagers } = this.props
        const isEmployeeVinFast = isVinFast()
        let absenceRequestTypesPrepare = absenceRequestTypes.map(item => ({...item, label: t(item.label)}))
        
        if (!isEmployeeVinFast) {
            absenceRequestTypesPrepare = (absenceRequestTypesPrepare || []).filter(item => item?.value !== FOREIGN_SICK_LEAVE)
        }

        const PN03ListPrepare = PN03List.map(item => ({...item, label: t(item.label)}))
        const {
            requestInfo,
            annualLeaveSummary,
            isEdit,
            files,
            errors,
            titleModal,
            messageModal,
            disabledSubmitButton,
            isShowStatusModal,
            isSuccess,
            isShowNoteModal,
            appraiser,
            approver
        } = this.state
        const sortRequestListByGroup = requestInfo.sort((reqPrev, reqNext) => reqPrev.groupId - reqNext.groupId)
        const requestInfoArr = _.valuesIn(_.groupBy(sortRequestListByGroup, (req) => req.groupId))
        const checkVinmec = checkIsExactPnL(Constants.PnLCODE.Vinmec);
        const minDate = getRegistrationMinDateByConditions()
        const registeredInformation = (leaveOfAbsence?.requestInfoOld || leaveOfAbsence?.requestInfoOld?.length > 0) ? leaveOfAbsence.requestInfoOld : leaveOfAbsence?.requestInfo

        return (
            <div className="leave-of-absence">
                <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
                <NoteModal show={isShowNoteModal} onHide={this.hideNoteModal} />
                <div className="row summary">
                    <div className="col">
                        <div className="item">
                            <div className="title">{t("LeaveBalance")}</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_LEA_REMAIN, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">{t('LeavesThisYear')}</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_LEA, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">{t('AdvancedAnnualLeave')}</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_ADV_LEA, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">{t('ToilHoursBalance')}</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_TIME_OFF_REMAIN, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">{t('ToilHours')}</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_COMP, 2) : 0}</div>
                        </div>
                    </div>
                    {/* <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù tạm ứng</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_ADV_COMP, 2) : 0}</div>
                        </div>
                    </div> */}
                </div>

                { isEdit && 
                    <div className="box shadow registered-information">
                        <div className='text-uppercase font-weight-bold box-title'>Thông tin đã đăng ký nghỉ</div>
                        <div className='content'>
                            {
                                (registeredInformation || []).map((ri, riIndex) => {
                                    let  totalTimeRegistered = ri?.isAllDay ? `${ri?.days || 0} ${t('DayUnit')}` : `${ri?.hours || 0} ${t('HourUnit')}`
                                    return (
                                        <div className='item' key={`old-request-info-${riIndex}`}>
                                            {
                                                ri?.absenceType?.value === FOREIGN_SICK_LEAVE ? (
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <label>{t('StartDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.startDate && moment(ri?.startDate, 'YYYYMMDD').isValid() ? moment(ri?.startDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <label>{t('EndDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.endDate && moment(ri?.endDate, 'YYYYMMDD').isValid() ? moment(ri?.endDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <label>{t('TotalLeaveTime')}</label>
                                                                <div className='d-flex align-items-center value'>{totalTimeRegistered}</div>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ marginTop: 15, marginBottom: 15 }}>
                                                            <div className='col-md-8'>
                                                                <label>{t('LeaveCategory')}</label>
                                                                <div className='d-flex align-items-center value'>{ri?.absenceType?.label || ''}</div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <label>{t('SickLeaveFundForExpat')}</label>
                                                                <div className='d-flex align-items-center value'>{`${Number(annualLeaveSummary?.SICK_LEA_EXPAT || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_EXPAT || 0)}` }</div>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col-md-12'>
                                                                <label>{t('ReasonRequestLeave')}</label>
                                                                <div className='d-flex align-items-center value'>{ri?.comment || ''}</div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-md-3'>
                                                                <label>{t('StartDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.startDate && moment(ri?.startDate, 'YYYYMMDD').isValid() ? moment(ri?.startDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                </div>
                                                            </div>
                                                            <div className='col-md-3'>
                                                                <label>{t('EndDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.endDate && moment(ri?.endDate, 'YYYYMMDD').isValid() ? moment(ri?.endDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                </div>
                                                            </div>
                                                            <div className='col-md-3'>
                                                                <label>{t('TotalLeaveTime')}</label>
                                                                <div className='d-flex align-items-center value'>{totalTimeRegistered}</div>
                                                            </div>
                                                            <div className='col-md-3'>
                                                                <label>{t('LeaveCategory')}</label>
                                                                <div className='d-flex align-items-center value'>{ri?.absenceType?.label || ''}</div>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ marginTop: 15 }}>
                                                            <div className='col-md-12'>
                                                                <label>{t('ReasonRequestLeave')}</label>
                                                                <div className='d-flex align-items-center value'>{ri?.comment || ''}</div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

                {requestInfoArr.map((req, index) => {
                    let totalDay = 0
                    let totalTime = 0
                    req.forEach(r => {
                        if (r.totalDays) {
                            totalDay += +(Math.round(r.totalDays + "e+2") + "e-2");
                        }
                        if (r.totalTimes) {
                            totalTime += +(Math.round(r.totalTimes + "e+2") + "e-2");
                        }
                    })

                    return (
                        <div className="box shadow position-relative" key={index}>
                            { isEdit && <div className='text-uppercase font-weight-bold box-title'>Thông tin điều chỉnh đăng ký nghỉ</div> }
                            <div className="form">
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        <div className="row">
                                            <div className="col-lg-6 col-xl-6">
                                                <p className="">{t('SelectLeaveType')}</p>
                                                <div className="btn-group btn-group-toggle leave-type" data-toggle="buttons">
                                                    <label onClick={this.updateLeaveType.bind(this, true, req[0].groupId)} style={{ zIndex: "unset" }} className={req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                        {t('FullDay')}
                                                    </label>
                                                    <label onClick={this.updateLeaveType.bind(this, false, req[0].groupId)} style={{ zIndex: "unset" }} className={!req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                        {t('ByHours')}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-xl-6">
                                                <div>
                                                    <p className="title">{t('LeaveCategory')}</p>
                                                    <div>
                                                        <Select name="absenceType" value={req[0].absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType, req[0].groupId)} placeholder={t('Select')} key="absenceType" options={absenceRequestTypesPrepare.filter(absenceType => (req[0].isAllDay) || (absenceType.value !== 'IN01' && absenceType.value !== MATERNITY_LEAVE_KEY && absenceType.value !== 'IN03' && absenceType.value !== MARRIAGE_FUNERAL_LEAVE_KEY))} />
                                                    </div>
                                                    {req[0].errors.absenceType ? this.error('absenceType', req[0].groupId) : null}

                                                    {req[0].absenceType && req[0].absenceType.value === MARRIAGE_FUNERAL_LEAVE_KEY ? <p className="title">{t("MarriageFuneral")}</p> : null}
                                                    {req[0].absenceType && req[0].absenceType.value === MARRIAGE_FUNERAL_LEAVE_KEY ?
                                                        <div>
                                                            <Select name="PN03" value={req[0].funeralWeddingInfo} onChange={funeralWeddingInfo => this.handleSelectChange('funeralWeddingInfo', funeralWeddingInfo, req[0].groupId)} placeholder={t('Select')} key="absenceType" options={PN03ListPrepare} />
                                                        </div>
                                                        :
                                                        null}
                                                    {req[0].errors.funeralWeddingInfo ? this.error('funeralWeddingInfo', req[0].groupId) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        { this.showPendingTimeNote(req[0]?.absenceType?.value, req[0]?.isAllDay) }
                                        {
                                            req[0]?.absenceType?.value === FOREIGN_SICK_LEAVE && (
                                                <>
                                                    <p className="title">{t("SickLeaveFundForExpat")}</p>
                                                    <input type="text" className="form-control" style={{ height: 38, borderRadius: 4, padding: '0 15px' }} value={`${Number(annualLeaveSummary?.SICK_LEA_EXPAT || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_EXPAT || 0)}`} disabled />
                                                </>
                                            )
                                        }
                                        { this.showPendingTimeNote(req[0]?.absenceType?.value, req[0]?.isAllDay) }
                                        { req[0].isShowHintLeaveForMother && <p className="message-danger"><i className="text-danger">* {t('AllowRegisterFor1Hour')}</i></p> }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        {req.map((reqDetail, indexDetail) => {
                                            return <div className="time-area" key={index + indexDetail}>
                                                {
                                                    !req[0].isAllDay ?
                                                        <div className="all-day-area">
                                                            <span className='wrap-item'>
                                                                <input type="checkbox" value={reqDetail.groupId + "." + reqDetail.groupItem} checked={reqDetail.isChecked || false} id={`check-${index}-${indexDetail}`} className="check-box mr-2" onChange={this.handleCheckboxChange} />
                                                                <label htmlFor={`check-${index}-${indexDetail}`}>{t('FullDay')}</label>
                                                            </span>
                                                        </div>
                                                        : null
                                                }
                                                {
                                                    req[0].isShowHintLeaveForMother ?
                                                        (
                                                            <div className="row p-4">
                                                                <div className="col-lg-12 col-xl-6">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="title">{t('StartHour')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onBlur={e => this.onBlurStartTime(reqDetail.groupId, reqDetail.groupItem)}
                                                                                        selected={reqDetail.startTime ? moment(reqDetail.startTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setStartTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        autoComplete="off"
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={checkVinmec === true ? 30 : 15}
                                                                                        timeCaption={t("Hour")}
                                                                                        dateFormat="HH:mm"
                                                                                        timeFormat="HH:mm"
                                                                                        placeholderText={t('Select')}
                                                                                        className="form-control input"
                                                                                        disabled={req[0].isAllDay || reqDetail.isAllDayCheckbox}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.startTime ? this.error('startTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <p className="title">{t('Endtime')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onBlur={e => this.onBlurEndTime(reqDetail.groupId, reqDetail.groupItem)}
                                                                                        selected={reqDetail.endTime ? moment(reqDetail.endTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        showTimeSelect
                                                                                        autoComplete="off"
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={checkVinmec === true ? 30 : 15}
                                                                                        timeCaption={t("Hour")}
                                                                                        dateFormat="HH:mm"
                                                                                        timeFormat="HH:mm"
                                                                                        // minTime={reqDetail.startTime ? this.setMinTime(reqDetail.startTime) : null}
                                                                                        // maxTime={ reqDetail.startTime ? this.setMaxTime(reqDetail.startTime)  : null}
                                                                                        placeholderText={t('Select')}
                                                                                        className="form-control input"
                                                                                        disabled={req[0].isAllDay || reqDetail.isAllDayCheckbox}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.endTime ? this.error('endTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-xl-6">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="title">{t('StartDate')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="startDate"
                                                                                        selectsStart
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={minDate ? minDate?.toDate() : reqDetail.endDate ? this.addDays(reqDetail.endDate, -31) : null}
                                                                                        onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem, req[0].isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.startDate ? this.error('startDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <p className="title">{t('EndDate')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="endDate"
                                                                                        selectsEnd
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate ? minDate?.toDate() : this.getMinDate()}
                                                                                        maxDate={reqDetail.startDate ? this.addDays(reqDetail.startDate, 31) : null}
                                                                                        onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, req[0].isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.endDate ? this.error('endDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        (
                                                            <div className="row p-4">
                                                                <div className="col-lg-12 col-xl-6">
                                                                    <p className="title">{t('StartDateTime')}</p>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="startDate"
                                                                                        selectsStart
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={minDate?.toDate() || null}
                                                                                        onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem, req[0].isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.startDate ? this.error('startDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onBlur={e => this.onBlurStartTime(reqDetail.groupId, reqDetail.groupItem)}
                                                                                        selected={reqDetail.startTime ? moment(reqDetail.startTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setStartTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        autoComplete="off"
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={checkVinmec === true ? 30 : 15}
                                                                                        timeCaption={t("Hour")}
                                                                                        dateFormat="HH:mm"
                                                                                        timeFormat="HH:mm"
                                                                                        placeholderText={t('Select')}
                                                                                        className="form-control input"
                                                                                        disabled={req[0].isAllDay || reqDetail.isAllDayCheckbox}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.startTime ? this.error('startTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-xl-6">
                                                                    <p className="title">{t('EndDateTime')}</p>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="endDate"
                                                                                        selectsEnd
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate?.toDate() || null}
                                                                                        onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, req[0].isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.endDate ? this.error('endDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onBlur={e => this.onBlurEndTime(reqDetail.groupId, reqDetail.groupItem)}
                                                                                        selected={reqDetail.endTime ? moment(reqDetail.endTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        showTimeSelect
                                                                                        autoComplete="off"
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={checkVinmec === true ? 30 : 15}
                                                                                        timeCaption={t("Hour")}
                                                                                        dateFormat="HH:mm"
                                                                                        timeFormat="HH:mm"
                                                                                        placeholderText={t('Select')}
                                                                                        className="form-control input"
                                                                                        disabled={req[0].isAllDay || reqDetail.isAllDayCheckbox}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.endTime ? this.error('endTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                }

                                                {!indexDetail && !isEdit ?
                                                    <React.Fragment>
                                                        <button type="button" className="btn btn-add-multiple-in-out" onClick={() => this.addMultiDateTime(req[0].groupId, req, req[0].isAllDay, req[0].absenceType, req[0].comment, req[0].funeralWeddingInfo)}><i className="fas fa-plus"></i> {t("AddMore")}</button>
                                                        <button type="button" className="btn btn-add-multiple" onClick={() => this.setState({ isShowNoteModal: true })}><i className="fas fa-info"></i></button>
                                                    </React.Fragment>
                                                    :
                                                    !isEdit && <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveLeave(reqDetail.groupId, reqDetail.groupItem)}><i className="fas fa-times"></i> {t("Cancel")}</button>
                                                }
                                                {
                                                    reqDetail.errors.totalDaysOff ?
                                                        <>
                                                            <div className="row">
                                                                <div className="col">
                                                                    {this.error('totalDaysOff', reqDetail.groupId, reqDetail.groupItem)}
                                                                </div>
                                                            </div>
                                                        </>
                                                        : null
                                                }
                                            </div>
                                        })}
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        <p className="title">{t('TotalLeaveTime')}</p>
                                        <div className="text-lowercase">
                                            <input type="text" className="form-control" value={req[0].isAllDay ? (totalDay ? totalDay + ` ${this.formatDayUnitByValue(totalDay || 0)}` : "") : (totalTime ? totalTime + ` ${t("Hour")}` : "")} readOnly />
                                        </div>
                                    </div>
                                </div>
                                {checkVinmec === true &&
                                    <div className="row business-type">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-lg-12 col-md-12 text-info smaller">* {t('Block30Notification')}</div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">{t('ReasonRequestLeave')}</p>
                                        <div>
                                            <textarea className="form-control" value={req[0].comment || ""} placeholder={t('EnterReason')} rows="5" onChange={e => this.handleInputChange(e, req[0].groupId)}></textarea>
                                        </div>
                                        {req[0].errors.comment ? this.error('comment', req[0].groupId) : null}
                                    </div>
                                </div>
                            </div>
                            {!index ?
                                !isEdit && <button type="button" className="btn btn-add-multiple" onClick={() => this.onAddLeave(req[0].groupId)}><i className="fas fa-plus"></i> {t("AddLeave")}</button>
                                :
                                !isEdit && <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveLeave(req[0].groupId)}><i className="fas fa-times"></i> {t("CancelLeave")}</button>
                            }
                        </div>
                    )
                })}

                {
                    (!isEdit || (isEdit && leaveOfAbsence?.appraiserId)) 
                    && <AssesserComponent 
                            isEdit={isEdit} 
                            errors={errors} 
                            approver={approver} 
                            appraiser={appraiser} 
                            recentlyAppraiser={recentlyManagers?.appraiser} 
                            updateAppraiser={this.updateAppraiser.bind(this)} />
                }
                <ApproverComponent 
                    isEdit={isEdit} 
                    errors={errors} 
                    appraiser={appraiser} 
                    approver={approver} 
                    recentlyApprover={recentlyManagers?.approver} 
                    updateApprover={this.updateApprover.bind(this)} />

                <ul className="list-inline">
                    {files.map((file, index) => {
                        return <li className="list-inline-item" key={index}>
                            <span className="file-name">
                                <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                                <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i>
                            </span>
                        </li>
                    })}
                </ul>
                <ButtonComponent isEdit={isEdit} files={files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} />
            </div>
        )
    }
}

export default withTranslation()(LeaveOfAbsenceComponent)
