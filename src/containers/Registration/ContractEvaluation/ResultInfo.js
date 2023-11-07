import React from "react";
import IconSuccess from '../../../assets/img/ic-success.svg';
import IconFailed from '../../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';
import './styles.scss'

function ResultInfo(props) {
    
    const processOkButton = () => {
        props.onHide();
    }

    return (
        <>
            <Modal className='create-salary-modal' centered show={props.show} onHide={props.onHide}>
                <Modal.Header>
                    <div className="header-contain">
                    <span className="sigle-text-header">{props.title || ''}</span>
                    {/* <span className="ic-close"><i className='fas fa-times ic-action ic-accept mr-2'></i></span> */}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="block-input">
                        <label className="label">{props.content}</label>
                    </div>
                    <div className="action-block">
                        <span className="btn-action btn-accept" onClick={processOkButton}>
                            <span>{props.t("OK")}</span>
                        </span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ResultInfo;
