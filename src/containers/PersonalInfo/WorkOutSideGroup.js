import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import { last } from "lodash"
import WorkOutSideGroupItem from './WorkOutSideGroupItem'
import ActionButtons from "./ActionButtons"
import IconAddWhite from "../../assets/img/icon/ic_btn_add_white.svg"

function WorkOutSideGroup(props) {
    const { t } = useTranslation()
    const [canUpdate, SetCanUpdate] = useState(false)
    const isEnableEditWorkOutsideGroup = true

    const [errors, SetErrors] = useState({})
    const [experiences, SetExperiences] = useState({})

    // const [experienceInformation, SetExperienceInformation] = useState({
    //     isEditing: false,
    //     experiences: [],
    //     experienceDataToUpdate : [],
    //     experienceDataToCreate : [],
    //     files: [],
    // })

    const handleSendRequest = () => {

    }

    const updateFilesToParent = () => {

    }

    const handleAddCompanies = () => {
        const keys = Object.keys(experiences)
        const newIndex = keys?.length === 0 ? 0 : Number((last(keys || []) || 0)) + 1
        const currentUserEmail = localStorage.getItem('email')
        const employeeNo = localStorage.getItem('employeeNo')
        const newExperience = {
            [newIndex]: {
                isAdding: true,
                username: currentUserEmail?.split('@')[0],
                uid: employeeNo,
                startDate: null,
                endDate: null,
                companyName: "",
                listWorking: {
                    0: {
                        startDate: null,
                        endDate: null,
                        positionName: "",
                        roleName: "",
                        salary: {
                            netSalary: "",
                            grossSalary: ""
                        },
                        currency: ""
                    }
                }
            }
        }
        SetExperiences({...experiences, ...newExperience})
    }

    const handleCanUpdate = () => {
        // TODO: Reset những item có chỉnh sửa
        SetCanUpdate(!canUpdate)
    }

    return (
        <div className="work-outside-group">
            <div className="top-button-actions">
                <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
                { isEnableEditWorkOutsideGroup && <span className="btn btn-primary shadow ml-3" onClick={handleCanUpdate}><i className="fas fa-user-edit"></i>{t("Edit")}</span> }
            </div>
            <h5 className="content-page-header">{t("QUÁ TRÌNH CÔNG TÁC NGOÀI TẬP ĐOÀN")}</h5>
            <div className="container-fluid info-tab-content shadow work-outside-group">
                <div className="work-outside-group-list">
                    {
                        (Object.entries(experiences) || []).map(item => (
                            <WorkOutSideGroupItem key={item[0]} index={item[0]} item={item[1]} canUpdate={canUpdate} />
                        ))
                    }
                    {
                        canUpdate && (
                            <>
                                <div className="block-btn-add-company">
                                    <button onClick={handleAddCompanies}><img src={IconAddWhite} alt="Add" /><span>Thêm công ty</span></button>
                                </div>
                                <ActionButtons errors={errors} sendRequests={handleSendRequest} updateFilesToParent={updateFilesToParent} />
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default WorkOutSideGroup
