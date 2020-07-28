import React, {useState} from "react";
import IconSuccess from '../../assets/img/ic-success.svg';
import IconFailed from '../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';

function InfoModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <>
        <Modal className='info-modal-common' centered show={props.show} onHide={handleClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className='text-center'>
                {props.content ? <p className='description'>{props.content}</p> : ''}
                {props.isSuccess ? <Image src={IconSuccess} alt="Success" className="ic-status" /> : <Image src={IconFailed} alt="Success" className="ic-status" />}
            </Modal.Body>
        </Modal>
        </>
    );
}

export default InfoModal;
