import React from "react"
import { useTranslation } from "react-i18next"
import { Image } from 'react-bootstrap'
import moment from 'moment'
import IconArrowRight from '../../../assets/img/icon/Icon-Arrow-Right.svg'

function ProjectTeamComponent(props) {
    const { t } = useTranslation()
    const { rsmProjectTeams, plant, actual, mandayActual, mandayPlant } = props

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

    return (
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
                                    <th className='c-manday'><div className='manday text-center'>Mandays</div></th>
                                    <th className='c-full-name'><div className='full-name'>Họ và tên</div></th>
                                    <th className='c-email'><div className='email'>Email</div></th>
                                    <th className='c-source'><div className='source'>Nguồn</div></th>
                                    <th className='c-pm-note'><div className='pm-note'>Ghi chú của PM</div></th>
                                    <th className='c-scheduler-note'><div className='scheduler-note'>Ghi chú của Scheduler</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (rsmProjectTeams || []).map((item, index) => {
                                        let skills = renderSkills(item?.skills)
                                        return <tr key={index}>
                                            <td className='c-no'><div className='no'>{index + 1}</div></td>
                                            <td className='c-role'><div className='role'>{item?.role?.value || ""}</div></td>
                                            <td className='c-skill'><div className='skill'>{skills}</div></td>
                                            <td className='c-start-date'><div className='start-date text-center'>{item?.startDate && moment(item?.startDate).format("DD/MM/YYYY")}</div></td>
                                            <td className='c-end-date'><div className='end-date text-center'>{item?.endDate && moment(item?.endDate).format("DD/MM/YYYY")}</div></td>
                                            <td className='c-manday'><div className='manday text-center'>{item?.manDays || 0}</div></td>
                                            <td className='c-full-name'><div className='full-name'>{item?.rsmResources?.fullName || ""}</div></td>
                                            <td className='c-email'><div className='email text-truncate'>{item?.rsmResources?.email || ""}</div></td>
                                            <td className='c-source'><div className='source'>{item?.resources?.value || ""}</div></td>
                                            <td className='c-pm-note'><div className='pm-note'>{item?.note || ""}</div></td>
                                            <td className='c-scheduler-note'><div className='scheduler-note'>{item?.schedulerNote || ""}</div></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="report-block">        
                        <div className="headcount">
                            <span className="font-weight-bold">(Average) Headcount</span>
                            <Image src={IconArrowRight} alt='arrow' />
                            <span>Plan: {plant || 0} | Actual: {actual || 0}</span>
                        </div>
                        <div className="total-manday">
                            <span className="font-weight-bold">Total mandays</span>
                            <Image src={IconArrowRight} alt='arrow' />
                            <span>Plan: {mandayPlant || 0} | Actual: {mandayActual || 0}</span>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default ProjectTeamComponent
