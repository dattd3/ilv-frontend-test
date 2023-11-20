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
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations, getRegistrationMinDateByConditions, isValidDateRequest, isEnableFunctionByFunctionName } from "../../../commons/Utils"
import NoteModal from '../NoteModal'
import { checkIsExactPnL } from '../../../commons/commonFunctions';
import { absenceRequestTypes, PN03List, MATERNITY_LEAVE_KEY, MARRIAGE_FUNERAL_LEAVE_KEY, MOTHER_LEAVE_KEY, FOREIGN_SICK_LEAVE, ANNUAL_LEAVE_KEY, ADVANCE_ABSENCE_LEAVE_KEY, COMPENSATORY_LEAVE_KEY, 
    VIN_UNI_SICK_LEAVE, VIN_SCHOOL_SICK_LEAVE } from "../../Task/Constants"
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconClock from 'assets/img/icon/ic_clock.svg'
import LoadingModal from 'components/Common/LoadingModal'
import ProcessingModal from 'components/Common/ProcessingModal'

const absenceTypesAndDaysOffMapping = {
    1: { day: 3, time: 24 },
    2: { day: 1, time: 8 },
    3: { day: 3, time: 24 }
}
const totalDaysForSameDay = 1
const queryString = window.location.search
const currentEmployeeNo = localStorage.getItem('employeeNo')
const currentCompanyCode = localStorage.getItem("companyCode")

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
                    groupItem: 1, // index group con bên trong
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
                    groupId: 1, // index group to bên ngoài
                    errors: {},
                }
            ],
            errors: {},
            needReload: true,
            totalPendingLeaves: null,
            totalPendingTOILs: null,
            validating: false,
            isLoading: false,
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

    initialData = () => {
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        muleSoftConfig['params'] = {
            date: moment().format('YYYYMMDD')
        }
        const config = getRequestConfigurations()
        const annualLeaveSummaryApiEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/currentabsence`
        const pendingInfoEndpoint = `${process.env.REACT_APP_REQUEST_URL}request/pendings`
        const requestAnnualLeaveSummary = axios.get(annualLeaveSummaryApiEndpoint, muleSoftConfig)
        const requestPendingInfo = axios.get(pendingInfoEndpoint, config)
    
        Promise.allSettled([requestAnnualLeaveSummary, requestPendingInfo]).then(responses => {
          this.processAnnualLeaveSummary(responses[0])
          this.processPendingInfo(responses[1])
        }).finally (() => {
        })


        const { leaveOfAbsence, t } = this.props
        registerLocale("vi", t("locale") === "vi" ? vi : enUS)

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
    }
    
    processAnnualLeaveSummary = response => {
        const annualLeaveSummary = this.processData(response)
        this.setState({ annualLeaveSummary: annualLeaveSummary })
    }

    processPendingInfo = response => {
        const data = this.processData(response)
        const { totalPendingLeaves, totalPendingTOILs } = data
        this.setState({ totalPendingLeaves, totalPendingTOILs })
    }

    processData = response => {
        let data = null
        if (response?.status === "fulfilled" && response?.value?.data) {
            const result = response.value.data?.result
            if (result && result?.code == Constants.API_SUCCESS_CODE) {
                data = response.value.data?.data
            }
        }
        return data
    }

    componentDidMount() {
        this.initialData()
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
    }

    setStartTime(startTime, groupId, groupItem) {
        const isVinMecUsers = checkIsExactPnL(Constants.pnlVCode.VinMec)
        let { requestInfo } = this.state
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
        const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
        requestInfo[indexReq].startTime = isVinMecUsers ? this.roundTimeForVinMec(start, 'startTime') : start
        requestInfo[indexReq].errors.startTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
        this.setState({ requestInfo })
    }

    setEndTime(endTime, groupId, groupItem) {
        const isVinMecUsers = checkIsExactPnL(Constants.pnlVCode.VinMec)
        let { requestInfo } = this.state
        const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
        const end = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
        requestInfo[indexReq].endTime = isVinMecUsers ? this.roundTimeForVinMec(end, 'endTime') : end
        requestInfo[indexReq].errors.endTime = null
        requestInfo[indexReq].errors.totalDaysOff = null
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

    isOverlapDateTime(startDateTimeInput, endDateTimeInput, indexReq) {
        if (!startDateTimeInput || !endDateTimeInput) {
            return false
        }

        const { requestInfo } = this.state
        const startDateTime = startDateTimeInput ? moment(startDateTimeInput, 'DD/MM/YYYY hh:mm') : null
        const endDateTime = endDateTimeInput ? moment(endDateTimeInput, 'DD/MM/YYYY hh:mm') : null
        const hasOverlap = requestInfo.filter((item, i) => i != indexReq).some(req => {
            const start = !req?.startDate ? null : moment(`${req?.startDate} ${req?.startTime || "00:00"}`, 'DD/MM/YYYY hh:mm') 
            const end = !req?.endDate ? null : moment(`${req?.endDate} ${req?.endTime || "23:59"}`, 'DD/MM/YYYY hh:mm')
            return start && end && (
                (startDateTime?.isSameOrBefore(start) && endDateTime?.isSameOrAfter(end)) 
                || (startDateTime?.isSameOrAfter(start) && startDateTime?.isSameOrBefore(end))
                || (endDateTime?.isSameOrAfter(start) && endDateTime?.isSameOrBefore(end))
            )
        })

        return hasOverlap
    }

    calculateTotalTime(startDate, endDate, startTime, endTime, indexReq) {
        const requestInfo = [...this.state.requestInfo]
        const { isAllDay, isAllDayCheckbox } = requestInfo[indexReq]
        if (isAllDay && isAllDayCheckbox && (!startDate || !endDate)) return
        if (!isAllDay && !isAllDayCheckbox && (!startDate || !endDate || !startTime || !endTime)) return

        // const startDateTime = !startDate ? null : `${startDate} ${startTime || "00:00"}`
        // const endDateTime = !endDate ? null : `${endDate} ${endTime || "23:59"}`
        // const isOverlapDateTime = this.isOverlapDateTime(startDateTime, endDateTime, indexReq)
        // if (isOverlapDateTime) {
        //     requestInfo[indexReq].errors.totalDaysOff = "Trùng với thời gian nghỉ đã chọn trước đó. Vui lòng chọn lại thời gian!"
        //     return this.setState({ requestInfo })
        // }
        
        if (!startDate || !endDate) {
            return
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

        if (times.length === 0 || (times || []).some(item => (!item?.from_date || !item?.to_date))) return

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

        this.setState({ validating: true, isProcessing: true })
        axios.post(`${process.env.REACT_APP_REQUEST_URL}request/validate`, {perno: currentEmployeeNo, ...(isEdit && { requestId: this.props.taskId }), times: times}, config)
            .then(res => {
                if (res?.data?.data?.times?.length > 0) {
                    const newRequestInfo = this.state.requestInfo.map((req, index) => {
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
                } else {
                    // this.setState({ needReload: false })
                    // this.showStatusModal(this.props.t("Notification"), res?.data?.result?.message, false)
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.totalDaysOff = res?.data?.result?.message
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
                } else {
                    this.setState({ needReload: false })
                    // this.showStatusModal(this.props.t("Notification"), error?.response?.data?.result?.message || "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!", false)
                    
                    const newRequestInfo = requestInfo.map(req => {
                        const errors = req.errors
                        errors.totalDaysOff = error?.response?.data?.result?.message || "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!"
                        return {
                            ...req,
                            errors,
                        }
                    })
                    this.setState({ newRequestInfo })
                }
            }).finally(() => this.setState({ validating: false, isProcessing: false }))
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
        const { t } = this.props
        const requestInfo = [...this.state.requestInfo]
        const index = groupId - 1 // groupId bắt đầu từ 1. Cần trừ đi 1 để đúng với index của mảng
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

            // Check if NNN => Not combine with other types
            if (newRequestInfo?.length > 1 ) {
              if (newRequestInfo?.some((item => item.absenceType?.value === FOREIGN_SICK_LEAVE)) && newRequestInfo?.some((item => item.absenceType?.value && item.absenceType?.value !== FOREIGN_SICK_LEAVE))) {
                return this.setState({
                  isShowStatusModal: true,
                  isSuccess: false,
                  titleModal: t("Warning"),
                  messageModal: t("ForeignLeaveWarningText"),
                  needReload: false
                })
              }
            }
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
        this.setState({ requestInfo: newRequestInfo, isShowStatusModal: false, disabledSubmitButton: false, needReload: true })

        if (['absenceType', 'funeralWeddingInfo'].includes(name) && (newRequestInfo || []).filter(item => item?.groupId == groupId).every(item => !item?.startDate && !item?.endDate) ) {
            return
        }

        this.validateTimeRequest(newRequestInfo, index)
    }

    verifyInput() {
        let { requestInfo, approver, appraiser } = this.state;
        const errors = { ...this.state.errors }
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

        errors.approver = !approver ? this.props.t('Required') : errors.approver

        this.setState({
            requestInfo,
            errors: errors,
        })

        const listError = requestInfo.map(req => _.compact(_.valuesIn(req.errors))).flat()
        if (listError.length > 0 || errors?.approver || errors?.appraiser) {
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
        const { t, leaveOfAbsence } = this.props
        const { files, isEdit, requestInfo } = this.state
        const err = this.verifyInput()
        this.setDisabledSubmitButton(true)
        if (!err) {
            this.setDisabledSubmitButton(false)
            return
        }

        const hasNotErrorBackDate = (requestInfo || []).every(item => isValidDateRequest(item?.startDate))
        if ((!this.props?.isEdit && !hasNotErrorBackDate) || (this.props?.isEdit && !isValidDateRequest(moment(leaveOfAbsence?.requestInfo[0]?.startDate, 'YYYYMMDD').format('DD/MM/YYYY')))) {
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
        bodyFormData.append('companyCode', currentCompanyCode)
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
            bodyFormData.append('id', leaveOfAbsence.id)
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
        const errorMsg = requestInfo[indexReq].errors[name]
        return errorMsg ? <p className="text-danger">{errorMsg}</p> : null
    }

    showStatusModal = (title, message, isSuccess = false, isWarningCreateRequest = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess, isWarningCreateRequest: isWarningCreateRequest });
    }

    hideStatusModal = () => {
        const { isEdit, needReload } = this.state
        this.setState({ isShowStatusModal: false, disabledSubmitButton: false })

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
        const isEnableForeignSickLeave = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.foreignSickLeave)
        let absenceRequestTypesPrepare = absenceRequestTypes.map(item => ({...item, label: t(item.label)}))
        
        if (!isEnableForeignSickLeave) {
            absenceRequestTypesPrepare = (absenceRequestTypesPrepare || []).filter(item => item?.value !== FOREIGN_SICK_LEAVE)
        }

        if (currentCompanyCode !== Constants.pnlVCode.VinUni) {
            absenceRequestTypesPrepare = (absenceRequestTypesPrepare || []).filter(item => item?.value !== VIN_UNI_SICK_LEAVE)
        }

        if (currentCompanyCode !== Constants.pnlVCode.VinSchool) {
            absenceRequestTypesPrepare = (absenceRequestTypesPrepare || []).filter(item => item?.value !== VIN_SCHOOL_SICK_LEAVE)
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
            approver,
            validating,
            isWarningCreateRequest,
            isLoading,
            isProcessing,
        } = this.state
        const sortRequestListByGroup = requestInfo.sort((reqPrev, reqNext) => reqPrev.groupId - reqNext.groupId)
        const requestInfoArr = _.valuesIn(_.groupBy(sortRequestListByGroup, (req) => req.groupId))
        const checkVinmec = checkIsExactPnL(Constants.pnlVCode.VinMec);
        const minDate = getRegistrationMinDateByConditions()
        const registeredInformation = (leaveOfAbsence?.requestInfoOld || leaveOfAbsence?.requestInfoOld?.length > 0) ? leaveOfAbsence.requestInfoOld : leaveOfAbsence?.requestInfo

        return (
            <div className="leave-of-absence">
                <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} isWarningCreateRequest={isWarningCreateRequest} onHide={this.hideStatusModal} />
                <NoteModal show={isShowNoteModal} onHide={this.hideNoteModal} />
                <LoadingModal show={isLoading} />
                <ProcessingModal isShow={isProcessing} />
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
                        <div className='text-uppercase font-weight-bold box-title'>{t("InformationOnRegisteredLeave")}</div>
                        <div className='content'>
                            {
                                (registeredInformation || []).map((ri, riIndex) => {
                                    let  totalTimeRegistered = ri?.isAllDay ? `${ri?.days || 0} ${t('DayUnit')}` : `${ri?.hours || 0} ${t('HourUnit')}`
                                    let isForeignSickLeave = ri?.absenceType?.value === FOREIGN_SICK_LEAVE
                                    let isForeignSickLeaveForVinUni = ri?.absenceType?.value === VIN_UNI_SICK_LEAVE
                                    let isForeignSickLeaveForVSC = ri?.absenceType?.value === VIN_SCHOOL_SICK_LEAVE

                                    return (
                                        <div className='item' key={`old-request-info-${riIndex}`}>
                                            {
                                                (isForeignSickLeave || isForeignSickLeaveForVinUni || isForeignSickLeaveForVSC) ? (
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <label>{t('StartDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.startDate && moment(ri?.startDate, 'YYYYMMDD').isValid() ? moment(ri?.startDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                    {ri?.startTime ? ' ' + moment(ri?.startTime, 'HH:mm').locale('en-us').format('HH:mm') : ''}
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <label>{t('EndDateTime')}</label>
                                                                <div className='d-flex align-items-center value'>
                                                                    {ri?.endDate && moment(ri?.endDate, 'YYYYMMDD').isValid() ? moment(ri?.endDate, 'YYYYMMDD').format('DD/MM/YYYY') : ''}
                                                                    {ri?.endTime ? ' ' + moment(ri?.endTime, 'HH:mm').locale('en-us').format('HH:mm') : ''}
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
                                                            {
                                                                isForeignSickLeave
                                                                ? (
                                                                    <div className='col-md-4'>
                                                                        <label>{t('SickLeaveFundForExpat')}</label>
                                                                        <div className='d-flex align-items-center value'>{`${Number(annualLeaveSummary?.SICK_LEA_EXPAT || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_EXPAT || 0)}` }</div>
                                                                    </div>
                                                                )
                                                                : isForeignSickLeaveForVinUni ? (
                                                                    <div className='col-md-4'>
                                                                        <label>{t('SickLeaveFundForVinUni')}</label>
                                                                        <div className='d-flex align-items-center value'>{`${Number(annualLeaveSummary?.SICK_LEA_VUNI || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VUNI || 0)}` }</div>
                                                                    </div>
                                                                )
                                                                : (
                                                                    <div className='col-md-4'>
                                                                        <label>{t('SickLeaveFundForVinSchool')}</label>
                                                                        <div className='d-flex align-items-center value'>{`${Number(annualLeaveSummary?.SICK_LEA_VSC || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VSC || 0)}` }</div>
                                                                    </div>
                                                                )
                                                            }
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

                    let isLeaveForMother = req[0]?.absenceType?.value === MOTHER_LEAVE_KEY
                    return (
                        <div className="box shadow position-relative" key={index}>
                            { isEdit && <div className='text-uppercase font-weight-bold box-title'>{t("InformationOnAdjustmentOfLeaveRegistration")}</div> }
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
                                                            <Select value={req[0].funeralWeddingInfo} onChange={funeralWeddingInfo => this.handleSelectChange('funeralWeddingInfo', funeralWeddingInfo, req[0].groupId)} placeholder={t('Select')} key="absenceType" options={PN03ListPrepare} />
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
                                        {
                                            req[0]?.absenceType?.value === VIN_UNI_SICK_LEAVE && (
                                                <>
                                                    <p className="title">{t("SickLeaveFundForVinUni")}</p>
                                                    <input type="text" className="form-control" style={{ height: 38, borderRadius: 4, padding: '0 15px' }} value={`${Number(annualLeaveSummary?.SICK_LEA_VUNI || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VUNI || 0)}`} disabled />
                                                </>
                                            )
                                        }
                                        {
                                            req[0]?.absenceType?.value === VIN_SCHOOL_SICK_LEAVE && (
                                                <>
                                                    <p className="title">{t("SickLeaveFundForVinSchool")}</p>
                                                    <input type="text" className="form-control" style={{ height: 38, borderRadius: 4, padding: '0 15px' }} value={`${Number(annualLeaveSummary?.SICK_LEA_VSC || 0).toFixed(3)} ${this.formatDayUnitByValue(annualLeaveSummary?.SICK_LEA_VSC || 0)}`} disabled />
                                                </>
                                            )
                                        }
                                        { (req[0]?.isShowHintLeaveForMother || isLeaveForMother) && <p className="message-danger"><i className="text-danger">* {t('AllowRegisterFor1Hour')}</i></p> }
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-8 col-xl-8">
                                        {req.map((reqDetail, indexDetail) => {
                                            return <div className={`time-area ${isEdit ? 'editing' : ''}`} key={index + indexDetail}>
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
                                                    (req[0]?.isShowHintLeaveForMother || isLeaveForMother) ?
                                                        (
                                                            <div className="row wrap-date-time">
                                                                <div className="col-lg-12 col-xl-6 col-first">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="title">{t('StartHour')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail.groupId, reqDetail.groupItem)}
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
                                                                                    <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.startTime ? this.error('startTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <p className="title">{t('Endtime')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
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
                                                                                    <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                                                                </label>
                                                                            </div>
                                                                            {reqDetail.errors.endTime ? this.error('endTime', reqDetail.groupId, reqDetail.groupItem) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-xl-6 col-second">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="title">{t('StartDate')}</p>
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="startDate"
                                                                                        selectsStart
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={minDate ? minDate?.toDate() : reqDetail.endDate ? this.addDays(reqDetail.endDate, -31) : null}
                                                                                        maxDate={reqDetail?.endDate ? moment(reqDetail?.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
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
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate ? minDate?.toDate() : this.getMinDate()}
                                                                                        maxDate={reqDetail.startDate ? this.addDays(reqDetail.startDate, 31) : null}
                                                                                        onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
                                                                                        className="form-control input" />
                                                                                    <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
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
                                                            <div className="row wrap-date-time">
                                                                <div className="col-lg-12 col-xl-6 col-first">
                                                                    <p className="title">{t('StartDateTime')}</p>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <div className="content input-container">
                                                                                <label>
                                                                                    <DatePicker
                                                                                        name="startDate"
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
                                                                                        selectsStart
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={minDate?.toDate() || null}
                                                                                        maxDate={reqDetail?.endDate ? moment(reqDetail?.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
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
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
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
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
                                                                                        selectsEnd
                                                                                        autoComplete="off"
                                                                                        selected={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                                                        minDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : minDate?.toDate() || null}
                                                                                        onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem, isLeaveForMother || req[0]?.isShowHintLeaveForMother)}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        placeholderText={t('Select')}
                                                                                        locale={t("locale")}
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
                                                                                        onClickOutside={() => this.onBlurDateTimePicker(reqDetail?.groupId, reqDetail?.groupItem)}
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
                                                                                    <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
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
                                                            <div className="row total-days-off">
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

                                <div className="row" style={{ marginTop: 10 }}>
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
                    disableApproverParams={requestInfo?.some(item => item.absenceType?.value === FOREIGN_SICK_LEAVE)}
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
                <ButtonComponent isEdit={isEdit} files={files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} validating={validating} />
            </div>
        )
    }
}

export default withTranslation()(LeaveOfAbsenceComponent)
