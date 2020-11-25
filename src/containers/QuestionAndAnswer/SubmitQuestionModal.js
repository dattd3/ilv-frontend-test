import React from "react"
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import { Modal, Image, Form, Button } from 'react-bootstrap'

class SubmitQuestionModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        return (
            <Modal backdrop="static" keyboard={false} className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>ĐẶT CÂU HỎI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-result text-left">
                        <Form.Group controlId="submitQuestionForm.QuestionCategoryID">
                            <Form.Label>Nhóm câu hỏi</Form.Label>
                            <Form.Control as="select">
                              <option>1</option>
                              <option>2</option>
                              <option>3</option>
                              <option>4</option>
                              <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="submitQuestionForm.QuestionContent">
                            <Form.Label>Nội dung câu hỏi</Form.Label>
                            <Form.Control type="text" placeholder="Nội dung câu hỏi" />
                        </Form.Group>
                        <Form.Group controlId="submitQuestionForm.CBQL">
                            <Form.Label>CBQL trực tiếp</Form.Label>
                            <Form.Control type="text" placeholder="Huy Như" readOnly />
                        </Form.Group>
                        <Form.Group controlId="submitQuestionForm.Title">
                            <Form.Label>Chức danh</Form.Label>
                            <Form.Control type="text" placeholder="Trưởng Phòng" readOnly />
                        </Form.Group>
                        <Form.Group controlId="submitQuestionForm.Department">
                            <Form.Label>Khối/ Phòng/ Bộ phận</Form.Label>
                            <Form.Control type="text" placeholder="CNTT" readOnly />
                        </Form.Group>
                    </div>
                    <div className="clearfix edit-button text-right">
                        <Button variant="secondary" className="pr-4 pl-4" onClick = {this.props.onHide}>Hủy</Button>{' '}
                        <Button variant="primary" className="pr-4 pl-4">Gửi</Button>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default SubmitQuestionModal
