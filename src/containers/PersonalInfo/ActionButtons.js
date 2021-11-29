import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { formatStringByMuleValue } from "../../commons/Utils"

function ActionButtons(props) {
    const { t } = useTranslation()
    const { relationships } = props
    const [files, SetFiles] = useState([])

    const handleChangeFileInput = e => {
        const files = Object.values(e.target.files)
        let fileStates = [...files]
        fileStates = fileStates.concat(files)
        SetFiles(fileStates)
    }

    const removeFiles = index => {
        let fileStates = [...files]
        const filesValid = fileStates.filter((item, i) => i !== index)
        SetFiles(filesValid)
    }

    const handleSendRequests = () => {
        props.sendRequests()
    }

    return (
        <div className="block-button-actions">
            <span className="btn-action btn-attachment">
                <label htmlFor="i_files" className="custom-file-upload">
                    {/* <Image src={IconAttachment} alt="Đính kèm" className="ic-action ic-attachment" />Đính kèm tài liệu */}
                    <i className="fas fa-paperclip"></i>Đính kèm tệp tin
                </label>
                <input id="i_files" type="file" name="i_files" onChange={handleChangeFileInput} multiple />
            </span>
            {/* <input type="file" hidden ref={this.inputReference} id="file-upload" onChange={handleChangeFileInput} multiple />
            <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> {t("AttachmentFile")}</button> */}
            <button type="button" className="btn btn-primary ml-3 shadow" onClick={handleSendRequests}><i className="fa fa-paper-plane" aria-hidden="true"></i>{t("Send")}</button>
        </div>
    )
}

export default ActionButtons
