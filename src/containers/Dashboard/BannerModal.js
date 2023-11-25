import { useEffect, useState } from 'react'
import { Modal, Carousel } from "react-bootstrap"
import axios from 'axios'
import Constants from 'commons/Constants'
import IconClose from 'assets/img/icon/Icon_Close_Modal.svg'

const BannerModal = ({ isShow, banners = [], onHideModal }) => {
    const locale = localStorage.getItem("locale")
    const [idBannerSeen, setIdBannerSeen] = useState([])



    return (
        <Modal
            show={isShow}
            // onHide={() => false}
            className='banner-home-modal'
            backdrop="static" 
            keyboard={false}
        >
            <Modal.Body>
                <button className="btn-close" title='Close' onClick={onHideModal}><img src={IconClose} alt='Close' /></button>
                <div className='content'>
                {
                    banners?.length > 0 && (
                    <Carousel 
                        controls={false} 
                        indicators={false}
                        onSelect={(a, b) => {
                            console.log('aaaaaaaaaa => ', a)
                            console.log('bbbbbbbbbb => ', b)
                        }}
                        onSlide={(d, e) => {
                            console.log('ddddddddd => ', d)
                            console.log('eeeeeeeeee => ', e)
                        }}
                    >
                    {
                        (banners || []).map((banner, i) => (
                            <Carousel.Item interval={5000} key={i}>
                                <div className="d-flex justify-content-center image">
                                    <img
                                        src={locale === Constants.LANGUAGE_VI ? banner?.imageVi : banner?.imageEn} className="title"
                                        alt="Banner"
                                    />
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
