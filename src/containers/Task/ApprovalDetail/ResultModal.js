import React from "react";
import purify from "dompurify"
import IconSuccess from '../../../assets/img/ic-success.svg';
import IconFailed from '../../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';

class ResultModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        return (
            <>
            <Modal className='info-modal-common position-apply-modal result-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center" dangerouslySetInnerHTML={{
                        __html: purify.sanitize(this.props?.message || ''),
                    }}></p>
                    <div className="wrap-result">
                        {this.props.isSuccess ? <Image src={IconSuccess} alt="Success" className="ic-status" /> : <Image src={IconFailed} alt="Success" className="ic-status" />}
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default ResultModal
