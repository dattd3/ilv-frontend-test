import React from "react"
import IconLoading from "assets/img/icon/ic_long_loading.gif"
import { Modal, Image } from "react-bootstrap"

function ProcessingModal({ isShow }) {
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
                    <p className="processing font-weight-bold">Đang chờ xử lý</p>
                    <div className="process-wait">Dữ liệu đang được xử lý. Vui lòng chờ trong giây lát...</div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ProcessingModal
