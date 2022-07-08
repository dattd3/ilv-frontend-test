import React from "react";
import IconSuccess from '../../../assets/img/ic-success.svg';
import IconFailed from '../../../assets/img/ic-failed.svg';
import { Modal, Image } from 'react-bootstrap';
import './styles.scss'

function SalaryModal(props) {
    
    const processOkButton = () => {
        props.onAccept();
    }

    const processCancelButton = (e) => {
        props.onHide();

    }

    return (
        <>
            <Modal className='create-salary-modal' centered show={props.show} onHide={props.onHide}>
                <Modal.Header>
                    <div className="header-contain">
                    <span className="sigle-text-header">{'Thực hiện đánh giá CBNV thành công!'}</span>
                    {/* <span className="ic-close"><i className='fas fa-times ic-action ic-accept mr-2'></i></span> */}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="block-input">
                        <label className="label">{'Bạn có muốn đề xuất điều chỉnh lương cho CBNV không?'}</label>
                    </div>
                    <div className="action-block">
                        <span className="btn-action btn-reset" onClick={processCancelButton}>
                            <i className='fas fa-times ic-action ic-reset mr-2'></i>
                            <span>Không</span>
                        </span>
                        <span className="btn-action btn-accept" onClick={processOkButton}>
                            <i className='fas fa-check ic-action ic-accept mr-2'></i>
                            <span>Đồng ý</span>
                        </span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SalaryModal;
