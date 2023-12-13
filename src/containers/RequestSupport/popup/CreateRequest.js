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
import { validateFileMimeType, validateTotalFileSize } from "utils/file"
import Editor from "components/Forms/Editor"
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
    const [files, setFiles] = useState([])

    const handleFileChange = (e) => {
        if (validateFileMimeType(e, e?.target?.files, t)) {
            const filesSelected = Object.values(e?.target?.files)
            const fileClone = [...files, ...filesSelected];
            if (validateTotalFileSize(e, fileClone, t)) {
                setFiles(fileClone)
            }
        }
    }

    const sendRequest = () => {
         
    }

    const handleInputChange = (key, e) => {
        let val = null
        switch (key) {
            case 'title':
                val = e?.target?.value || ''
                break
            case 'content':
                val = e || ''
                break
            case 'typeId':
            case 'isSecurity':
            case 'companyCode':
            case 'groupId':
            case 'priorityId':
            case 'statusId':
                val = e?.value || null
                break
            case 'receives':
                val = e || []
                break
        }

        setData((data) => ({
            ...data,
            [key]: val,
        }))
    }

    const handleRemoveFile = (index) => {

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

    const priorities = (masterData?.slas || [])
    .filter(item => item?.groupId == data?.groupId)
    .map(item => {
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

    const securities = [
        { value: true, label: 'Có' },
        { value: false, label: 'Không' },
    ]

    console.log('TING TING => ', files)

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
                                    <input type="text" placeholder="Nhập" onChange={e => handleInputChange('title', e)} value={data?.title || ''} />
                                </div>
                                <div className="content-block">
                                    <label>Nội dung</label>
                                    <Editor
                                        data={data?.content || ""}
                                        onChange={(e, editor) => {
                                            handleInputChange('content', editor?.getData())
                                        }}
                                        // disabled={isReadOnly || false}
                                    />
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Loại</label>
                                        <Select
                                            value={(serviceTypes || []).find(item => item?.value == data?.typeId)}
                                            isClearable={true}
                                            onChange={e => handleInputChange('typeId', e)}
                                            placeholder={t('Chọn')} 
                                            options={serviceTypes}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Bảo mật</label>
                                        <Select
                                            value={(securities || []).find(item => item?.value == data?.isSecurity)}
                                            isClearable={false}
                                            onChange={e => handleInputChange('isSecurity', e)}
                                            placeholder={t('Chọn')} 
                                            options={securities}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Công ty</label>
                                        <Select
                                            value={(companies || []).find(item => item?.value == data?.companyCode)}
                                            isClearable={true}
                                            onChange={e => handleInputChange('companyCode', e)}
                                            placeholder={t('Chọn')} 
                                            options={companies}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Nhóm</label>
                                        <Select
                                            value={(groups || []).find(item => item?.value == data?.groupId)}
                                            isClearable={true}
                                            onChange={e => handleInputChange('groupId', e)}
                                            placeholder={t('Chọn')} 
                                            options={groups}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Người xử lý</label>
                                        <div className="val">{data?.handlerId || ''}</div>
                                    </div>
                                    <div className="col">
                                        <label>Người cùng nhận thông tin</label>
                                        <Select
                                            value={null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('receives', e)}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Ưu tiên</label>
                                        <Select
                                            value={(priorities || []).find(item => item?.value == data?.priorityId)}
                                            isClearable={true}
                                            onChange={e => handleInputChange('priorityId', e)}
                                            placeholder={t('Chọn')} 
                                            options={priorities}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Trạng thái</label>
                                        <Select
                                            value={(statuses || []).find(item => item?.value == data?.statusId)}
                                            isClearable={true}
                                            onChange={e => handleInputChange('statusId', e)}
                                            placeholder={t('Chọn')} 
                                            options={statuses}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                                {/* <FeedbackHistory /> */}
                            </div>
                        </div>
                        <div className="attachment">
                            <h2>Tệp đính kèm</h2>
                            <div className="content-region shadow-customize">
                                {
                                    (files || []).map((file, index) => {
                                        return (
                                            <span className="item">
                                                <span className="file-name">{file?.name}</span>
                                                <span>({file?.size * 0.001}KB)</span>
                                                <img src={IconClose} className="remove" alt="Close" onClick={() => handleRemoveFile(index)} />
                                            </span>
                                        )
                                    }
                                )}
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
