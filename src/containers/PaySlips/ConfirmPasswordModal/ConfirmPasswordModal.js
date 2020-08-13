import React from "react";
import { Form, Button, Col, Modal } from 'react-bootstrap';

function ConfirmPasswordModal(props) {
    return (
        <Modal className='confirm-password-modal' centered show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row>
                        <Col xs={12}><Form.Label className="label">Nhập mật khẩu để xem bảng lương</Form.Label></Col>
                    </Form.Row>
                    <Form.Row>
                        <Col xs={9}><Form.Control placeholder="Nhập mật khẩu" type="password" /></Col>
                        <Col xs={3}><Button type="submit" className="mb-3 btn-submit">Xác nhận</Button></Col>
                    </Form.Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ConfirmPasswordModal;
