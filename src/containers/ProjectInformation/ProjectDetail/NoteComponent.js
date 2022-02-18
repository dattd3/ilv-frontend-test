import React from "react"
import { useTranslation } from "react-i18next"

function NoteComponent(props) {
    const { t } = useTranslation()
    const { projectComment } = props

    return (
        <div className="note-block">
            <h2 className="title-block">IV. Ghi chú</h2>
            <hr className="line-seperate"></hr>
            <div className="note-table-wrapper">
                <table className="note-table">
                    <thead>
                        <tr>
                            <th className='c-content'><div className='content'>Thông tin ghi chú</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='c-content'><div className='content'>{projectComment || ""}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NoteComponent
