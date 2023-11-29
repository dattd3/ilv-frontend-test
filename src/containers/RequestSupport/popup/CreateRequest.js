import React, { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import IconClose from 'assets/img/icon/icon_x.svg'
import IconSend from 'assets/img/icon/Icon_send.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const CreatedRequest = (props) => {
    const { isShow, onHide } = props
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [isShowFilter, setIsShowFilter] = useState(false)

    const handleInputChange = () => {

    }

    const listRequests = [{}, {}, {}, {}, {}, {}]

    const classIndexMapping = {
        0: 'new',
        1: 'processing',
        2: 'paused',
        3: 'cancelled',
        4: 'processed',
        5: 'closed',
    }

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: 35,
            padding: '0 10px'
        }),
        input: (provided, state) => ({
            ...provided,
            margin: 0,
        }),
        indicatorSeparator: (prevStyle, state) => ({
            display: 'none'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: 35,
        }),
    }

    const customFilterStyles = {
        control: base => ({
            ...base,
            height: 30,
            minHeight: 30
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: 30,
            padding: '0 5px'
        }),
        input: (provided, state) => ({
            ...provided,
            margin: 0,
        }),
        indicatorSeparator: (prevStyle, state) => ({
            display: 'none'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: 30,
        }),
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <Modal
                show={isShow}
                onHide={onHide}
                className="create-request-modal"
            >
                <Modal.Body className='rounded'>
                    <div className="header">
                        <span className="close" onClick={onHide}><img src={IconClose} alt="Close" /></span>
                    </div>
                    <div className='content'>
                        <div className="user-info">
                            <h2>Thông tin CBNV tạo yêu cầu</h2>
                            <div className="d-flex content-region shadow-customize">
                                <div className="col-item full-name">
                                    <label>Họ và tên</label>
                                    <div className="val">Trần Tuấn Anh</div>
                                </div>
                                <div className="col-item employee-code">
                                    <label>Mã nhân viên</label>
                                    <div className="val">3651641</div>
                                </div>
                                <div className="col-item employee-ad">
                                    <label>Mã AD</label>
                                    <div className="val">anhnt35</div>
                                </div>
                                <div className="col-item view-more">
                                    <label>&nbsp;</label>
                                    <div className="val btn">Xem thêm</div>
                                </div>
                            </div>
                        </div>
                        <div className="request-info">
                            <h2>Thông tin yêu cầu</h2>
                            <div className="content-region shadow-customize">
                                <div className="title-block">
                                    <label>Tiêu đề</label>
                                    <input type="text" placeholder="Nhập" value={""} />
                                </div>
                                <div className="content-block">
                                    <label>Tiêu đề</label>
                                    <textarea 
                                        rows={5} 
                                        placeholder={'Nhập'} 
                                        value={""} 
                                        onChange={handleInputChange} 
                                        // disabled={isDisableManagerComment} 
                                    />
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <lable>Loại</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <lable>Bảo mật</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <lable>Công ty</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <lable>Nhóm</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <lable>Người xử lý</lable>
                                        <div className="val">annv2</div>
                                    </div>
                                    <div className="col">
                                        <lable>Người cùng nhận thông tin</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <lable>Ưu tiên</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <lable>Trạng thái</lable>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="attachment">
                            <h2>Tệp đính kèm</h2>
                            <div className="content-region shadow-customize">
                                <span className="item"><span className="file-name">Điều chỉnh 1.docx</span><span>(129KB)</span><img src={IconClose} className="remove" alt="Close" /></span>
                                <span className="item"><span className="file-name">Điều chỉnh 1.docx</span><span>(129KB)</span><img src={IconClose} className="remove" alt="Close" /></span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end button">
                            <button className="btn btn-attachment">Đính kèm tệp tin</button>
                            <button className="btn btn-send"><img src={IconSend} alt="Send" />Gửi yêu cầu</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreatedRequest
