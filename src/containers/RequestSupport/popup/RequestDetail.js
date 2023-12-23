import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import purify from "dompurify"
import { useGuardStore } from 'modules'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import { validateFileMimeType, validateTotalFileSize } from "utils/file"
import Editor from "components/Forms/Editor"
import UserInfo from "../common/UserInfo"
import FeedbackHistory from "../common/FeedbackHistory"
import StatusModal from 'components/Common/StatusModal'
import LoadingModal from 'components/Common/LoadingModal'
import IconClose from 'assets/img/icon/icon_x.svg'
import IconSend from 'assets/img/icon/Icon_send.svg'
import IconAttachment from 'assets/img/icon/ic_upload_attachment.svg'
import IconSendBlue from 'assets/img/icon/icon-send.svg'
import IconAttachmentBlue from 'assets/img/icon/ic_upload_attachment_blue.svg'

import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const RequestDetail = ({ isShow , id, masterData, onHide }) => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [requestDetail, setRequestDetail] = useState(null)
    const [feedbacks, setFeedbacks] = useState({
        data: [],
        total: 0,
    })
    const [feedbackFiles, setFeedbackFiles] = useState([])

    const data = {}

    const [statusModal, setStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
        needReload: true
    })

    useEffect(() => {
        const fetchAllDataModal = async () => {
            try {
                setIsLoading(true)
                const getRequestDetail = axios.get(`${process.env.REACT_APP_REQUEST_URL}api/support/detail/${id}`, getRequestConfigurations())
                const getFeedbackList = axios.get(`${process.env.REACT_APP_REQUEST_URL}api/support/feedback/${id}`, getRequestConfigurations())

                const [responseRequestDetail, responseFeedbackList] = await Promise.allSettled([getRequestDetail, getFeedbackList])
                setRequestDetail(responseRequestDetail?.value?.data?.data)
                setFeedbacks({
                    data: responseFeedbackList?.value?.data?.data?.datas || [],
                    total: responseFeedbackList?.value?.data?.data?.totalRecord || 0,
                })
            } catch (error) {

            } finally {
                setIsLoading(false)
            }
        }

        isShow && fetchAllDataModal()
    }, [isShow])

    const handleFileChange = (e) => {
        if (validateFileMimeType(e, e?.target?.files, t)) {
            const filesSelected = Object.values(e?.target?.files)
            const fileClone = [...feedbackFiles, ...filesSelected];
            if (validateTotalFileSize(e, fileClone, t)) {
                setFeedbackFiles(fileClone)
            }
        }
    }

    const sendRequest = async () => {
        const statusModalTemp = { ...statusModal }
        setIsLoading(true)
        try {
            let formData = new FormData()
            formData.append('id', 0)
            formData.append('name', data?.title || '')
            formData.append('userId', user?.email || '')
            formData.append('userInfo', JSON.stringify({
                employeeCode: user?.employeeNo || '',
                ad: user?.ad || '',
                fullName: user?.fullName || '',
                phoneNumber: user?.cell_phone_no || '',
                pnlEmail: user?.plEmail || '',
                jobTitle: user?.jobTitle || '',
                department: user?.department || '',
            }))
            formData.append('contents', data?.content || '')
            // formData.append('handlerId', null)
            // formData.append('handlerInfo', null)
            formData.append('companyCode', data?.companyCode || null)
            formData.append('groupId', data?.groupId || null)
            // formData.append('causesCsId', null)
            // formData.append('causesVsId', null)
            // formData.append('typeId', null)
            formData.append('security', data?.isSecurity || false)
            formData.append('slaId', data?.priorityId)
            formData.append('statusId', data?.statusId)
            // formData.append('statusNotes', '')
            formData.append('serviceTypeId', data?.typeId)
            // formData.append('levelId', null)
            // formData.append('categoryId', null)
            // formData.append('categorySubId', null)
            // formData.append('categorySubItemId', null)
            // formData.append('receives', null)
            for (let key in feedbackFiles) {
                formData.append('files', feedbackFiles[key])
            }

            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/update`, formData, config)
            statusModalTemp.isShow = true
            statusModalTemp.needReload = false
            if (response?.data) {
                const result = response.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                    statusModalTemp.content = "Gửi yêu cầu thành công!"
                    statusModalTemp.needReload = true
                } else {
                    statusModalTemp.isSuccess = false
                    statusModalTemp.content = result?.message
                }
            } else {
                statusModalTemp.isSuccess = false
                statusModalTemp.content = "Đã có lỗi xảy ra. Xin vui lòng thử lại!"
            }
            setStatusModal(statusModalTemp)
        } catch (e) {
            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = e?.response?.data?.result?.message || t("AnErrorOccurred")
            statusModalTemp.needReload = false
            setStatusModal(statusModalTemp)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (key, e) => {
        const obj = {}
        switch (key) {
            case 'title':
                obj[key] = e?.target?.value || ''
                break
            case 'content':
                obj[key] = e || ''
                break
            case 'typeId':
            case 'isSecurity':
            case 'priorityId':
            case 'statusId':
                obj[key] = e?.value || null
                break
            case 'companyCode':
                obj[key] = e?.value || null
                obj.groupId = null
                break
            case 'groupId':
                obj[key] = e?.value || null
                obj.priorityId = null
                obj.companyCode = (masterData?.companies || []).find(item => item?.code === e?.companyCode)?.code || null
                break
            case 'receives':
                obj[key] = e || []
                break
        }

        setData((data) => ({
            ...data,
            ...obj
        }))
    }

    const handleRemoveFile = (index) => {
        const fileClone = [...feedbackFiles]
        fileClone.splice(index, 1)
        setFeedbackFiles(fileClone)
    }

    const onHideStatusModal = () => {
        setStatusModal({
            isShow: false,
            isSuccess: true,
            content: "",
            needReload: true
        })

        if (statusModal?.needReload) {
            window.location.reload()
        }
    }

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

    const groups = (masterData?.groups || [])
    .map(item => {
        return {
            value: item?.id,
            label: item?.groupName,
            companyCode: item?.companyCode,
        }
    })

    const priorities = (masterData?.slas || [])
    .filter(item => item?.groupId == data?.groupId)
    .map(item => {
        return {
            value: item?.id,
            label: locale === Constants.LANGUAGE_VI ? item?.prioritizeVn : item?.prioritizeEn,
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
        { value: false, label: 'Không' },
        { value: true, label: 'Có' },
    ]

    console.log('requestDetail => ', requestDetail)

    return (
        <>
            <LoadingModal show={isLoading} />
            <StatusModal 
                show={statusModal.isShow} 
                isSuccess={statusModal.isSuccess} 
                content={statusModal.content} 
                className="common-status-modal"
                onHide={onHideStatusModal} 
            />
            <Modal
                show={isShow}
                onHide={onHide}
                className="request-detail-modal"
            >
                <Modal.Body className='rounded'>
                    <div className="header">
                        <span className="close" onClick={onHide}><img src={IconClose} alt="Close" /></span>
                    </div>
                    <div className='content'>
                        <UserInfo />
                        <div className="feedback-action">
                            <h2>Phản hồi/Thao tác</h2>
                            <div className="content-region shadow-customize">
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
                                <div className="button-region">
                                    {
                                        feedbackFiles?.length > 0 && (
                                            <div className="attachment">
                                                <div className="content-region">
                                                    {
                                                        (feedbackFiles || []).map((file, index) => {
                                                            return (
                                                                <span className="item" key={`file-${index}`}>
                                                                    <span className="file-name">{file?.name}</span>&nbsp;
                                                                    <span>({file?.size * 0.001}KB)</span>
                                                                    <img src={IconClose} className="remove" alt="Close" onClick={() => handleRemoveFile(index)} />
                                                                </span>
                                                            )
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="d-flex justify-content-end button-block">
                                        <label htmlFor="i_files" className="btn btn-attachment">
                                            <img src={IconAttachmentBlue} alt="Attachment" />
                                            {t("AttachFile")}
                                            <input
                                                id="i_files"
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf"
                                                multiple
                                            />
                                        </label>
                                        <button className="btn btn-send" onClick={sendRequest}><img src={IconSendBlue} alt="Send" />{t("Send")}</button>
                                    </div>
                                </div>
                                <FeedbackHistory
                                    feedbacks={feedbacks}
                                />
                            </div>
                        </div>
                        <div className="request-info">
                            <h2>Thông tin yêu cầu</h2>
                            <div className="content-region shadow-customize">
                                <div className="row-customize d-block">
                                    <label>Tiêu đề</label>
                                    <div className="val">{requestDetail?.name || ''}</div>
                                </div>
                                <div className="row-customize d-block">
                                    <label>Nội dung</label>
                                    <div 
                                        className="val ck ck-content"
                                        dangerouslySetInnerHTML={{
                                        __html: purify.sanitize(requestDetail?.contents || ''),
                                        }}
                                    />
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Loại</label>
                                        <div className="val">{requestDetail?.supportServiceType?.typeVn || requestDetail?.supportServiceType?.typeEn}</div>
                                        {/* <Select
                                            value={(serviceTypes || []).find(item => item?.value == data?.typeId) || null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('typeId', e)}
                                            placeholder={t('Chọn')} 
                                            options={serviceTypes}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                    <div className="col">
                                        <label>Bảo mật</label>
                                        <div className="val">{requestDetail?.security ? 'Có' : 'Không'}</div>
                                        {/* <Select
                                            value={(securities || []).find(item => item?.value == data?.isSecurity) || null}
                                            isClearable={false}
                                            onChange={e => handleInputChange('isSecurity', e)}
                                            placeholder={t('Chọn')} 
                                            options={securities}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                    <div className="col">
                                        <label>Công ty</label>
                                        <div className="val">{requestDetail?.company?.name || ''}</div>
                                        {/* <Select
                                            value={(companies || []).find(item => item?.value == data?.companyCode) || null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('companyCode', e)}
                                            placeholder={t('Chọn')} 
                                            options={companies}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                    <div className="col">
                                        <label>Nhóm</label>
                                        <div className="val">{requestDetail?.supportGroups?.groupName || ''}</div>
                                        {/* <Select
                                            value={(groups || []).find(item => item?.value == data?.groupId) || null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('groupId', e)}
                                            placeholder={t('Chọn')} 
                                            options={groups}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Người xử lý</label>
                                        <div className="val">{data?.handlerId || ''}</div>
                                    </div>
                                    <div className="col">
                                        <label>Người cùng nhận thông tin</label>
                                        <div className="val">{data?.receives || ''}</div>
                                        {/* <Select
                                            value={null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('receives', e)}
                                            placeholder={t('Chọn')} 
                                            options={[]}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                    <div className="col">
                                        <label>Ưu tiên</label>
                                        <div className="val">{requestDetail?.priorityId || ''}</div>
                                        {/* <Select
                                            value={(priorities || []).find(item => item?.value === data?.priorityId) || null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('priorityId', e)}
                                            placeholder={t('Chọn')} 
                                            options={priorities}
                                            classNamePrefix="filter-select"
                                        /> */}
                                    </div>
                                    <div className="col">
                                        <label>Trạng thái</label>
                                        <Select
                                            value={(statuses || []).find(item => item?.value == data?.statusId) || null}
                                            isClearable={true}
                                            onChange={e => handleInputChange('statusId', e)}
                                            placeholder={t('Chọn')} 
                                            options={statuses}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="d-flex justify-content-end button-block">
                            <button className="btn btn-send" onClick={sendRequest}><img src={IconSend} alt="Send" />{t("Send")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RequestDetail
