import React from "react"
import moment from 'moment'
import { statusStyleMapping } from '../Constants'

function ProjectRowItem(props) {
    const { item } = props
    const processStatus = item?.processStatus
    const className = statusStyleMapping[processStatus?.key].className

    const handleStatusClick = (projectId, statusId) => {
        props.handleStatusClick(projectId, statusId)
    }

    return (
        <tr>
            <td className='sticky-column c-no'><div className='no'>{item?.id}</div></td>
            <td className='sticky-column c-project-name'><div className='project-name'>{item?.projectName || ''}</div></td>
            <td className='sticky-column c-short-name'><div className='short-name'>{item?.projectShortName || ''}</div></td>
            <td className='sticky-column c-manager'><div className='manager'>{item?.projectManager || ''}</div></td>
            <td><div className='request-summary'>{item?.requestSummary || ''}</div></td>
            <td><div className='pnl'>{item?.pnL || ''}</div></td>
            <td><div className='block'>{item?.unitName || ''}</div></td>
            <td><div className='start-date'>{item?.startDate && moment(item.startDate).format('DD/MM/YYYY')}</div></td>
            <td><div className='end-date'>{item?.endDate && moment(item.endDate).format('DD/MM/YYYY')}</div></td>
            <td className='text-center sticky-column c-status'><div className={`status ${className}`} onClick={() => handleStatusClick(item?.id, item?.processStatus?.key)}>{item?.processStatus?.value}</div></td>
        </tr>
    )
}

export default ProjectRowItem
