import React from "react"
import ListProjects from "../ListProjects"
import { myProjectPageKey } from "../Constants"

function MyProjects() {

    return (
        <ListProjects from={myProjectPageKey} />
    )
}

export default MyProjects
