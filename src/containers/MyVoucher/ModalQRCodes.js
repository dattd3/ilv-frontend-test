import { useEffect } from 'react'
import { Modal, Carousel } from "react-bootstrap";
import IconClose from 'assets/img/icon/icon_x.svg'

const ModalQRCodes = ({ isShowModal, listQRs = [], onHideModal }) => {

    // useEffect(() => {

    // }, [isShowModal])

    return (
        <Modal
            show={isShowModal}
            // onHide={() => false}
            className='qr-codes-modal'
            backdrop="static" 
            keyboard={false}
        >
            <Modal.Body className='rounded'>
                <button className="btn-close" title='Close' onClick={onHideModal}><img src={IconClose} alt='Close' /></button>
                <div className='content'>
                {
                    listQRs?.length > 0 && (
                    <Carousel>
                    {
                        (listQRs || []).map((ele, i) => (
                            <Carousel.Item interval={9000} key={i}>
                                <div className="d-flex justify-content-center flex-column qr-item">
                                    <div className="d-flex justify-content-center image">
                                        <img
                                            src={ele?.image}
                                            alt="QR"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center code">{ele?.code}</div>
                                </div>
                            </Carousel.Item>
                        ))
                    }
                    </Carousel>
                    )
                }
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalQRCodes
