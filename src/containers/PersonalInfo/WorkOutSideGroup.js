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

const prefixUpdating = 'UPDATING'

function WorkOutSideGroup(props) {
    const { t } = useTranslation()
    const history = useHistory()
    const location = useLocation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const [canUpdate, SetCanUpdate] = useState(false)
    const [errors, SetErrors] = useState({})
    const [experiences, SetExperiences] = useState(null)
    const [experienceOriginal, SetExperienceOriginal] = useState(null)
    const [accessToken, SetAccessToken] = useState(new URLSearchParams(location.search).get('accesstoken') || null)
    const [isSeenSalaryAtLeastOnce, SetIsSeenSalaryAtLeastOnce] = useState(false)
    const [hiddenViewSalary, SetHiddenViewSalary] = useState(true)
    const [isShowConfirmPasswordModal, SetIsShowConfirmPasswordModal] = useState(false)
    const [isShowLoading, SetIsShowLoading] = useState(false)
    const [isShowConfirmSendRequestModal, SetIsShowConfirmSendRequestModal] = useState(false)
    const [files, SetFiles] = useState([])
    const state = 'personal_info_tab_WorkOutsideGroup'
    const isEnableEditWorkOutsideGroup = true
    const tabActive = getValueParamByQueryString(window.location.search, 'tab')
    const currentCompanyCode = localStorage.getItem('companyCode')
    const currentEmployeeNo = localStorage.getItem('employeeNo')

    const fakeInitData = () => {
        let result = []
        for (let index = 0; index < 1; index++) {
          let temp = {
            ORGEH: `Công ty A ${index}`,
            BEGDA: 20230101,
            ENDDA: 20230202,
            PERNR: currentEmployeeNo,
            KOKRS: currentCompanyCode,
            ID: index,
          }

          for (let i = 1; i < 6; i++) {
            temp[`BEG${i}`] = 20230101
            temp[`END${i}`] = 20230101
            temp[`WAERS${i}`] = 'USD'
            temp[`DE_NET${i}`] = 'xxxxxxxxxx'
            temp[`DE_GROSS${i}`] = 'xxxxxxxxxx'
            temp[`DUT${i}`] = null
            temp[`PLAN${i}`] = null
          }

          result = [...result, temp]
        }
        return result
    }

    const fakeDecodeData = () => {
        let result = []
        for (let index = 0; index < 1; index++) {
          let temp = {
            ORGEH: `Công ty A ${index}`,
            BEGDA: 20230101,
            ENDDA: 20230202,
            PERNR: currentEmployeeNo,
            KOKRS: currentCompanyCode,
            ID: index,
          }

          for (let i = 1; i < 6; i++) {
            temp[`BEG${i}`] = 20230101
            temp[`END${i}`] = 20230101
            temp[`WAERS${i}`] = 'USD'
            temp[`DE_NET${i}`] = 12000000
            temp[`DE_GROSS${i}`] = 16000000
            temp[`DUT${i}`] = null
            temp[`PLAN${i}`] = null
          }
          result = [...result, temp]
        }

        return result
    }

    useEffect(() => {
        const fetchData = async () => {
            SetIsShowLoading(true)
            const config = getMuleSoftHeaderConfigurations()
            try {
                const response = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/workprocess/outside`, config)
                let data = response?.data?.data || []

                // Fake data
                data = fakeInitData()

                SetExperiences(data)
                SetExperienceOriginal(data)
                // if (response && response?.data) {
                //     // let data = response?.data?.data || []
                //     // const experienceToSave = (data || []).reduce((res, currentItem, currentIndex) => {
                //     //     res[currentIndex] = {
                //     //         username: currentUserEmail?.split('@')[0],
                //     //         uid: employeeNo,
                //     //         companyName: currentItem[0] || '',
                //     //         startDate: currentItem[1][0]?.from_time || null,
                //     //         endDate: currentItem[1][0]?.to_time || null,
                //     //         listWorking: (currentItem[1] || []).reduce((resSub, subItem, subIndex) => {
                //     //             resSub[subIndex] = {
                //     //                 startDate: subItem?.BEG || null,
                //     //                 endDate: subItem?.END || null,
                //     //                 positionName: subItem?.title || '', // Chức danh
                //     //                 roleName: subItem?.rank || '', // Vai trò chính
                //     //                 salary: {
                //     //                     netSalary: subItem?.salary_net || null,
                //     //                     grossSalary: subItem?.salary_gross || null,
                //     //                 },
                //     //                 currency: subItem?.currency || null,
                //     //             }
                //     //             return resSub
                //     //         }, {})
                //     //     }
                //     //     return res
                //     // }, {})

                //     SetExperiences(response?.data?.data || [])
                // }
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

    const handleSendRequest = () => {
        // Xử lý submit yêu cầu
        
        // Validate data

        SetIsShowConfirmSendRequestModal(true)
    }

    const updateFilesToParent = (filesToUpdate) => {
        SetFiles(filesToUpdate)
    }

    const handleAddCompanies = () => {
        const companyModel = {
            isAddNew: true,
            ORGEH: "",
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
        SetExperiences(experienceToSave)
    }

    // const handleRemoveProcess = (companyIndex, processIndex) => {
    //     const experiencesClone = {...experiences}
    //     delete experiencesClone[companyIndex].listWorking[processIndex]
    //     SetExperiences(experiencesClone)
    // }

    // const handleAddProcess = (companyIndex) => {
    //     const experiencesClone = {...experiences}
    //     const lastProcessIndex = Number(Object.keys(experiencesClone[companyIndex]?.listWorking || {}).pop() || 0)
    //     experiencesClone[companyIndex].listWorking[lastProcessIndex + 1] = {
    //         startDate: null,
    //         endDate: null,
    //         positionName: "",
    //         roleName: "",
    //         salary: {
    //             netSalary: "",
    //             grossSalary: ""
    //         },
    //         currency: "",
    //     }
    //     SetExperiences(experiencesClone)
    // }

    const handleToggleProcess = (companyIndex) => {
        const experiencesClone = [...experiences]
        experiencesClone[companyIndex].isCollapse = !experiencesClone[companyIndex].isCollapse
        SetExperiences(experiencesClone)
    }

    const handleToggleViewSalary = () => {
        if (accessToken) {
            SetHiddenViewSalary(!hiddenViewSalary)
        }

        let isShow = false
        if (!accessToken && tabActive == 'WorkOutsideGroup') {
            isShow = true
        }
        SetIsShowConfirmPasswordModal(isShow)
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
        SetAccessToken(token)
        try {
            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            if (accessToken) {
                formData.append('token', `Bearer ${token}`)   
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/getsalary`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    const fake = fakeDecodeData()
                    SetExperiences(fake)

                    // SetExperiences(response?.data?.data || [])
                    SetHiddenViewSalary(false)
                }
            }
        } catch (error) {

        } finally {

        }
    }

    const handleInputChangeOnParent = (index, key, value) => {
        const experienceToSave = [...experiences]
        experienceToSave[index][key] = value
        SetExperiences(experienceToSave)
    }

    const onHideConfirmPasswordModal = (isCancel) => {
        if (isCancel) {
            SetHiddenViewSalary(true)
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
            result[`BEG${i}`] = item?.isAddNew ? item[`BEG${i}`] : getValueByCondition(item[`BEG${i}`], item[`BEG${i}_${prefixUpdating}`])
            result[`END${i}`] = item?.isAddNew ? item[`END${i}`] : getValueByCondition(item[`END${i}`], item[`END${i}_${prefixUpdating}`])
            result[`WAERS${i}`] = item?.isAddNew ? item[`WAERS${i}`] : getValueByCondition(item[`WAERS${i}`], item[`WAERS${i}_${prefixUpdating}`])
            result[`DUT${i}`] = item?.isAddNew ? item[`DUT${i}`] : getValueByCondition(item[`DUT${i}`], item[`DUT${i}_${prefixUpdating}`])
            result[`PLAN${i}`] = item?.isAddNew ? item[`PLAN${i}`] : getValueByCondition(item[`PLAN${i}`], item[`PLAN${i}_${prefixUpdating}`])
            lstKeyToDelete = [...lstKeyToDelete, `DE_GROSS${i}_${prefixUpdating}`, `DE_NET${i}_${prefixUpdating}`, `WAERS${i}_${prefixUpdating}`, `PLAN${i}_${prefixUpdating}`, `END${i}_${prefixUpdating}`, `DUT${i}_${prefixUpdating}`, `BEG${i}_${prefixUpdating}`]
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

        let newItem = {
            ...item,
            ORGEH: getValueByCondition(item?.ORGEH, item[`ORGEH_${prefixUpdating}`]),
            BEGDA: getValueByCondition(item?.BEGDA, item[`BEGDA_${prefixUpdating}`]),
            ENDDA: getValueByCondition(item?.ENDDA, item[`ENDDA_${prefixUpdating}`]),
        }
        let lstKeyToDelete = []
        for (let i = 1; i < 6; i++) {
            newItem[`DE_GROSS${i}`] = getValueByCondition(newItem[`DE_GROSS${i}`], newItem[`DE_GROSS${i}_${prefixUpdating}`])
            newItem[`DE_NET${i}`] = getValueByCondition(newItem[`DE_NET${i}`], newItem[`DE_NET${i}_${prefixUpdating}`])
            newItem[`BEG${i}`] = getValueByCondition(newItem[`BEG${i}`], newItem[`BEG${i}_${prefixUpdating}`])
            newItem[`END${i}`] = getValueByCondition(newItem[`END${i}`], newItem[`END${i}_${prefixUpdating}`])
            newItem[`WAERS${i}`] = getValueByCondition(newItem[`WAERS${i}`], newItem[`WAERS${i}_${prefixUpdating}`])
            newItem[`DUT${i}`] = getValueByCondition(newItem[`DUT${i}`], newItem[`DUT${i}_${prefixUpdating}`])
            newItem[`PLAN${i}`] = getValueByCondition(newItem[`PLAN${i}`], newItem[`PLAN${i}_${prefixUpdating}`])
            lstKeyToDelete = [...lstKeyToDelete, `DE_GROSS${i}_${prefixUpdating}`, `DE_NET${i}_${prefixUpdating}`, `WAERS${i}_${prefixUpdating}`, `PLAN${i}_${prefixUpdating}`, `END${i}_${prefixUpdating}`, `DUT${i}_${prefixUpdating}`, `BEG${i}_${prefixUpdating}`]
        }
        newItem = omit(newItem, ['listWorking', 'ORGEH_UPDATING', 'BEGDA_UPDATING', 'ENDDA_UPDATING', ...lstKeyToDelete])

        return { oldItem, newItem }
    }

    const sendRequest = async (note = '') => {
        console.log('submitting ....', experiences)

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
                    return itemClone
                })
            }
            
            const experienceUpdating = (experiences || []).filter(item => isNotEmpty(item[`DE_GROSS1_${prefixUpdating}`]) || isNotEmpty(item[`DE_GROSS2_${prefixUpdating}`]) 
            || isNotEmpty(item[`DE_GROSS3_${prefixUpdating}`]) || isNotEmpty(item[`DE_GROSS4_${prefixUpdating}`]) || isNotEmpty(item[`DE_GROSS5_${prefixUpdating}`]) 
            || isNotEmpty(item[`DE_NET1_${prefixUpdating}`]) || isNotEmpty(item[`DE_NET2_${prefixUpdating}`]) || isNotEmpty(item[`DE_NET3_${prefixUpdating}`]) 
            || isNotEmpty(item[`DE_NET4_${prefixUpdating}`]) || isNotEmpty(item[`DE_NET5_${prefixUpdating}`]) || isNotEmpty(item[`ORGEH_${prefixUpdating}`]) 
            || isNotEmpty(item[`BEGDA_${prefixUpdating}`]) || isNotEmpty(item[`ENDDA_${prefixUpdating}`])
            )

            const update = {
                userProfileHistoryExperiences: (experienceUpdating || []).map(item => {
                    let itemInfo = prepareUpdatingItemInfo(item)
                    return {
                        OldExperience: itemInfo?.oldItem,
                        NewExperience: itemInfo?.newItem,
                    }
                })
            }

            const userProfileInfo = {
                create,
                update,
            }

            console.log('Profile info to save ==== ', userProfileInfo)

            const userProfileInfoToSap = (experiences || []).map(item => {
                return prepareItemToSAP(item)
            })

            console.log('DATA to SAP => ', userProfileInfoToSap)

            return

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

            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/experience`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    SetExperiences(response?.data?.data || [])
                    SetHiddenViewSalary(false)
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            SetIsShowLoading(false)
        }
    }

    return (
        <>
        <LoadingModal show={isShowLoading} />
        <ConfirmPasswordModal show={isShowConfirmPasswordModal} state={state} onUpdateToken={updateToken} onHide={onHideConfirmPasswordModal} />
        <ConfirmSendRequestModal isShow={isShowConfirmSendRequestModal} sendRequest={sendRequest} onHide={onHideConfirmSendRequestModal} />
        <div className="work-outside-group">
            <div className="top-button-actions">
                <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
                { isEnableEditWorkOutsideGroup && <span className="btn btn-primary shadow ml-3" onClick={handleCanUpdate}><i className="fas fa-user-edit"></i>{t("Edit")}</span> }
            </div>
            <h5 className="content-page-header text-uppercase">{t("WorkingProcessOutSideGroup")}</h5>
            <div className="container-fluid info-tab-content shadow work-outside-group">
                <div className="work-outside-group-list">
                    {
                        experiences && experiences?.length === 0
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
                        : experiences && (experiences || []).map((item, index) => (
                            <WorkOutSideGroupItem 
                                key={index}
                                index={index}
                                item={item}
                                canUpdate={canUpdate}
                                hiddenViewSalary={hiddenViewSalary}
                                handleRemoveCompany={handleRemoveCompany}
                                // handleRemoveProcess={handleRemoveProcess}
                                // handleAddProcess={handleAddProcess}
                                handleToggleProcess={handleToggleProcess}
                                handleToggleViewSalary={handleToggleViewSalary}
                                handleInputChangeOnParent={handleInputChangeOnParent} />
                        ))
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
export { prefixUpdating }