import React from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { statusStyleMapping, complexityColorMapping, criticalityColorMapping, status } from '../Constants'

function GeneralInformationComponent(props) {
    const { t } = useTranslation()
    const { projectData } = props
    const processStatus = projectData?.processStatus
    const complexity = projectData?.complexity
    const criticality = projectData?.criticality
    const criticalityKey = criticality === "No Critical" ? "NoCritical" : criticality
    const statusClassName = statusStyleMapping[processStatus?.key]?.className
    const complexityClassName = complexityColorMapping[complexity]?.className || complexityColorMapping.Low.className
    const criticalityClassName = criticalityColorMapping[criticalityKey]?.className || criticalityColorMapping.NoCritical.className
    const rsmBudgets = projectData.rsmBudgets
    const rsmRisks = projectData.rsmRisks

    const renderProjectBudget = () => {
        return (rsmBudgets || []).map((item, i) => {
            return <tr key={i}>
                        <td className='c-no'><div className='no'>{i + 1}</div></td>
                        <td className='c-category'><div className='category'>{item?.category || ''}</div></td>
                        <td className='c-currency'><div className='currency'>{item?.currency || ''}</div></td>
                        <td className='c-amount-money'><div className='amount-money'>{item?.amount || ''}</div></td>
                    </tr>
        })
    }

    const getProjectBudgetTotal = () => {
        const total = (rsmBudgets || []).reduce((initial, current) => {
            initial += current.amount || 0
            return initial
        }, 0)
        return total ? `${total} ${rsmBudgets[0]?.currency}` : 0
    }

    const renderRiskAssessment = () => {
        return (rsmRisks || []).map((item, i) => {
            return <tr key={i}>
                        <td className='c-no'><div className='no'>{i + 1}</div></td>
                        <td className='c-business-impact'><div className='business-impact'>{item?.businessImpact || ''}</div></td>
                        <td className='c-urgency'><div className='urgency'>{item?.urgency || ''}</div></td>
                    </tr>
        })
    }

    let statusLabel = processStatus?.value
    switch (processStatus?.key) {
        case status.pendingSchedule:
            statusLabel = 'Scheduler'
            break;
        case status.pendingScheduleUpdate:
            statusLabel = 'Update'
            break;
    }

    return (
        <div className="general-information">
            <h2 className="title-block">I. Thông tin chung</h2>
            <hr className="line-seperate"></hr>
            <div className="table-title">Thông tin chung</div>
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
                            <th rowSpan={2} className='c-complexity'><div className='complexity'>Complexity</div></th>
                            <th rowSpan={2} className='c-criticality'><div className='criticality'>Criticality</div></th>
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
                            <td className='sticky-column c-no'><div className='no'>{1}</div></td>
                            <td className='sticky-column c-project-name'><div className='project-name'>{projectData?.projectName || ''}</div></td>
                            <td className='sticky-column c-short-name'><div className='short-name'>{projectData?.projectShortName || ''}</div></td>
                            <td className='sticky-column c-manager'><div className='manager'>{projectData?.projectManager || ''}</div></td>
                            <td className='c-request-summary'><div className='request-summary'>{projectData?.requestSummary || ''}</div></td>
                            <td><div className='pnl'>{projectData?.pnL || ''}</div></td>
                            <td><div className='block'>{projectData?.unitName || ''}</div></td>
                            <td><div className='start-date'>{projectData?.startDate && moment(projectData.startDate).format('DD/MM/YYYY')}</div></td>
                            <td><div className='end-date'>{projectData?.endDate && moment(projectData.endDate).format('DD/MM/YYYY')}</div></td>
                            <th className='c-complexity'><div className="complexity"><span className={`status ${complexityClassName}`}>{complexity || 'No Critical'}</span></div></th>
                            <th className='c-criticality'><div className="criticality"><span className={`status ${criticalityClassName}`}>{criticality || 'Low'}</span></div></th>
                            <td className='text-center sticky-column c-status'><div className={`status ${statusClassName}`} title={processStatus?.value}>{statusLabel}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ngân sách dự án  */}
            <div className="project-budget-table-wrapper">
                <div className="table-title">Ngân sách dự án</div>
                <table className="project-budget-table">
                    <thead>
                        <tr>
                            <th className='c-no'><div className='no text-center'>#</div></th>
                            <th className='c-category'><div className='category'>Hạng mục</div></th>
                            <th className='c-currency'><div className='currency'>Tiền tệ</div></th>
                            <th className='c-amount-money'><div className='amount-money'>Số tiền</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderProjectBudget() }
                    </tbody>
                </table>
                <div className="bottom-table-title">Tổng số tiền: {getProjectBudgetTotal()}</div>
            </div>

            {/* Đánh giá rủi ro  */}
            <div className="risk-assessment-table-wrapper">
                <div className="table-title">Đánh giá rủi ro</div>
                <table className="risk-assessment-table">
                    <thead>
                        <tr>
                            <th className='c-no'><div className='no text-center'>#</div></th>
                            <th className='c-business-impact'><div className='business-impact'>Business Impact</div></th>
                            <th className='c-urgency'><div className='urgency'>Urgency</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderRiskAssessment() }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GeneralInformationComponent
