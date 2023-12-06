import { useState } from "react"
import { Modal, Carousel } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import IconClose from 'assets/img/icon/icon_x.svg'

const ModalQRCodes = ({ isShowModal, listQRs = [], onHideModal }) => {
    const { t } = useTranslation()
    const [carouselControl, SetCarouselControl] = useState({
        showPrev: true,
        showNext: true,
    })

    return (
        <Modal
            show={isShowModal}
            onHide={onHideModal}
            className='qr-codes-modal'
        >
            <Modal.Body className='rounded'>
                <button className="btn-close" title='Close' onClick={onHideModal}><img src={IconClose} alt='Close' /></button>
                <div className='content'>
                {
                    listQRs?.length > 0 
                    ? (
                        <Carousel 
                            interval={null} 
                            indicators={false}
                            onSlide={(eventKey) => {
                                const carouselControlClone = {...carouselControl}

                                SetCarouselControl(carouselControlClone)
                            }}
                            // prevLabel={""}
                            // prevIcon={""}
                            // nextIcon={""}
                            // nextLabel={""}
                            // controls={false}
                        >
                        {
                            (listQRs || []).map((ele, i) => (
                                <Carousel.Item key={i}>
                                    <div className="d-flex justify-content-center flex-column qr-item">
                                        <div className="d-flex justify-content-center image">
                                            <img
                                                src={`data:image/png;base64,${ele?.qrCode}`}
                                                alt="QR"
                                                className='qr-image'
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center code">{ele?.code}</div>
                                        <div className="d-flex justify-content-center time">HSD: <span className="font-weight-bold">{moment(ele?.validFrom).format("DD/MM/YYYY")} - {moment(ele?.validTo).format("DD/MM/YYYY")}</span></div>
                                    </div>
                                </Carousel.Item>
                            ))
                        }
                        </Carousel>
                    )
                    : (<div className="alert alert-danger data-not-found">{t("NoDataFound")}</div>)
                }
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalQRCodes
