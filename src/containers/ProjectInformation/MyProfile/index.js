import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import ListProjects from "./ListProjects"
import UserInfo from './UserInfo'

function MyProfile() {
    const { t } = useTranslation()
    const [userProfile, SetUserProfile] = useState({})

    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    SetUserProfile(data)
                    console.log(data)
                }
            }
        }

        const getProjectData = async () => {
            try {
                const config = getRequestConfigurations()
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/profile`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
            }
        }

        getProjectData()
    }, [])

    return (
        <div className="my-profile-page">
            <h1 className="content-page-header">Hồ sơ của tôi</h1>
            <UserInfo userInfo={_.omit(userProfile, 'projectCloseds', 'projectInProcess')} />
            <div className="project-in-progress">
                <ListProjects title="I. Dự án đang tiến hành" projects={userProfile.projectInProcess} />
            </div>
            <div className="project-completed">
                <ListProjects title="II. Dự án đã hoàn hành" projects={userProfile.projectCloseds} />
            </div>
        </div>
    )
}

export default MyProfile
