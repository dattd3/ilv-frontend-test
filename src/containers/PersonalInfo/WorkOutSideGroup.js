import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from "axios"
import moment from 'moment'
import { last, omit, size, groupBy } from "lodash"
import { useGuardStore } from 'modules/index'
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, getRequestConfigurations } from "commons/Utils"
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
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const [canUpdate, SetCanUpdate] = useState(false)
    const [errors, SetErrors] = useState({})
    const [experiences, SetExperiences] = useState(null)
    const [experienceOriginal, SetExperienceOriginal] = useState(null)
    const [accessToken, SetAccessToken] = useState(null)
    const [hiddenViewSalary, SetHiddenViewSalary] = useState(true)
    const [isShowConfirmPasswordModal, SetIsShowConfirmPasswordModal] = useState(false)
    const [isShowLoading, SetIsShowLoading] = useState(false)
    const [isShowConfirmSendRequestModal, SetIsShowConfirmSendRequestModal] = useState(false)
    const [files, SetFiles] = useState([])

    const isEnableEditWorkOutsideGroup = true
    const tabActive = getValueParamByQueryString(window.location.search, 'tab')
    const currentCompanyCode = localStorage.getItem('companyCode')
    const currentEmployeeNo = localStorage.getItem('employeeNo')

    // const [experienceInformation, SetExperienceInformation] = useState({
    //     isEditing: false,
    //     experiences: [],
    //     experienceDataToUpdate : [],
    //     experienceDataToCreate : [],
    //     files: [],
    // })

    useEffect(() => {
        const fetchData = async () => {
            SetIsShowLoading(true)
            const config = getMuleSoftHeaderConfigurations()
            try {
                const response = await axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/workprocess/outside`, config)
                const data = response?.data?.data || []
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
            fetchData()
        }
    }, [tabActive])

    const handleSendRequest = () => {
        // Xử lý submit yêu cầu
        
        // Validate data

        
        // Submit data
    }

    const updateFilesToParent = () => {

    }

    const handleAddCompanies = () => {
        const newExperience = {
            isAddNew: true,
            BEG2: null,
            WAERS3: null,
            WAERS2: null,
            BEG3: null,
            WAERS1: null,
            BEG1: null,
            NET3: null,
            NET2: null,
            NET1: null,
            GROSS1: null,
            GROSS3: null,
            GROSS2: null,
            BEGDA: null,
            ORGEH: "",
            END3: null,
            END2: null,
            END1: null,
            ENDDA: null,
            ID: null,
            KOKRS: currentCompanyCode,
            DUT2: null,
            DUT1: null,
            PLAN1: null,
            PLAN2: null,
            PLAN3: null,
            PERNR: currentEmployeeNo,
            DUT3: null,
        }
        SetExperiences([...experiences, newExperience])
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
        const experienceOriginalClone = [...experienceOriginal].map(item => {
            for (const key in item) {
                if (key.endsWith(`_${prefixUpdating}`)) {
                    delete item[key]
                }
            }
            return item
        })
        SetExperiences(experienceOriginalClone)
        SetCanUpdate(!canUpdate)
    }

    const updateToken = async (token) => {
        SetAccessToken(token)
        try {
            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            formData.append('token', `Bearer ${token}`)
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/getsalary`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    SetExperiences(response?.data?.data || [])
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

    const sendRequest = async (note = '') => {
        SetIsShowLoading(true)
        try {
            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            let formData = new FormData()
            formData.append('Name', 'Công tác ngoài tập đoàn')
            formData.append('Comment', note)
            formData.append('UserProfileInfo', note)
            formData.append('UpdateField', JSON.stringify({UpdateField: ['WorkOutside']}))
            formData.append('RequestTypeId', 15)
            formData.append('CompanyCode', user?.companyCode)
            formData.append('UserProfileInfoToSap', note)
            formData.append('User', note)
            formData.append('OrgLv2Id', user?.organizationLv2)
            formData.append('OrgLv2Text', user?.company)
            formData.append('DivisionId', user?.divisionId)
            formData.append('Division', user?.division)
            formData.append('RegionId', user?.regionId)
            formData.append('Region', user?.region)
            formData.append('UnitId', user?.unitId)
            formData.append('Unit', user?.unit)
            formData.append('PartId', user?.partId)
            formData.append('Part', user?.part)
            formData.append('Files', note)
            formData.append('Tab', 'CONGTACNGOAITAPDOAN')

            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/experience`, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    SetExperiences(response?.data?.data || [])
                    SetHiddenViewSalary(false)
                }
            }
        } catch (error) {

        } finally {
            SetIsShowLoading(false)
        }
    }

    console.log('agsfasdasdfggsfd', user)

    return (
        <>
        <LoadingModal show={isShowLoading} />
        <ConfirmPasswordModal show={isShowConfirmPasswordModal} onUpdateToken={updateToken} onHide={onHideConfirmPasswordModal} />
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