import { useState, useEffect } from "react"
import { Modal, Tabs, Tab } from "react-bootstrap"
import Select from 'react-select'
import ReactTooltip from 'react-tooltip'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { omit, uniqWith, isEqual } from 'lodash'
import moment from 'moment'
import { saveAs } from 'file-saver'
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
import IconSave from 'assets/img/ic-save.svg'
import IconSendBlue from 'assets/img/icon/icon-send.svg'
import IconAttachmentBlue from 'assets/img/icon/ic_upload_attachment_blue.svg'
import IconFeedbackOverdueActive from 'assets/img/icon/ic_feedback-overdue_active.svg'
import IconFeedbackOverdue from 'assets/img/icon/ic_feedback-overdue_grey.svg'
import IconDeadlineOverdueActive from 'assets/img/icon/ic_deadline-overdue_active.svg'
import IconDeadlineOverdue from 'assets/img/icon/ic_deadline-overdue_grey.svg'
import { tabConfig } from "../Constant"
import SearchMultiUsers from "components/Common/SearchMultiUsers"

const RequestDetail = ({ isShow , id, masterData, tab, onHide }) => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const modalTabConfig = {
        feedBack: 'feedBack',
        action: 'action',
    }
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [requestDetail, setRequestDetail] = useState(null)
    const [feedbacks, setFeedbacks] = useState({
        data: [],
        total: 0,
    })
    const [actions, setActions] = useState([])
    const [feedbackFiles, setFeedbackFiles] = useState([])
    const [feedBackContent, setFeedBackContent] = useState('')
    const [statusModal, setStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
        needReload: true
    })
    const [activeTab, setActiveTab] = useState(modalTabConfig.feedBack)

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

        if (isShow) {
            setActiveTab(modalTabConfig.feedBack)
            fetchAllDataModal()
        }
    }, [isShow])

    useEffect(() => {
        const fetchListAction = async () => {
            try {
                setIsLoading(true)
                const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}api/support/logs/${id}`, getRequestConfigurations())
                setActions(response?.data?.data || [])
            } catch (error) {

            } finally {
                setIsLoading(false)
            }
        }

        activeTab === modalTabConfig.action && fetchListAction()
    }, [activeTab])

    const handleFileChange = (e) => {
        if (validateFileMimeType(e, e?.target?.files, t)) {
            const filesSelected = Object.values(e?.target?.files)
            const fileClone = [...feedbackFiles, ...filesSelected];
            if (validateTotalFileSize(e, fileClone, t)) {
                setFeedbackFiles(fileClone)
            }
        }
    }

    const sendFeedback = async () => {
        const statusModalTemp = { ...statusModal }
        setIsLoading(true)
        try {
            let formData = new FormData()
            formData.append('id', id) 
            formData.append('contents', feedBackContent || '')
            formData.append('userInfo', JSON.stringify({
                employeeCode: user?.employeeNo || '',
                ad: user?.ad || '',
                fullName: user?.fullName || '',
                phoneNumber: user?.cell_phone_no || '',
                pnlEmail: user?.plEmail || '',
                jobTitle: user?.jobTitle || '',
                department: user?.department || '',
                shortenedOrgLevel2Name: user?.orgshort_lv2,
                shortenedOrgLevel3Name: user?.orgshort_lv3,
                shortenedOrgLevel4Name: user?.orgshort_lv4,
            }))

            for (let key in feedbackFiles) {
                formData.append('files', feedbackFiles[key])
            }

            const config = getRequestConfigurations()
            config.headers['content-type'] = 'multipart/form-data'
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/feedback`, formData, config)
            statusModalTemp.isShow = true
            statusModalTemp.needReload = false
            if (response?.data) {
                const result = response.data?.result
                if (result?.code == Constants.API_SUCCESS_CODE) { 
                    statusModalTemp.isSuccess = true
                    statusModalTemp.content = "Gửi phản hồi thành công!"
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

    const updateRequest = async () => {
        const statusModalTemp = { ...statusModal }
        setIsLoading(true)
        try {
            let formData = new FormData()
            formData.append('id', id)
            formData.append('name', requestDetail?.name || '')
            formData.append('userId', requestDetail?.userId || '')
            formData.append('userInfo', requestDetail?.userInfo)
            formData.append('contents', requestDetail?.contents || '')
            if (requestDetail?.handlerId) {
                formData.append('handlerId', requestDetail?.handlerId)
            }
            if (requestDetail?.handlerInfo) {
                formData.append('handlerInfo', requestDetail?.handlerInfo)
            }
            formData.append('companyCode', requestDetail?.companyCode || '')
            if (requestDetail?.groupId) {
                formData.append('groupId', requestDetail?.groupId)
            }
            if (requestDetail?.causesCsId !== undefined && requestDetail?.causesCsId !== null) {
                formData.append('causesCsId', requestDetail?.causesCsId)
            }
            if (requestDetail?.causesVsId !== undefined && requestDetail?.causesVsId !== null) {
                formData.append('causesVsId', requestDetail?.causesVsId)
            }
            if (requestDetail?.typeId !== undefined && requestDetail?.typeId !== null) {
                formData.append('typeId', requestDetail?.typeId)
            }
            formData.append('security', requestDetail?.security)
            if (requestDetail?.slaId !== undefined && requestDetail?.slaId !== null) {
                formData.append('slaId', requestDetail?.slaId)
            }
            if (requestDetail?.statusId !== undefined && requestDetail?.statusId !== null) {
                formData.append('statusId', requestDetail?.statusId)
            }
            if (requestDetail?.statusNotes !== undefined && requestDetail?.statusNotes !== null) {
                formData.append('statusNotes', requestDetail?.statusNotes)
            }
            if (requestDetail?.serviceTypeId !== undefined && requestDetail?.serviceTypeId !== null) {
                formData.append('serviceTypeId', requestDetail?.serviceTypeId)
            }
            if (requestDetail?.levelId !== undefined && requestDetail?.levelId !== null) {
                formData.append('levelId', requestDetail?.levelId)
            }
            if (requestDetail?.categoryId !== undefined && requestDetail?.categoryId !== null) {
                formData.append('categoryId', requestDetail?.categoryId)
            }
            if (requestDetail?.categorySubId !== undefined && requestDetail?.categorySubId !== null) {
                formData.append('categorySubId', requestDetail?.categorySubId)
            }
            if (requestDetail?.categorySubItemId !== undefined && requestDetail?.categorySubItemId !== null) {
                formData.append('categorySubItemId', requestDetail?.categorySubItemId)
            }
            if (requestDetail?.requestReceives !== undefined && requestDetail?.requestReceives !== null) {
                formData.append('receives', JSON.stringify(requestDetail?.requestReceives))
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
                    statusModalTemp.content = "Cập nhật yêu cầu thành công!"
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
        if (key === 'feedBackContent') {
            return setFeedBackContent(e || '')
        }
        
        const obj = {}
        switch (key) {
            // case 'updateReason':
            case 'statusNotes':
                obj[key] = e?.target?.value || ''
                break
            case 'typeId':
            case 'levelId':
            case 'serviceTypeId':
            case 'slaId':
            case 'statusId':
            case 'categorySubItemId':
            case 'causesCsId':
            case 'causesVsId':
                obj[key] = e?.value || null
                break
            case 'categoryId':
                obj[key] = e?.value || null
                obj.categorySubId = null
                obj.categorySubItemId = null
                break
            case 'categorySubId':
                obj[key] = e?.value || null
                obj.categorySubItemId = null
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
        }

        setRequestDetail({
            ...requestDetail,
            ...obj,
        })
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

    const downloadAttachment = (url, fileName) => {
        saveAs(url, fileName)
    }

    const handleChangeTab = (key) => {
        setActiveTab(key)
    }

    const handleDeleteEmployee = (employeeCode = null) => {
        const _listEmployees = [...(requestDetail?.requestReceives || [])]
        let rest = []
        if (employeeCode) {
            rest = (_listEmployees || []).filter(item => JSON.parse(item?.receiveInfo || '{}')?.employeeCode != employeeCode)
        }

        setRequestDetail({
            ...requestDetail,
            requestReceives: rest,
        })
    }

    const handleSelectEmployee = (employee) => {
        if (!employee || employee?.length === 0) {
            return
        }
    
        const _employee = (employee || []).map(item => {
            let res = omit(item, ['value', 'label'])
            return {
                id: 0,
                receiveId: `${res?.ad?.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`,
                receiveInfo: JSON.stringify(res),
                supportRequestId: id,
            }
        })
        let _listEmployees = [...(requestDetail?.requestReceives || [])]
        _listEmployees = [..._listEmployees, ..._employee]
        _listEmployees = uniqWith(_listEmployees, isEqual)
        setRequestDetail({
            ...requestDetail,
            requestReceives: _listEmployees,
        })
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
    .filter(item => item?.groupId == requestDetail?.groupId)
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

    const categories = (() => {
        return (masterData?.categories || [])
        .filter(item => item?.parentCode == 0)
        .map(item => {
            return {
                value: item?.id,
                label: item?.name,
                parentCode: item?.parentCode,
            }
        })
    })()

    const subCategories = (() => {
        return (masterData?.categories || [])
        .filter(item => item?.parentCode == requestDetail?.categoryId)
        .map(item => {
            return {
                value: item?.id,
                label: item?.name,
                parentCode: item?.parentCode,
            }
        })
    })()

    const detailCategories = (() => {
        return (masterData?.categories || [])
        .filter(item => item?.parentCode == requestDetail?.categorySubId)
        .map(item => {
            return {
                value: item?.id,
                label: item?.name,
            }
        })
    })()

    const newRepeats = (() => {
        return (masterData?.types || []).map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.typeVn : item?.typeEn,
            }
        })
    })()

    const levelSupport = (() => {
        return (masterData?.levels || []).map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.typeVn : item?.typeEn,
            }
        })
    })()

    const errorCauses = (() => {
        return (masterData?.causessError || []).map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.causesCsVn : item?.causesCsEn,
            }
        })
    })()

    const overdueReasons = (() => {
        return (masterData?.causessDeadated || []).map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.causesVsVn : item?.causesVsEn,
            }
        })
    })()

    const viewByTechnician = tab === tabConfig.processing

    console.log('TING TING => ', masterData)
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
                        <UserInfo userInfo={JSON.parse(requestDetail?.userInfo || '{}')} />
                        <div className="feedback-action">
                            <h2 className="d-flex align-items-center justify-content-between">
                                <span>Phản hồi/Thao tác</span>
                                {
                                    tab === tabConfig.processing && (
                                        <span className="feedback-action-status">
                                            {
                                                    moment(requestDetail?.feedbackDeadline).isValid() && moment(requestDetail?.feedbackDeadline).isBefore(moment()) 
                                                    ? (
                                                        <span 
                                                            data-tip data-for={`tooltip-ic1`} 
                                                            className="highlight cursor-pointer" 
                                                        >
                                                            <ReactTooltip 
                                                                id={`tooltip-ic1`} 
                                                                scrollHide 
                                                                effect="solid" 
                                                                place="right" 
                                                                type='dark'>
                                                                Quá hạn phản hồi
                                                            </ReactTooltip>
                                                            <img src={IconFeedbackOverdueActive} alt="Icon" />
                                                        </span>
                                                    )
                                                    : (
                                                        <span className="highlight cursor-pointer"><img src={IconFeedbackOverdue} alt="Icon" /></span>
                                                    )
                                            }
                                            {
                                                moment(requestDetail?.closingDeadline).isValid() && moment(requestDetail?.closingDeadline).isBefore(moment()) 
                                                ? (
                                                    <span 
                                                        data-tip data-for={`tooltip-ic2`} 
                                                        className="highlight cursor-pointer" 
                                                    >
                                                        <ReactTooltip 
                                                            id={`tooltip-ic2`} 
                                                            scrollHide 
                                                            effect="solid" 
                                                            place="right" 
                                                            type='dark'>
                                                            Quá hạn đóng
                                                        </ReactTooltip>
                                                        <img src={IconDeadlineOverdueActive} alt="Icon" />
                                                    </span>
                                                )
                                                : (
                                                    <span className="highlight cursor-pointer"><img src={IconDeadlineOverdue} alt="Icon" /></span>
                                                )
                                            }
                                        </span>
                                    )
                                }
                            </h2>
                            <div className="content-region shadow-customize">
                                <Tabs activeKey={activeTab} onSelect={key => handleChangeTab(key)} className={tab === tabConfig.createdReceiving ? `tabs-hidden` : ''}>
                                    <Tab eventKey={modalTabConfig.feedBack} title={"Phản hồi"} className="tab-item" id={`${modalTabConfig.feedBack}-tab`}>
                                        <div className="feedback-tab-content" style={{ marginTop: tab === tabConfig.createdReceiving ? 0 : null}}>
                                            <div className="content-block">
                                                <label>Nội dung</label>
                                                <Editor
                                                    data={feedBackContent || ""}
                                                    onChange={(e, editor) => {
                                                        handleInputChange('feedBackContent', editor?.getData())
                                                    }}
                                                />
                                            </div>
                                            <div className="button-region">
                                                {
                                                    feedbackFiles?.length > 0 && (
                                                        <div className="attachment" style={{ marginTop: 0 }}>
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
                                                            accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf, .zip"
                                                            multiple
                                                        />
                                                    </label>
                                                    <button className="btn btn-send" onClick={sendFeedback}><img src={IconSendBlue} alt="Send" />{t("Send")}</button>
                                                </div>
                                            </div>
                                            <FeedbackHistory
                                                feedbacks={feedbacks}
                                            />
                                        </div>
                                    </Tab>
                                    <Tab eventKey={modalTabConfig.action} title={t("Thao tác")} className="tab-item" id={`${modalTabConfig.action}-tab`}>
                                        <div className="action-tab-content">
                                            <table className="action-table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center col-no">STT</th>
                                                        <th className="col-time">Thời gian</th>
                                                        <th className="col-action">Thao tác</th>
                                                        <th className="col-description">Mô tả</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        (actions || []).map((item, i) => {
                                                            return (
                                                                <tr key={`action-${i}`}>
                                                                    <td className="text-center col-no">{i + 1}</td>
                                                                    <td className="col-time">{moment(item?.createdDate).isValid() ? moment(item?.createdDate).format('DD/MM/YYYY HH:mm:ss') : ''}</td>
                                                                    <td className="col-action">{item?.actions ?? ''}</td>
                                                                    <td className="col-description">{item?.descriptions ?? ''}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </Tab>
                                </Tabs>
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
                                        {
                                            viewByTechnician
                                            ? (
                                                <Select
                                                    value={(serviceTypes || []).find(item => item?.value == requestDetail?.serviceTypeId) || null}
                                                    isClearable={true}
                                                    onChange={e => handleInputChange('serviceTypeId', e)}
                                                    placeholder={t('Chọn')} 
                                                    options={serviceTypes}
                                                    classNamePrefix="filter-select"
                                                />
                                            )
                                            : (
                                                <div className="val">
                                                    {locale === Constants.LANGUAGE_VI ? requestDetail?.supportServiceType?.typeVn : (requestDetail?.supportServiceType?.typeEn || requestDetail?.supportServiceType?.typeVn)}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col">
                                        <label>Bảo mật</label>
                                        <div className="val">
                                            {requestDetail?.security ? 'Có' : 'Không'}
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label>Công ty</label>
                                        {
                                            viewByTechnician
                                            ? (
                                                <Select
                                                    value={(companies || []).find(item => item?.value == requestDetail?.companyCode) || null}
                                                    isClearable={true}
                                                    onChange={e => handleInputChange('companyCode', e)}
                                                    placeholder={t('Chọn')} 
                                                    options={companies}
                                                    classNamePrefix="filter-select"
                                                />
                                            )
                                            : (
                                                <div className="val">
                                                    {requestDetail?.company?.name || ''}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col">
                                        <label>Nhóm</label>
                                        {
                                            viewByTechnician
                                            ? (
                                                <Select
                                                    value={(groups || []).find(item => item?.value == requestDetail?.groupId) || null}
                                                    isClearable={true}
                                                    onChange={e => handleInputChange('groupId', e)}
                                                    placeholder={t('Chọn')} 
                                                    options={groups}
                                                    classNamePrefix="filter-select"
                                                />
                                            )
                                            : (
                                                <div className="val">
                                                    {requestDetail?.supportGroups?.groupName || ''}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="row-customize">
                                    <div className="col">
                                        <label>Người xử lý</label>
                                        {
                                            viewByTechnician
                                            ? (
                                                <Select
                                                    value={(groups || []).find(item => item?.value == requestDetail?.groupId) || null}
                                                    isClearable={true}
                                                    onChange={e => handleInputChange('groupId', e)}
                                                    placeholder={t('Chọn')} 
                                                    options={groups}
                                                    classNamePrefix="filter-select"
                                                />
                                            )
                                            : (
                                                <div className="val">
                                                    {requestDetail?.handlerInfo ? JSON.parse(requestDetail?.handlerInfo)?.ad : ''}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col">
                                        <label>Người cùng nhận thông tin</label>
                                        {
                                            viewByTechnician
                                            ? (
                                                <SearchMultiUsers
                                                    handleDeleteEmployee={handleDeleteEmployee}
                                                    listEmployees={(requestDetail?.requestReceives || [])
                                                        .map(item => JSON.parse(item?.receiveInfo || '{}'))
                                                        .map(item => ({
                                                            ...item,
                                                            value: item?.employeeCode,
                                                            label: item?.fullName,
                                                        }))
                                                    }
                                                    handleSelectEmployee={handleSelectEmployee}
                                                    isDisabled={false}
                                                />
                                            )
                                            : (
                                                <div className="val d-flex align-items-center justify-content-between" style={{ height: 38 }}>
                                                    {
                                                        requestDetail?.requestReceives?.length > 0 && (
                                                            <>
                                                                <span className="tag">{JSON.parse(requestDetail?.requestReceives[0]?.receiveInfo)?.ad}</span>
                                                                <span className="total d-inline-flex align-items-center justify-content-center">{requestDetail?.requestReceives?.length}</span>
                                                            </>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col">
                                        <label>Ưu tiên</label>
                                        {
                                            viewByTechnician
                                            ? (
                                                <Select
                                                    value={(priorities || []).find(item => item?.value === requestDetail?.slaId) || null}
                                                    isClearable={true}
                                                    onChange={e => handleInputChange('slaId', e)}
                                                    placeholder={t('Chọn')} 
                                                    options={priorities}
                                                    classNamePrefix="filter-select"
                                                />
                                            )
                                            : (
                                                <div className="val">
                                                    {locale === Constants.LANGUAGE_VI ? requestDetail?.supportSla?.prioritizeVn : (requestDetail?.supportSla?.prioritizeEn || requestDetail?.supportSla?.prioritizeVn)}
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="col">
                                        <label>Trạng thái</label>
                                        <Select
                                            value={(statuses || []).find(item => item?.value == requestDetail?.statusId) || null}
                                            onChange={e => handleInputChange('statusId', e)}
                                            placeholder={t('Chọn')} 
                                            options={statuses}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                </div>

                                {
                                    tab === tabConfig.processing && (
                                        <>
                                            <div className="row-customize">
                                                <div className="col">
                                                    <label>Hỗ trợ mức độ</label>
                                                    <Select
                                                        value={(levelSupport || []).find(item => item?.value == requestDetail?.levelId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('levelId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={levelSupport}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label>Nguyên nhân lỗi</label>
                                                    <Select
                                                        value={(errorCauses || []).find(item => item?.value == requestDetail?.causesCsId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('causesCsId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={errorCauses}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label>Lý do quá hạn</label>
                                                    <Select
                                                        value={(overdueReasons || []).find(item => item?.value == requestDetail?.causesVsId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('causesVsId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={overdueReasons}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label>Mới/Lặp lại</label>
                                                    <Select
                                                        value={(newRepeats || []).find(item => item?.value == requestDetail?.typeId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('typeId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={newRepeats}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row-customize">
                                                <div className="col">
                                                    <label>Đầu mục cha</label>
                                                    <Select
                                                        value={(categories || []).find(item => item?.value == requestDetail?.categoryId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('categoryId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={categories}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label>Đầu mục con</label>
                                                    <Select
                                                        value={(subCategories || []).find(item => item?.value == requestDetail?.categorySubId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('categorySubId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={subCategories}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label>Đầu mục chi tiết</label>
                                                    <Select
                                                        value={(detailCategories || []).find(item => item?.value == requestDetail?.categorySubItemId) || null}
                                                        isClearable={true}
                                                        onChange={e => handleInputChange('categorySubItemId', e)}
                                                        placeholder={t('Chọn')} 
                                                        options={detailCategories}
                                                        classNamePrefix="filter-select"
                                                    />
                                                </div>
                                                <div className="col"></div>
                                            </div>
                                            <div className="row-customize">
                                                <div className="col">
                                                    <label>Lý do cập nhật</label>
                                                    <textarea 
                                                        rows={3} 
                                                        // placeholder={t("EvaluationDetailPartSelectScoreInput")} 
                                                        value={requestDetail?.statusNotes || ""} 
                                                        onChange={e => handleInputChange('statusNotes', e)} 
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                        {
                            requestDetail?.documents?.length > 0 && (
                                <div className="attachment">
                                    <h2>Tệp đính kèm</h2>
                                    <div className="content-region shadow-customize">
                                        {
                                            (requestDetail?.documents || []).map((file, index) => {
                                                return (
                                                    <span className="item" key={`file-${index}`}>
                                                        <span className="cursor-pointer file-name" onClick={() => downloadAttachment(file?.fileUrl, file?.fileName)}>{file?.fileName}</span>
                                                        <span>({file?.fileSize}KB)</span>
                                                        {/* <img src={IconClose} className="remove" alt="Close" onClick={() => handleRemoveFile(index)} /> */}
                                                    </span>
                                                )
                                            }
                                        )}
                                    </div>
                                </div>
                            )
                        }
                        <div className="d-flex justify-content-end button-block">
                            <button className="btn btn-save" onClick={updateRequest}><img src={IconSave} alt="Send" />{t("Save")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RequestDetail
