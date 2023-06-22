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

    console.log('userProfileHistoryExperiences ======== ', userProfileHistoryExperiences)

    return (
        <>
        <LoadingModal show={isShowLoading} />
        <ConfirmPasswordModal show={isShowConfirmPasswordModal} state={state} onUpdateToken={updateToken} onHide={onHideConfirmPasswordModal} />
        {/* <ConfirmSendRequestModal isShow={isShowConfirmSendRequestModal} sendRequest={sendRequest} onHide={onHideConfirmSendRequestModal} /> */}
        <div className="work-outside-group-detail">
            <h5 className="content-page-header text-uppercase">{t("WorkingProcessOutSideGroup")}</h5>
            <div className="info-tab-content shadow work-outside-group">
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
        </div>
        </>
    )
}

export default WorkOutSideGroupDetail
