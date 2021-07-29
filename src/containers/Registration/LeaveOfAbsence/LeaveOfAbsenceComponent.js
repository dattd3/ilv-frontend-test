import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { withTranslation } from "react-i18next";
import NoteModal from '../NoteModal'

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

class LeaveOfAbsenceComponent extends React.Component {
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
                    isShowHintLeaveForMother: false,
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
                // 'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                // 'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            },
            params: {
                date: moment().format('YYYYMMDD')
            }
        }

        const { leaveOfAbsence, t } = this.props
        if (t("locale") === "vi") {
            registerLocale("vi", vi)
        } else {
            registerLocale("en-US", enUS)
        }

        // {
        //     perno: localStorage.getItem('employeeNo'),
        //     date: moment().format('YYYYMMDD')
        // }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/currentabsence`, config)
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
        let { requestInfo } = this.state;
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
        this.setState({ requestInfo })
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
                        errors.totalDaysOff = res.data.result.message
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
                let check = false;
                if (value.value === "PN02") {
                    check = true;
                }
                else {
                    check = false;
                }

                const errors = {
                    ...req.errors,
                    absenceType: null
                }
                if (req.groupId === groupId) {

                    return {
                        ...req,
                        absenceType: value,
                        isShowHintLeaveForMother: check,
                        isChecked: check ? false : req.isChecked,
                        isAllDayCheckbox: check ? false : req.isChecked,
                        startDate: check ? null : req.startDate,
                        endDate: check ? null : req.endDate,
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
                if (response && response.data.data && response.data.result) {
                    this.showStatusModal(t("Successful"), t("RequestSent"), true)
                    this.setDisabledSubmitButton(false)
                }
                else {
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
        return errorMsg ? <p className="text-danger p-2">{errorMsg}</p> : null
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

    setMinTime (time) {
        return time ? setHours(setMinutes(new Date(), parseInt(time.split(':')[1])), (parseInt(time.split(':')[0]))) : null
    }

    setMaxTime(time) {
        return time ? setHours(setMinutes(new Date(), parseInt(time.split(':')[1])), (parseInt(time.split(':')[0]) + 1)) : null
    }

    setSelectedEndTime (endTime, flagTime) {
        let cvtedEndTime = moment(endTime, Constants.LEAVE_TIME_FORMAT);
        let cvtedMaxTime = moment(this.setMaxTime(flagTime), Constants.LEAVE_TIME_FORMAT);
        let cvtedMinTime = moment(this.setMinTime(flagTime), Constants.LEAVE_TIME_FORMAT);

        if (cvtedEndTime > cvtedMaxTime) {
            return cvtedMaxTime.toDate();
        }
        if (cvtedEndTime < cvtedMinTime) {
            return cvtedMinTime.toDate();
        }

        return cvtedEndTime.toDate();
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
                            <div className="title">{t('AdvancecdAnnualLeave')}</div>
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
                            <div className="form">
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        <div className="row">
                                            <div className="col-lg-6 col-xl-6">
                                                <p className="">{t('SelectLeaveType')}</p>
                                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
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
                                                        <Select name="absenceType" value={req[0].absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType, req[0].groupId)} placeholder={t('Select')} key="absenceType" options={absenceTypes.filter(absenceType => (req[0].isAllDay) || (absenceType.value !== 'IN01' && absenceType.value !== 'IN02' && absenceType.value !== 'IN03' && absenceType.value !== 'PN03'))} />
                                                    </div>
                                                    {req[0].errors.absenceType ? this.error('absenceType', req[0].groupId) : null}

                                                    {req[0].absenceType && req[0].absenceType.value === 'PN03' ? <p className="title">Thông tin hiếu, hỉ</p> : null}
                                                    {req[0].absenceType && req[0].absenceType.value === 'PN03' ?
                                                        <div>
                                                            <Select name="PN03" value={req[0].funeralWeddingInfo} onChange={funeralWeddingInfo => this.handleSelectChange('funeralWeddingInfo', funeralWeddingInfo, req[0].groupId)} placeholder={t('Select')} key="absenceType" options={PN03List} />
                                                        </div>
                                                        :
                                                        null}
                                                    {req[0].errors.funeralWeddingInfo ? this.error('funeralWeddingInfo', req[0].groupId) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        {
                                            req[0].isShowHintLeaveForMother ?
                                                <p className="message-danger"><i className="text-danger">* {t('AllowRegisterFor1Hour')}</i></p>
                                                : ''
                                        }

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        {req.map((reqDetail, indexDetail) => (
                                            <div className="time-area" key={index + indexDetail}>
                                                {
                                                    !req[0].isAllDay ?
                                                        <div className="all-day-area">
                                                            <input disabled={req[0].isShowHintLeaveForMother ? "disabled" : ""} type="checkbox" value={reqDetail.groupId + "." + reqDetail.groupItem} checked={reqDetail.isChecked} className="check-box mr-2" onChange={this.handleCheckboxChange} />
                                                            <label>{t('FullDay')}</label>
                                                        </div>
                                                        : null
                                                }
                                                {
                                                    req[0].isShowHintLeaveForMother ?
                                                        (
                                                            <div className="row p-2">
                                                                <div className="col-lg-12 col-xl-6">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="title">{t('StartTime')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        selected={reqDetail.startTime ? moment(reqDetail.startTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setStartTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        autoComplete="off"
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
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
                                                                                        selected={reqDetail.endTime ? moment(reqDetail.endTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        showTimeSelect
                                                                                        autoComplete="off"
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
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
                                                                                        minDate={['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        // maxDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(this.getMaxDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : this.getMaxDate())}
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
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : this.getMinDate())}
                                                                                        maxDate={this.getMaxDate()}
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
                                                                                        // minDate={['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={(['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), Constants.LEAVE_DATE_FORMAT).toDate() : null)}
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
                                                                                        selected={reqDetail.startTime ? moment(reqDetail.startTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setStartTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        autoComplete="off"
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
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
                                                                                        // minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null)}
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), Constants.LEAVE_DATE_FORMAT).toDate() : null)}
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
                                                                                        selected={reqDetail.endTime ? moment(reqDetail.endTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                                                        onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                                                                        showTimeSelect
                                                                                        autoComplete="off"
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
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

                                                {!indexDetail ?
                                                    !isEdit &&
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
                                        ))}
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        <p className="title">{t('TotalLeaveTime')}</p>
                                        <div className="text-lowercase">
                                            <input type="text" className="form-control" value={req[0].isAllDay ? (totalDay ? totalDay + ` ${t("Day")}` : "") : (totalTime ? totalTime + ` ${t("Hour")}` : "")} readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">{t('ReasonRequestLeave')}</p>
                                        <div>
                                            <textarea className="form-control" value={req[0].comment || ""} name="commnent" placeholder={t('EnterReason')} rows="5" onChange={e => this.handleInputChange(e, req[0].groupId)}></textarea>
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
                <AssesserComponent isEdit={isEdit} errors={errors} approver={approver} appraiser={appraiser} updateAppraiser={this.updateAppraiser.bind(this)} />

                <ApproverComponent isEdit={isEdit} errors={errors} appraiser={appraiser} approver={approver} updateApprover={this.updateApprover.bind(this)} />
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
