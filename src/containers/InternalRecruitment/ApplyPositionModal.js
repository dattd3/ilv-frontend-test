import React, {useState} from "react";
import IconSuccess from '../../assets/img/ic-success.svg';
import IconFailed from '../../assets/img/ic-failed.svg';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal, Row, Col } from 'react-bootstrap';

function ApplyPositionModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
        <Modal size="lg" className='info-modal-common position-apply-modal' centered show={props.show} onHide={handleClose}>
            <Modal.Header className='apply-position-modal' closeButton>
                <Modal.Title>Ứng tuyển</Modal.Title>
            </Modal.Header>
            <Modal.Body className=''>
                <Form>
                    <div key={`inline-radio`} className="apply-option">
                        <Form.Check inline label="Ứng tuyển" type={`radio`} id={`inline-radio-1`} name='optionApply' />
                        <Form.Check inline label="Giới thiệu" type={`radio`} id={`inline-radio-2`} name='optionApply' />
                    </div>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={2}>Họ và tên</Form.Label>
                        <Col sm={10}>
                        <Form.Control type="email" placeholder="Email" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>Email</Form.Label>
                        <Col sm={10}>
                        <Form.Control type="password" placeholder="Password" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2}>Số điện thoại</Form.Label>
                        <Col sm={10}>
                        <Form.Control type="text" placeholder="" />
                        </Col>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label column sm={2}>Tải lên CV</Form.Label>
                        <Col sm={10}>                  
                            <Form.File
                            className="position-relative"
                            required
                            name="file"
                            label=""
                            id="validationFormik107"
                            feedbackTooltip
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={2} isValid>Ghi chú</Form.Label>
                        <Form.Control.Feedback type="valid">(Không bắt buộc)</Form.Control.Feedback>
                        <Col sm={10}>
                        <Form.Control as="textarea" rows="3" placeholder="Nhập ghi chú ..." />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Sign in</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}
export default ApplyPositionModal;
