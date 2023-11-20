import React, { useState, useEffect, useRef } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Tabs, Tab } from 'react-bootstrap'
import Select from 'react-select'
import DatePicker, {registerLocale } from 'react-datepicker'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { status } from '../Constants'
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

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const currentEmployeeNoLogged = localStorage.getItem('employeeNo')

function ProjectDetail(props) {
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
    const timeSheetStatusStyleMapping = {
        0: {label: 'Pending', className: 'pending'},
        1: {label: 'Approved', className: 'approved'},
        2: {label: 'Denied', className: 'denied'}
    }
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
                    id: projectId
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
                            position: item?.rsmResources?.postition,
                            email: item?.rsmResources?.email,
                            skills: item?.rsmResources?.skills ? JSON.parse(item?.rsmResources?.skills) : [],
                            source: item?.resources,
                            timeSheets: [],
                            rsmTimeSheet: _.groupBy(item?.rsmTimeSheets, sub => sub.date)
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
                            actualHours: 0,
                            rsmStatus: null
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
                    actualHours: objIncludeKey[item.date] ? objIncludeKey[item.date][0]?.actual || 0 : 0,
                    rsmStatus: objIncludeKey[item.date] ? objIncludeKey[item.date][0]?.statusId : null
                }
            })

            return result
        }

        const fetchData = async () => {
            // SetIsLoading(true)
            const projectDetailData = await getProjectDetail(projectId)
            SetProjectData(projectDetailData)
            if (projectDetailData) {
                const startDate = moment(days[0]).format('YYYY-MM-DD')
                const endDate = moment(days[days?.length - 1]).format('YYYY-MM-DD')
                const employeeIds = (projectDetailData?.rsmProjectTeams || []).map(item => item?.rsmResources?.employeeNo)
                const payload = {
                    employeeIds: employeeIds,
                    projectId: projectId,
                    startDate: startDate,
                    endDate: endDate
                }

                let projectTimeSheetData = await getProjectTimeSheetData(projectId, payload)
                const userTimeSheetData = await getUserTimeSheetData(projectId, payload)

                projectTimeSheetData = ([...projectTimeSheetData] || []).map(item => ({...item, timeSheets: userTimeSheetData && userTimeSheetData[item?.employeeId] || []}))
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
            window.location.reload()
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetIsLoading(false)
            SetStatusModal(statusModalTemp)
            window.location.reload();
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
            const payload = (timeSheets || []).map(item => {
                return {
                    id: rsmTimeSheet[[item.date]][0]?.id,
                    projectId: rsmTimeSheet[[item.date]][0]?.projectId,
                    resourceId: rsmTimeSheet[[item.date]][0]?.resourceId,
                    projetctTeamId: rsmTimeSheet[[item.date]][0]?.projetctTeamId,
                    date: rsmTimeSheet[[item.date]][0]?.date,
                    shift_Id: rsmTimeSheet[[item.date]][0]?.shift_Id,
                    plannedTotal: rsmTimeSheet[[item.date]][0]?.plannedTotal,
                    hours: rsmTimeSheet[[item.date]][0]?.hours,
                    actual: item?.actualHoursTemp !== null && item?.actualHoursTemp !== undefined ? item?.actualHoursTemp : item?.actualHours,
                    statusId: rsmTimeSheet[[item.date]][0]?.statusId,
                    isEdit: rsmTimeSheet[[item.date]][0]?.isEdit
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
                actualHoursTemp: index === i ? val : item?.actualHoursTemp !== null && item?.actualHoursTemp !== undefined ? item?.actualHoursTemp : item?.actualHours
            }
        })
        return result
    }

    const handleChangeActualTime = (timeSheetIndex, e) => {
        const value = e?.target?.value
        const projectTimeSheetOriginalTemp = [...projectTimeSheetOriginal].map(item => {
            if (item?.employeeId != currentEmployeeNoLogged) {
                return item
            }
            return {
                ...item,
                timeSheets: setActualTimeForListTimeSheet(item?.timeSheets, timeSheetIndex, value)
            }
        })

        SetProjectTimeSheetOriginal(projectTimeSheetOriginalTemp)
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
    const rangeTimeFilter = `${filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''} - ${filter.toDate ? moment(filter.toDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}`

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        })
    };

    return (
        <>
        <LoadingModal show={isLoading} />
        <ConfirmModal modalClassName='apply-project' show={confirmModal.isShow} tempButtonLabel='Hủy' mainButtonLabel='Gửi' confirmHeader={confirmModal.confirmHeader} 
            confirmContent={confirmModal.confirmContent} onCancelClick={onCancelClick} onAcceptClick={onAcceptClick} onHide={onHide} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />
        <div className="projects-detail-page">
            <h1 className="content-page-header project-name"><Image src={IconArrowLeft} alt='Arrow' />{projectData?.projectName}</h1>
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
                    <ButtonComponent handleApply={handleApply} />
                </Tab>
                {
                    projectData?.processStatusId == status.inProgress
                    && <Tab eventKey="project-management" title='Quản lý dự án'>
                        <div className="table-title">Đội ngũ dự án</div>
                        <div className="project-management">
                            <div className="content">
                                <div className="header-block">
                                    <div className="filter-block">
                                        <div className="option-filter">
                                            <span className="date">Ngày</span>
                                            <span className="week">Tuần</span>
                                            <span className="month">Tháng</span>
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
                                                                    { isMe && <button className="btn-submit" onClick={submitTimeSheet}><Image src={IconCheckWhite} alt="Check" /></button>}
                                                                    {
                                                                        (item?.timeSheets || []).map((timeSheet, tIndex) => {
                                                                            return <div className="item" key={tIndex}>
                                                                                        <div className="top">
                                                                                            <span className="note">Note</span>
                                                                                            <div className="time">{`${timeSheet?.hoursValue}h`}</div>
                                                                                        </div>
                                                                                        <div className="bottom">
                                                                                            { timeSheet?.rsmStatus !== null && <span className={`status ${timeSheetStatusStyleMapping[timeSheet?.rsmStatus]?.className}`}>{timeSheetStatusStyleMapping[timeSheet?.rsmStatus]?.label}</span> }
                                                                                            {/* <span className="status pending">Pending</span>
                                                                                            <span className="status approved">Approved</span> */}
                                                                                            <div className="time">
                                                                                                {
                                                                                                    isMe 
                                                                                                    ? <input type="text" onChange={(e) => handleChangeActualTime(tIndex, e)} value={timeSheet?.actualHoursTemp !== null && timeSheet?.actualHoursTemp !== undefined ? timeSheet?.actualHoursTemp : timeSheet?.actualHours || 0} />
                                                                                                    : `${timeSheet?.actualHours}h`
                                                                                                }
                                                                                            </div>
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

                                    
                                    {/* <div className="data-item">
                                        <div className="col-left">
                                            <div className="user-info">
                                                <span className="source">Thuê ngoài</span>
                                                <div className="avatar-block"><Image src='https://znews-photo.zadn.vn/w660/Uploaded/bzwvopcg/2022_02_07/thumbff.jpg' /></div>
                                                <div className="full-name">Nguyễn Văn Cường</div>
                                                <div className="title">Chuyên viên Lập trình</div>
                                                <div className="other-info">
                                                    <div className="first">
                                                        <div className="employee-no"><Image src={IconMaNhanVienBlue} alt='No' />3651641</div>
                                                        <div className="pool"><Image src={IconVitriBlue} alt='Pool' />BA</div>
                                                    </div>
                                                    <div className="second">
                                                        <div className="email" title="cuongnv56@vingroup.net"><Image src={IconEmailBlue} alt='Email' /><span>cuongnv56@vingroup.net</span></div>
                                                        <div className="skill">
                                                            <Image src={IconKyNangBlue} alt='Skill' />
                                                            <ul className="skills">
                                                                <li>Kotlin</li>
                                                                <li>Javascript</li>
                                                                <li>HTML</li>
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
                                                        <div>01/12/2021 - 01/06/2021</div>
                                                    </div>
                                                    <div className="actual">Actual</div>
                                                </div>             
                                                <div className="col-item">
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status approved">Approved</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status pending">Pending</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status approved">Approved</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status approved">Approved</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status pending">Pending</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status approved">Approved</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                    <div className="item">
                                                        <div className="top">
                                                            <span className="note">Note</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                        <div className="bottom">
                                                            <span className="status approved">Approved</span>
                                                            <div className="time">8h</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
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
