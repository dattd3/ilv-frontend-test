import React from "react"
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from "react-i18next"

const NoteModal = (props) => {
    const { t } = useTranslation()
    const { isShow, content, onHide } = props

    return (
        <Modal className="text-dark" centered show={isShow} onHide={onHide}>
            <Modal.Body className="rounded position-relative ot-info-modal-body">
                <div className="text-center font-weight-bold pb-2">
                    <div className="text-center">
                        <span className="icon-box-note position-absolute">
                            <i className="fas fa-info"></i>
                        </span>
                    </div>
                    {t("Note")}
                </div>
                <p>{ content }</p>
                <div className="text-center">
                    <Button className="btn-primary" onClick={onHide}>{t("OK")}</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NoteModal
