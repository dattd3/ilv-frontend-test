import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'
import moment from 'moment'
import _, { omit } from 'lodash'
import { useGuardStore } from 'modules'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import { validateFileMimeType, validateTotalFileSize } from "utils/file"
import Editor from "components/Forms/Editor"
import UserInfo from "../common/UserInfo"
import StatusModal from 'components/Common/StatusModal'
import LoadingModal from 'components/Common/LoadingModal'
import IconClose from 'assets/img/icon/icon_x.svg'
import IconSend from 'assets/img/icon/Icon_send.svg'
import IconAttachment from 'assets/img/icon/ic_upload_attachment.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import SearchMultiUsers from "components/Common/SearchMultiUsers"
registerLocale("vi", vi)

const CreatedRequest = ({ isShow, masterData, onHide }) => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const guard = useGuardStore()
    const user = guard.getCurentUser()
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
    const [statusModal, setStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
        needReload: true
    })

    useEffect(() => {
        if (isShow) {
            setData({
                ...data,
                typeId: masterData?.serviceTypes?.[0]?.id,
                statusId: masterData?.statuses?.[0]?.id,
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShow])

    const handleFileChange = (e) => {
        if (validateFileMimeType(e, e?.target?.files, t)) {
            const filesSelected = Object.values(e?.target?.files)
            const fileClone = [...files, ...filesSelected];
            if (validateTotalFileSize(e, fileClone, t)) {
                setFiles(fileClone)
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
                shortenedOrgLevel2Name: user?.orgshort_lv2,
                shortenedOrgLevel3Name: user?.orgshort_lv3,
                shortenedOrgLevel4Name: user?.orgshort_lv4,
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
            const receives = (data?.receives || []).map(item => {
                let res = omit(item, ['value', 'label'])
                return {
                    id: 0,
                    receiveId: `${res?.ad?.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`,
                    receiveInfo: JSON.stringify(res),
                }
            })
            if (receives && receives?.length > 0) {
                formData.append('receives', JSON.stringify(receives))
            }
            for (let key in files) {
                formData.append('files', files[key])
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
        }

        setData((data) => ({
            ...data,
            ...obj
        }))
    }

    const handleRemoveFile = (index) => {
        const fileClone = [...files]
        fileClone.splice(index, 1)
        setFiles(fileClone)
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

    const handleDeleteEmployee = (employeeCode = null) => {
        const _listEmployees = [...data?.receives]
        let rest = []
        if (employeeCode) {
            rest = (_listEmployees || []).filter(item => item?.employeeCode != employeeCode)
        }

        setData({
            ...data,
            receives: rest,
        })
    }

    const handleSelectEmployee = (employee) => {
        if (!employee || employee?.length === 0) {
            return
        }
    
        let _listEmployees = [...data?.receives]
        _listEmployees = [..._listEmployees, ...employee]
        _listEmployees = _.uniqWith(_listEmployees, _.isEqual)
        setData({
            ...data,
            receives: _listEmployees,
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

    const groups = data?.companyCode 
    ? (masterData?.groups || [])
    .filter(item => item?.companyCode == data?.companyCode)
    .map(item => {
        return {
            value: item?.id,
            label: item?.groupName,
            companyCode: item?.companyCode,
        }
    })
    : (masterData?.groups || [])
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
                                            value={(serviceTypes || []).find(item => item?.value == data?.typeId) || null}
                                            onChange={e => handleInputChange('typeId', e)}
                                            placeholder={t('Chọn')} 
                                            options={serviceTypes}
                                            classNamePrefix="filter-select"
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Bảo mật</label>
                                        <Select
                                            value={(securities || []).find(item => item?.value == data?.isSecurity) || null}
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
                                            value={(companies || []).find(item => item?.value == data?.companyCode) || null}
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
                                            value={(groups || []).find(item => item?.value == data?.groupId) || null}
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
                                        <SearchMultiUsers
                                            handleDeleteEmployee={handleDeleteEmployee}
                                            listEmployees={data?.receives}
                                            handleSelectEmployee={handleSelectEmployee}
                                            isDisabled={false}
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Ưu tiên</label>
                                        <Select
                                            value={(priorities || []).find(item => item?.value === data?.priorityId) || null}
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
                                            value={(statuses || []).find(item => item?.value == data?.statusId) || null}
                                            onChange={e => handleInputChange('statusId', e)}
                                            placeholder={t('Chọn')} 
                                            options={statuses}
                                            classNamePrefix="filter-select"
                                            isDisabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            files?.length > 0 && (
                                <div className="attachment">
                                    <h2>Tệp đính kèm</h2>
                                    <div className="content-region shadow-customize">
                                        {
                                            (files || []).map((file, index) => {
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
                                <img src={IconAttachment} alt="Attachment" />
                                {t("AttachFile")}
                                <input
                                    id="i_files"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".xls, .xlsx, .doc, .docx, .jpg, .png, .pdf, .zip"
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
