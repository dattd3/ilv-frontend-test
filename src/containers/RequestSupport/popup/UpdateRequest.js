import { Fragment, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import IconClose from "assets/img/icon/icon_x.svg"
import IconOk from "assets/img/icon/Icon_Check_White.svg"
import IconCancel from "assets/img/icon/Icon_Cancel.svg"
import Constants from "commons/Constants"

export default function UpdateRequest({ isShow, masterData, onHide }) {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const { t } = useTranslation()
    const [inputData, setInputData] = useState({
        ids: '',
        groupId: null,
        handler: null,
        slaId: null,
        // handlerId: null,
        // handlerInfo: '',
        statusId: null,
        message: '',
    })

    // useEffect(() => {
    //     dataModal?.isShow && setInputData({})
    // }, [dataModal?.isShow])

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
            case 'handler':
                obj[key] = e || null
                break
        }

        setInputData({
            ...inputData,
            ...obj,
        })
    }

    const handleUpdateRequest = () => {

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

    return (
        <Modal
            className="update-request-modal"
            show={isShow}
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

                    {
                    // dataModal?.field?.inputType === 'text'
                    // ? (
                    //     <input 
                    //     type={dataModal?.field?.inputType} 
                    //     className="input"
                    //     placeholder={dataModal?.field?.placeholderText}
                    //     value={inputData[dataModal?.field?.inputName] || ''}
                    //     onChange={e => handleInputChange(dataModal?.field?.inputName, dataModal?.field?.inputType, e)}
                    //     />
                    // )
                    // : (
                    //     <textarea 
                    //     rows={3} 
                    //     className="input"
                    //     placeholder={dataModal?.field?.placeholderText} 
                    //     value={inputData[dataModal?.field?.inputName] || ''} 
                    //     onChange={e => handleInputChange(dataModal?.field?.inputName, dataModal?.field?.inputType, e)} 
                    //     />
                    // )
                    }
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
                        <SearchSingleUserComponent
                            // isClearable={true}
                            // styles={customStyles}
                            // components={{ Option: e => MyOption({...e, isSearch: isSearch})}}
                            // onInputChange={this.onInputChange.bind(this)}
                            // onChange={approverItem => this.handleSelectChange('approver', approverItem)}
                            // value={approver}
                            // placeholder={t('Search') + '...'}
                            // filterOption={this.filterOption}
                            // options={users ? users : recentlyApprover || []}
                            // isLoading={isSearching}
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
    )
}