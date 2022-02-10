import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios from 'axios'
import Constants from '../../../commons/Constants'
import { status } from '../Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import ProjectRowItem from '../Share/ProjectRowItem'

function ProjectDetail() {
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({projects: [], totalRecord: 0})
    const [paging, SetPaging] = useState({pageIndex: 1, pageSize: 10})


    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    const projectDataToSave = {...projectData}
                    projectDataToSave.projects = data?.details || []
                    projectDataToSave.totalRecord = data?.totalRecord || 0
                    SetProjectData(projectDataToSave)
                }
            }
        }

        const getProjectData = async () => {
            try {
                const config = getRequestConfigurations()
                config.params = {
                    pageIndex: paging.pageIndex,
                    pageSize: paging.pageSize
                }
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/open`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
            }
        }
        getProjectData()
    }, [paging])


    return (
        <div className="list-projects-page">
            <h1 className="content-page-header">Project detail</h1>
        </div>
    )
}

export default ProjectDetail
