import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useHistory, withRouter } from "react-router-dom"
import axios from "axios"
import moment from 'moment'
import { last, omit, size, groupBy } from "lodash"
import { useGuardStore } from 'modules/index'
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations, formatStringByMuleValue } from "commons/Utils"
import WorkOutSideGroupItem from './WorkOutSideGroupItem'
import ActionButtons from "./ActionButtons"
import ConfirmPasswordModal from "./ConfirmPasswordModal"
import Constants from "commons/Constants"
import LoadingModal from "components/Common/LoadingModal"
import ConfirmSendRequestModal from "./ConfirmSendRequestModal"
import WorkOutSideGroupItemDetail from "./WorkOutSideGroupItemDetail"
import DocumentComponent from "containers/Task/RequestDetail/DocumentComponent"
import { typeViewSalary } from "./WorkOutSideGroup"

const WorkOutSideGroupDetail = (props) => {
    const { details, viewPopup } = props
    const id = props?.match?.params?.id
    const { t } = useTranslation()
    const history = useHistory()
    const location = useLocation()
    // const guard = useGuardStore()
    // const user = guard.getCurentUser()
    // const [errors, SetErrors] = useState({})
    const [detail, SetDetail] = useState(null)
    const [accessToken, SetAccessToken] = useState(new URLSearchParams(location.search).get('accesstoken') || null)
    const [hiddenViewSalary, SetHiddenViewSalary] = useState(true)
    const [isShowConfirmPasswordModal, SetIsShowConfirmPasswordModal] = useState(false)
    const [isShowLoading, SetIsShowLoading] = useState(false)
    // const [isShowConfirmSendRequestModal, SetIsShowConfirmSendRequestModal] = useState(false)
    const state = viewPopup ? `workoutside_tasks_tab_approval_${id ?? details?.id}` : `workoutside${location.pathname.replaceAll('/', '_')}`

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete("accesstoken");
        history.replace({
          search: queryParams.toString(),
        });

        if (accessToken) {
            updateToken(accessToken)
        }
    }, [])

    useEffect(() => {
        SetDetail(details)
    }, [details])

    const onHideConfirmPasswordModal = () => {
        SetIsShowConfirmPasswordModal(false)
    }

    const handleToggleProcess = (companyIndex, isAddNew = false) => {
        const detailClone = {...detail}
        if (isAddNew) {
            detailClone.requestInfo.create.experiences[companyIndex].isCollapse = !detailClone?.requestInfo?.create?.experiences[companyIndex]?.isCollapse
        } else {
            detailClone.requestInfo.update.userProfileHistoryExperiences[companyIndex].isCollapse = !detailClone?.requestInfo?.update?.userProfileHistoryExperiences[companyIndex]?.isCollapse
        }
        SetDetail(detailClone)
    }

    const handleToggleViewSalary = () => {
        if (accessToken) {
            SetHiddenViewSalary(!hiddenViewSalary)
        }

        let isShow = false
        if (!accessToken) {
            isShow = true
        }
        SetIsShowConfirmPasswordModal(isShow)
    }

    const updateToken = async (token) => {
        SetAccessToken(token)
        try {
            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            formData.append('id', id)
            formData.append('subid', 1)
            formData.append('type', typeViewSalary.OTHER)
            if (accessToken) {
                formData.append('token', `Bearer ${token}`)
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/getsalary`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    SetDetail(response?.data?.data)
                    SetHiddenViewSalary(false)
                }
            }
        } catch (error) {

        } finally {

        }
    }

    const evictionRequest = () => {

    }

    const userProfileHistoryExperiences = detail?.requestInfo?.update?.userProfileHistoryExperiences
    const experienceCreateNew = detail?.requestInfo?.create?.experiences || []
    const userInfo = detail?.user
    const status = detail?.processStatusId
    const responseDataFromSAP = detail?.responseDataFromSAP
    const documents = detail?.requestDocuments
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
                <span className={`status ${statusOptions[status]?.className}`}>{statusOptions[status]?.label}</span>
                {
                    (status == Constants.STATUS_PARTIALLY_SUCCESSFUL && responseDataFromSAP) && 
                    <div className={`d-flex status fail`}>
                        <i className="fas fa-times pr-2 text-danger align-self-center"></i>
                        <div>{responseDataFromSAP}</div>
                    </div>
                }
            </div>
            { 
                documents?.length > 0 && (
                    <div className="documents-block">
                        <h5 className="content-page-header text-uppercase">{t("RegistrationAttachmentInformation")}</h5>
                        <DocumentComponent documents={documents} />
                    </div>
                )
            }
            {
                status == Constants.STATUS_PENDING && (
                    <div className="action-block">
                        <span className="btn btn-primary ml-3 shadow btn-eviction-task" title="Thu hồi yêu cầu" onClick={evictionRequest}>
                        <i className="fas fa-undo-alt" aria-hidden="true"></i>Thu hồi</span>
                    </div>
                )
            }
        </div>
        </>
    )
}

export default withRouter(WorkOutSideGroupDetail)
