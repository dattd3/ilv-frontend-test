import React, { useState, useEffect } from "react"
import { Image } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations } from '../../../commons/Utils'
import NoteComponent from './NoteComponent'
import ProjectStructureComponent from './ProjectStructureComponent'
import ButtonComponent from './ButtonComponent'
import GoalComponent from './GoalComponent'
import GeneralInformationComponent from './GeneralInformationComponent'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import ConfirmModal from '../../../components/Common/ConfirmModal'
import IconArrowLeft from '../../../assets/img/icon/Icon-Arrow-Left.svg'

function ProjectDetail(props) {
    const { t } = useTranslation()
    const [projectData, SetProjectData] = useState({})
    const [isLoading, SetIsLoading] = useState(false)
    const [confirmModal, SetConfirmModal] = useState({isShow: false, confirmHeader: 'Xác nhận ứng tuyển', confirmContent: 'Bạn chắc chắn muốn tham gia dự án này?'})
    const [statusModal, SetStatusModal] = useState({isShow: false, isSuccess: true, content: ''})
    const projectId = props.match.params.id

    useEffect(() => {
        const processProjectData = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result && result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data?.data
                    SetProjectData(data)
                }
            }
            SetIsLoading(false)
        }

        const getProjectDetail = async (projectId) => {
            SetIsLoading(true)
            try {
                const config = getRequestConfigurations()
                config.params = {
                    id: projectId
                }
                const response = await axios.get(`${process.env.REACT_APP_RSM_URL}projects/detail`, config)
                processProjectData(response)
            } catch (e) {
                console.error(e)
                SetIsLoading(false)
            }
        }

        getProjectDetail(projectId)
    }, [])

    const handleApply = () => {
        const confirmModalTemp = {...confirmModal}
        confirmModalTemp.isShow = true
        SetConfirmModal(confirmModalTemp)
    }

    const onCancelClick = () => {
        onHide()
    }

    const onHide = () => {
        const confirmModalTemp = {...confirmModal}
        confirmModalTemp.isShow = false
        SetConfirmModal(confirmModalTemp)
    }

    const onHideStatusModal = () => {
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = false
        SetStatusModal(statusModalTemp)
    }

    const onAcceptClick = async () => {
        SetIsLoading(true)
        onHide()
        const statusModalTemp = {...statusModal}
        try {
            const payload = {
                projectId: parseInt(projectId),
                comment: ""
            }
            const config = getRequestConfigurations()
            const response = await axios.post(`${process.env.REACT_APP_RSM_URL}projects/apply`, payload, config)
            SetIsLoading(false)
            statusModalTemp.isShow = true
            if (response && response.data) {
                const result = response.data?.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                } else {
                    statusModalTemp.isSuccess = false
                }
                statusModalTemp.content = result.message
            } else {
                statusModalTemp.isSuccess = false
                statusModalTemp.content = t("AnErrorOccurred")
            }
            SetStatusModal(statusModalTemp)
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetIsLoading(false)
            SetStatusModal(statusModalTemp)
        }
    }

    const { rsmBusinessOwners, rsmProjectTeams, rsmTargets, projectComment, plant, actual, mandayActual, mandayPlant } = projectData

    return (
        <>
        <LoadingModal show={isLoading} />
        <ConfirmModal modalClassName='apply-project' show={confirmModal.isShow} tempButtonLabel='Hủy' mainButtonLabel='Gửi' confirmHeader={confirmModal.confirmHeader} 
            confirmContent={confirmModal.confirmContent} onCancelClick={onCancelClick} onAcceptClick={onAcceptClick} onHide={onHide} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />
        <div className="projects-detail-page">
            <h1 className="content-page-header project-name"><Image src={IconArrowLeft} alt='Arrow' />{projectData?.projectName}</h1>
            <GeneralInformationComponent projectData={projectData} />
            <GoalComponent rsmTargets={rsmTargets} />
            <ProjectStructureComponent 
                rsmBusinessOwners={rsmBusinessOwners} 
                rsmProjectTeams={rsmProjectTeams} 
                plant={plant} 
                actual={actual} 
                mandayActual={mandayActual} 
                mandayPlant={mandayPlant} 
            />
            <NoteComponent projectComment={projectComment} />
            <ButtonComponent handleApply={handleApply} />
        </div>
        </>
    )
}

export default ProjectDetail
