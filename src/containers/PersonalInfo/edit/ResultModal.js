import React from "react";
import { Modal } from 'react-bootstrap';

class ResultModal extends React.Component {
    constructor(props) {
        super();
    }

    render () {
        return (
            <>
            <Modal className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.props.message}</p>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default ResultModal
