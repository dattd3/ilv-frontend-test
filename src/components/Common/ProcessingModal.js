import React from "react"
import { Modal, Image } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import IconLoading from "assets/img/icon/ic_long_loading.gif"

function ProcessingModal({ isShow }) {
    const { t } = useTranslation()

    return (
        <>
            <Modal
                className="processing-modal"
                centered
                show={isShow}
                onHide={() => { return }}
                // backdrop={false}
            >
                <Modal.Body className="text-center">
                    <Image src={IconLoading} alt="Success" className="ic-status" />
                    <p className="processing font-weight-bold">{t("WaitProcessing")}</p>
                    <div className="process-wait">{t("WaitProcessingContentMessage")}...</div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ProcessingModal
