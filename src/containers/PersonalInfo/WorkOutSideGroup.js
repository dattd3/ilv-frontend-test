import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useHistory } from "react-router-dom"
import axios from "axios"
import Moment from "moment"
import { extendMoment } from "moment-range"
import { omit } from "lodash"
import { useGuardStore } from 'modules/index'
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations, formatStringByMuleValue } from "commons/Utils"
import map from "containers/map.config"
import WorkOutSideGroupItem from './WorkOutSideGroupItem'
import ActionButtons from "./ActionButtons"
import ConfirmPasswordModal from "./ConfirmPasswordModal"
import StatusModal from "components/Common/StatusModal"
import IconAddWhite from "assets/img/icon/ic_btn_add_white.svg"
import IconEdit from 'assets/img/icon/ic_edit_information_white.svg'
import IconHistory from 'assets/img/icon/ic_history_white.svg'
import Constants from "commons/Constants"
import LoadingModal from "components/Common/LoadingModal"
import ConfirmSendRequestModal from "./ConfirmSendRequestModal"
import { valueType, isEmptyByValue, formatValue } from "./WorkOutSideGroupDetail"
const moment = extendMoment(Moment)

const prefixUpdating = 'UPDATING'
const typeViewSalary = {
    OWN: 'OWN',
    OTHER: 'OTHER',
}

