import React from "react";
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal, Row, Col } from 'react-bootstrap';

const getFileName = () => {
    var file = document.getElementById('file-upload');
    const fileName = file.files[0].name;
    document.getElementById('file-name-upload').innerHTML = fileName;
}

function ApplyPositionModal(props) {
    return (
        <>
        <Modal size="lg" className='info-modal-common position-apply-modal' centered show={props.show} onHide={props.onHide}>
            <Modal.Header className='apply-position-modal' closeButton>
                <Modal.Title>Ứng tuyển</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div key={`inline-radio`} className="apply-option">
                        <Form.Check className="option-apply" inline label="Ứng tuyển" type={`radio`} id={`inline-radio-1`} name='optionApply' defaultChecked />
                        <Form.Check className="option-apply" inline label="Giới thiệu" type={`radio`} id={`inline-radio-2`} name='optionApply' />
                    </div>
                    <Form.Group as={Row} controlId="formHorizontalName">
                        <Form.Label column sm={3}>Họ và tên</Form.Label>
                        <Col sm={9}>
                        <Form.Control type="text" placeholder="Họ và tên" required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalEmail">
                        <Form.Label column sm={3}>Email</Form.Label>
                        <Col sm={9}>
                        <Form.Control type="email" placeholder="Email" required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPhone">
                        <Form.Label column sm={3}>Số điện thoại</Form.Label>
                        <Col sm={9}>
                        <Form.Control type="text" placeholder="Số điện thoại" required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="file-block">
                        <Form.Label column sm={3}>Tải lên CV</Form.Label>
                        <Col sm={9}>
                        <Form.Label htmlFor="file-upload" className="custom-file-upload" column sm={9}>
                            <i className="fa fa-cloud-upload"></i><span id="file-name-upload" className="file-name-upload">Chọn file ...</span>
                        </Form.Label>
                        </Col>
                        <Col sm={9}>
                            <Form.File
                            className="position-relative"
                            required
                            name="file"
                            label=""
                            id="file-upload"
                            onChange={getFileName}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalPassword">
                        <Form.Label column sm={3}>Ghi chú</Form.Label>
                        <Form.Control.Feedback>(Không bắt buộc)</Form.Control.Feedback>
                        <Col sm={9}>
                        <Form.Control as="textarea" rows="4" placeholder="Nhập ghi chú ..." />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 9, offset: 3 }} className="buttons-block">
                            <Button type="button" className="btn-close" onClick={props.onHide}>Hủy</Button>
                            <Button type="submit" className="btn-send">Nộp hồ sơ</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}
export default ApplyPositionModal;
