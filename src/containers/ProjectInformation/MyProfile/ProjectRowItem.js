import React from "react"
import moment from 'moment'
import { statusStyleMapping } from '../Constants'

function ProjectRowItem(props) {
    const { project } = props
    const processStatus = project?.processStatus
    const className = statusStyleMapping[processStatus?.key].className

    return (
        <tr>
            <td className="sticky-column c-no"><div className="no">{project?.id}</div></td>
            <td className="sticky-column c-project-name"><div className="project-name text-truncate">{project?.projectName || ''}</div></td>
            <td className="sticky-column c-project-manager"><div className="project-manager text-truncate">{project?.projectManager || ''}</div></td>
            <td className="sticky-column c-start-date"><div className="start-date">{project?.startDate && moment(project.startDate).format('DD/MM/YYYY')}</div></td>
            <td className="sticky-column c-end-date"><div className="end-date">{project?.endDate && moment(project.endDate).format('DD/MM/YYYY')}</div></td>
            <td className="c-role"><div className="role text-truncate">{project?.role || ''}</div></td>
            <td className="c-effort"><div className="effort">{project?.effort || 0}</div></td>
            <td className="c-planned-hours"><div className="planned-hours">{project?.plannedHours || 0}</div></td>
            <td className="c-actual-hours"><div className="actual-hours">{project?.actualHours || 0}</div></td>
            <td className="c-review"><div className="review"><span className={`review-status ${className}`}>{project?.processStatus?.value}</span></div></td>
            <td className="c-review-comment"><div className="review-comment text-truncate">{project?.comment || ""}</div></td>
        </tr>
    )
}

export default ProjectRowItem
