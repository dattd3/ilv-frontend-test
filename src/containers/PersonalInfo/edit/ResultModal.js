import React from "react";
import IconSuccess from '../../../assets/img/ic-success.svg';
import IconFailed from '../../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';

class ResultModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        const { show, title, message, isSuccess, onHide } = this.props

        return (
            <>
            <Modal className='info-modal-common position-apply-modal result-modal' centered show={show} onHide={onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrap-result">
                        <p className="text-center">{message}</p>
                        {isSuccess ? <Image src={IconSuccess} alt="Success" className="ic-status" /> : <Image src={IconFailed} alt="Success" className="ic-status" />}
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default ResultModal
