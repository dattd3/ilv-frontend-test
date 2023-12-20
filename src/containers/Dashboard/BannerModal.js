import { Modal, Carousel } from "react-bootstrap"
import Constants from 'commons/Constants'
import IconClose from 'assets/img/icon/Icon_Close_Modal.svg'

const BannerModal = ({ isShow, banners = [], onHideModal }) => {
    const locale = localStorage.getItem("locale")

    return (
        <Modal
            show={isShow}
            backdrop="static"
            keyboard={false}
            className='banner-home-modal'
        >
            <Modal.Body>
                <button className="btn-close" title='Close' onClick={onHideModal}><img src={IconClose} alt='Close' /></button>
                <div className='content'>
                {
                    banners?.length > 0 && (
                        <Carousel 
                            controls={false} 
                        >
                        {
                            (banners || []).map((banner, i) => (
                                <Carousel.Item interval={3000} key={i}>
                                    <div className="d-flex justify-content-center image">
                                        <a href={`/my-voucher/notices/${banner?.id}`}>
                                            <img
                                                src={locale === Constants.LANGUAGE_VI ? (banner?.imageVi || banner?.imageEn) : (banner?.imageEn || banner?.imageVi)} className="title"
                                                alt="Banner"
                                            />
                                        </a>
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

export default BannerModal
