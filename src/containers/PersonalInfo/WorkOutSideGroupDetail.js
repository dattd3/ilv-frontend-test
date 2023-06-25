import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useHistory } from "react-router-dom"
import axios from "axios"
import moment from 'moment'
import { last, omit, size, groupBy } from "lodash"
import { useGuardStore } from 'modules/index'
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations, formatStringByMuleValue } from "commons/Utils"
import WorkOutSideGroupItem from './WorkOutSideGroupItem'
import ActionButtons from "./ActionButtons"
import ConfirmPasswordModal from "./ConfirmPasswordModal"
import IconAddWhite from "assets/img/icon/ic_btn_add_white.svg"
import Constants from "commons/Constants"
import LoadingModal from "components/Common/LoadingModal"
import ConfirmSendRequestModal from "./ConfirmSendRequestModal"
import WorkOutSideGroupItemDetail from "./WorkOutSideGroupItemDetail"
import DocumentComponent from "containers/Task/ApprovalDetail/DocumentComponent"

const prefixUpdating = 'UPDATING'

const WorkOutSideGroupDetail = ({ details }) => {
    const { t } = useTranslation()
    // const history = useHistory()
    // const location = useLocation()
    // const guard = useGuardStore()
    // const user = guard.getCurentUser()
    // const [canUpdate, SetCanUpdate] = useState(false)
    // const [errors, SetErrors] = useState({})
    // const [experiences, SetExperiences] = useState(null)
    // const [experienceDeleted, SetExperienceDeleted] = useState([])
    // const [experienceOriginal, SetExperienceOriginal] = useState(null)
    // const [accessToken, SetAccessToken] = useState(new URLSearchParams(location.search).get('accesstoken') || null)
    // const [isSeenSalaryAtLeastOnce, SetIsSeenSalaryAtLeastOnce] = useState(false)
    const [hiddenViewSalary, SetHiddenViewSalary] = useState(true)
    const [isShowConfirmPasswordModal, SetIsShowConfirmPasswordModal] = useState(false)
    const [isShowLoading, SetIsShowLoading] = useState(false)
    // const [isShowConfirmSendRequestModal, SetIsShowConfirmSendRequestModal] = useState(false)
    // const [files, SetFiles] = useState([])
    const state = 'personal_info_tab_WorkOutsideGroup'
    // const isEnableEditWorkOutsideGroup = true
    // const tabActive = getValueParamByQueryString(window.location.search, 'tab')
    // const currentCompanyCode = localStorage.getItem('companyCode')
    // const currentEmployeeNo = localStorage.getItem('employeeNo')

    const onHideConfirmPasswordModal = () => {

    }

    const handleToggleProcess = () => {

    }

    const handleToggleViewSalary = () => {

    }

    const updateToken = () => {

    }

    console.log('details ======== ', details)

    const userProfileHistoryExperiences = details?.requestInfo?.update?.userProfileHistoryExperiences
    const experienceCreateNew = details?.requestInfo?.create?.experiences || []
    const userInfo = details?.user
    const status = details?.processStatusId
    const responseDataFromSAP = details?.responseDataFromSAP
    const documents = details?.requestDocuments

    const statusOptions = {
        [Constants.STATUS_NOT_APPROVED]: { label: t("Reject"), className: 'fail' },
        [Constants.STATUS_APPROVED]: { label: t("Approved"), className: 'success' },
        [Constants.STATUS_EVICTION]: { label: t("Recalled"), className: 'fail' },
        [Constants.STATUS_REVOCATION]: { label: t("Canceled"), className: 'fail' },
        [Constants.STATUS_WAITING]: { label: t("Waiting"), className: 'waiting' },
        [Constants.STATUS_PARTIALLY_SUCCESSFUL]: { label: t("Unsuccessful"), className: 'warning' },
        [Constants.STATUS_NO_CONSENTED]: { label: "Rejected", className: 'fail' },
        [Constants.STATUS_WAITING_CONSENTED]: { label: "PendingConsent", className: 'waiting' },
        [Constants.STATUS_CONSENTED]: { label: "Consented", className: 'waiting' }
    }

    return (
        <>
        <LoadingModal show={isShowLoading} />
        <ConfirmPasswordModal show={isShowConfirmPasswordModal} state={state} onUpdateToken={updateToken} onHide={onHideConfirmPasswordModal} />
        {/* <ConfirmSendRequestModal isShow={isShowConfirmSendRequestModal} sendRequest={sendRequest} onHide={onHideConfirmSendRequestModal} /> */}
        <div className="work-outside-group-detail">
            <h5 className="content-page-header text-uppercase">{t("EmployeeInfomation")}</h5>
            <div className="registration-employee-information">
                <div className="row">
                    <div className="col-md-4">
                        <div className="label">{t("FullName")}</div>
                        <div className="value">{userInfo?.fullName || ''}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="label">{t("EmployeeNo")}</div>
                        <div className="value">{userInfo?.employeeNo || ''}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="label">{t("Title")}</div>
                        <div className="value">{userInfo?.jobTitle || ''}</div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 15 }}>
                        <div className="label">{t("DepartmentManage")}</div>
                        <div className="value">{userInfo?.department || ''}</div>
                    </div>
                </div>
            </div>
            <h5 className="content-page-header text-uppercase">{t("RegistrationUpdateInformation")}</h5>
            <div className="edit-registration-information">
                <ul className="d-flex">
                    <li className="d-flex align-items-center"><span className="box-color old"></span><span>{t("Record")}</span></li>
                    <li className="d-flex align-items-center"><span className="box-color adjusted"></span><span>{t("UpdateInformation")}</span></li>
                    <li className="d-flex align-items-center"><span className="box-color new"></span><span>{t("NewInformation")}</span></li>
                    <li className="d-flex align-items-center"><span className="box-color removed"></span><span>{t("RemovedInfo")}</span></li>
                </ul>
            </div>
            <div className="info-tab-content work-outside-group">
                <div className="work-outside-group-list">
                    {
                        userProfileHistoryExperiences && userProfileHistoryExperiences?.length === 0
                        ? (
                            <div className="work-outside-group-item">
                                <div className="company-info">
                                    <div className="group-header">
                                        <h5>{t("CompanyInfo")}</h5>
                                    </div>
                                    <div style={{ margin: 15 }}>{t("NoDataFound")}</div> 
                                </div>
                            </div>
                        )
                        : (
                            <>
                                {
                                    userProfileHistoryExperiences && (userProfileHistoryExperiences || []).map((item, index) => (
                                        <WorkOutSideGroupItemDetail 
                                            key={`updated-deleted-${index}`}
                                            index={index}
                                            item={item}
                                            hiddenViewSalary={hiddenViewSalary}
                                            handleToggleProcess={handleToggleProcess}
                                            handleToggleViewSalary={handleToggleViewSalary} />
                                    ))
                                }
                                {
                                    experienceCreateNew && (experienceCreateNew || []).map((item, index) => (
                                        <WorkOutSideGroupItemDetail 
                                            key={`created-${index}`}
                                            index={index}
                                            item={item}
                                            isAddNew={true}
                                            hiddenViewSalary={hiddenViewSalary}
                                            handleToggleProcess={handleToggleProcess}
                                            handleToggleViewSalary={handleToggleViewSalary} />
                                    ))
                                }
                            </>
                        )
                    }
                </div>
            </div>
            {/* {
                status == Constants.STATUS_NOT_APPROVED && (
                    <div className="">
                        <div className="row item-info">
                            <div className="col-12">
                                <div className="label">{t("ReasonNotApprove")}</div>
                                <div className="value">{hrComment}</div>
                            </div>
                        </div>
                    </div>
                )
            } */}
                
            <div className="block-status">
                <span className={`status ${statusOptions[status].className}`}>{statusOptions[status].label}</span>
                {
                    (status == Constants.STATUS_PARTIALLY_SUCCESSFUL && responseDataFromSAP) && 
                    <div className={`d-flex status fail`}>
                        <i className="fas fa-times pr-2 text-danger align-self-center"></i>
                        <div>{responseDataFromSAP}</div>
                    </div>
                }
            </div>
            { 
                documents?.length == 0 && (
                    <div className="documents-block">
                        <h5 className="content-page-header text-uppercase">{t("RegistrationAttachmentInformation")}</h5>
                        <DocumentComponent documents={documents} />
                    </div>
                )
            }
            {
                status == Constants.STATUS_PENDING && (
                    <div className="clearfix mb-5">
                        <span className="btn btn-primary float-right ml-3 shadow btn-eviction-task" title="Thu hồi yêu cầu" onClick={e => this.evictionRequest(this.getUserProfileHistoryId())}>
                        <i className="fas fa-undo-alt" aria-hidden="true"></i>  Thu hồi</span>
                    </div>
                )
            }
        </div>
        </>
    )
}

export default WorkOutSideGroupDetail
