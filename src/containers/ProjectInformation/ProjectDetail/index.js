import React, { useState, useEffect, useRef } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Tabs, Tab } from 'react-bootstrap'
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import DatePicker, {registerLocale } from 'react-datepicker'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { status, ILoveVinGroupSite } from '../Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import NoteComponent from './NoteComponent'
import ProjectStructureComponent from './ProjectStructureComponent'
import ButtonComponent from './ButtonComponent'
import GoalComponent from './GoalComponent'
import GeneralInformationComponent from './GeneralInformationComponent'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import ConfirmModal from '../../../components/Common/ConfirmModal'
import IconArrowLeft from '../../../assets/img/icon/Icon-Arrow-Left.svg'
import IconArrowPrevious from '../../../assets/img/icon/arrow-previous.svg'
import IconArrowNext from '../../../assets/img/icon/arrow-next.svg'
import IconMaNhanVienBlue from '../../../assets/img/icon/Icon_Manhanvien_Blue.svg'
import IconVitriBlue from '../../../assets/img/icon/Icon_Vitri_Blue.svg'
import IconEmailBlue from '../../../assets/img/icon/Icon_Email_Blue.svg'
import IconKyNangBlue from '../../../assets/img/icon/Icon_Kynang_Blue.svg'
import IconCheckWhite from '../../../assets/img/icon/Icon_Check_White.svg'
import IconInfoRed from '../../../assets/img/icon/Icon_Info_Red.svg'
import IconInfoViolet from '../../../assets/img/icon/Icon_Info_Violet.svg'
import IconInfoYellow from '../../../assets/img/icon/Icon_Info_Yellow.svg'

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const currentEmployeeNoLogged = localStorage.getItem('employeeNo')

function ProjectDetail(props) {
    // const history = useHistory();
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({})
    const [projectTimeSheetOriginal, SetProjectTimeSheetOriginal] = useState([])
    const [projectTimeSheetFiltered, SetProjectTimeSheetFiltered] = useState([])
    const [days, SetDays] = useState([])
    const [dateChange, SetDateChange] = useState(null)
    const [isLoading, SetIsLoading] = useState(false)
    const [confirmModal, SetConfirmModal] = useState({isShow: false, confirmHeader: 'Xác nhận ứng tuyển', confirmContent: 'Bạn chắc chắn muốn tham gia dự án này?'})
    const [statusModal, SetStatusModal] = useState({isShow: false, isSuccess: true, content: ''})
    const [filter, SetFilter] = useState({
        option: 'week',
        fromDate: null,
        toDate: null,
        employees: [],
        employeeSelected: []
    })
    const projectId = parseInt(props.match.params.id)
    const [weekNumber, SetWeekNumber] = useState(moment().week())
    const actionForWeek = {
        previous: 0,
        next: 1
    }
    const employeeSource = {
        NOI_BO: 'NB',
        THUE_NGOAI: 'TN'
    }

    const timeSheetStatusPending = 0
    const timeSheetStatusApproved = 1
    const timeSheetStatusDenied = 2

    const timeSheetStatusStyleMapping = {
        [timeSheetStatusPending]: {label: 'Pending', className: 'pending'},
        [timeSheetStatusApproved]: {label: 'Approved', className: 'approved'},
        [timeSheetStatusDenied]: {label: 'Denied', className: 'denied'}
    }
    const leaveCodes = ['IN01', 'IN02', 'IN03', 'PN01', 'PN02', 'PN03', 'PQ01', 'PQ04', 'PQ02', 'UN01']
    const businessTripTrainingCodes = ['CT01', 'CT02', 'CT03', 'CT04', 'DT01', 'WFH1', 'WFH2']
    const prefixOutSource = 'TN'

    const usePrevious = (value) => {
        const ref = useRef()
        useEffect(() => {
            ref.current = value
        })
        return ref.current
    }

    const useHasChanged= (val) => {
        const prevVal = usePrevious(val)
        return !_.isEqual(prevVal, val)
    }

    const hasProjectDataChanged = useHasChanged(projectData)

    useEffect(() => {
        const dayTemps = getDaysOfWeekByDateOnWeek(moment())
        setDateForFilter(dayTemps)
        SetDays(dayTemps)
    }, [])

    useEffect(() => {
        const prepareProjectDetailData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    return data
                }
                return null
            }
            return null
        }

        const getProjectDetail = async (projectId) => {
            try {
                const config = getRequestConfigurations()
                config.params = {
                    id: projectId,
                    site: ILoveVinGroupSite
                }
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/detail`, config)
                return prepareProjectDetailData(response)
            } catch (e) {
                return null
            }
        }

        const prepareProjectTimeSheetData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    let data = response.data?.data
                    data = [...data].map(item => {
                        return {
                            ...item,
                            rsmTimeSheets: (item?.rsmTimeSheet || []).sort((current, next) => {
                                let first = moment(current.date, 'DD-MM-YYYY')
                                let second = moment(next.date, 'DD-MM-YYYY')
                                return first - second
                            })
                        }
                    })

                    const timeSheets = (data || []).map(item => {
                        return {
                            avatar: item?.rsmResources?.avatar,
                            fullName: item?.rsmResources?.fullName,
                            title: item?.rsmResources?.title,
                            employeeId: item?.rsmResources?.employeeNo,
                            position: item?.rsmResources?.specialize,
                            email: item?.rsmResources?.email,
                            skills: item?.rsmResources?.skills ? JSON.parse(item?.rsmResources?.skills) : [],
                            source: item?.resources,
                            timeSheets: [],
                            rsmTimeSheet: _.groupBy(item?.rsmTimeSheets, sub => sub.date),
                            rsmLeaveTypeAndComment: item.rsmLeaveTypeAndComment
                        }
                    })
                    return timeSheets
                }
                return []
            }
            return []
        }

        const getProjectTimeSheetData = async (projectId, payload) => {
            try {
                const config = getRequestConfigurations()
                const response = await axios.post(`${process.env.REACT_APP_RSM_URL}projects/list-timesheet`, payload, config)
                return prepareProjectTimeSheetData(response)
            } catch (e) {
                return []
            }
        }

        const prepareUserTimeSheetData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    let data = response.data?.data
                    data = data.sort((current, next) => {
                        let first = moment(current.date, 'DD-MM-YYYY')
                        let second = moment(next.date, 'DD-MM-YYYY')
                        return first - second
                    })
                    .map(item => {
                        return {
                            date: item.date,
                            hoursValue: item.hoursValue,
                            is_holiday: item.is_holiday,
                            pernr: item.pernr,
                            username: item.username,
                            status: item.status,
                            shift_id: item.shift_id,
                            from_time1: item.from_time1, // Bắt đầu kế hoạch
                            to_time1: item.to_time1, // Kết thúc kế hoạch
                            start_time1_fact: item.start_time1_fact, // Bắt đầu thực tế
                            end_time1_fact: item.end_time1_fact, // Kết thúc thực tế
                            actualHours: "",
                            rsmStatus: null,
                        }
                    })
                    const timeSheets = _.groupBy(data, item => item.pernr)
                    return timeSheets
                }
                return null
            }
            return null
        }

        const getUserTimeSheetData = async (projectId, payload) => {
            try {
                const config = getRequestConfigurations()
                const response = await axios.post(`${process.env.REACT_APP_RSM_URL}projects/timeoverview`, payload, config)
                return prepareUserTimeSheetData(response)
            } catch (e) {
                return null
            }
        }

        const mappingActualHours = (arrayIncludeKey, objIncludeKey) => {
            const result = (arrayIncludeKey || []).map(item => {
                return {
                    ...item,
                    actualHours: objIncludeKey[item.date] ? objIncludeKey[item.date][0]?.actual || "" : "",
                    rsmStatus: objIncludeKey[item.date] ? objIncludeKey[item.date][0]?.statusId : null
                }
            })

            return result
        }

        const prepareOutSourceTimeSheets = (rsmTimeSheet, employeeId, email) => {
            const daysFormat = (days || []).map(item => moment(item).format('DD-MM-YYYY'))
            const itemExist = Object.values(rsmTimeSheet)[0][0]
            const timeSheets = daysFormat.reduce((initial, current) => {
                let item = rsmTimeSheet[current] && rsmTimeSheet[current].length > 0 ? rsmTimeSheet[current][0] : {}
                if (rsmTimeSheet[current]?.length > 0) {
                    const itemExistToSave = {...itemExist}
                    itemExistToSave['actualHours'] = item?.actual || ""
                    itemExistToSave['end_time1_fact'] = null
                    itemExistToSave['date'] = current
                    itemExistToSave['from_time1'] = null
                    itemExistToSave['hoursValue'] = item?.hours
                    itemExistToSave['is_holiday'] = '0'
                    itemExistToSave['pernr'] = employeeId
                    itemExistToSave['rsmStatus'] = item?.statusId
                    itemExistToSave['shift_id'] = item?.shift_Id
                    itemExistToSave['start_time1_fact'] = null
                    itemExistToSave['status'] = 0
                    itemExistToSave['to_time1'] = null
                    itemExistToSave['username'] = email
                    initial.push(itemExistToSave)
                } else {
                    initial.push({
                        id: itemExist?.id,
                        projectId: itemExist?.projectId,
                        resourceId: itemExist?.resourceId,
                        actualHours: itemExist?.actual || "",
                        actual: itemExist?.actual,
                        plannedTotal: itemExist?.plannedTotal,
                        date: current,
                        end_time1_fact: null,
                        hours: itemExist?.hours,
                        from_time1: null,
                        hoursValue: itemExist?.hours,
                        is_holiday: '0',
                        pernr: employeeId,
                        rsmStatus: itemExist?.statusId,
                        shift_id: itemExist?.shift_Id,
                        shift_Id: itemExist?.shift_Id,
                        start_time1_fact: null,
                        status: 0,
                        to_time1: null,
                        username: email,
                        statusId: itemExist?.statusId,
                        isEdit: itemExist?.isEdit,
                        projetctTeamId: itemExist?.projetctTeamId
                    })
                }
                return initial
            }, [])

            return timeSheets
        }

        const fetchData = async () => {
            SetIsLoading(true)
            const projectDetailData = await getProjectDetail(projectId)
            SetProjectData(projectDetailData)
            if (projectDetailData && [status.inProgress, status.closed].includes(projectDetailData?.processStatusId)) {
                const startDate = moment(days[0]).format('YYYY-MM-DD')
                const endDate = moment(days[days?.length - 1]).format('YYYY-MM-DD')
                const internalEmployeeIds = (projectDetailData?.rsmProjectTeams || [])
                .filter(item => item?.rsmResources?.employeeNo && !item?.rsmResources?.employeeNo?.startsWith(prefixOutSource))
                .map(item => item?.rsmResources?.employeeNo)
                const employeeIds = (projectDetailData?.rsmProjectTeams || []).map(item => item?.rsmResources?.employeeNo)
                const payloadUserTimeSheet = {
                    employeeIds: internalEmployeeIds,
                    projectId: projectId,
                    startDate: startDate,
                    endDate: endDate
                }
                const payloadProjectTimeSheet = {
                    employeeIds: employeeIds,
                    projectId: projectId,
                    startDate: startDate,
                    endDate: endDate
                }

                let projectTimeSheetData = await getProjectTimeSheetData(projectId, payloadProjectTimeSheet)
                const userTimeSheetData = await getUserTimeSheetData(projectId, payloadUserTimeSheet)
                projectTimeSheetData = ([...projectTimeSheetData] || []).map(item => ({...item, timeSheets: item?.employeeId?.startsWith(prefixOutSource) ? prepareOutSourceTimeSheets(item?.rsmTimeSheet, item?.employeeId, item?.email) : userTimeSheetData && userTimeSheetData[item?.employeeId] || []}))              

                projectTimeSheetData = (projectTimeSheetData || []).map(item => {
                    return {
                        ...item,
                        timeSheets: mappingActualHours(item?.timeSheets, item?.rsmTimeSheet)
                    }
                })
                
                SetProjectTimeSheetOriginal(projectTimeSheetData)

                const filterTemp = {...filter}
                filterTemp.employees = projectTimeSheetData.map(item => {
                    return {
                        value: item.employeeId,
                        label: item.fullName
                    }
                })
                SetFilter(filterTemp)
            }
            SetIsLoading(false)
        }

        if (days && days.length > 0) {
            fetchData()
        }
    }, [days])

    const setDateForFilter = (dayInputs) => {
        const startDate = moment(dayInputs[0]).format('YYYY-MM-DD')
        const endDate = moment(dayInputs[dayInputs?.length - 1]).format('YYYY-MM-DD')
        const filterTemp = {...filter}
        filterTemp.fromDate = startDate
        filterTemp.toDate = endDate
        SetFilter(filterTemp)
    }

    const handleApply = () => {
        const confirmModalTemp = {...confirmModal}
        confirmModalTemp.isShow = true
        SetConfirmModal(confirmModalTemp)
    }

    const onCancelClick = () => {
        onHide()
    }

    const onHide = () => {
        const confirmModalTemp = {...confirmModal}
        confirmModalTemp.isShow = false
        SetConfirmModal(confirmModalTemp)
    }

    const onHideStatusModal = () => {
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = false
        SetStatusModal(statusModalTemp)
        window.location.reload()
    }

    const onAcceptClick = async () => {
        SetIsLoading(true)
        onHide()
        const statusModalTemp = {...statusModal}
        try {
            const payload = {
                projectId: parseInt(projectId),
                comment: ""
            }
            const config = getRequestConfigurations()
            const response = await axios.post(`${process.env.REACT_APP_RSM_URL}projects/apply`, payload, config)
            SetIsLoading(false)
            statusModalTemp.isShow = true
            if (response && response.data) {
                const result = response.data?.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                } else {
                    statusModalTemp.isSuccess = false
                }
                statusModalTemp.content = result.message
            } else {
                statusModalTemp.isSuccess = false
                statusModalTemp.content = t("AnErrorOccurred")
            }
            SetStatusModal(statusModalTemp)
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetIsLoading(false)
            SetStatusModal(statusModalTemp)
        }
    }

    const handleChangeDatePicker = time => {

    }

    const submitTimeSheet = async () => {
        const statusModalTemp = {...statusModal}
        try {
            SetIsLoading(true)
            const dataToSubmit = (projectTimeSheetOriginal || []).find(item => item.employeeId == currentEmployeeNoLogged)
            const { rsmTimeSheet, timeSheets } = dataToSubmit
            const payload = (timeSheets || [])
            .filter(item => moment(item?.date, 'DD-MM-YYYY').isSameOrAfter(moment(moment(projectData?.startDate).format('DD-MM-YYYY'), 'DD-MM-YYYY')) 
                            && moment(item?.date, 'DD-MM-YYYY').isSameOrBefore(moment(moment(projectData?.endDate).format('DD-MM-YYYY'), 'DD-MM-YYYY')))
            .map(item => {
                return {
                    id: rsmTimeSheet[item.date][0]?.id,
                    projectId: rsmTimeSheet[item.date][0]?.projectId,
                    resourceId: rsmTimeSheet[item.date][0]?.resourceId,
                    projetctTeamId: rsmTimeSheet[item.date][0]?.projetctTeamId,
                    date: rsmTimeSheet[item.date][0]?.date,
                    shift_Id: rsmTimeSheet[item.date][0]?.shift_Id,
                    plannedTotal: rsmTimeSheet[item.date][0]?.plannedTotal,
                    hours: rsmTimeSheet[item.date][0]?.hours,
                    actual: item?.actualHoursTemp !== null && item?.actualHoursTemp !== undefined ? item?.actualHoursTemp : item?.actualHours,
                    statusId: item?.isEditing && rsmTimeSheet[item.date][0]?.statusId == timeSheetStatusDenied ? timeSheetStatusPending : rsmTimeSheet[item.date][0]?.statusId,
                    isEdit: rsmTimeSheet[item.date][0]?.isEdit
                }
            })
            const config = getRequestConfigurations()
            const response = await axios.post(`${process.env.REACT_APP_RSM_URL}projects/update-timesheet`, payload, config)

            SetIsLoading(false)
            statusModalTemp.isShow = true

            if (response && response.data) {
                const result = response.data.result
                statusModalTemp.content = result?.message
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                } else {
                    statusModalTemp.isSuccess = false
                }
            } else {
                statusModalTemp.content = t("AnErrorOccurred")
            }
            SetStatusModal(statusModalTemp)
        } catch (e) {
            SetIsLoading(false)
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetStatusModal(statusModalTemp)
        }
    }

    const setActualTimeForListTimeSheet = (timeSheets, index, val) => {
        const result = (timeSheets || []).map((item, i) => {
            return {
                ...item,
                actualHoursTemp: index === i ? val : item?.actualHoursTemp !== null && item?.actualHoursTemp !== undefined ? item?.actualHoursTemp : item?.actualHours,
                ...(index === i && { isEditing: true })
            }
        })
        return result
    }

    const handleChangeActualTime = (parentIndex, timeSheetIndex, e) => {
        const actualTimeValid = [0, 2, 4, 6, 8]
        let value = e?.target?.value || ""

        if (!actualTimeValid.includes(parseInt(value))) {
            value = ""
        }

        if (projectTimeSheetFiltered?.length > 0) {
            const projectTimeSheetOriginalTemp = [...projectTimeSheetFiltered].map(item => {
                if (item?.employeeId != currentEmployeeNoLogged) {
                    return item
                } else {
                    return {
                        ...item,
                        timeSheets: setActualTimeForListTimeSheet(item?.timeSheets, timeSheetIndex, value)
                    }
                }
            })
            SetProjectTimeSheetFiltered(projectTimeSheetOriginalTemp)
        } else {
            const projectTimeSheetOriginalTemp = [...projectTimeSheetOriginal].map(item => {
                if (item?.employeeId != currentEmployeeNoLogged) {
                    return item
                } else {
                    return {
                        ...item,
                        timeSheets: setActualTimeForListTimeSheet(item?.timeSheets, timeSheetIndex, value)
                    }
                }
            })
            SetProjectTimeSheetOriginal(projectTimeSheetOriginalTemp)
        }
    }

    const handleChangeSelect = e => {
        const filterTemp = {...filter}
        filterTemp.employeeSelected = e
        const employeeIds = (e || []).map(item => item.value)
        const projectTimeSheetFilteredTemp = projectTimeSheetOriginal.filter(item => employeeIds.includes(item.employeeId))
        SetFilter(filterTemp)
        SetProjectTimeSheetFiltered(projectTimeSheetFilteredTemp)
    }

    const handleChangeWeekNumber = (type) => {
        if (weekNumber <= 1 && type === actionForWeek.previous) {
            return
        }

        let dateOnWeekChanged = dateChange || moment()
        let daysOfWeek = []
        let weekNumberTemp = weekNumber
        if (type === actionForWeek.next) {
            weekNumberTemp += 1
            dateOnWeekChanged = moment(dateOnWeekChanged).add(1, 'weeks')
            daysOfWeek = getDaysOfWeekByDateOnWeek(dateOnWeekChanged)
        } else {
            weekNumberTemp -= 1
            dateOnWeekChanged = moment(dateOnWeekChanged).subtract(1, 'weeks')
            daysOfWeek = getDaysOfWeekByDateOnWeek(dateOnWeekChanged)
        }

        setDateForFilter(daysOfWeek)
        SetWeekNumber(weekNumberTemp)
        SetDateChange(dateOnWeekChanged)
        SetDays(daysOfWeek)
    }

    const getDaysOfWeekByDateOnWeek = date => {
        const weekStart = moment(date).clone().startOf('week')
        const daysOfWeek = 6
        let days = []
        for (let i = 0; i <= daysOfWeek; i++) {
          const date = moment(weekStart).add(i, 'days')
          days.push(date)
        }
        return days
    }

    const { rsmBusinessOwners, rsmProjectTeams, rsmTargets, projectComment, plant, actual, mandayActual, mandayPlant } = projectData
    const rangeTimeFilter = `${projectData?.startDate ? moment(projectData?.startDate).format('DD/MM/YYYY') : ''} - ${projectData?.endDate ? moment(projectData?.endDate).format('DD/MM/YYYY') : ''}`

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        })
    };

    const formatMulesoftValue = val => {
        if (!val || val === '0' || val === '#' || val === '000000' || val === '00000000' || val === '0000') {
            return ""
        }
        return val
    }

    const goBack = () => {
        const backUrl = localStorage.getItem('backUrl')
        window.location.href = backUrl
    }

    const getNoteInfos = (timeSheet, rsmLeaveTypeAndComment, source) => {
        const fromTime1 = formatMulesoftValue(timeSheet.from_time1)
        const toTime1 = formatMulesoftValue(timeSheet.to_time1)
        const startTime1Fact = formatMulesoftValue(timeSheet.start_time1_fact)
        const endTime1Fact = formatMulesoftValue(timeSheet.end_time1_fact)

        let hasLeave = false
        let hasBusinessTripTraining = false
        let icon = IconInfoRed
        let notes = []
        const isUnusualShift = (
            ((!fromTime1 || !toTime1) && timeSheet.shift_id !== 'OFF')
            || ((startTime1Fact > fromTime1 || endTime1Fact < toTime1) && (timeSheet.shift_id !== 'OFF'))
        )

        const leaveData = (rsmLeaveTypeAndComment || []).filter(item => leaveCodes.includes(item?.baseTypeModel?.value) 
            && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrAfter(moment(item?.startDate, 'YYYYMMDD')) 
            && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrBefore(moment(item?.endDate, 'YYYYMMDD'))
        )
        const businessTripTrainingData = (rsmLeaveTypeAndComment || []).filter(item => businessTripTrainingCodes.includes(item?.baseTypeModel?.value)
            && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrAfter(moment(item?.startDate, 'YYYYMMDD')) 
            && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrBefore(moment(item?.endDate, 'YYYYMMDD'))
        )

        if (isUnusualShift) {
            icon = IconInfoRed
        } else {
            if (leaveData && leaveData?.length > 0) {
                icon = IconInfoYellow
                hasLeave = true
            } else if (businessTripTrainingData && businessTripTrainingData?.length > 0) {
                icon = IconInfoViolet
                hasBusinessTripTraining = true
            }
        }

        if (isUnusualShift) {
            notes.push({
                className: 'red',
                line1: 'Bất thường công:',
                line2: `Giờ kế hoạch: ${moment(fromTime1, 'HHmmss').isValid() ? moment(fromTime1, 'HHmmss').format('HH:mm:ss') : ""} - ${moment(toTime1, 'HHmmss').isValid() ? moment(toTime1, 'HHmmss').format('HH:mm:ss') : ""}`,
                line3: `Giờ thực tế: ${moment(startTime1Fact, 'HHmmss').isValid() ? moment(startTime1Fact, 'HHmmss').format('HH:mm:ss') : ""} - ${moment(endTime1Fact, 'HHmmss').isValid() ? moment(endTime1Fact, 'HHmmss').format('HH:mm:ss') : ""}`
            })
        }

        if (leaveData && leaveData?.length > 0) {
            icon = IconInfoYellow
            const leaveDataToSave = leaveData.map(item => {
                return {
                    className: 'yellow',
                    line1: `${item?.baseTypeModel?.label}:`,
                    line2: item?.user_Comment,
                    line3: `${moment(item?.startTime, 'HHmm').isValid() ? moment(item?.startTime, 'HHmm').format('HH:mm') : ""} - ${moment(item?.endTime, 'HHmm').isValid() ? moment(item?.endTime, 'HHmm').format('HH:mm') : ""}`
                    
                }
            })
            notes = notes.concat(leaveDataToSave)
        }

        if (businessTripTrainingData && businessTripTrainingData?.length > 0) {
            icon = IconInfoViolet
            const businessTripTrainingDataToSave = businessTripTrainingData.map(item => {
                return {
                    className: 'violet',
                    line1: `${item?.baseTypeModel?.label}:`,
                    line2: item?.user_Comment,
                    line3: `${moment(item?.startTime, 'HHmm').isValid() ? moment(item?.startTime, 'HHmm').format('HH:mm') : ""} - ${moment(item?.endTime, 'HHmm').isValid() ? moment(item?.endTime, 'HHmm').format('HH:mm') : ""}`
                    
                }
            })
            notes = notes.concat(businessTripTrainingDataToSave)
        }

        return {
            hasShowNote: source == employeeSource.THUE_NGOAI ? false : (isUnusualShift || hasLeave || hasBusinessTripTraining),
            icon: icon,
            notes: notes
        }
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <ConfirmModal modalClassName='apply-project' show={confirmModal.isShow} tempButtonLabel='Hủy' mainButtonLabel='Gửi' confirmHeader={confirmModal.confirmHeader} 
            confirmContent={confirmModal.confirmContent} onCancelClick={onCancelClick} onAcceptClick={onAcceptClick} onHide={onHide} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />
        <div className="projects-detail-page">
            <h1 className="content-page-header project-name"><span title="Back" onClick={goBack} style={{cursor: 'pointer'}}><Image src={IconArrowLeft} alt='Arrow' /></span>{projectData?.projectName}</h1>
            <Tabs defaultActiveKey="plan" id="project-detail-tabs">
                <Tab eventKey="plan" title='Kế hoạch' className="tab-item">
                    <GeneralInformationComponent projectData={projectData} />
                    <GoalComponent rsmTargets={rsmTargets} />
                    <ProjectStructureComponent 
                        rsmBusinessOwners={rsmBusinessOwners} 
                        rsmProjectTeams={rsmProjectTeams} 
                        plant={plant} 
                        actual={actual} 
                        mandayActual={mandayActual} 
                        mandayPlant={mandayPlant} 
                    />
                    <NoteComponent projectComment={projectComment} />
                    <ButtonComponent handleApply={handleApply} projectStatus={projectData?.processStatusId} />
                </Tab>
                {
                    [status.inProgress, status.closed].includes(projectData?.processStatusId)
                    && <Tab eventKey="project-management" title='Quản lý dự án'>
                        <div className="table-title">Đội ngũ dự án</div>
                        <div className="project-management">
                            <div className="content">
                                <div className="header-block">
                                    <div className="filter-block">
                                        <div className="wrap-note">
                                            <div className="alert alert-warning note-actual-time" role="alert">Giờ ACTUAL phải thuộc các giá trị: 0, 2, 4, 6, 8</div>
                                            <div className="option-filter">
                                                <span className="date">Ngày</span>
                                                <span className="week">Tuần</span>
                                                <span className="month">Tháng</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="other-filter-block">
                                        <div className="col-left">
                                            <div className="row-date">
                                                <div className="date-filter from">
                                                    <label>Từ ngày</label>
                                                    <DatePicker 
                                                        selected={filter.fromDate && moment(filter.fromDate).isValid() ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                                        onChange={time => handleChangeDatePicker(time)}
                                                        dateFormat="dd/MM/yyyy"
                                                        disabled
                                                        locale="vi"
                                                        className="form-control input filter-from-date" />
                                                </div>
                                                <div className="date-filter to">
                                                    <label>Đến ngày</label>
                                                    <DatePicker 
                                                        selected={filter.toDate && moment(filter.toDate).isValid() ? moment(filter.toDate, 'YYYY-MM-DD').toDate() : null}
                                                        onChange={time => handleChangeDatePicker(time)}
                                                        dateFormat="dd/MM/yyyy"
                                                        disabled
                                                        locale="vi"
                                                        className="form-control input filter-to-date" />
                                                </div>
                                            </div>
                                            <div className="row-employee">
                                                <label>Họ và tên</label>
                                                <Select placeholder={'Chọn'} isMulti options={filter.employees} values={filter.employeeSelected} onChange={handleChangeSelect} />
                                            </div>
                                        </div>
                                        <div className="col-right">
                                            <div className="top-label">
                                                <div className="main-label font-weight-bold text-uppercase month">Tháng</div>
                                                <div className="main-data option">
                                                    <span className="ic-action" onClick={() => handleChangeWeekNumber(actionForWeek.previous)}><Image src={IconArrowPrevious} alt='Previous' /></span>
                                                    <span className="font-weight-bold text-uppercase">Tuần {weekNumber}</span>
                                                    <span className="ic-action" onClick={() => handleChangeWeekNumber(actionForWeek.next)}><Image src={IconArrowNext} alt='Next' /></span>
                                                </div>
                                            </div>
                                            <div className="bottom-label">
                                                <div className="main-label font-weight-bold text-uppercase">Ngày</div>
                                                <div className="main-data">
                                                    {
                                                        (days || []).map((item, index) => {
                                                            return <div className="day-item" key={index}>
                                                                        <div className="day font-weight-bold">{item && moment(item).format('DD/MM')}</div>
                                                                        <div className="st">{item && moment(item).format('dddd')}</div>
                                                                    </div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-block">
                                    {
                                        (projectTimeSheetFiltered && projectTimeSheetFiltered.length > 0 ? projectTimeSheetFiltered : projectTimeSheetOriginal).map((item, index) => {
                                            let isMe = currentEmployeeNoLogged == item.employeeId
                                            return <div className={`data-item ${isMe ? 'me' : ''}`} key={index}>
                                                        <div className="col-left">
                                                            <div className="user-info">
                                                                { item.source?.key == employeeSource.THUE_NGOAI && <span className="source">Thuê ngoài</span> }
                                                                <div className="avatar-block">
                                                                <Image src={`data:image/png;base64,${item?.avatar}`} alt="Avatar" className="avatar"
                                                                    onError={(e) => {
                                                                        e.target.src = "/LogoVingroupCircle.svg"
                                                                    }}
                                                                />
                                                                </div>
                                                                <div className="full-name">{item?.fullName || ""}</div>
                                                                <div className="title">{item?.title || ""}</div>
                                                                <div className="other-info">
                                                                    <div className="first">
                                                                        <div className="employee-no"><Image src={IconMaNhanVienBlue} alt='No' />{item?.employeeId || ""}</div>
                                                                        <div className="pool"><Image src={IconVitriBlue} alt='Pool' />{item?.position || ""}</div>
                                                                    </div>
                                                                    <div className="second">
                                                                        <div className="email" title={item?.email || ""}><Image src={IconEmailBlue} alt='Email' /><span>{item?.email || ""}</span></div>
                                                                        <div className="skill">
                                                                            <Image src={IconKyNangBlue} alt='Skill' />
                                                                            <ul className="skills">
                                                                                {
                                                                                    (item?.skills || []).map((item, sId) => {
                                                                                        return <li key={sId}>{item}</li>
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-right">
                                                            <div className="time-sheet-item">
                                                                <div className="col-first">
                                                                    <div className="planned">
                                                                        <div className="font-weight-bold">Planned Total</div>
                                                                        <div className="range-time">{rangeTimeFilter}</div>
                                                                    </div>
                                                                    <div className="actual">Actual</div>
                                                                </div>
                                                                <div className="col-item">
                                                                    <ReactTooltip id='label-submit-time-sheet' scrollHide isCapture place="left" type='light' border={true} arrowColor='#FFFFFF' borderColor="#e3e6f0" className="item-tooltip-submit-time-sheet">
                                                                        <span>Xác nhận Timesheet</span>
                                                                    </ReactTooltip>
                                                                    { isMe && <button className="btn-submit" data-tip data-for='label-submit-time-sheet' onClick={submitTimeSheet}><Image src={IconCheckWhite} alt="Check" /></button> }
                                                                    {
                                                                        (item?.timeSheets || []).map((timeSheet, tIndex) => {
                                                                            let noteInfos = getNoteInfos(timeSheet, item?.rsmLeaveTypeAndComment, item.source?.key)
                                                                            let hasEditTime = isMe && projectData?.processStatusId != status.closed 
                                                                                                && ![timeSheetStatusApproved].includes(timeSheet?.rsmStatus)
                                                                                                && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrAfter(moment(moment(projectData?.startDate).format('DD-MM-YYYY'), 'DD-MM-YYYY')) 
                                                                                                && moment(timeSheet?.date, 'DD-MM-YYYY').isSameOrBefore(moment(moment(projectData?.endDate).format('DD-MM-YYYY'), 'DD-MM-YYYY'))
                                                                            return <div className="item" key={tIndex}>
                                                                                        <div className="top">
                                                                                            {
                                                                                                (timeSheet.shift_id === 'OFF' || timeSheet.is_holiday === 1 || timeSheet.is_holiday === '1')
                                                                                                ? 
                                                                                                    <>
                                                                                                    <ReactTooltip id={`shift-infos-${tIndex}-user-index-${index}`} scrollHide isCapture globalEventOff="click" effect="solid" clickable place="top" type='light' border={true} arrowColor='#FFFFFF' borderColor="#e3e6f0" className="note-time-sheet">
                                                                                                        <div style={{padding: '5px 15px'}}>{(timeSheet.is_holiday === 1 || timeSheet.is_holiday === '1') ? 'Holiday' : 'OFF'}</div>
                                                                                                    </ReactTooltip>
                                                                                                    <div className="text-center off-shift" data-tip data-for={`shift-infos-${tIndex}-user-index-${index}`}>OFF</div>
                                                                                                    </>
                                                                                                : <>
                                                                                                {
                                                                                                    noteInfos.hasShowNote
                                                                                                    ? <>
                                                                                                        <ReactTooltip id={`note-infos-${tIndex}-user-index-${index}`} scrollHide isCapture globalEventOff="click" effect="solid" clickable place="bottom" type='light' border={true} arrowColor='#FFFFFF' borderColor="#e3e6f0" className="note-time-sheet">
                                                                                                            <ul>
                                                                                                                {
                                                                                                                    (noteInfos?.notes).map((note, nIndex) => {
                                                                                                                        return <li key={nIndex}>
                                                                                                                                    <p className={`title ${note?.className}`}>{note?.line1}</p>
                                                                                                                                    <ul>
                                                                                                                                        <li>{note?.line2}</li>
                                                                                                                                        <li>{note?.line3}</li>
                                                                                                                                    </ul>
                                                                                                                                </li>
                                                                                                                    })
                                                                                                                }
                                                                                                            </ul>
                                                                                                        </ReactTooltip>
                                                                                                        <span className="note" data-tip data-for={`note-infos-${tIndex}-user-index-${index}`}><Image src={noteInfos.icon} alt="Note" /></span>
                                                                                                    </>
                                                                                                    : null
                                                                                                }
                                                                                                <div className="time">{`${timeSheet?.hoursValue}h`}</div>
                                                                                                </>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="bottom">
                                                                                            {
                                                                                                (timeSheet.shift_id === 'OFF' || timeSheet.is_holiday === 1 || timeSheet.is_holiday === '1')
                                                                                                ? null
                                                                                                : timeSheet?.rsmStatus !== null && <span className={`status ${timeSheetStatusStyleMapping[timeSheet?.rsmStatus]?.className}`}>{timeSheetStatusStyleMapping[timeSheet?.rsmStatus]?.label}</span>
                                                                                            }
                                                                                            {
                                                                                                (timeSheet.shift_id === 'OFF' || timeSheet.is_holiday === 1 || timeSheet.is_holiday === '1') 
                                                                                                ? null
                                                                                                : <div className="time">
                                                                                                {
                                                                                                    hasEditTime
                                                                                                    ? <><input type="text" onChange={(e) => handleChangeActualTime(index, tIndex, e)} value={timeSheet?.actualHoursTemp !== null && timeSheet?.actualHoursTemp !== undefined ? timeSheet?.actualHoursTemp : timeSheet?.actualHours || ""} /><span>h</span></>
                                                                                                    : `${timeSheet?.actualHours || 0}h`
                                                                                                }
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Tab>
                }
            </Tabs>
        </div>
        </>
    )
}

export default ProjectDetail
