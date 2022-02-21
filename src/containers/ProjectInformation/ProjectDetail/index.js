import React, { useState, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import { Tabs, Tab } from 'react-bootstrap'
import Select from 'react-select'
import DatePicker, {registerLocale } from 'react-datepicker'
import axios from 'axios'
import Constants from '../../../commons/Constants'
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

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

function ProjectDetail(props) {
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({})
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
    const projectId = props.match.params.id

    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    SetProjectData(data)
                }
            }
            SetIsLoading(false)
        }

        const getProjectDetail = async (projectId) => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                config.params = {
                    id: projectId
                }
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/detail`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
                SetIsLoading(false)
            }
        }

        getProjectDetail(projectId)
    }, [])

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

    const handleChangeSelect = e => {

    }

    const { rsmBusinessOwners, rsmProjectTeams, rsmTargets, projectComment, plant, actual, mandayActual, mandayPlant } = projectData

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
                <Tab eventKey="project-management" title='Quản lý dự án'>
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
                                                    selectsStart 
                                                    selected={filter.fromDate}
                                                    startDate={filter.fromDate}
                                                    endDate={filter.toDate}
                                                    onChange={time => handleChangeDatePicker(time)}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control input filter-from-date" />
                                            </div>
                                            <div className="date-filter to">
                                                <label>Đến ngày</label>
                                                <DatePicker 
                                                    selectsStart 
                                                    selected={filter.toDate}
                                                    startDate={filter.toDate}
                                                    endDate={filter.toDate}
                                                    onChange={time => handleChangeDatePicker(time)}
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="vi"
                                                    className="form-control input filter-to-date" />
                                            </div>
                                        </div>
                                        <div className="row-employee">
                                            <label>Họ và tên</label>
                                            <Select placeholder={'Chọn'} options={filter.employees} onChange={handleChangeSelect} styles={customStyles} />
                                        </div>
                                    </div>
                                    <div className="col-right">
                                        <div className="top-label">
                                            <div className="main-label font-weight-bold text-uppercase month">Tháng</div>
                                            <div className="main-data option">
                                                <span className="ic-action"><Image src={IconArrowPrevious} alt='Previous' /></span>
                                                <span className="font-weight-bold text-uppercase">Tuần 1</span>
                                                <span className="ic-action"><Image src={IconArrowNext} alt='Next' /></span>
                                            </div>
                                        </div>
                                        <div className="bottom-label">
                                            <div className="main-label font-weight-bold text-uppercase">Ngày</div>
                                            <div className="main-data">
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">01/01</div>
                                                    <div className="st">Thứ Hai</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">02/01</div>
                                                    <div className="st">Thứ Ba</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">03/01</div>
                                                    <div className="st">Thứ Tư</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">04/01</div>
                                                    <div className="st">Thứ Năm</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">05/01</div>
                                                    <div className="st">Thứ Sáu</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">06/01</div>
                                                    <div className="st">Thứ Bảy</div>
                                                </div>
                                                <div className="day-item">
                                                    <div className="day font-weight-bold">07/01</div>
                                                    <div className="st">Chủ nhật</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="data-block">
                                <div className="data-item me">
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
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="top">
                                                        <span className="note">Note</span>
                                                        <div className="time">8h</div>
                                                    </div>
                                                    <div className="bottom">
                                                        <div className="time"><input type="text" placeholder="Nhập" value={""} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-item">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
        </>
    )
}

export default ProjectDetail
