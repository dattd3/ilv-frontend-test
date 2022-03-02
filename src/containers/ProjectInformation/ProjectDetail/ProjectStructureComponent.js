import React from "react"
import { useTranslation } from "react-i18next"
import BusinessOwnerComponent from './BusinessOwnerComponent'
import ProjectTeamComponent from './ProjectTeamComponent'

function ProjectStructureComponent(props) {
    const { t } = useTranslation()
    const { rsmBusinessOwners, rsmProjectTeams, plant, actual, mandayActual, mandayPlant } = props

    return (
        <div className="project-structure">
            <h2 className="title-block">III. Cơ cấu dự án</h2>
            <ProjectTeamComponent 
                rsmProjectTeams={rsmProjectTeams} 
                plant={plant} 
                actual={actual} 
                mandayActual={mandayActual} 
                mandayPlant={mandayPlant} />
            <BusinessOwnerComponent rsmBusinessOwners={rsmBusinessOwners} />
        </div>
    )
}

export default ProjectStructureComponent
