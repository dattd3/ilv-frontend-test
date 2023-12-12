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
import IconAttachment from 'assets/img/icon/ic_upload_attachment.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import UserInfo from "../common/UserInfo"
import FeedbackHistory from "../common/FeedbackHistory"
registerLocale("vi", vi)

const CreatedRequest = ({ isShow, masterData, onHide }) => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI

    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({
        title: '',
        content: '',
        typeId: null,
        isSecurity: false,
        companyCode: null,
        groupId: null,
        handlerId: null,
        receives: [],
        priorityId: null,
        statusId: null,
    })

    const handleFileChange = () => {

    }

    const sendRequest = () => {
         
    }

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

    console.log('masterData => ',masterData)

    const serviceTypes = (masterData?.serviceTypes || []).map(item => {
        return {
            value: item?.id,
            label: locale === Constants.LANGUAGE_VI ? item?.typeVn : item?.typeEn,
        }
    })

    const companies = (masterData?.companies || []).map(item => {
        return {
            value: item?.code,
            label: item?.name,
        }
    })

    const groups = (masterData?.groups || []).map(item => {
        return {
            value: item?.id,
            label: item?.groupName,
        }
    })

    const priorities = (masterData?.slas || []).map(item => {
        return {
            value: item?.id,
            label: item?.prioritize,
            groupId: item?.groupId,
        }
    })

    const statuses = (masterData?.statuses || []).map(item => {
        return {
            value: item?.id,
            label: locale === Constants.LANGUAGE_VI ? item?.statusVn : item?.statusEn,
        }
    })

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
                        <UserInfo />
                        <div className="request-info">
                            <h2>Thông tin yêu cầu</h2>
                            <div className="content-region shadow-customize">
                                <div className="title-block">
                                    <label>Tiêu đề</label>
                                    <input type="text" placeholder="Nhập" value={""} />
                                </div>
                                <div className="content-block">
                                    <label>Nội dung</label>
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
                                        <label>Loại</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={serviceTypes}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Bảo mật</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={[
                                                { value: true, label: 'Có' },
                                                { value: false, label: 'Không' },
                                            ]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Công ty</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={companies}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Nhóm</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={groups}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Người xử lý</label>
                                        <div className="val">annv2</div>
                                    </div>
                                    <div className="col">
                                        <label>Người cùng nhận thông tin</label>
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
                                        <label>Ưu tiên</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={priorities}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Trạng thái</label>
                                        <Select
                                            value={null}
                                            isClearable={false}
                                            onChange={handleInputChange}
                                            placeholder={t('Chọn')} 
                                            options={statuses}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                                <FeedbackHistory />
                            </div>
                        </div>
                        <div className="attachment">
                            <h2>Tệp đính kèm</h2>
                            <div className="content-region shadow-customize">
                                <span className="item"><span className="file-name">Điều chỉnh 1.docx</span><span>(129KB)</span><img src={IconClose} className="remove" alt="Close" /></span>
                                <span className="item"><span className="file-name">Điều chỉnh 1.docx</span><span>(129KB)</span><img src={IconClose} className="remove" alt="Close" /></span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end button-block">
                            <label htmlFor="i_files" className="btn btn-attachment">
                                <img src={IconAttachment} alt="Attachment" />
                                {t("AttachFile")}
                                <input
                                    id="i_files"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf"
                                    multiple
                                />
                            </label>
                            <button className="btn btn-send" onClick={sendRequest}><img src={IconSend} alt="Send" />{t("Send")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreatedRequest
