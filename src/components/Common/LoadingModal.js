import React from "react";
import logo from '../../assets/img/myvp-logo.png';
import { Modal, Spinner } from 'react-bootstrap';

function LoadingModal(props) {
    const { show, content } = props;
    return (
        <Modal centered show={show} onHide={() => { return; }}>
            <Modal.Body className='text-center no-bg'>
                <Spinner animation="border" variant="light" size='lg' />
                {content ? <p className='loading-note'>{content}</p> : ''}
            </Modal.Body>
        </Modal>
    );
}
export default LoadingModal;