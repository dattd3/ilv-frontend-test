import React from 'react'
import axios from 'axios'
import { registerLocale } from 'react-datepicker'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"

import Constants from '../../../commons/Constants'
import ResignationRequestsManagementActionButton from '../TerminationComponents/ResignationRequestsManagementActionButton'
import ListStaffResignationComponent from '../TerminationComponents/ListStaffResignationComponent'
import ResultModal from '../ResultModal'

import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'

const FULL_DAY = 1
const DURING_THE_DAY = 2

const absenceTypesAndDaysOffMapping = {
    1: { day: 3, time: 24 },
    2: { day: 1, time: 8 },
    3: { day: 3, time: 24 }
}

const ANNUAL_LEAVE_KEY = "PQ01"
const COMPENSATORY_LEAVE_KEY = "PQ02"
const ADVANCE_COMPENSATORY_LEAVE_KEY = "PQ03"
const ADVANCE_ABSENCE_LEAVE_KEY = "PQ04"
const MATERNITY_LEAVE_KEY = "IN02"

class ResignationRequestsManagementPage extends React.Component {
    constructor(props) {
        super();
        this.state = {
            approver: null,
            appraiser: null,
            annualLeaveSummary: null,
            files: [],
            isUpdateFiles: false,
            isEdit: false,
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            isShowNoteModal: false,
            requestInfo: [
                {
                    groupItem: 1,
                    startDate: null,
                    startTime: null,
                    endDate: null,
                    endTime: null,
                    comment: null,
                    totalTimes: 0,
                    totalDays: 0,
                    absenceType: null,
                    isAllDay: true,
                    funeralWeddingInfo: null,
                    groupId: 1,
                    errors: {},
                }
            ],
            errors: {}
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
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const { leaveOfAbsence, t } = this.props
        if (t("locale") === "vi") {
            registerLocale("vi", vi)
        } else {
            registerLocale("en-US", enUS)
        }


        axios.post(`${process.env.REACT_APP_MULE_HOST_INBOUND}api/sap/hcm/v1/inbound/user/currentabsence`, {
            perno: localStorage.getItem('employeeNo'),
            date: moment().format('YYYYMMDD')
        }, config)
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
                isEdit: true,
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
    }

    setStartDate(startDate, groupId, groupItem) {
        let { requestInfo } = this.state;
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem);
        const { endDate, startTime, endTime } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = moment(startDate).isValid() ? moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : null
        const end = endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) > endDate)
            || !requestInfo[indexReq].isAllDay ? moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : endDate
        requestInfo[indexReq].startDate = start
        requestInfo[indexReq].endDate = end
        requestInfo[indexReq].errors.startDate = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        this.calculateTotalTime(start, end, startTime, endTime, indexReq)
    }

    setEndDate(endDate, groupId, groupItem) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startDate, startTime, endTime } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = !requestInfo[indexReq].isAllDay ? moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT) : startDate
        const end = moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT)

        requestInfo[indexReq].startDate = start
        requestInfo[indexReq].endDate = end
        requestInfo[indexReq].errors.endDate = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        this.calculateTotalTime(start, end, startTime, endTime, indexReq)
    }

    setStartTime(startTime, groupId, groupItem) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startDate, endTime, endDate } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

        const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
        const startTimeToSave = moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
        let end = endTime

        if (end === undefined || (moment(startTime).isValid() && moment(startTimeToSave, Constants.LEAVE_TIME_FORMAT) > moment(endTime, Constants.LEAVE_TIME_FORMAT))) {
            end = moment(startTime).isValid() && moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
        }

        if ((moment(startTime).isValid() && moment(startTimeToSave, "HH:mm") >= moment("16:00", Constants.LEAVE_TIME_FORMAT))
            && (moment(endTime, "HH:mm").isValid() && moment(endTime, "HH:mm") < moment("08:00", "HH:mm"))) {
            end = endTime
        }
        requestInfo[indexReq].startTime = start
        requestInfo[indexReq].endTime = end
        requestInfo[indexReq].errors.startTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        this.calculateTotalTime(startDate, endDate, start, end, indexReq)
    }

    setEndTime(endTime, groupId, groupItem) {
        let { requestInfo } = this.state
        const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
        const { startTime, startDate, endDate } = request
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)

        const endTimeToSave = moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        let start = startTime

        if (startTime === undefined || (moment(endTime).isValid() && moment(endTimeToSave, Constants.LEAVE_TIME_FORMAT) < moment(startTime, Constants.LEAVE_TIME_FORMAT))) {
            start = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        }

        if ((moment(startTime, "HH:mm").isValid() && moment(startTime, "HH:mm") >= moment("16:00", Constants.LEAVE_TIME_FORMAT))
            && (moment(endTime).isValid() && moment(endTimeToSave, "HH:mm") < moment("08:00", "HH:mm"))) {
            start = startTime
        }

        const end = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        requestInfo[indexReq].startTime = start
        requestInfo[indexReq].endTime = end
        requestInfo[indexReq].errors.endTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
        this.calculateTotalTime(startDate, endDate, start, end, indexReq)
    }

    isOverlapDateTime(startDateTime, endDateTime, indexReq) {
        let { requestInfo } = this.state

        const hasOverlap = requestInfo.flat().filter(req => {
            const start = moment(`${req.startDate} ${req.startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
            const end = moment(`${req.endDate} ${req.endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')

            if ((startDateTime >= start && startDateTime < end) || (endDateTime > start && endDateTime <= end) || (startDateTime <= start && endDateTime >= end)) {
                return req
            }
        })
        return Boolean(hasOverlap.length > 1)
    }

    calculateTotalTime(startDate, endDate, startTime, endTime, indexReq) {
        const { requestInfo } = this.state
        const { isAllDay, isAllDayCheckbox } = requestInfo[indexReq]
        if (isAllDay && isAllDayCheckbox && (!startDate || !endDate)) return
        if (!isAllDay && !isAllDayCheckbox && (!startDate || !endDate || !startTime || !endTime)) return

        const startDateTime = moment(`${startDate} ${startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
        const endDateTime = moment(`${endDate} ${endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')
        const isOverlapDateTime = this.isOverlapDateTime(startDateTime, endDateTime, indexReq)
        if (isOverlapDateTime) {
            requestInfo[indexReq].errors.totalDaysOff = "Trùng với thời gian nghỉ đã chọn trước đó. Vui lòng chọn lại thời gian !"
            this.setState({ requestInfo })
            return
        }
        this.validateTimeRequest(requestInfo)
    }

    validateTimeRequest(requestInfo) {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        const times = [];
        requestInfo.forEach(req => {
            const startTime = req.startTime ? moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null
            const endTime = req.endTime ? moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION) : null
            if (req.startDate && req.endDate && ((!req.isAllDay && !req.isAllDayCheckbox && startTime && startTime) || req.isAllDay || req.isAllDayCheckbox )) {
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
console.log(times)
        if (times.length === 0) return
        axios.post(`${process.env.REACT_APP_REQUEST_URL}request/validate`, {
            perno: localStorage.getItem('employeeNo'),
            times: times,
        }, config)
            .then(res => {
                if (res && res.data && res.data.data && res.data.data.times.length > 0) {
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        let totalTimes
                        let totalDays
                        res.data.data.times.map(time => {
                            if (parseInt(time.group_id) === req.groupId && parseInt(time.id) === req.groupItem) {
                                errors.totalDaysOff = !time.is_valid ? time.message : null
                                totalTimes = time.hours
                                totalDays = time.days
                            }

                        })
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
                        errors.totalDaysOff = this.props.t("AnErrorOccurred")
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            }).catch(error => {

                const newRequestInfo = requestInfo.map(req => {
                    const errors = req.errors
                    errors.totalDaysOff = "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!"
                    return {
                        ...req,
                        errors,
                    }
                })
                this.setState({ newRequestInfo })
            })
    }

    calFullDay(timesheets) {
        const hours = timesheets.filter(timesheet => timesheet.shift_id !== 'OFF').reduce((accumulator, currentValue) => {
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
        const { requestInfo } = this.state
        let newRequestInfo = []
        if (name === "absenceType") {
            newRequestInfo = requestInfo.map(req => {
                const errors = {
                    ...req.errors,
                    absenceType: null
                }
                if (req.groupId === groupId) {
                    return {
                        ...req,
                        absenceType: value,
                        errors
                    }
                }
                return { ...req }
            })
        } else if (name === "funeralWeddingInfo") {
            newRequestInfo = requestInfo.map(req => {
                let errors = req.errors
                if (req.funeralWeddingInfo && (req.isAllDay && req.totalDays > absenceTypesAndDaysOffMapping[req.funeralWeddingInfo.value].day)) {
                    const days = absenceTypesAndDaysOffMapping[req.funeralWeddingInfo.value].day
                    errors['funeralWeddingInfo'] = `Thời gian được đăng ký nghỉ tối đa là ${days} ngày`
                } else {
                    errors['funeralWeddingInfo'] = null
                }

                if (req.groupId === groupId) {
                    return {
                        ...req,
                        funeralWeddingInfo: value,
                        errors
                    }
                }
                return { ...req }
            })
        }
        this.setState({ requestInfo: newRequestInfo })
        this.validateTimeRequest(newRequestInfo)
    }

    verifyInput() {
        let { requestInfo, approver, appraiser, errors } = this.state;
        requestInfo.forEach((req, indexReq) => {
            if (!req.startDate) {
                req.errors["startDate"] = this.props.t('Required')
            }
            if (!req.endDate) {
                req.errors["endDate"] = this.props.t('Required')
            }
            if (!req.startTime && !req.isAllDay && !req.isAllDayCheckbox) {
                req.errors["startTime"] = this.props.t('Required')
            }
            if (!req.endTime && !req.isAllDay && !req.isAllDayCheckbox) {
                req.errors["endTime"] = this.props.t('Required')
            }
            if (!req.absenceType) {
                requestInfo[indexReq].errors.absenceType = this.props.t('Required')
            }
            if (!req.comment) {
                requestInfo[indexReq].errors.comment = this.props.t('Required')
            }
            requestInfo[indexReq].errors['pn03'] = (requestInfo[indexReq].absenceType && requestInfo[indexReq].absenceType.value === 'PN03' && _.isNull(requestInfo[indexReq]['pn03'])) ? this.props.t('Required') : null
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
        const { requestInfo } = this.state;
        const maxIndex = _.maxBy(requestItem, 'groupItem') ? _.maxBy(requestItem, 'groupItem').groupItem : 1;
        requestInfo.push({
            groupItem: maxIndex + 1,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            comment: comment,
            totalTimes: 0,
            totalDays: 0,
            absenceType: absenceType,
            isAllDay: isAllDay,
            funeralWeddingInfo: funeralWeddingInfo,
            groupId: groupId,
            errors: {},
        })
        this.setState({ requestInfo })
    }

    onAddLeave() {
        const { requestInfo } = this.state;
        const maxGroup = _.maxBy(requestInfo, 'groupId').groupId;
        const maxGroupItem = _.maxBy(requestInfo, 'groupItem').groupItem;
        requestInfo.push({
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            comment: null,
            totalTimes: 0,
            totalDays: 0,
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
        this.setState({ requestInfo })
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
        const {
            files,
            isEdit,
            requestInfo
        } = this.state

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
                    processStatusId: req.processStatusId,
                    id: req.id
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
        bodyFormData.append('employeeNo', localStorage.getItem('employeeNo'))
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
            id: 2,
            name: "Đăng ký nghỉ"
        }))
        bodyFormData.append('requestInfo', JSON.stringify(dataRequestInfo))
        if (isEdit) {
            bodyFormData.append('id', this.props.leaveOfAbsence.id)
        }

        if(!isEdit)
        {
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
                if (response && response.data.data && response.data.result) {
                    this.showStatusModal(t("Successful"), t("RequestSent"), true)
                    this.setDisabledSubmitButton(false)
                }
                else
                {
                    this.showStatusModal(t("Notification"), response.data.result.message, false)
                    this.setDisabledSubmitButton(false)
                }
            })
            .catch(response => {
                this.showStatusModal(t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
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
        return errorMsg ? <p className="text-danger">{errorMsg}</p> : null
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        const { isEdit } = this.state;
        this.setState({ isShowStatusModal: false });
        if (isEdit) {
            window.location.replace("/tasks")
        } else {
            window.location.reload();
        }
    }

    updateLeaveType(isAllDay, groupId) {
        const { requestInfo } = this.state
        const newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
        newRequestInfo.push({
            groupItem: 1,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            comment: null,
            totalTimes: 0,
            totalDays: 0,
            absenceType: null,
            isAllDay: isAllDay,
            funeralWeddingInfo: null,
            groupId: groupId,
            errors: {},
        })

        this.setState({ requestInfo: newRequestInfo })
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
            }
        });

        this.setState({ requestInfo: requestInfo })
        this.validateTimeRequest(requestInfo)
    }


    handleDatePickerInputChange(index, dateInput, field, name) {
        if (moment(dateInput, 'DD-MM-YYYY').isValid()) {
          const oldPrefix = "old_"
          const date = moment(dateInput).format('DD-MM-YYYY')
          let newUserEducation = [...this.state[name]]
          newUserEducation[index][oldPrefix + field] = newUserEducation[index][field]
          newUserEducation[index][field] = date
          this.setState({ [name]: [...newUserEducation] })
          this.updateParrent(name, newUserEducation)
        }
    }

    render() {
        const { t } = this.props;
        let absenceTypes = [
            { value: 'IN01', label: t('SickLeave') },
            { value: MATERNITY_LEAVE_KEY, label: t('MaternityLeave') },
            { value: 'IN03', label: t('RecoveryLeave') },
            { value: 'PN01', label: t('LeaveForExpats') },
            { value: 'PN02', label: t("LeaveForMother") },
            { value: 'PN03', label: t('LeaveForMarriageFuneral') },
            // { value: 'PN04', label: t('LeaveForWorkAccidentOccupationalDisease') },
            { value: ANNUAL_LEAVE_KEY, label: t('AnnualLeaveYear') },
            { value: ADVANCE_ABSENCE_LEAVE_KEY, label: t("AdvancedLeave") },
            { value: COMPENSATORY_LEAVE_KEY, label: t('ToilIfAny') },
            // { value: ADVANCE_COMPENSATORY_LEAVE_KEY, label: 'Nghỉ bù tạm ứng' },
            { value: 'UN01', label: t('UnpaidLeave') }
        ]

        const PN03List = [
            { value: '1', label: 'Bản thân Kết hôn' },
            { value: '2', label: 'Con kết hôn' },
            { value: '3', label: 'Bố đẻ, mẹ đẻ, bố vợ, mẹ vợ hoặc bố chồng, mẹ chồng mất; vợ chết hoặc chồng mất; con mất' },
        ];
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

        return (
            <>
            <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideStatusModal} />
            <div className="leave-of-absence resignation-requests-management-page">
                <ResignationRequestsManagementActionButton />
                <ListStaffResignationComponent />
            </div>
            </>
        )
    }
}

export default withTranslation()(ResignationRequestsManagementPage)
