import React, { useState } from "react"
import { useTranslation } from "react-i18next"

function ActionButtons(props) {
    const { t } = useTranslation()
    const { errors } = props
    const [files, SetFiles] = useState([])

    const handleChangeFileInput = e => {
        const filesSelected = Object.values(e.target.files)
        let fileStates = [...files]
        fileStates = fileStates.concat(filesSelected)
        SetFiles(fileStates)
        props.updateFilesToParent(fileStates)
    }

    const removeFiles = index => {
        let fileStates = [...files]
        const filesValid = [...fileStates.slice(0, index), ...fileStates.slice(index + 1)]
        SetFiles(filesValid)
        props.updateFilesToParent(filesValid)
    }

    const handleSendRequests = () => {
        props.sendRequests()
    }

    return (
        <>
        { errors && errors.other && <div className="text-danger validation-message validation-files">{errors.other}</div> }
        <div className="list-files">
            {
                (files || []).map((file, i) => {
                    return <div className="item" key={i}>
                                <span className="file-name">{file.name}</span>
                                <span className="btn-remove"><i className="fa fa-times remove" aria-hidden="true" onClick={() => removeFiles(i)}></i></span>
                            </div>
                })
            }
        </div>
        <div className="block-button-actions">
            <div className="block-buttons">
                <span className="btn-action btn-attachment">
                    <label htmlFor="i_files" className="custom-file-upload"><i className="fas fa-paperclip"></i>{t("AttachFile")}</label>
                    <input id="i_files" type="file" name="i_files" onChange={handleChangeFileInput} accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf" multiple />
                </span>
                <button type="button" className="btn btn-primary ml-3 shadow" onClick={handleSendRequests}><i className="fa fa-paper-plane" aria-hidden="true"></i>{t("Send")}</button>
            </div>
        </div>
        </>
    )
}

export default ActionButtons
