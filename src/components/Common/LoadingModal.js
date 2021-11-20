import React from "react";
import logo from '../../assets/img/myvp-logo.png';
import { Modal, Spinner } from 'react-bootstrap';

function LoadingModal(props) {
    const { show, content, isloading = true } = props;
    return (
        <Modal centered show={show} onHide={() => { return; }}>
            <Modal.Body className='text-center no-bg'>
                {isloading ? <Spinner animation="border" variant="light" size='lg' /> : null}
                {content ? <p className='loading-note'>{content}</p> : ''}
            </Modal.Body>
        </Modal>
    );
}
export default LoadingModal;