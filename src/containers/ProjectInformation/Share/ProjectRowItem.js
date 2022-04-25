import React from "react"
import moment from 'moment'
import { statusStyleMapping, complexityColorMapping, criticalityColorMapping, status } from '../Constants'

function ProjectRowItem(props) {
    const { item, index } = props
    const processStatus = item?.processStatus
    const statusClassName = statusStyleMapping[processStatus?.key]?.className
    const complexityClassName = complexityColorMapping[item?.complexity]?.className || complexityColorMapping.Low.className
    const criticalityClassName = criticalityColorMapping[item?.criticality]?.className || criticalityColorMapping.NoCritical.className
    let statusLabel = processStatus?.value

    switch (item?.processStatusId) {
        case status.pendingSchedule:
            statusLabel = 'Scheduler'
            break;
        case status.pendingScheduleUpdate:
            statusLabel = 'Update'
            break;
    }

    const handleStatusClick = (projectId, statusId) => {
        props.handleStatusClick(projectId, statusId)
    }

    return (
        <tr onClick={() => handleStatusClick(item?.id, item?.processStatus?.key)}>
            <td className='sticky-column c-no'><div className='no'>{index}</div></td>
            <td className='sticky-column c-project-name'><div className='project-name'>{item?.projectName || ''}</div></td>
            <td className='sticky-column c-short-name'><div className='short-name'>{item?.projectShortName || ''}</div></td>
            <td className='sticky-column c-manager'><div className='manager'>{item?.projectManager || ''}</div></td>
            <td><div className='request-summary'>{item?.requestSummary || ''}</div></td>
            <td><div className='pnl'>{item?.pnL || ''}</div></td>
            <td><div className='block'>{item?.unitName || ''}</div></td>
            <td><div className='start-date'>{item?.startDate && moment(item.startDate).format('DD/MM/YYYY')}</div></td>
            <td><div className='end-date'>{item?.endDate && moment(item.endDate).format('DD/MM/YYYY')}</div></td>
            <td><div className='complexity'><span className={`status ${complexityClassName}`}>{item?.complexity || ""}</span></div></td>
            <td><div className='criticality'><span className={`status ${criticalityClassName}`}>{item?.criticality || ""}</span></div></td>
            <td className='text-center sticky-column c-status'><div className={`status text-truncate ${statusClassName}`} title={item?.processStatus?.value}>{statusLabel}</div></td>
        </tr>
    )
}

export default ProjectRowItem
