import React from "react"
import moment from 'moment'
import { statusStyleMapping } from '../Constants'

function ProjectRowItem(props) {
    const { project } = props
    // const processStatus = item?.processStatus || 0
    // const className = statusStyleMapping[processStatus?.key].className

    return (
        <tr>
            <td className="sticky-column c-no"><div className="no">1</div></td>
            <td className="sticky-column c-project-name"><div className="project-name text-truncate">Employee Experience App</div></td>
            <td className="sticky-column c-project-manager"><div className="project-manager text-truncate">Nguyễn Văn Cường</div></td>
            <td className="sticky-column c-start-date"><div className="start-date">01/01/2021</div></td>
            <td className="sticky-column c-end-date"><div className="end-date">30/12/2022</div></td>
            <td className="c-role"><div className="role text-truncate">Developer</div></td>
            <td className="c-effort"><div className="effort">100</div></td>
            <td className="c-planned-hours"><div className="planned-hours">1000</div></td>
            <td className="c-actual-hours"><div className="actual-hours">1000</div></td>
            <td className="c-review"><div className="review"><span className="review-status open">Đạt</span></div></td>
            <td className="c-review-comment"><div className="review-comment text-truncate">Đạt chỉ tiêu so với kế hoạch</div></td>
        </tr>
    )
}

export default ProjectRowItem
