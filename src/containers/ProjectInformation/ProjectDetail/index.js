import React, { useState, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import moment from 'moment'
import Constants from '../../../commons/Constants'
import { status, statusStyleMapping } from '../Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import ProjectRowItem from '../Share/ProjectRowItem'
import LoadingModal from '../../../components/Common/LoadingModal'
import IconArrowLeft from '../../../assets/img/icon/Icon-Arrow-Left.svg'
import IconArrowRight from '../../../assets/img/icon/Icon-Arrow-Right.svg'
import IconCancel from '../../../assets/img/icon/Icon_Cancel.svg'
import IconCheck from '../../../assets/img/icon/Icon_Check.svg'

function ProjectDetail(props) {
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({})
    const [isLoading, SetIsLoading] = useState(false)

    const levelColorMapping = {
        High: {className: 'high'},
        Medium: {className: 'medium'},
        Low: {className: 'low'}
    }

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

        const projectId = props.match.params.id
        getProjectDetail(projectId)
    }, [])

    const renderSkills = (skills) => {
        if (!skills ||skills?.length === 0 || skills?.every(item => !item)) {
            return ""
        }
        return (
            skills.map((item, index) => {
                return <span className="skill-item" key={index}>{item}</span>
            })
        )
    }

    const { rsmBusinessOwners, rsmProjectTeams, rsmTargets } = projectData
    const processStatus = projectData?.processStatus
    const className = statusStyleMapping[processStatus?.key]?.className

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="projects-detail-page">
            <h1 className="content-page-header project-name"><Image src={IconArrowLeft} alt='Arrow' /> Project detail</h1>
            <div className="general-information">
                <h2 className="title-block">I. Thông tin chung</h2>
                <hr className="line-seperate"></hr>
                <div className="general-information-table-wrapper">
                    <table className="general-information-table">
                        <thead>
                            <tr>
                                <th rowSpan={2} className='sticky-column c-no'><div className='no'>#</div></th>
                                <th rowSpan={2} className='sticky-column c-project-name'><div className='project-name'>Tên dự án</div></th>
                                <th rowSpan={2} className='sticky-column c-short-name'><div className='short-name'>Tên rút gọn</div></th>
                                <th rowSpan={2} className='sticky-column c-manager'><div className='manager'>Quản lý dự án</div></th>
                                <th rowSpan={2} className='c-request-summary'><div className='request-summary'>Tóm tắt yêu cầu</div></th>
                                <th colSpan={2} className='c-customer'><div className='customer'>Khách hàng</div></th>
                                <th colSpan={2} className='c-time'><div className='time'>Thời gian</div></th>
                                <th rowSpan={2} className='sticky-column c-status'><div className='status'>Trạng thái</div></th>
                            </tr>
                            <tr>
                                <th className='col-pnl'><div className='text-center pnl'>P&L</div></th>
                                <th className='col-block'><div className='block'>Khối</div></th>
                                <th className='col-start-date'><div className='start-date'>Ngày bắt đầu</div></th>
                                <th className='col-end-date'><div className='end-date'>Ngày kết thúc</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='sticky-column c-no'><div className='no'>{projectData?.id}</div></td>
                                <td className='sticky-column c-project-name'><div className='project-name'>{projectData?.projectName || ''}</div></td>
                                <td className='sticky-column c-short-name'><div className='short-name'>{projectData?.projectShortName || ''}</div></td>
                                <td className='sticky-column c-manager'><div className='manager'>{projectData?.projectManager || ''}</div></td>
                                <td className='c-request-summary'><div className='request-summary'>{projectData?.requestSummary || ''}</div></td>
                                <td><div className='pnl'>{projectData?.pnL || ''}</div></td>
                                <td><div className='block'>{projectData?.unitName || ''}</div></td>
                                <td><div className='start-date'>{projectData?.startDate && moment(projectData.startDate).format('DD/MM/YYYY')}</div></td>
                                <td><div className='end-date'>{projectData?.endDate && moment(projectData.endDate).format('DD/MM/YYYY')}</div></td>
                                <td className='text-center sticky-column c-status'><div className={`status ${className}`}>{'Đạt'}</div></td>
                                {/* <td className='text-center sticky-column c-status'><div className={`status ${className}`} onClick={() => handleStatusClick(item?.id, item?.processStatus?.key)}>{item?.processStatus?.value}</div></td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="goal">
                <h2 className="title-block">II. Mục tiêu</h2>
                <hr className="line-seperate"></hr>
                <div className="goal-table-wrapper">
                    {
                        (!rsmTargets || rsmTargets?.length === 0)
                        ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                        : <table className="goal-table">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className='c-no'><div className='no'>#</div></th>
                                    <th rowSpan={2} className='c-goal-title'><div className='goal-title'>Mục tiêu</div></th>
                                    <th rowSpan={2} className='c-unit'><div className='unit'>Đơn vị</div></th>
                                    <th rowSpan={2} className='c-detail'><div className='detail'>Giải thích chi tiết</div></th>
                                    <th rowSpan={2} className='c-priority'><div className='priority text-center'>Ưu tiên</div></th>
                                    <th colSpan={2} className='c-threshold'><div className='threshold text-center'>Threshold</div></th>
                                </tr>
                                <tr>
                                    <th className='c-lsl'><div className='text-center lsl'>LSL</div></th>
                                    <th className='c-usl'><div className='text-center usl'>USL</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (rsmTargets || []).map((item, index) => {
                                        return <tr key={index}>
                                            <td className='c-no'><div className='no'>{item?.id}</div></td>
                                            <td className='c-goal-title'><div className='goal-title'>{item?.targetName || ""}</div></td>
                                            <td className='c-unit'><div className='unit'>{item?.unit || ""}</div></td>
                                            <td className='c-detail'><div className='detail'>{item?.explainDetails || ''}</div></td>
                                            <td className='c-priority'><div className='priority status'><span className={`level-style ${levelColorMapping[item?.prioritize]?.className}`}>{item?.prioritize || ""}</span></div></td>
                                            <td><div className='lsl text-center'>{item?.lsl || ''}</div></td>
                                            <td><div className='usl text-center'>{item?.usl || ''}</div></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>

            <div className="project-structure">
                <h2 className="title-block">III. Cơ cấu dự án</h2>
                <div className="project-team-block">
                    {
                        (!rsmProjectTeams || rsmProjectTeams?.length === 0)
                        ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                        : <>
                            <div className="project-team">Đội ngũ dự án</div>
                            <div className="project-structure-table-wrapper">
                                <table className="project-structure-table">
                                    <thead>
                                        <tr>
                                            <th className='c-no'><div className='no'>#</div></th>
                                            <th className='c-role'><div className='role'>Vai trò</div></th>
                                            <th className='c-skill'><div className='skill'>Kỹ năng</div></th>
                                            <th className='c-start-date'><div className='start-date text-center'>Ngày bắt đầu</div></th>
                                            <th className='c-end-date'><div className='end-date text-center'>Ngày kết thúc</div></th>
                                            <th className='c-effort'><div className='effort text-center'>% Effort</div></th>
                                            <th className='c-plan-hour'><div className='plan-hour text-center'>Plan Hour</div></th>
                                            <th className='c-source'><div className='source'>Nguồn</div></th>
                                            <th className='c-note'><div className='note'>Ghi chú</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (rsmProjectTeams || []).map((item, index) => {
                                                let skills = renderSkills(item?.skills)
                                                return <tr key={index}>
                                                    <td className='c-no'><div className='no'>{item?.id}</div></td>
                                                    <td className='c-role'><div className='role'>{item?.role || ""}</div></td>
                                                    <td className='c-skill'><div className='skill'>{skills}</div></td>
                                                    <td className='c-start-date'><div className='start-date text-center'>{item?.startDate && moment(item?.startDate).format("DD/MM/YYYY")}</div></td>
                                                    <td className='c-end-date'><div className='end-date text-center'>{item?.endDate && moment(item?.endDate).format("DD/MM/YYYY")}</div></td>
                                                    <td className='c-effort'><div className='effort text-center'>{item?.effort || '0%'}</div></td>
                                                    <td className='c-plan-hour'><div className='plan-hour text-center'>{item?.plannedHours || 0}</div></td>
                                                    <td className='c-source'><div className='source'>{item?.resources}</div></td>
                                                    <td className='c-note'><div className='note'>{item?.note}</div></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="report">
                                <span className="font-weight-bold">(Average) Headcount</span>
                                <Image src={IconArrowRight} alt='arrow' />
                                <span>Plan: 8 | Actual: 7</span>
                            </div>
                        </>
                    }
                </div>

                <div className="business-owner-block">
                    <div className="business-owner">Thông tin Business owner</div>
                    <div className="business-owner-table-wrapper">
                        {
                            (!rsmBusinessOwners || rsmBusinessOwners?.length === 0)
                            ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                            : <table className="business-owner-table">
                                <thead>
                                    <tr>
                                        <th className='c-no'><div className='no'>#</div></th>
                                        <th className='c-pnl'><div className='pnl'>P&L</div></th>
                                        <th className='c-full-name'><div className='full-name'>Họ và tên</div></th>
                                        <th className='c-email'><div className='email'>Địa chỉ Email</div></th>
                                        <th className='c-interest-level'><div className='interest-level text-center'>Mức độ quan tâm</div></th>
                                        <th className='c-affect-level'><div className='affect-level text-center'>Mức độ ảnh hưởng</div></th>
                                        <th className='c-note'><div className='note'>Ghi chú</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rsmBusinessOwners.map((item, index) => {
                                            return <tr key={index}>
                                                <td className='c-no'><div className='no'>{item?.id}</div></td>
                                                <td className='c-pnl'><div className='pnl'>{item?.pnL || ""}</div></td>
                                                <td className='c-full-name'><div className='full-name'>{item?.fullName || ""}</div></td>
                                                <td className='c-email'><div className='email'>{item?.email || ""}</div></td>
                                                <td className='c-interest-level'><div className='interest-level text-center'><span className={`level-style ${levelColorMapping[item?.influenceLevel]?.className}`}>{item?.influenceLevel || ""}</span></div></td>
                                                <td className='c-affect-level'><div className='affect-level text-center'><span className={`level-style ${levelColorMapping[item?.criticalLevel]?.className}`}>{item?.criticalLevel || ""}</span></div></td>
                                                <td className='c-note'><div className='note'>{item?.note || ""}</div></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div>

            <div className="note-block">
                <h2 className="title-block">IV. Ghi chú</h2>
                <hr className="line-seperate"></hr>
                <div className="note-table-wrapper">
                    <table className="note-table">
                        <thead>
                            <tr>
                                <th className='c-content'><div className='content'>Thông tin ghi chú</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='c-content'><div className='content'>{projectData?.projectComment || ""}</div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="button-block">
                <button className="button cancel"><Image src={IconCancel} alt="Hủy" />Hủy</button>
                <button className="button apply"><Image src={IconCheck} alt="Ứng tuyển" />Ứng tuyển </button>
            </div>
        </div>
        </>
    )
}

export default ProjectDetail
