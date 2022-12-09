import React from "react"
import ListProjects from "../ListProjects"
import HOCComponent from '../../../components/Common/HOCComponent'
import { myProjectPageKey } from "../Constants"

function MyProjects() {
    localStorage.setItem('backUrl', window.location.href)

    return (
        <ListProjects from={myProjectPageKey} isSetBackUrl={false} />
    )
}

export default HOCComponent(MyProjects)