function WorkOutSideGroup(props) {
    const { t } = useTranslation()
    const history = useHistory()
    const location = useLocation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const [canUpdate, SetCanUpdate] = useState(false)
    const [errors, SetErrors] = useState({})
    const [experiences, SetExperiences] = useState(null)
    const [experienceDeleted, SetExperienceDeleted] = useState([])
    const [experienceOriginal, SetExperienceOriginal] = useState(null)
    const [accessToken, SetAccessToken] = useState(new URLSearchParams(location.search).get('accesstoken') || null)
    const [hiddenViewSalary, SetHiddenViewSalary] = useState(true)
    const [isShowConfirmPasswordModal, SetIsShowConfirmPasswordModal] = useState(false)
    const [isShowLoading, SetIsShowLoading] = useState(false)
    const [isShowConfirmSendRequestModal, SetIsShowConfirmSendRequestModal] = useState(false)
    const [statusModal, SetStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: '',
    })
    const [needReload, SetNeedReload] = useState(true)
    const [files, SetFiles] = useState([])
    const state = 'personal_info_tab_WorkOutsideGroup'
    const isEnableEditWorkOutsideGroup = true
    const tabActive = getValueParamByQueryString(window.location.search, 'tab')
    const currentCompanyCode = localStorage.getItem('companyCode')
    const currentEmployeeNo = localStorage.getItem('employeeNo')

    useEffect(() => {
        const fetchData = async () => {
            SetIsShowLoading(true)
            const config = getMuleSoftHeaderConfigurations()
            try {
                const response = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/workprocess/outside`, config)
                const data = (response?.data?.data || []).map(item => {
                    for (const key in item) {
                        if (['ID', 'PERNR'].includes(key)) {
                            item[key] = item[key]
                        } else {
                            item[key] = formatValue(item[key], valueType.other)
                            if (key.startsWith('BEG') || key.startsWith('END')) {
                                item[key] = formatValue(item[key], valueType.date)
                            }
                        }
                    }
                    return item
                })
                SetExperiences(data)
                SetExperienceOriginal(data)
                SetIsShowConfirmPasswordModal(!accessToken && tabActive === 'WorkOutsideGroup' && data?.length > 0)
            } catch (e) {
                SetExperiences([])
                SetExperienceOriginal([])
            } finally {
                SetIsShowLoading(false)
            }
        }

        if (tabActive === 'WorkOutsideGroup') {
            const queryParams = new URLSearchParams(location.search)
            queryParams.delete("accesstoken")
            history.replace({
                search: queryParams.toString(),
            })

            if (accessToken) {
                updateToken(accessToken)
            } else {
                fetchData()
            }
        }
    }, [tabActive])

    const isValidPeriod = (experience) => {
        const companyEndDate = experience?.isAddNew ? experience?.ENDDA : experience[`ENDDA_${prefixUpdating}`] ? experience[`ENDDA_${prefixUpdating}`] : experience?.ENDDA
        if (!companyEndDate && !moment(companyEndDate, 'YYYYMMDD').isValid()) {
            return true
        }

        let lstPeriodEndDate = []
        for (let i = 1; i < 6; i++) {
            let periodEndDate = experience?.isAddNew ? experience[`END${i}`] : experience[`END${i}_${prefixUpdating}`] ? experience[`END${i}_${prefixUpdating}`] : experience[`END${i}`]
            if (periodEndDate && moment(periodEndDate, 'YYYYMMDD').isValid()) {
                lstPeriodEndDate.push(periodEndDate)
            }
        }
        (lstPeriodEndDate || []).sort((a, b) => b - a)
        const maxPeriodEndDate = lstPeriodEndDate?.length > 0 ? lstPeriodEndDate[0] : null
        return companyEndDate >= maxPeriodEndDate
    }

    const isDataValid = () => {
        const hasCreateNew = (experiences || []).some(item => item?.isAddNew)
        const hasOnlyUpdating = (experiences || []).some(item => Object.entries(item).some(sub => sub[0].endsWith(`_${prefixUpdating}`) && isNotEmpty(sub[1])))

        if (!hasCreateNew && !hasOnlyUpdating && experienceDeleted?.length === 0) {
            SetNeedReload(false)
            SetStatusModal({
                isShow: true,
                isSuccess: false,
                content: t("PersonalInfoNoChange"),
            })
            return false
        }

        const experienceClone = ([...experiences] || []).map((item, i, original) => {
            let isOverlap = (original || [])
            .filter((sub, subIndex) => i !== subIndex)
            .some(sub => moment.range(
                moment(item[`BEGDA_${prefixUpdating}`] ? item[`BEGDA_${prefixUpdating}`] : item?.BEGDA, 'YYYYMMDD'),
                moment(item[`ENDDA_${prefixUpdating}`] ? item[`ENDDA_${prefixUpdating}`] : item?.ENDDA, 'YYYYMMDD')
            ).overlaps(moment.range(
                moment(sub[`BEGDA_${prefixUpdating}`] ? sub[`BEGDA_${prefixUpdating}`] : sub?.BEGDA, 'YYYYMMDD'),
                moment(sub[`ENDDA_${prefixUpdating}`] ? sub[`ENDDA_${prefixUpdating}`] : sub?.ENDDA, 'YYYYMMDD')
            ), { adjacent: true }))
            let isPeriodValid = isValidPeriod(item)
            let dateMessageInValid = null
            if (item?.isAddNew && (isEmptyByValue(item?.BEGDA, valueType.date) || isEmptyByValue(item?.ENDDA, valueType.date))) {
                dateMessageInValid = t("StartDateEndDateRequired")
            } else if (!isPeriodValid) {
                dateMessageInValid = t("InvalidDatePeriod")
            } else if (isOverlap) {
                dateMessageInValid = t("CompanyTimeNotOverlap")
            }

            return {
                ...item,
                ...(
                    item?.isAddNew && (isEmptyByValue(item?.ORGEH, valueType.other) ? { errorCompanyName: t("Required") } : { errorCompanyName: null })
                ),
                errorCompanyDate: dateMessageInValid
            }
        })

        SetExperiences(experienceClone)
        const isInValid = (experienceClone || []).some(item => item?.errorCompanyName || item?.errorCompanyDate)

        if (isInValid) {
            SetNeedReload(false)
            SetStatusModal({
                isShow: true,
                isSuccess: false,
                content: t("InvalidDataPleaseCheckAgain")
            })
        }

        return !isInValid
    }

    const handleSendRequest = () => {
        const isValid = isDataValid()
        if (!isValid) {
            return
        }
        SetIsShowConfirmSendRequestModal(true)
    }

    const updateFilesToParent = (filesToUpdate) => {
        SetFiles(filesToUpdate)
    }

    const handleAddCompanies = () => {
        const companyModel = {
            isAddNew: true,
            ORGEH: null,
            BEGDA: null,
            ENDDA: null,
            PERNR: currentEmployeeNo,
            KOKRS: currentCompanyCode,
            ID: null,
        }

        for (let i = 1; i < 6; i++) {
            companyModel[`BEG${i}`] = null
            companyModel[`END${i}`] = null
            companyModel[`WAERS${i}`] = null
            companyModel[`DE_NET${i}`] = null
            companyModel[`DE_GROSS${i}`] = null
            companyModel[`DUT${i}`] = null
            companyModel[`PLAN${i}`] = null
        }

        SetExperiences([...experiences, companyModel])
    }

    const handleRemoveCompany = (companyIndex) => {
        const experienceToSave = [...experiences].filter((item, index) => index !== companyIndex)
        if (!experiences[companyIndex]?.isAddNew) {
            let experienceDeletedClone = [...experienceDeleted]
            const companyDeleted = experiences[companyIndex]

            for (const key in companyDeleted) {
                if (key.endsWith(`_${prefixUpdating}`)) {
                    delete companyDeleted[key]
                }
            }
            companyDeleted.isDeleted = true
            delete companyDeleted.listWorking

            experienceDeletedClone = [...experienceDeletedClone, companyDeleted]
            SetExperienceDeleted(experienceDeletedClone)
        }
        SetExperiences(experienceToSave)
    }

    const handleToggleProcess = (companyIndex) => {
        const experiencesClone = [...experiences]
        experiencesClone[companyIndex].isCollapse = !experiencesClone[companyIndex].isCollapse
        SetExperiences(experiencesClone)
    }

    const handleToggleViewSalary = () => {
        if (accessToken) {
            SetHiddenViewSalary(!hiddenViewSalary)
        }

        // let isShow = false
        // if (!accessToken && tabActive == 'WorkOutsideGroup') {
        //     isShow = true
        // }
        // SetIsShowConfirmPasswordModal(isShow)
    }

    const handleCanUpdate = () => {
        // const experienceOriginalClone = [...experienceOriginal].map(item => {
        //     for (const key in item) {
        //         if (key.endsWith(`_${prefixUpdating}`)) {
        //             delete item[key]
        //         }
        //     }
        //     return item
        // })

        // const isUpdating = (experiences || []).some(item => item.isAddNew || item?.isUpdating)
        // if (isUpdating) {
        //     SetExperiences(experienceOriginalClone)
        // }

        SetCanUpdate(!canUpdate)
    }

    const updateToken = async (token) => {
        SetIsShowLoading(true)
        SetAccessToken(token)
        try {
            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            formData.append('id', null)
            formData.append('subid', null)
            formData.append('type', typeViewSalary.OWN)
            if (accessToken || token) {
                formData.append('token', `Bearer ${token ?? accessToken}`)
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/getsalary`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    // const experienceClone = [...(experiences || [])]
                    // const listIDs = (experienceClone || []).filter(item => item?.ID).map(item => item?.ID?.toString())
                    // const experienceOldCreateNew = (experienceClone || []).filter(item => item?.isAddNew)
                    // const data = (response?.data?.data || [])
                    // .filter(item => listIDs?.includes(item?.ID))
                    // .map((item, itemIndex) => {
                    //     let experienceItemOld = experienceClone[itemIndex] || {}
                    //     for (const key in item) {
                    //         if (['ID', 'PERNR'].includes(key)) {
                    //             item[key] = item[key]
                    //         } else {
                    //             item[key] = formatValue(item[key], valueType.other)
                    //             if (key.startsWith('BEG') || key.startsWith('END')) {
                    //                 item[key] = formatValue(item[key], valueType.date)
                    //             }
                    //         }
                    //         if (experienceItemOld[`${key}_${prefixUpdating}`] !== undefined) {
                    //             item[`${key}_${prefixUpdating}`] = experienceItemOld[`${key}_${prefixUpdating}`]
                    //         }
                    //     }
                    //     return item
                    // })
                    // SetExperiences([...data, ...experienceOldCreateNew])

                    SetExperiences(response?.data?.data || [])
                    // SetHiddenViewSalary(false)
                }
            }
        } catch (error) {

        } finally {
            SetIsShowLoading(false)
        }
    }

    const handleInputChangeOnParent = (index, key, value) => {
        // (!(/^\d*$/.test(Number(val))) || val.includes('.'))
        // !(/^[0-9][0-9,\.]*$/.test(Number(val))) 
        // !(/^[0-9][0-9,\.]*$/.test(Number(value)))
        const lisKeyNumberType = [1, 2, 3, 4, 5].reduce((res, item) => {
            res = [...res, `DE_NET${item}`, `DE_GROSS${item}`, `DE_NET${item}_${prefixUpdating}`, `DE_GROSS${item}_${prefixUpdating}`]
            return res
        }, [])

        let temp = value
        if (lisKeyNumberType.includes(key)) {
            temp = value?.replace(/[^0-9]/g, '')
        }

        const experienceToSave = [...experiences]
        experienceToSave[index][key] = temp
        SetExperiences(experienceToSave)
    }

    const onHideConfirmPasswordModal = (isCancel) => {
        if (isCancel) {
            window.location.href = map.Root
        }
        SetIsShowConfirmPasswordModal(false)
    }

    const onHideConfirmSendRequestModal = () => {
        SetIsShowConfirmSendRequestModal(false)
    }

    const prepareOrganization = (level3Text = '', level4Text = '', level5Text = '', level6Text = '') => {
        let result = ''
        switch (true) {
            case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '' && formatStringByMuleValue(level5Text) !== '' && formatStringByMuleValue(level6Text) !== '':
                result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}/${formatStringByMuleValue(level5Text)}/${formatStringByMuleValue(level6Text)}`
                break;
            case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '' && formatStringByMuleValue(level5Text) !== '':
                result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}/${formatStringByMuleValue(level5Text)}`
                break;
            case formatStringByMuleValue(level3Text) !== '' && formatStringByMuleValue(level4Text) !== '':
                result = `${formatStringByMuleValue(level3Text)}/${formatStringByMuleValue(level4Text)}`
                break;
        }
        return result
    }

    // const isEmptyByValue = val => {
    //     return (val !== undefined && (val === '' || val === null)) || val === undefined
    // }

    const isNotEmpty = val => {
        return val !== undefined && val !== null && val?.trim() !== ''
    }

    const getValueByCondition = (oldValue, newValue) => {
        let result = newValue
        if (newValue === undefined) {
            result = oldValue
        } else {
            if (newValue === '') {
                result = oldValue
            }
        }

        return result
    }

    const prepareItemToSAP = item => {
        const result = {
            ...item,
            ...( item?.isAddNew ? { needEncrypt: true } : { needEncrypt: accessToken ? true : false }),
            MYVP_ID: null,
            USER_NAME: user?.ad,
            KDATE: null,
            ACTIO: 'INS',
            ORGEH: item?.isAddNew ? item?.ORGEH : getValueByCondition(item?.ORGEH, item[`ORGEH_${prefixUpdating}`]),
            BEGDA: item?.isAddNew ? item?.BEGDA : getValueByCondition(item?.BEGDA, item[`BEGDA_${prefixUpdating}`]),
            ENDDA: item?.isAddNew ? item?.ENDDA : getValueByCondition(item?.ENDDA, item[`ENDDA_${prefixUpdating}`]),
        }
        let lstKeyToDelete = []
        
        for (let i = 1; i < 6; i++) {
            result[`DE_GROSS${i}`] = item?.isAddNew ? item[`DE_GROSS${i}`] : getValueByCondition(item[`DE_GROSS${i}`], item[`DE_GROSS${i}_${prefixUpdating}`])
            result[`DE_NET${i}`] = item?.isAddNew ? item[`DE_NET${i}`] : getValueByCondition(item[`DE_NET${i}`], item[`DE_NET${i}_${prefixUpdating}`])
            result[`BEG${i}`] = item?.isAddNew ? (item[`BEG${i}`] || null) : (getValueByCondition(item[`BEG${i}`], item[`BEG${i}_${prefixUpdating}`]) || null)
            result[`END${i}`] = item?.isAddNew ? (item[`END${i}`] || null) : (getValueByCondition(item[`END${i}`], item[`END${i}_${prefixUpdating}`]) || null)
            result[`WAERS${i}`] = item?.isAddNew ? item[`WAERS${i}`] : getValueByCondition(item[`WAERS${i}`], item[`WAERS${i}_${prefixUpdating}`])
            result[`DUT${i}`] = item?.isAddNew ? item[`DUT${i}`] : getValueByCondition(item[`DUT${i}`], item[`DUT${i}_${prefixUpdating}`])
            result[`PLAN${i}`] = item?.isAddNew ? item[`PLAN${i}`] : getValueByCondition(item[`PLAN${i}`], item[`PLAN${i}_${prefixUpdating}`])
            lstKeyToDelete = [...lstKeyToDelete, `DE_GROSS${i}_${prefixUpdating}`, `DE_NET${i}_${prefixUpdating}`, `WAERS${i}_${prefixUpdating}`, `PLAN${i}_${prefixUpdating}`, `END${i}_${prefixUpdating}`, `DUT${i}_${prefixUpdating}`, `BEG${i}_${prefixUpdating}`, 'errorCompanyName', 'errorCompanyDate', 'isCollapse']
        }

        return omit(result, ['isAddNew', 'listWorking', 'ID', 'ORGEH_UPDATING', 'BEGDA_UPDATING', 'ENDDA_UPDATING', ...lstKeyToDelete])
    }

    const prepareUpdatingItemInfo = item => {
        if (!item) {
            return null
        }
        item.needEncrypt = accessToken ? true : false

        const oldItem = {...item}
        for (const key in oldItem) {
            if (key.endsWith(`_${prefixUpdating}`)) {
                delete oldItem[key]
            }
        }
        delete oldItem.listWorking
        delete oldItem.errorCompanyName
        delete oldItem.errorCompanyDate
        delete oldItem?.isCollapse

        let newItem = {
            ...item,
            ORGEH: item[`ORGEH_${prefixUpdating}`] || null,
            BEGDA: item[`BEGDA_${prefixUpdating}`] || null,
            ENDDA: item[`ENDDA_${prefixUpdating}`] || null,
        }
        let lstKeyToDelete = []
        for (let i = 1; i < 6; i++) {
            newItem[`DE_GROSS${i}`] = newItem[`DE_GROSS${i}_${prefixUpdating}`] || null
            newItem[`DE_NET${i}`] = newItem[`DE_NET${i}_${prefixUpdating}`] || null
            newItem[`BEG${i}`] = newItem[`BEG${i}_${prefixUpdating}`] || null
            newItem[`END${i}`] = newItem[`END${i}_${prefixUpdating}`] || null
            newItem[`WAERS${i}`] = newItem[`WAERS${i}_${prefixUpdating}`] || null
            newItem[`DUT${i}`] = newItem[`DUT${i}_${prefixUpdating}`] || null
            newItem[`PLAN${i}`] = newItem[`PLAN${i}_${prefixUpdating}`] || null
            lstKeyToDelete = [...lstKeyToDelete, `DE_GROSS${i}_${prefixUpdating}`, `DE_NET${i}_${prefixUpdating}`, `WAERS${i}_${prefixUpdating}`, `PLAN${i}_${prefixUpdating}`, `END${i}_${prefixUpdating}`, `DUT${i}_${prefixUpdating}`, `BEG${i}_${prefixUpdating}`]
        }
        newItem = omit(newItem, ['listWorking', 'ORGEH_UPDATING', 'BEGDA_UPDATING', 'ENDDA_UPDATING', ...lstKeyToDelete])

        return { oldItem, newItem }
    }

    const onHideStatusModal = () => {
        SetStatusModal({
            ...statusModal,
            isShow: false,
            isSuccess: true,
            content: "",
        })
        if (needReload) {
            window.location.reload()
        }
    }

    const sendRequest = async (note = '') => {
        const statusModalClone = {...statusModal}
        SetIsShowLoading(true)
        try {
            const userObj = {
                employeeNo: user?.employeeNo,
                fullName: user?.fullName,
                jobTitle: user?.jobTitle,
                department: prepareOrganization(user?.division, user?.actualDepartment, user?.unit, user?.part),
            }
            const create = {
                experiences: (experiences || [])
                .filter(item => item?.isAddNew)
                .map(item => {
                    let itemClone = {...item}
                    delete itemClone.isAddNew
                    delete itemClone.listWorking
                    delete itemClone.errorCompanyName
                    delete itemClone.errorCompanyDate
                    delete itemClone?.isCollapse
                    itemClone.needEncrypt = true
                    return itemClone
                })
            }
            const experienceUpdating = (experiences || []).filter(item => Object.entries(item).some(sub => sub[0].endsWith(`_${prefixUpdating}`) && isNotEmpty(sub[1])))
            const update = {
                userProfileHistoryExperiences: (experienceUpdating || []).map(item => {
                    let itemInfo = prepareUpdatingItemInfo(item)
                    return {
                        OldExperience: itemInfo?.oldItem,
                        NewExperience: itemInfo?.newItem,
                    }
                })
            }
            if (experienceDeleted?.length > 0) {
                update.userProfileHistoryExperiences = update.userProfileHistoryExperiences.concat(experienceDeleted.map(item => {
                    return {
                        OldExperience: item,
                        NewExperience: item
                    }
                }))
            }
            const userProfileInfo = {
                create,
                update,
            }
            const userProfileInfoToSap = (experiences || []).map(item => {
                return prepareItemToSAP(item)
            })

            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            formData.append('Name', t("WorkingOutSideGroup"))
            formData.append('Comment', note)
            formData.append('UserProfileInfo', JSON.stringify(userProfileInfo))
            formData.append('UpdateField', JSON.stringify({UpdateField: ['WorkOutside']}))
            formData.append('RequestTypeId', Constants.UPDATE_PROFILE)
            formData.append('CompanyCode', user?.companyCode)
            formData.append('UserProfileInfoToSap', JSON.stringify(userProfileInfoToSap))
            formData.append('User', JSON.stringify(userObj))
            formData.append('OrgLv2Id', user?.organizationLv2)
            formData.append('OrgLv2Text', formatStringByMuleValue(user?.company))
            formData.append('DivisionId', user?.divisionId)
            formData.append('Division', formatStringByMuleValue(user?.division))
            formData.append('RegionId', user?.regionId)
            formData.append('Region', formatStringByMuleValue(user?.region))
            formData.append('UnitId', user?.unitId)
            formData.append('Unit', formatStringByMuleValue(user?.unit))
            formData.append('PartId', user?.partId)
            formData.append('Part', formatStringByMuleValue(user?.part))
            for (let key in files) {
                formData.append('Files', files[key])
            }

            SetIsShowConfirmSendRequestModal(false)
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/experience`, formData, config)
            statusModalClone.isShow = true
            let content = t("gui_yeu_cau_that_bai_vui_long_thu_lai")
            let isSuccess = false
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    content = t("RequestSent")
                    isSuccess = true
                    SetHiddenViewSalary(false)
                    SetNeedReload(true)
                } else {
                    content = result?.message
                    SetNeedReload(false)
                }
            } else {
                SetNeedReload(false)
            }
            statusModalClone.isSuccess = isSuccess
            statusModalClone.content = content
            SetStatusModal(statusModalClone)
        } catch (error) {
            SetNeedReload(false)
            SetStatusModal({
                ...statusModal,
                isShow: true,
                isSuccess: false,
                content: t("AnErrorOccurred"),
            })
        } finally {
            SetIsShowLoading(false)
        }
    }

    return (
        <>
        <LoadingModal show={isShowLoading} />
        <ConfirmPasswordModal
            show={isShowConfirmPasswordModal}
            state={state}
            onUpdateToken={updateToken}
            onHide={onHideConfirmPasswordModal} />
        <ConfirmSendRequestModal
            isShow={isShowConfirmSendRequestModal}
            sendRequest={sendRequest}
            onHide={onHideConfirmSendRequestModal} />
        <StatusModal
            show={statusModal?.isShow || false}
            isSuccess={statusModal?.isSuccess}
            content={statusModal?.content}
            className="work-out-side-group-status-modal"
            backdropClassName="backdrop-work-out-side-group-status-modal"
            onHide={onHideStatusModal}
        />
        <div className="work-outside-group">
            <div className="top-button-actions">
                <a href="/tasks" className="btn btn-info shadow-customize d-flex align-items-center"><img src={IconHistory} alt='History' />{t("History")}</a>
                { isEnableEditWorkOutsideGroup && <span className="btn btn-primary shadow-customize ml-3 d-flex align-items-center" onClick={handleCanUpdate}><img src={IconEdit} alt='Edit' />{t("Edit")}</span> }
            </div>
            <h5 className="content-page-header text-uppercase">{t("WorkingProcessOutSideGroup")}</h5>
            <div className="container-fluid info-tab-content shadow work-outside-group">
                <div className="work-outside-group-list">
                    {
                        <>
                        {
                            experiences && experiences?.length === 0 && (
                                <div className="work-outside-group-item">
                                    <div className="company-info">
                                        <div className="group-header">
                                            <h5>{t("CompanyInfo")}</h5>
                                        </div>
                                        <div style={{ margin: 15 }}>{t("NoDataFound")}</div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            (experiences || []).map((item, index) => (
                                <WorkOutSideGroupItem 
                                    key={index}
                                    index={index}
                                    item={item}
                                    canUpdate={canUpdate}
                                    totalItem={experiences?.length || 0}
                                    viewSalaryAtLeastOnceTime={accessToken ? true : false}
                                    hiddenViewSalary={hiddenViewSalary}
                                    handleRemoveCompany={handleRemoveCompany}
                                    // handleRemoveProcess={handleRemoveProcess}
                                    // handleAddProcess={handleAddProcess}
                                    handleToggleProcess={handleToggleProcess}
                                    handleToggleViewSalary={handleToggleViewSalary}
                                    handleInputChangeOnParent={handleInputChangeOnParent} />
                            ))
                        }
                        </>
                    }
                    {
                        canUpdate && (
                            <>
                                <div className="block-btn-add-company">
                                    <button onClick={handleAddCompanies}><img src={IconAddWhite} alt="Add" /><span>{t("AddCompany")}</span></button>
                                </div>
                                <ActionButtons errors={errors} sendRequests={handleSendRequest} updateFilesToParent={updateFilesToParent} />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default WorkOutSideGroup
export { prefixUpdating, typeViewSalary }