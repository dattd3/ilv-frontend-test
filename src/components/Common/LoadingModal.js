import React from "react";
import { Modal, Image } from 'react-bootstrap';
import IconLoading from '../../assets/img/icon/ic-loading.gif';

function LoadingModal(props) {
    const { show, content, isloading = true } = props;
    return (
        <Modal show={show} onHide={() => { return; }} className='dialog-loading' backdropClassName="dialog-loading2" dialogClassName="modal-loading">
            <Modal.Body className='text-center no-bg'>
                {isloading && <Image src={IconLoading} alt='Loading' />}
                {/* {content ? <p className='loading-note'>{content}</p> : ''} */}
            </Modal.Body>
        </Modal>
    );
}

export default LoadingModal;
