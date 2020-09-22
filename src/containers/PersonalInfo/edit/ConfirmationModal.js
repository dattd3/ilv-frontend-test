import React from "react";
import { Modal } from 'react-bootstrap';

class ConfirmationModal extends React.Component {
    constructor(props) {
        super();
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
                    <div>
                        <textarea className="form-control" id="note" rows="4"></textarea>
                    </div>
                    <div className="clearfix">
                        <button type="button" className="btn btn-primary w-25 float-right">Có</button>
                        <button type="button" className="btn btn-secondary mr-2 w-25 float-right" onClick={this.props.onHide}>Không</button>
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default ConfirmationModal
