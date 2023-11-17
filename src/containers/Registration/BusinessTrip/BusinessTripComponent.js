import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import Constants from '../../../commons/Constants'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import moment from 'moment'
import map from '../../../../src/containers/map.config'
import { withTranslation } from "react-i18next";
import { getValueParamByQueryString, getRegistrationMinDateByConditions, isValidDateRequest } from "../../../commons/Utils"
import { checkIsExactPnL } from '../../../commons/commonFunctions';
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconClock from 'assets/img/icon/ic_clock.svg'
import LoadingModal from 'components/Common/LoadingModal'
import ProcessingModal from 'components/Common/ProcessingModal'

registerLocale("vi", vi)

const FULL_DAY = 1
const DURING_THE_DAY = 2
const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const TRAINING_OPTION_VALUE = "DT01"
const totalDaysForSameDay = 1
const queryString = window.location.search

const isEditPage = () => {
    const currentURL = window.location.pathname
    const arrURL = currentURL.split("/")
    const arrURLLength = arrURL.length
    if (arrURLLength > 3) {
        if (arrURL[arrURLLength - 1] && arrURL[arrURLLength - 1] === 'edit' && arrURL[arrURLLength - 2] && arrURL[arrURLLength - 3]) {
            return true
        }
        return false
    }
    return false
}

class BusinessTripComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: isEditPage(),
            approver: null,
            files: [],
            isUpdateFiles: false,
            appraiser: null,
            errors: {},
            titleModal: "",
            messageModal: "",
            disabledSubmitButton: false,
            dateRequest: getValueParamByQueryString(queryString, 'date'),
            requestInfo: [
                {
                    groupItem: 1,
                    startDate: getValueParamByQueryString(queryString, 'date'),
                    startTime: 0,
                    endDate: getValueParamByQueryString(queryString, 'date'),
                    endTime: 0,
                    comment: null,
                    totalTimes: 0,
                    totalDays: getValueParamByQueryString(queryString, 'date') ? totalDaysForSameDay : 0,
                    isAllDay: true,
                    attendanceQuotaType: null,
                    place: null,
                    vehicle: null,
                    groupId: 1,
                    errors: {},
                }
            ],
            needReload: true,
            validating: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { businessTrip } = nextProps
        if (businessTrip) {
            return ({
                approver: businessTrip.approver,
                appraiser: businessTrip.appraiser
            })
        }
        return prevState
    }

    componentDidMount() {
        const { businessTrip } = this.props
        if (businessTrip && businessTrip && businessTrip.requestInfo) {
            const { groupID, days, id, startDate, startTime, processStatusId, endDate, endTime, hours, attendanceType, location, vehicle, isAllDay, comment } = businessTrip.requestInfo[0]
            const { appraiser, approver, requestDocuments } = businessTrip
            this.setState({
                approver: approver,
                appraiser: appraiser,
                requestInfo: [
                    {
                        id: id,
                        groupItem: 0,
                        startDate: moment(startDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                        startTime: startTime ? moment(startTime, 'HHmm00').format('HH:mm') : null,
                        endDate: moment(endDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                        endTime: endTime ? moment(endTime, 'HHmm00').format('HH:mm') : null,
                        totalTimes: hours,
                        totalDays: days,
                        processStatusId: processStatusId,
                        comment: comment,
                        isAllDay: isAllDay,
                        groupId: parseInt(groupID || 1),
                        errors: {},
                        attendanceQuotaType: attendanceType,
                        place: {
                            ...location,
                            label: location ? _.upperFirst(location.label) : null
                        },
                        vehicle: {
                            ...vehicle,
                            label: vehicle ? _.upperFirst(vehicle.label) : null
                        },
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
        requestInfo[indexReq].errors.overlapDateTime = null
        this.setState({ requestInfo })
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
        requestInfo[indexReq].errors.overlapDateTime = null
        this.setState({ requestInfo })
    }

    setStartTime(startTime, groupId, groupItem) {
        const isVinMecUsers = checkIsExactPnL(Constants.pnlVCode.VinMec)
        let { requestInfo } = this.state
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
        const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
        requestInfo[indexReq].startTime = isVinMecUsers ? this.roundTimeForVinMec(start, 'startTime') : start
        requestInfo[indexReq].errors.startTime = null
        requestInfo[indexReq].errors.overlapDateTime = null
        this.setState({ requestInfo })
    }

    roundTimeForVinMec = (timeInput, type = 'startTime') => {
        let time = moment(timeInput, Constants.LEAVE_TIME_FORMAT)
        let m = time.minutes()
        let timeOutput = time

        switch (type) {
            case 'startTime':
                if (m > 30) {
                    time.set('minute', 30);
                    timeOutput = time.format(Constants.LEAVE_TIME_FORMAT);
                } else if (m < 30 && m > 0) {
                    time.set('minute', 0);
                    timeOutput = time.format(Constants.LEAVE_TIME_FORMAT);
                }

                return timeOutput
            case 'endTime':
                let h = time.hours()
                if (m > 30) {
                    if (h < 24) {
                        h = h + 1;
                        m = 0;
                        time.set('hour', h);
                        time.set('minute', m);
                        timeOutput = time.format(Constants.LEAVE_TIME_FORMAT);               
                    }
                } else if (m < 30 && m > 0) {
                    time.set('minute', 30);
                    timeOutput = time.format(Constants.LEAVE_TIME_FORMAT);
                }
        
                return timeOutput
        }
        return timeOutput
    }

    onBlurDateTimePicker = (groupId, groupItem) => {
        const requestInfo = [...this.state.requestInfo]
        const request = requestInfo.find(req => req?.groupId === groupId && req?.groupItem === groupItem)
        const { startDate, endDate, startTime, endTime } = request
        const indexReq = requestInfo.findIndex(req => req?.groupId === groupId && req?.groupItem === groupItem)
        this.calculateTotalTime(startDate, endDate, startTime, endTime, indexReq)
    }

    setEndTime(endTime, groupId, groupItem) {
        const isVinMecUsers = checkIsExactPnL(Constants.pnlVCode.VinMec)
        let { requestInfo } = this.state
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)
        const end = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        requestInfo[indexReq].endTime = isVinMecUsers ? this.roundTimeForVinMec(end, 'endTime') : end
        requestInfo[indexReq].errors.endTime = null
        requestInfo[indexReq].errors.overlapDateTime = null
        this.setState({ requestInfo })
    }

    calculateTotalTime(startDateInput, endDateInput, startTimeInput = null, endTimeInput = null, indexReq) {
        const { requestInfo } = this.state
        const { isAllDay,isAllDayCheckbox, errors } = requestInfo[indexReq]
        if ((isAllDay && isAllDayCheckbox && (!startDateInput || !endDateInput))
            || (!isAllDay && !isAllDayCheckbox && (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput))) {
            return false
        }

        // const startDateTime = moment(`${startDateInput} ${startTimeInput || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
        // const endDateTime = moment(`${endDateInput} ${endTimeInput || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')

        // const isOverlapDateTime = this.isOverlapDateTime(startDateTime, endDateTime, indexReq)
        // if (isOverlapDateTime && startDateTime && endDateTime) {
        //     requestInfo[indexReq].errors.startTimeAndEndTime = "Trùng với thời gian nghỉ đã chọn trước đó. Vui lòng chọn lại thời gian!"
        //     this.setState({ requestInfo })
        //     return
        // }

        // const start = moment(startDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
        // const end = moment(endDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
        // if (startDateTime && endDateTime) {
        //     this.validationFromDB(start, end, startTimeInput, endTimeInput, indexReq)
        // }

        if (!startDateInput || !endDateInput) return

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
            const startTime = moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION)
            const endTime = moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION)
            if (req.startDate && req.endDate && ((!req.isAllDay && !req.isAllDayCheckbox && startTime && startTime) || req.isAllDay || req.isAllDayCheckbox )) {
                times.push({
                    id: req.groupItem,
                    subid: req.id,
                    from_date: moment(req.startDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
                    from_time: !req.isAllDay && !req.isAllDayCheckbox ? startTime : "",
                    to_date: moment(req.endDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
                    to_time: !req.isAllDay && !req.isAllDayCheckbox ? endTime : "",
                    leave_type: "CTDT",
                    group_id: req.groupId
                })
            }
        })

        if (times.length === 0) return
        this.setState({ validating: true, isProcessing: true })
        axios.post(`${process.env.REACT_APP_REQUEST_URL}request/validate`, {
            perno: localStorage.getItem('employeeNo'),
            ...(this.state.isEdit && { requestId: this.props.taskId }),
            times: times,
        }, config)
            .then(res => {
                if (res?.data?.data?.times?.length > 0) {
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        let totalTimes
                        let totalDays
                        res.data.data.times.map(time => {
                            if (parseInt(time.group_id) === req.groupId && parseInt(time.id) === req.groupItem) {
                                errors.startTimeAndEndTime = !time.is_valid ? time.message : null
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
                } else {
                    // this.showStatusModal(this.props.t("Notification"), res?.data?.result?.message, false)
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.startTimeAndEndTime =  res.data.result.message
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            }).catch(error => {
                if (error.response.status == 401) {
                    window.location.reload();
                }
                else { 
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.startTimeAndEndTime = error?.response?.data?.result?.message || "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!"
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            }).finally(() => this.setState({ validating: false, isProcessing: false }))
    }

    isOverlapDateTime(startDateTime, endDateTime) {
        let { requestInfo } = this.state
        const hasOverlap = requestInfo.filter(req => {
            const start = moment(`${req.startDate} ${req.startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
            const end = moment(`${req.endDate} ${req.endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')

            if ((startDateTime > start && startDateTime < end) || (endDateTime > start && endDateTime < end) || (startDateTime < start && endDateTime > end)) {
                return req
            }
        })
        return Boolean(hasOverlap.length > 1)
    }

    validationFromDB = (startDate, endDate, startTime = null, endTime = null, indexReq) => {
        const { requestInfo } = this.state
        let { errors } = requestInfo[indexReq]
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }

        axios.post(`${process.env.REACT_APP_REQUEST_URL}user/validation-business-trip`, {
            from_date: startDate,
            to_date: endDate,
            from_time: startTime,
            to_time: endTime
        }, config)
            .then(res => {
                if (res && res.data) {
                    const data = res.data
                    if (!_.isNull(data.result) && data.result.code == Constants.API_ERROR_CODE) {
                        errors.startTimeAndEndTime = data.result.message
                    } else {
                        errors.startTimeAndEndTime = null
                    }
                    this.setState({ requestInfo })
                }
            }).catch(error => {

            })
    }

    updateFiles(files) {
        this.setState({ files: files })
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
        const newRequestInfo = requestInfo.map(req => {
            const errors = {
                ...req.errors,
                [name]: null
            }
            if (req.groupId === groupId) {
                return {
                    ...req,
                    [name]: value,
                    errors,
                    ...((name === "attendanceQuotaType" && value.value === TRAINING_OPTION_VALUE) && {isHiddenAddressAndVehicle: true})
                }
            }
            return { ...req }
        })
        this.setState({ requestInfo: newRequestInfo })
    }

    verifyInput() {
        let { requestInfo, approver, appraiser } = this.state
        const errors = { ...this.state.errors }
        const { t } = this.props

        if (approver?.account?.trim() && appraiser?.account?.trim() && approver?.account?.trim()?.toLowerCase() === appraiser?.account?.trim()?.toLowerCase()) {
            this.showStatusModal(t("Notification"), t("ApproverAndConsenterCannotBeIdentical"), false)
            this.setState({ needReload: false })
            return false
        }

        requestInfo.forEach((req, indexReq) => {
            const { startDate, endDate, startTime, endTime, attendanceQuotaType, vehicle, place, comment, isAllDay } = req
            requestInfo[indexReq].errors["startDate"] = !startDate ? this.props.t('Required') : null
            requestInfo[indexReq].errors["endDate"] = !endDate ? this.props.t('Required') : null
            requestInfo[indexReq].errors["startTime"] = !startTime && !isAllDay && !req.isAllDayCheckbox ? this.props.t('Required') : null
            requestInfo[indexReq].errors["endTime"] = !endTime && !isAllDay && !req.isAllDayCheckbox ?  this.props.t('Required') : null
            requestInfo[indexReq].errors.attendanceQuotaType = !attendanceQuotaType ? this.props.t('Required') : null
            if(attendanceQuotaType?.value != "DT01" && localStorage.getItem("companyCode") != 'V073') {
                requestInfo[indexReq].errors.vehicle = !vehicle ? this.props.t('Required') : null
                requestInfo[indexReq].errors.place = !place ? this.props.t('Required') : null
            }
            requestInfo[indexReq].errors.comment = !comment ? this.props.t('Required') : null
        })

        errors.approver = !approver ? this.props.t('Required') : null

        this.setState({
            requestInfo,
            errors: errors
        })
        const listError = requestInfo.map(req => _.compact(_.valuesIn(req.errors))).flat()
        if (listError.length > 0 || errors?.approver || errors?.appraiser) {
            return false
        }

        return true
    }

    setDisabledSubmitButton(status) {
        this.setState({ disabledSubmitButton: status })
    }

    submit() {
        const { t, businessTrip } = this.props
        const { requestInfo, files, isEdit } = this.state
        this.setDisabledSubmitButton(true)
        const err = this.verifyInput()
        this.setDisabledSubmitButton(true)
        if (!err) {
            this.setDisabledSubmitButton(false)
            return
        }

        const hasNotErrorBackDate = (requestInfo || []).every(item => isValidDateRequest(item?.startDate))
        if ((!this.props?.isEdit && !hasNotErrorBackDate) || (this.props?.isEdit && !isValidDateRequest(moment(businessTrip?.requestInfo[0]?.startDate, 'YYYYMMDD').format('DD/MM/YYYY')))) {
            this.showStatusModal(t("Notification"), t("ErrorBackDateRequestVinpearl"), false)
            this.setState({ needReload: false })
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
                attendanceType: req.attendanceQuotaType,
                vehicle: req?.isHiddenAddressAndVehicle ? null : req.vehicle,
                location: req?.isHiddenAddressAndVehicle ? null : req.place,
                isAllDay: req.isAllDay,
                groupId: req.groupId,
            }
            if (isEdit) {
                reqItem = {
                    ...reqItem,
                    processStatusId: req.processStatusId ? req.processStatusId : requestInfo[0]?.processStatusId,
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
            id: Constants.BUSINESS_TRIP,
            name: "Đăng ký công tác đào tạo"
        }))
        bodyFormData.append('requestInfo', JSON.stringify(dataRequestInfo))
        if (isEdit) {
            bodyFormData.append('id', businessTrip?.id)
        }

        if(!isEdit)
        {
            files.forEach(file => {
                bodyFormData.append('Files', file)
            })
        }
        
        axios({
            method: 'POST',
            url: isEdit ? `${process.env.REACT_APP_REQUEST_URL}Request/edit` : `${process.env.REACT_APP_REQUEST_URL}Request/attendance/register`,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
        })
        .then(response => {
            const result = response?.data?.result
            if (result?.code === Constants.API_SUCCESS_CODE) {
                this.showStatusModal(t("Successful"), t("RequestSent"), true)
                this.setState({ needReload: true })
            } else if (result?.code == Constants.API_ERROR_CODE_WORKING_DAY_LOCKED) {
                this.setState({ needReload: true })
                this.showStatusModal(t("Notification"), result?.message, false, true)
            } else {
                this.setState({ needReload: false })
                this.showStatusModal(t("Notification"), result?.message, false)
            }
        })
        .catch(error => {
            this.setState({ needReload: false })
            this.showStatusModal(t("Notification"), error?.response?.data?.result?.message || t("AnErrorOccurred"), false)
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
        const errorMsg = requestInfo[indexReq]?.errors[name]
        return errorMsg ? <p className="text-danger">{errorMsg}</p> : null
    }

    isNullCustomize = value => {
        return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
    }

    showStatusModal = (title, message, isSuccess = false, isWarningCreateRequest = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess, isWarningCreateRequest });
    };

    hideStatusModal = () => {
        const { isEdit, needReload } = this.state;
        this.setState({ isShowStatusModal: false, disabledSubmitButton: false });
        if (isEdit) {
            window.location.replace("/tasks")
        } else {
            if (needReload) {
                window.location.href = `${map.Registration}?tab=BusinessTripRegistration`
            }
        }
    }

    updateLeaveType(isAllDay, groupId) {
        const { requestInfo, dateRequest } = this.state
        const newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
        newRequestInfo.push({
            id: requestInfo[0]?.id,
            processStatusId: requestInfo[0]?.processStatusId,
            groupItem: 1,
            startDate: dateRequest,
            startTime: 0,
            endDate: dateRequest,
            endTime: 0,
            comment: null,
            totalTimes: 0,
            totalDays: dateRequest ? totalDaysForSameDay : 0,
            isAllDay: isAllDay,
            attendanceQuotaType: null,
            place: null,
            vehicle: null,
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

    addMultiDateTime(groupId, requestItem, isAllDay,req) {
        const { requestInfo, dateRequest } = this.state;
        const maxIndex = _.maxBy(requestItem, 'groupItem') ? _.maxBy(requestItem, 'groupItem').groupItem : 1;
        requestInfo.push({
            groupItem: maxIndex + 1,
            groupId: groupId,
            startDate: dateRequest,
            startTime: 0,
            endDate: dateRequest,
            endTime: 0,
            comment: req.comment,
            totalTimes: 0,
            totalDays: dateRequest ? totalDaysForSameDay : 0,
            isAllDay: isAllDay,
            attendanceQuotaType: req.attendanceQuotaType,
            place: req.place,
            vehicle: req.vehicle,
            errors: {},
        })
        this.setState({ requestInfo })
    }

    removeIndex(index, indexDetail) {
        let { requestList } = this.state;
        requestList[index].requestDetails.splice(indexDetail, 1)
        if (requestList[index].requestDetails.length > 1) {
            requestList[index].totalDays = requestList[index].requestDetails.reduce((cur, acc) => cur.totalDays + acc.totalDays)
            requestList[index].totalTimes = requestList[index].requestDetails.reduce((cur, acc) => cur.totalTimes + acc.totalTimes)
        } else {
            requestList[index].totalDays = requestList[index].requestDetails[0].totalDays
            requestList[index].totalTimes = requestList[index].requestDetails[0].totalTimes
        }
        this.setState({ requestList })
    }

    onAddBizTrip() {
        const { requestInfo, dateRequest } = this.state;
        const maxGroup = _.maxBy(requestInfo, 'groupId').groupId;
        requestInfo.push({
            groupItem: 1,
            startDate: dateRequest,
            startTime: 0,
            endDate: dateRequest,
            endTime: 0,
            comment: null,
            totalTimes: 0,
            totalDays: dateRequest ? totalDaysForSameDay : 0,
            isAllDay: true,
            attendanceQuotaType: null,
            place: null,
            vehicle: null,
            groupId: maxGroup + 1,
            errors: {},
        })
        document.querySelector('.list-inline').scrollIntoView({
            behavior: 'smooth'
        });
        this.setState({ requestInfo })
    }

    onRemoveBizTrip(groupId, groupItem) {
        let { requestInfo } = this.state;
        let newRequestInfo = []
        if (!groupItem) {
            newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
        } else {
            newRequestInfo = requestInfo.filter(req => req.groupId !== groupId || req.groupItem !== groupItem)
        }
        this.setState({ requestInfo: newRequestInfo })
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

    render() {
        const { t, businessTrip, recentlyManagers } = this.props;
        const { requestInfo, errors, approver, appraiser, isEdit, validating, isShowStatusModal, titleModal, messageModal, isSuccess, isWarningCreateRequest, isLoading, isProcessing } = this.state
        const sortRequestListByGroup = requestInfo.sort((reqPrev, reqNext) => reqPrev.groupId - reqNext.groupId)
        const requestInfoArr = _.valuesIn(_.groupBy(sortRequestListByGroup, (req) => req.groupId))
        const vehicles = [
            { value: '1', label: t('PrivateVehicles') },
            { value: '2', label: t('Taxi') },
            { value: '3', label: t('Train') },
            { value: '4', label: t('Flight') },
            { value: '5', label: t('Others') }
        ]

        const places = [
            { value: '1', label: t('Domestic') },
            { value: '2', label: t('Foreign') }
        ]

        let attendanceQuotaTypes = [
            { value: 'CT01', label: t('BizTripHasPerDiemNoMeals') },
            { value: 'CT02', label: t('BizTripHasPerDiemHasMeals') },
            { value: 'CT03', label: t('BizTripNoPerDiemHasMeals') },
            { value: 'CT04', label: t('BizTripNoPerDiemNoMeals') },
            { value: 'DT01', label: t('Menu_Training') },
            { value: 'WFH1', label: t('WFHNoPerDiemHasMeals') },
            { value: 'WFH2', label: t('WFHNoPerDiemNoMeals') },
        ]
        if (['V073'].includes(localStorage.getItem("companyCode"))) {
            attendanceQuotaTypes = [
                { value: 'CT03', label: t('BizTripNoPerDiemHasMeals') },
                { value: 'CT04', label: t('BizTripNoPerDiemNoMeals') },
                { value: 'DT01', label: t('Menu_Training') },
                { value: 'WFH1', label: t('WFHNoPerDiemHasMeals') },
                { value: 'WFH2', label: t('WFHNoPerDiemNoMeals') },
            ]
        }
        const checkVinmec = checkIsExactPnL(Constants.pnlVCode.VinMec);
        const minDate = getRegistrationMinDateByConditions()
        const registeredInformation = (businessTrip?.requestInfoOld || businessTrip?.requestInfoOld?.length > 0) ? businessTrip.requestInfoOld : businessTrip?.requestInfo
        
        return (
            <div className="business-trip">
                <ResultModal 
                    show={isShowStatusModal} 
                    title={titleModal} 
                    message={messageModal} 
                    isSuccess={isSuccess} 
                    isWarningCreateRequest={isWarningCreateRequest} 
                    onHide={this.hideStatusModal} />
                <LoadingModal show={isLoading} />
                <ProcessingModal isShow={isProcessing} />

                { isEdit && 
                    <div className="box shadow registered-information">
                        <div className='text-uppercase font-weight-bold box-title'>Thông tin đã đăng ký công tác/đào tạo</div>
                        <div className='content'>
                            {
                                (registeredInformation || []).map((ri, riIndex) => {
                                    let  totalTimeRegistered = ri?.isAllDay ? `${ri?.days || 0} ${t('DayUnit')}` : `${ri?.hours || 0} ${t('HourUnit')}`
                                    return (
                                        <div className='item' key={`old-request-info-${riIndex}`}>
                                            <div className='d-flex row-main-info'>
                                                <div className='row-main-info__item'>
                                                    <label>{t('StartDateTime')}</label>
                                                    <div className='d-flex align-items-center value'>
                                                        {ri?.startDate && moment(ri?.startDate, 'YYYYMMDD').isValid() ? moment(ri?.startDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                    </div>
                                                </div>
                                                <div className='row-main-info__item'>
                                                    <label>{t('EndDateTime')}</label>
                                                    <div className='d-flex align-items-center value'>
                                                        {ri?.endDate && moment(ri?.endDate, 'YYYYMMDD').isValid() ? moment(ri?.endDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                    </div>
                                                </div>
                                                <div className='row-main-info__item'>
                                                    <label>{t('TotalLeaveTime')}</label>
                                                    <div className='d-flex align-items-center value'>{totalTimeRegistered}</div>
                                                </div>
                                            </div>
                                            <div className='d-flex row-main-info'>
                                                <div className='row-main-info__item'>
                                                    <label>{t('TypeOfBizTripAndTraining')}</label>
                                                    <div className='d-flex align-items-center value'>{ri?.attendanceType?.label || ''}</div>
                                                </div>
                                                <div className='row-main-info__item'>
                                                    <label>{t('Location')}</label>
                                                    <div className='d-flex align-items-center value'>{ri?.location?.label || ''}</div>
                                                </div>
                                                <div className='row-main-info__item'>
                                                    <label>{t('MeansOfTransportation')}</label>
                                                    <div className='d-flex align-items-center value'>{ri?.vehicle?.label || ''}</div>
                                                </div>
                                            </div>
                                            <div className='reason'>
                                                <label>{t('ReasonTripAndTrainning')}</label>
                                                <div className='d-flex align-items-center value'>{ri?.comment || ''}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

                {requestInfoArr && requestInfoArr.map((req, index) => {
                    let totalDay = 0
                    let totalTime = 0
                    req.forEach(r => {
                        if (r.totalDays) {
                            totalDay += r.totalDays
                        }
                        if (r.totalTimes) {
                            totalTime += r.totalTimes
                        }
                    })
                    return (
                        <div className="box shadow position-relative" key={index}>
                            <div className="form">
                                <div className="row">
                                    <div className="col-7">
                                        <p className="text-uppercase"><b>{t('BizTrip_TrainingTime')}</b></p>
                                        <div className="btn-group btn-group-toggle leave-type" data-toggle="buttons">
                                            <label onClick={this.updateLeaveType.bind(this, true, req[0].groupId)} className={req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                {t('FullDayBizTrip')}
                                            </label>
                                            <label onClick={this.updateLeaveType.bind(this, false, req[0].groupId)} className={!req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                                {t('ByHoursBizTrip')}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        {req.map((reqDetail, indexDetail) =>
                                            <div className="time-area" key={indexDetail + index}>
                                                {
                                                    !req[0].isAllDay ? 
                                                    <div className="all-day-area">
                                                        <span className='wrap-item'>
                                                            <input type="checkbox" value={reqDetail.groupId+"."+reqDetail.groupItem} checked={reqDetail.isChecked} id={`check-${index}-${indexDetail}`} className="check-box mr-2" onChange={this.handleCheckboxChange}/>
                                                            <label htmlFor={`check-${index}-${indexDetail}`}>{t('FullDay')}</label>
                                                        </span>
                                                    </div>                                                    
                                                    : null
                                                }
                                                <div className="row wrap-date-time">
                                                    <div className="col-lg-12 col-xl-6 col-first">
                                                        <p className="title">{t('StartDateTime')}</p>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div className="content input-container">
                                                                    <label>
                                                                        <DatePicker
                                                                            name="startDate"
                                                                            selectsStart
                                                                            onClickOutside={() => this.onBlurDateTimePicker(reqDetail.groupId, reqDetail.groupItem)}
                                                                            autoComplete="off"
                                                                            selected={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                                                            startDate={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                                                            endDate={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                                                            minDate={minDate?.toDate() || null}
                                                                            onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem)}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText={t('Select')}
                                                                            locale="vi"
                                                                            className="form-control input" />
                                                                        <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                                                                    </label>
                                                                </div>
                                                                {reqDetail.errors.startDate ? this.error('startDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="content input-container">
                                                                    <label>
                                                                        <DatePicker
                                                                            onClickOutside={() => this.onBlurDateTimePicker(reqDetail.groupId, reqDetail.groupItem)}
                                                                            selected={reqDetail.startTime ? moment(reqDetail.startTime, TIME_FORMAT).toDate() : null}
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
                                                                            disabled={req[0].isAllDay || reqDetail.isAllDayCheckbox} />
                                                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                                                    </label>
                                                                </div>
                                                                {reqDetail.errors.startTime ? this.error('startTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12 col-xl-6 col-second">
                                                        <p className="title">{t('EndDateTime')}</p>
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <div className="content input-container">
                                                                    <label>
                                                                        <DatePicker
                                                                            name="endDate"
                                                                            selectsEnd
                                                                            onClickOutside={() => this.onBlurDateTimePicker(reqDetail.groupId, reqDetail.groupItem)}
                                                                            autoComplete="off"
                                                                            selected={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                                                            startDate={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                                                            endDate={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                                                            minDate={reqDetail?.startDate ? moment(reqDetail?.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate?.toDate() || null}
                                                                            onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem)}
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText={t('Select')}
                                                                            locale="vi"
                                                                            className="form-control input" />
                                                                        <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                                                                    </label>
                                                                </div>
                                                                {reqDetail.errors.endDate ? this.error('endDate', reqDetail.groupId, reqDetail.groupItem) : null}
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="content input-container">
                                                                    <label>
                                                                        <DatePicker
                                                                            onClickOutside={() => this.onBlurDateTimePicker(reqDetail.groupId, reqDetail.groupItem)}
                                                                            selected={reqDetail.endTime ? moment(reqDetail.endTime, TIME_FORMAT).toDate() : null}
                                                                            onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
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
                                                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                                                    </label>
                                                                </div>
                                                                {reqDetail.errors.endTime ? this.error('endTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {!indexDetail 
                                                    ? <button type="button" className="btn btn-add-multiple-in-out" style={{ right: 0 }} onClick={() => this.addMultiDateTime(req[0].groupId, req, req[0].isAllDay, req[0])}><i className="fas fa-plus"></i> {t("AddMore")}</button>
                                                    : <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveBizTrip(reqDetail.groupId, reqDetail.groupItem)}><i className="fas fa-times"></i> {t("delete")}</button>
                                                }
                                                {
                                                    reqDetail.errors.startTimeAndEndTime ?
                                                        <>
                                                            <div className="row time-message">
                                                                <div className="col">
                                                                    {this.error('startTimeAndEndTime', reqDetail.groupId, reqDetail.groupItem)}
                                                                </div>
                                                            </div>
                                                        </>
                                                        : null
                                                }
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-4 col-xl-4">
                                        <p className="title">{t('TotalTimeForBizTripAndTraining')}</p>
                                        <div className="text-lowercase">
                                            <input type="text" className="form-control" value={req[0].isAllDay ? (totalDay ? totalDay + ` ${t("Day")}` : "") : (totalTime ? totalTime + ` ${t("Hour")}` : "")} readOnly />
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
                                <div className="row" style={{ marginTop: 5 }}>
                                    <div className="col-sm-6 col-md-5">
                                        <p className="title">{t('TypeOfBizTripAndTraining')}</p>
                                        <div>
                                            <Select name="attendanceQuotaType" value={req[0]?.attendanceQuotaType} onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType, req[0].groupId)} placeholder={t('Select')} key="attendanceQuotaType" options={attendanceQuotaTypes} />
                                        </div>
                                        {this.error('attendanceQuotaType', req[0].groupId)}
                                        <div className="row business-type business-type-note">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-6 text-info smaller">* {t('PerDiemIncluded')}</div>
                                                    <div className="col-md-6 text-info">* {t('NoPerDiem')}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 text-info smaller">* {t('MealsIncluded')}</div>
                                                    <div className="col-md-6 text-info">* {t('NoMeals')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        req[0]?.attendanceQuotaType?.value != "DT01" && !['V073'].includes(localStorage.getItem("companyCode")) ?
                                            <>
                                                <div className="col-sm-6 col-md-4">
                                                    <p className="title">{t('Location')}</p>
                                                    <div>
                                                        <Select name="place" value={req[0]?.place} onChange={place => this.handleSelectChange('place', place, req[0]?.groupId)} placeholder={t('Select')} key="place" options={places} />
                                                    </div>
                                                    {this.error('place', req[0]?.groupId)}
                                                </div>
                                                <div className="col-sm-12 col-md-3">
                                                    <p className="title">{t('MeansOfTransportation')}</p>
                                                    <div>
                                                        <Select name="vehicle" value={req[0].vehicle} onChange={vehicle => this.handleSelectChange('vehicle', vehicle, req[0].groupId)} placeholder={t('Select')} key="vehicle" options={vehicles} />
                                                    </div>
                                                    {this.error('vehicle', req[0]?.groupId)}
                                                </div>
                                            </>
                                            : null
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">{t('ReasonTripAndTrainning')}</p>
                                        <div>
                                            <textarea className="form-control" name="comment" value={req[0].comment || ""} onChange={e => this.handleInputChange(e, req[0].groupId)} placeholder={t('EnterReason')} rows="3"></textarea>
                                        </div>
                                        {req[0].errors.comment ? this.error('comment', req[0].groupId) : null}
                                    </div>
                                </div>
                            </div>
                            {!index ?
                                !isEdit && <button type="button" className="btn btn-add-multiple" onClick={() => this.onAddBizTrip()}><i className="fas fa-plus"></i> {t("AddBizTrip")}</button>
                                :
                                !isEdit && <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveBizTrip(req[0].groupId)}><i className="fas fa-times"></i> {t("RemoveBizTrip")}</button>
                            }
                        </div>
                    )
                })}
                { (!isEdit || (isEdit && businessTrip?.appraiserId)) 
                    && <AssesserComponent 
                            isEdit={isEdit} 
                            appraiser={appraiser} 
                            errors={errors} 
                            approver={approver} 
                            recentlyAppraiser={recentlyManagers?.appraiser} 
                            updateAppraiser={this.updateAppraiser.bind(this)} />
                }
                <ApproverComponent 
                    isEdit={isEdit} 
                    approver={approver} 
                    errors={errors} 
                    appraiser={appraiser} 
                    recentlyApprover={recentlyManagers?.approver} 
                    updateApprover={this.updateApprover.bind(this)} />
                <ul className="list-inline">
                    {this.state.files.map((file, index) => {
                        return <li className="list-inline-item" key={index}>
                            <span className="file-name">
                                <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                                <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i>
                            </span>
                        </li>
                    })}
                </ul>
                <ButtonComponent isEdit={isEdit} files={this.state.files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={this.state.disabledSubmitButton} validating={validating} />
            </div>
        )
    }
}
export default withTranslation()(BusinessTripComponent)
