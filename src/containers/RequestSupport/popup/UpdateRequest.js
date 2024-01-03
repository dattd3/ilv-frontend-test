import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { size } from "lodash"
import Constants from "commons/Constants"
import { getRequestConfigurations } from "commons/Utils"
import SearchSingleUser from "components/Common/SearchSingleUser"
import LoadingModal from "components/Common/LoadingModal"
import StatusModal from "components/Common/StatusModal"
import IconClose from "assets/img/icon/icon_x.svg"
import IconOk from "assets/img/icon/Icon_Check_White.svg"
import IconCancel from "assets/img/icon/Icon_Cancel.svg"

export default function UpdateRequest({ updateRequestModal, masterData, onHide }) {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const { t } = useTranslation()
    const [inputData, setInputData] = useState({
        ids: '',
        groupId: null,
        handlerId: null,
        handlerInfo: null,
        slaId: null,
        statusId: null,
        message: '',
    })
    const [isLoading, setIsLoading] = useState(false)
    const [statusModal, setStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
        needReload: true
    })

    useEffect(() => {
        updateRequestModal?.isShow && setInputData({
            ids: updateRequestModal?.ids,
            groupId: updateRequestModal?.groupId,
            handlerId: updateRequestModal?.handlerId,
            handlerInfo: updateRequestModal?.handlerInfo,
            slaId: updateRequestModal?.slaId,
            statusId: updateRequestModal?.statusId,
            message: '',
        })
    }, [updateRequestModal?.isShow])

    const handleInputChange = (key, e) => {        
        const obj = {}
        switch (key) {
            case 'ids':
                obj[key] = e?.target?.value || ''
                break
            case 'message':
                obj[key] = e?.target?.value || ''
                break
            case 'groupId':
            case 'slaId':
            case 'statusId':
                obj[key] = e?.value || null
                break
            case 'handlerInfo':
                obj[key] = !e ? null : JSON.stringify(e)
                obj.handlerId = !e ? null : `${e?.ad?.toLowerCase()}${Constants.GROUP_EMAIL_EXTENSION}`
                break
        }

        setInputData({
            ...inputData,
            ...obj,
        })
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

    const handleUpdateRequest = async () => {
        const statusModalTemp = { ...statusModal }
        setIsLoading(true)
        try {
            const payload = {
                ids: inputData?.ids?.split(','),
                groupId: inputData?.groupId, 
                handlerId: inputData?.handlerId, 
                handlerInfo: inputData?.handlerInfo,
                slaId: inputData?.slaId,
                statusId: inputData?.statusId,
                message: inputData?.message || '',
            }

            const config = getRequestConfigurations()
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/update/items`, payload, config)
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
            console.log('rrrrrrrrrr', e)

            statusModalTemp.isShow = true
            statusModalTemp.isSuccess = false
            statusModalTemp.content = e?.response?.data?.result?.message || t("AnErrorOccurred")
            statusModalTemp.needReload = false
            setStatusModal(statusModalTemp)
        } finally {
            setIsLoading(false)
        }
    }

    const groups = (() => {
        return (masterData?.groups || [])
        .map(item => {
            return {
                value: item?.id,
                label: item?.groupName,
            }
        })
    })()

    const priorities = (() => {
        return (masterData?.slas || [])
        .filter(item => item?.groupId == inputData?.groupId)
        .map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.prioritizeVn : item?.prioritizeEn,
            }
        })
    })()

    const statuses = (() => {
        return (masterData?.statuses || []).map(item => {
            return {
                value: item?.id,
                label: locale === Constants.LANGUAGE_VI ? item?.statusVn : item?.statusEn,
            }
        })
    })()

    const handlerInfo = JSON.parse(inputData?.handlerInfo || '{}')

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
                className="update-request-modal"
                show={updateRequestModal?.isShow}
                onHide={onHide}
            >
                <Modal.Body className='rounded'>
                    <div className="header">
                        <div className='text-title text-uppercase'>Cập nhật</div>
                        <span className="close" onClick={onHide}><img src={IconClose} alt="Close" /></span>
                    </div>
                    <div className='content'>
                        <div className="row-items">
                            <div className="col-customize">
                                <label>Danh sách mã yêu cầu</label>
                                <input 
                                    type="text" 
                                    className="input"
                                    placeholder={'Nhập'}
                                    value={inputData?.ids || ''}
                                    onChange={e => handleInputChange('ids', e)}
                                />
                            </div>
                        </div>
                        <div className="row-items">
                            <div className="col-customize">
                                <label>Chọn nhóm</label>
                                <Select
                                    value={(groups || []).find(item => item?.value == inputData?.groupId) || null}
                                    isClearable={true}
                                    onChange={e => handleInputChange('groupId', e)}
                                    placeholder={t('Chọn')} 
                                    options={groups}
                                    classNamePrefix="filter-select"
                                />
                            </div>
                            <div className="col-customize">
                                <label>Chọn người xử lý</label>
                                <SearchSingleUser 
                                    user={handlerInfo && size(handlerInfo) > 0 ? {...handlerInfo, value: handlerInfo?.employeeCode, label: handlerInfo?.fullName } : null}
                                    handleSelectEmployee={e => handleInputChange('handlerInfo', e)}
                                />
                            </div>
                            <div className="col-customize">
                                <label>Ưu tiên</label>
                                <Select
                                    value={(priorities || []).find(item => item?.value == inputData?.slaId) || null}
                                    isClearable={true}
                                    onChange={e => handleInputChange('slaId', e)}
                                    placeholder={t('Chọn')} 
                                    options={priorities}
                                    classNamePrefix="filter-select"
                                />
                            </div>
                            <div className="col-customize">
                                <label>Trạng thái</label>
                                <Select
                                    value={(statuses || []).find(item => item?.value == inputData?.statusId) || null}
                                    isClearable={true}
                                    onChange={e => handleInputChange('statusId', e)}
                                    placeholder={t('Chọn')} 
                                    options={statuses}
                                    classNamePrefix="filter-select"
                                />
                            </div>
                        </div>
                        <div className="row-items">
                            <div className="col-customize">
                                <label>Lý do</label>
                                <textarea 
                                    rows={3} 
                                    className="input"
                                    placeholder={'Nhập'}  
                                    value={inputData?.message || ''} 
                                    onChange={e => handleInputChange('message', e)} 
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end button-block">
                            <button type="button" className="btn cancel" onClick={onHide}>
                                <img src={IconCancel} alt="Cancel" />
                                Hủy
                            </button>
                            <button 
                                type="button"  
                                className="btn ok" 
                                onClick={handleUpdateRequest}
                            >
                                <img src={IconOk} alt="Close" />
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}