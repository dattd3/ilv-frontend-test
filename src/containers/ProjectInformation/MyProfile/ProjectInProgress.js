import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'

function ProjectInProgress(props) {
    const { t } = useTranslation()
    const { title, projects } = props

    console.log("44444444444444444")
    console.log(projects)

    const renderRowItems = () => {
        return (projects || []).map((item, index) => {
            return <tr key={index}>
                <td className="sticky-column c-no"><div className="no">{index + 1}</div></td>
                <td className="sticky-column c-project-name"><div className="project-name text-truncate">{item?.projectName || ''}</div></td>
                <td className="sticky-column c-project-manager"><div className="project-manager text-truncate">{item?.projectManager || ''}</div></td>
                <td className="sticky-column c-start-date"><div className="start-date">{item?.startDate && moment(item.startDate).format('DD/MM/YYYY')}</div></td>
                <td className="sticky-column c-end-date"><div className="end-date">{item?.endDate && moment(item.endDate).format('DD/MM/YYYY')}</div></td>
                <td className="c-role"><div className="role text-truncate">{item?.role || ''}</div></td>
                <td className="c-manday"><div className="manday">{item?.manDays || 0}</div></td>
            </tr>
        })
    }

    return (
        <div className="project-list-table-my-profile">
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
                                <th className="c-role"><div className="role">Vai trò</div></th>
                                <th className="c-manday"><div className="manday">Mandays</div></th>
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

export default ProjectInProgress
