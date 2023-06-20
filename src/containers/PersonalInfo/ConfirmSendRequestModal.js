import React, { useState, useEffect } from "react"
import { Form, Button, Col, Modal } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import { useTranslation } from "react-i18next"
import IconX from 'assets/img/icon/icon_x.svg';
import './styles.scss';

const ConfirmSendRequestModal = ({ isShow, sendRequest, onHide }) => {
    const { t } = useTranslation()
    const [note, SetNote] = useState('')

    const disabledSubmitButton = false

    useEffect(() => {
        if (!isShow) {
            SetNote('')
        }
    }, [isShow])

    const handleInputChange = e => {
        SetNote(e?.target?.value || '')
    }

    const handleCancel = () => {
        SetNote('')
        onHide()
    }

    const triggerSendRequest = e => {
        e.preventDefault()
        sendRequest(note)
    }

    return (
        <Modal className='modal-confirm-send-request' centered show={isShow} onHide={onHide}>
            <Modal.Header className='modal-confirm-send-request__header'>
                <p className='modal-confirm-send-request__title font-weight-bold text-uppercase'>{t("Xác nhận gửi yêu cầu")}</p>
                <img
                    src={IconX}
                    className='mr-1 cursor-pointer icon-delete'
                    onClick={onHide}
                />
            </Modal.Header>
            <Modal.Body className='modal-confirm-send-request__body'>
                <div className="content">
                    <Form onSubmit={e => triggerSendRequest(e)}>
                        <Form.Row>
                            <Col xs={12}><Form.Label className="modal-confirm-send-request__textlabel">{t("Thêm ghi chú")}</Form.Label></Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={12}><Form.Control as="textarea" placeholder="Nhập" rows={3} value={note || ''} onChange={handleInputChange} /></Col>
                             <Col xs={12} style={{ marginTop: 15 }}>
                                <div className="btn-block d-flex justify-content-end">
                                    <Button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={disabledSubmitButton}>
                                    { t("Hủy") }
                                    </Button>
                                    <Button type="submit" className="btn btn-submit" disabled={disabledSubmitButton}>
                                    { t("accept") }
                                    </Button>
                                </div>
                            </Col>
                        </Form.Row>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ConfirmSendRequestModal
