import React from "react";
import { Modal, Row, Col } from 'react-bootstrap';

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            
        }
      }


    render () {
        return (
            <>
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>Xác nhận gửi yêu cầu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Thêm ghi chú (không bắt buộc)</p>
                    <p>
                        <textarea class="form-control" id="note" rows="4"></textarea>
                    </p>
                    <p className="clearfix">
                        <button type="button" class="btn btn-primary w-25 float-right">Có</button>
                        <button type="button" class="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide}>Không</button>
                    </p>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}
export default ConfirmationModal
