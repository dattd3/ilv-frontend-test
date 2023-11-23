import { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Tabs, Tab } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, getCurrentLanguage } from 'commons/Utils'
import { isJsonString } from "utils/string"
import LoadingModal from 'components/Common/LoadingModal'
import StatusModal from 'components/Common/StatusModal'
import CustomPaging from 'components/Common/CustomPaging'
import HOCComponent from 'components/Common/HOCComponent'
import IconExpand from 'assets/img/icon/pms/icon-expand.svg'
import IconCollapse from 'assets/img/icon/pms/icon-collapse.svg'
import IconSearch from 'assets/img/icon/Icon_Loop.svg'
import IconReject from 'assets/img/icon/Icon_Cancel.svg'
import IconApprove from 'assets/img/icon/Icon_Check.svg'

import IconPlus from 'assets/img/icon/ic_plus-green.svg'

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import FilterBlock from "./FilterBlock"
registerLocale("vi", vi)

const Content = (props) => {
    const tabMapping = {
        request: 'request',
        appraisal: 'appraisal',
        approval: 'approval',
        evaluation: 'evaluation',
    }
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, SetActiveTab] = useState(tabMapping.request)

    useEffect(() => {
        // const processEvaluationForms = response => {
        //     if (response && response.data) {
        //         const result = response.data.result
        //         if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
        //             const data = (response?.data?.data || []).map(item => {
        //                 return {value: item?.id, label: item?.name, reviewStreamCode: item?.reviewStreamCode}
        //             })
        //             SetFilter({
        //                 ...filter,
        //                 isOpenFilterAdvanced: false,
        //                 evaluationForm: null,
        //                 employees: [],
        //                 employee: null,
        //                 currentStep: null,
        //                 blocks: [],
        //                 block: null,
        //                 regions: [],
        //                 region: null,
        //                 units: [],
        //                 unit: null,
        //                 groups: [],
        //                 group: [],
        //                 rank: null,
        //                 title: null,
        //                 fromDate: null,
        //                 toDate: null,
        //                 isFormFilterValid: true,
        //                 evaluationForms: data,
        //             })
        //         }
        //     }
        //     processLoading(false)
        // }

        // const fetchEvaluationForms = async () => {
        //     processLoading(true)
        //     const config = getRequestConfigurations()
        //     const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listFormToApprove?EmployeeCode=${employeeCode}&ApproverEmployeeAdCode=${employeeAD}`, config)
        //     processEvaluationForms(response)
        // }

        // if (isOpen) {
        //     fetchEvaluationForms()
        // }
    }, [])

    const tasks = [{}]

    return (
        <div className="page-content">
            <div className="d-flex align-items-center justify-content-between header">
                <h1>Quản lý yêu cầu tuyển dụng</h1>
                <button className="btn-create-request"><img src={IconPlus} alt="Create" />Tạo yêu cầu mới</button>
            </div>
            <div className="content">
                <div className="request-list shadow">
                    {
                        tasks.length > 0 ?
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-customize">
                                        <div className="code">{t("RequestNo")}</div>
                                    </th>
                                    <th scope="col" className="col-customize">
                                        <div className="groundwork">{t("Cơ sở")}</div>
                                    </th>
                                    <th scope="col" className="col-customize">
                                        <div className="position">{t("Vị trí")}</div>
                                    </th>
                                    <th scope="col" className="break-time text-center">{t("Tên đề xuất")}</th>
                                    <th scope="col" className="status">{t("Loại yêu cầu")}</th>
                                    <th scope="col" className="status">{t("Loại đề xuất")}</th>
                                    <th scope="col" className="status">{t("Số lượng")}</th>
                                    <th scope="col" className="status">{t("Ngày gửi yêu cầu")}</th>
                                    <th scope="col" className="status text-center">{t("Status")}</th>
                                    <th scope="col" className="tool text-center">{t("action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    // tasks.map((child, index) => {
                                    //     let isShowEditButton = this.isShowEditButton(child?.processStatusId, child?.requestTypeId, child?.startDate, child?.isEdit)
                                    //     const isShowEvictionButton = this.isShowEvictionButton(child?.processStatusId, 
                                    //         child?.requestTypeId, 
                                    //         child?.requestTypeId === Constants.OT_REQUEST ? child?.dateRange : child?.startDate, 
                                    //     );
                                    //     let actionType = child?.actionType || null
                                    //     if (child?.requestTypeId == Constants.RESIGN_SELF) {
                                    //         const requestItem = child.requestInfo ? child.requestInfo[0] : null // BE xác nhận chỉ có duy nhất 1 item trong requestInfo
                                    //         actionType = requestItem ? requestItem.actionType : null
                                    //     }
                                    //     let isShowDeleteButton = this.isShowDeleteButton(child.processStatusId, child.appraiserId, child.requestTypeId, actionType, child.createField)
                                    //     let totalTime = null

                                    //     if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                    //         totalTime = child.days >= fullDay ? `${child.days} ${t('DayUnit')}` : `${child.hours} ${t('HourUnit')}`
                                    //     } else if ([Constants.OT_REQUEST].includes(child.requestTypeId)) {
                                    //         totalTime = `${child.totalTime} ${t('HourUnit')}`
                                    //     }

                                    //     let editLink = this.getRequestEditLink(child.id, child.requestTypeId, child.processStatusId)
                                    //     let detailLink = [Constants.SALARY_PROPOSE, Constants.PROPOSAL_TRANSFER, Constants.PROPOSAL_APPOINTMENT, Constants.WELFARE_REFUND, Constants.INSURANCE_SOCIAL, Constants.INSURANCE_SOCIAL_INFO, Constants.SOCIAL_SUPPORT].includes(child.requestTypeId) ? this.getSalaryProposeLink(child) : this.getRequestDetailLink(child.id, child.requestTypeId)
                                    //     let dateChanged = showRangeDateGroupByArrayDate(child.startDate)

                                    //     if ([Constants.OT_REQUEST].includes(child.requestTypeId)) {
                                    //         dateChanged = child.dateRange;
                                    //     }
                                    //     let isShowSyncRequest = child?.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL 
                                    //     && [Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP, Constants.SUBSTITUTION, Constants.IN_OUT_TIME_UPDATE, Constants.OT_REQUEST, Constants.WELFARE_REFUND].includes(child?.requestTypeId)

                                    //     // let isWorkOutSideGroup = false
                                    //     // if ([Constants.UPDATE_PROFILE].includes(child?.requestTypeId)) {
                                    //     //     const updateField = JSON.parse(child?.updateField || '{}')
                                    //     //     isWorkOutSideGroup = updateField?.UpdateField?.length === 1 && updateField?.UpdateField[0] === 'WorkOutside'
                                    //     // }

                                    //     return (
                                    //         <tr key={index}>
                                    //             <td className="code"><a href={detailLink} title={child.requestType.name} className="task-title">{generateTaskCodeByCode(child.id)}</a></td>
                                    //             <td className="request-type">{getRequestTypeLabel(child.requestType, child.absenceType?.value)}</td>
                                    //             <td className="day-off">
                                    //                 <div dangerouslySetInnerHTML={{
                                    //                     __html: purify.sanitize(dateChanged || ''),
                                    //                 }} />
                                    //                 {
                                    //                     (child?.newItem || []).map((item, itemIndex) => {
                                    //                         let subDateChanged = ''
                                    //                         if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                    //                             subDateChanged = showRangeDateGroupByArrayDate([moment(item?.startDate, 'YYYYMMDD').format('DD/MM/YYYY'), moment(item?.endDate, 'YYYYMMDD').format('DD/MM/YYYY')])
                                    //                         } 
                                    //                         return (
                                    //                             <div key={`sub-date-${itemIndex}`} dangerouslySetInnerHTML={{
                                    //                                 __html: purify.sanitize(subDateChanged || ''),
                                    //                             }} style={{marginTop: 5}} />
                                    //                         )
                                    //                     })
                                    //                 }
                                    //             </td>
                                    //             <td className="break-time text-center">
                                    //                 <div>{totalTime}</div>
                                    //                 {
                                    //                     (child?.newItem || []).map((item, itemIndex) => {
                                    //                         let subTotalTime = ''
                                    //                         if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                    //                             subTotalTime = item?.days >= fullDay ? `${item?.days} ${t('DayUnit')}` : `${item?.hours} ${t('HourUnit')}`
                                    //                         }
                                    //                         return (
                                    //                             <div key={`sub-break-time-${itemIndex}`} style={{marginTop: 5}}>{subTotalTime}</div>
                                    //                         )
                                    //                     })
                                    //                 }
                                    //             </td>
                                    //             <td className="status">{t(`operationType.${child.operationType?.toLowerCase()}`)}</td>
                                    //             <td className="status text-center">{this.showStatus(child.processStatusId, child.requestType.id, child.approver, child.statusName)}</td>
                                    //             <td className="tool">
                                    //                 {isShowEditButton && (<a href={editLink} title={t("Edit")}><img alt={t("Edit")} src={editButton} /></a>)}
                                    //                 {isShowEvictionButton && (<span title={t("Recall")} onClick={e => this.evictionRequest(child.requestTypeId, child)}><img alt={t("Recall")} src={evictionButton} /></span>)}
                                    //                 {isShowDeleteButton && <span title={t("Cancel2")} onClick={e => this.deleteRequest(child.requestTypeId, child)}><img alt={t("Cancel2")} src={deleteButton} /></span>}
                                    //                 {isShowSyncRequest && <span title={t("Sync")} onClick={e => this.syncRequest(child.requestTypeId, child)}><img alt={t("Sync")} src={IconSync} /></span>}
                                    //             </td>
                                    //         </tr>
                                    //     )
                                    // })
                                }
                            </tbody>
                        </table>
                        : <div className="shadow-customize data-not-found">{t("NoDataFound")}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Content
