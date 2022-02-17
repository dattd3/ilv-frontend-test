import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import ListProjects from "./ListProjects"
import ProjectInProgress from "./ProjectInProgress"
import UserInfo from './UserInfo'
import LoadingModal from '../../../components/Common/LoadingModal'

function MyProfile() {
    const { t } = useTranslation()
    const [userProfile, SetUserProfile] = useState(null)
    const [isLoading, SetIsLoading] = useState(false)

    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    SetUserProfile(data)
                }
            }
            SetIsLoading(false)
        }

        const getProjectData = async () => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/profile`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
                SetIsLoading(false)
            }
        }

        getProjectData()
    }, [])

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="my-profile-page">
            <h1 className="content-page-header">Hồ sơ của tôi</h1>
            {
                userProfile ?
                <>
                    <UserInfo userInfo={_.omit(userProfile, 'projectCloseds', 'projectInProcess')} />
                    <div className="project-in-progress">
                        <ProjectInProgress title="I. Dự án đang tiến hành" projects={userProfile?.projectInProcess} />
                    </div>
                    <div className="project-completed">
                        <ListProjects title="II. Dự án đã hoàn hành" projects={userProfile?.projectCloseds} />
                    </div>
                </>
                : <h6 className="alert alert-danger" role="alert">{t("NoDataFound")}</h6>
            }
        </div>
        </>
    )
}

export default MyProfile
