import React from "react"
import { useTranslation } from "react-i18next"
import ProjectRowItem from "./ProjectRowItem"

function ListProjects(props) {
    const { t } = useTranslation()
    const { title, projects } = props

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
                                <th className="c-effort"><div className="effort">% Effort</div></th>
                                <th className="c-planned-hours"><div className="planned-hours">Planned Hours</div></th>
                                <th className="c-actual-hours"><div className="actual-hours">Actual Hours</div></th>
                                <th className="c-review"><div className="review">Đánh giá</div></th>
                                <th className="c-review-comment"><div className="review-comment">Ý kiến đánh giá</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (projects || []).map((item, index) => {
                                    return <React.Fragment key={index}><ProjectRowItem project={item} /></React.Fragment>
                                })
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default ListProjects
