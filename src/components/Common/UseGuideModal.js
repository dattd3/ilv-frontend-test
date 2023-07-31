import React from "react"
import { Modal, FormControl } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import IconSearch from "assets/img/icon/icon-search.svg"
import IconCloseModal from "assets/img/icon/Icon_Close_Modal.svg"
import IconRedEye from "assets/img/icon/icon-red-eye.svg"
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg"

export default function UseGuideModal({ show, onHide }) {
  const {t} = useTranslation();

  return <Modal backdrop="static" 
    keyboard={false}
    className='use-guide-modal'
    centered show={show}
    onHide={onHide}
    dialogClassName="use-guide-dialog-modal"
  >
    <Modal.Body>
      <div className="title position-relative">
        THAO TÁC SỬ DỤNG HỆ THỐNG
        <img src={IconCloseModal} alt="" className="icon-close" onClick={onHide} />
      </div>
      <div className="body">
      <div className="flex-1 position-relative">
        <img src={IconSearch} alt="" className="icon-prefix-select" />
        <FormControl
            placeholder="Tìm kiếm theo tên tính năng"
            className="search-input"
            // onChange={this.handleInputChange}
        />
        <div className="content-table">
          <div className="content-header mb-15">
            <div className="content-col-1">
              <b>STT</b>
            </div>
            <div className="content-col-2">
              <b>Tên tính năng</b>
            </div>
            <div className="content-col-3">
              <b>Website</b>
            </div>
            <div className="content-col-4">
              <b>Mobile</b>
            </div>
          </div>
          <div className="content-item mb-15">
            <div className="content-col-1">
              1
            </div>
            <div className="content-col-2">
              <div>
                <b>Yêu cầu thay dổi phân ca</b>
              </div>
              <div>
                Ngày cập nhật: 12/02/2023
              </div>
            </div>
            <div className="content-col-3">
              <div className="cursor-pointer">
                <img src={IconRedEye} alt="" />&nbsp;&nbsp;
                Xem file
              </div>
              <div className="cursor-pointer">
                <img src={IconBluePlay} alt="" />&nbsp;&nbsp;
                Xem video
              </div>
            </div>
            <div className="content-col-4">
              <div className="cursor-pointer">
                <img src={IconRedEye} alt="" />&nbsp;&nbsp;
                Xem file
              </div>
              <div className="cursor-pointer">
                <img src={IconBluePlay} alt="" />&nbsp;&nbsp;
                Xem video
              </div>
            </div>
          </div>
        </div>
    </div> 
      </div>
    </Modal.Body>
  </Modal>
}