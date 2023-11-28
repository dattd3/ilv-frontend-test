import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import HOCComponent from 'components/Common/HOCComponent'
import IconMailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconMailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconAddNew from 'assets/img/icon/ic_btn_add_green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
import Note from "../common/Note"
 
const CreatedReceiving = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectChange = () => {

    }

    const listRequests = [{}]

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="created-receiving-tab">
                <div className="header-block">
                    <h1 className="header-title">Quản lý yêu cầu</h1>
                    <div className="d-flex justify-content-between align-items-center content">
                        <div className="d-inline-flex left">
                            <button className="btn btn-create-request"><img src={IconAddNew} alt="Create" />Tạo yêu cầu mới</button>
                            <div className="filter position-relative">
                                <img src={IconFilter} alt="Filter" className="icon-prefix-select" />
                                <Select
                                    value={null}
                                    isClearable={false}
                                    onChange={handleSelectChange}
                                    placeholder={t('Lọc nhanh')} 
                                    options={[]}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
                                    classNamePrefix="filter-select"
                                />
                            </div>
                        </div>
                        <div className="right">
                            <Note />
                        </div>
                    </div>
                </div>
                <div className="tab-content"> 
                    <div className="request-list">
                        {
                            listRequests?.length > 0 
                            ? (
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="code">{t("RequestNo")}</th>
                                            <th scope="col" className="request-type">{t("TypeOfRequest")}</th>
                                            <th scope="col" className="day-off">{t("Times")}</th>
                                            <th scope="col" className="break-time text-center">{t("TotalLeaveTime")}</th>
                                            <th scope="col" className="status">{t("operation")}</th>
                                            <th scope="col" className="status text-center">{t("Status")}</th>
                                            <th scope="col" className="tool text-center">{t("action2")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        listRequests.map((child, index) => {
                                            
                                            return (
                                                <tr key={index}>
                                                    <td className="code"><a href={detailLink} title={child.requestType.name} className="task-title">{generateTaskCodeByCode(child.id)}</a></td>
                                                    <td className="request-type">{getRequestTypeLabel(child.requestType, child.absenceType?.value)}</td>
                                                    <td className="day-off">
                                                        <div dangerouslySetInnerHTML={{
                                                            __html: purify.sanitize(dateChanged || ''),
                                                        }} />
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subDateChanged = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subDateChanged = showRangeDateGroupByArrayDate([moment(item?.startDate, 'YYYYMMDD').format('DD/MM/YYYY'), moment(item?.endDate, 'YYYYMMDD').format('DD/MM/YYYY')])
                                                                } 
                                                                return (
                                                                    <div key={`sub-date-${itemIndex}`} dangerouslySetInnerHTML={{
                                                                        __html: purify.sanitize(subDateChanged || ''),
                                                                    }} style={{marginTop: 5}} />
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td className="break-time text-center">
                                                        <div>{totalTime}</div>
                                                        {
                                                            (child?.newItem || []).map((item, itemIndex) => {
                                                                let subTotalTime = ''
                                                                if ([Constants.LEAVE_OF_ABSENCE, Constants.BUSINESS_TRIP].includes(child.requestTypeId)) {
                                                                    subTotalTime = item?.days >= fullDay ? `${item?.days} ${t('DayUnit')}` : `${item?.hours} ${t('HourUnit')}`
                                                                }
                                                                return (
                                                                    <div key={`sub-break-time-${itemIndex}`} style={{marginTop: 5}}>{subTotalTime}</div>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td className="status">{t(`operationType.${child.operationType?.toLowerCase()}`)}</td>
                                                    <td className="status text-center">{this.showStatus(child.processStatusId, child.requestType.id, child.approver, child.statusName)}</td>
                                                    <td className="tool">
                                                        {isShowEditButton && (<a href={editLink} title={t("Edit")}><img alt={t("Edit")} src={editButton} /></a>)}
                                                        {isShowEvictionButton && (<span title={t("Recall")} onClick={e => this.evictionRequest(child.requestTypeId, child)}><img alt={t("Recall")} src={evictionButton} /></span>)}
                                                        {isShowDeleteButton && <span title={t("Cancel2")} onClick={e => this.deleteRequest(child.requestTypeId, child)}><img alt={t("Cancel2")} src={deleteButton} /></span>}
                                                        {isShowSyncRequest && <span title={t("Sync")} onClick={e => this.syncRequest(child.requestTypeId, child)}><img alt={t("Sync")} src={IconSync} /></span>}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            )
                            : (<div className="data-not-found">{t("NoDataFound")}</div>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatedReceiving
