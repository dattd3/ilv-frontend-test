import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { reviewColorMapping } from "../Constants"

function ProjectCompleted(props) {
    const { t } = useTranslation()
    const { title, projects } = props

    const renderRowItems = () => {
        return (projects || []).map((item, index) => {
            let competenceMapping = reviewColorMapping[item?.competence]
            let attitudeMapping = reviewColorMapping[item?.attitude]
            let leadershipSkillsMapping = reviewColorMapping[item?.leadership]
            let overallMapping = reviewColorMapping[item?.overall]

            return <tr key={index}>
                        <td className="sticky-column c-no"><div className="no">{index + 1}</div></td>
                        <td className="sticky-column c-project-name"><div className="project-name text-truncate" title={item?.projectName || ''}>{item?.projectName || ''}</div></td>
                        <td className="sticky-column c-project-manager"><div className="project-manager text-truncate" title={item?.projectManager || ''}>{item?.projectManager || ''}</div></td>
                        <td className="sticky-column c-start-date"><div className="start-date">{item?.startDate && moment(item.startDate).format('DD/MM/YYYY')}</div></td>
                        <td className="sticky-column c-end-date"><div className="end-date">{item?.endDate && moment(item.endDate).format('DD/MM/YYYY')}</div></td>
                        <td className="c-role"><div className="role text-truncate" title={item?.role?.value || ''}>{item?.role?.value || ''}</div></td>
                        <td className="c-manday"><div className="manday">{item?.manDays || 0}</div></td>
                        <td className="c-professional-capacity-assessment">
                            <div className="professional-capacity-assessment">
                                { competenceMapping && <div><span className={`review-status ${competenceMapping?.className}`}>{competenceMapping?.label}</span></div> }
                                <div className="comment" title={item?.competenceComment || ""}>{item?.competenceComment || ""}</div>
                            </div>
                        </td>
                        <td className="c-attitude-behavior">
                            <div className="attitude-behavior">
                                { attitudeMapping && <div><span className={`review-status ${attitudeMapping?.className}`}>{attitudeMapping?.label}</span></div> }
                                <div className="comment" title={item?.attitudeComment || ""}>{item?.attitudeComment || ""}</div>
                            </div>
                        </td>
                        <td className="c-leadership-skill">
                            <div className="leadership-skill">
                                { leadershipSkillsMapping && <div><span className={`review-status ${leadershipSkillsMapping?.className}`}>{leadershipSkillsMapping?.label}</span></div> }
                                <div className="comment" title={item?.leadershipComment || ""}>{item?.leadershipComment || ""}</div>
                            </div>
                        </td>
                        <td className="c-overall">
                            <div className="overall">
                                { overallMapping && <div><span className={`review-status ${overallMapping?.className}`}>{overallMapping?.label}</span></div> }
                                <div className="comment" title={item?.overallComment || ""}>{item?.overallComment || ""}</div>
                            </div>
                        </td>
                    </tr>
        })
    }

    return (
        <div className="project-completed-table-my-profile">
            <h2>{title}</h2>
            <div className="project-table-wrapper">
                {
                    projects?.length === 0 
                    ? <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
                    : <table className="project-table-my-profile">
                        <thead>
                            <tr>
                                <th className="sticky-column c-no"><div className="no">#</div></th>
                                <th className="sticky-column c-project-name"><div className="project-name">Tên dự án</div></th>
                                <th className="sticky-column c-project-manager"><div className="project-manager">Quản lý dự án</div></th>
                                <th className="sticky-column c-start-date"><div className="start-date">Ngày bắt đầu</div></th>
                                <th className="sticky-column c-end-date"><div className="end-date">Ngày kết thúc</div></th>
                                <th className="c-role"><div className="role">Năng lực chuyên môn</div></th>
                                <th className="c-manday"><div className="manday">Mandays</div></th>
                                <th className="c-professional-capacity-assessment"><div className="professional-capacity-assessment">Năng lực chuyên môn</div></th>
                                <th className="c-attitude-behavior"><div className="attitude-behavior">Hành vi thái độ</div></th>
                                <th className="c-review"><div className="review">Kỹ năng lãnh đạo</div></th>
                                <th className="c-review-comment"><div className="review-comment">Đánh giá tổng</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderRowItems() }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default ProjectCompleted
