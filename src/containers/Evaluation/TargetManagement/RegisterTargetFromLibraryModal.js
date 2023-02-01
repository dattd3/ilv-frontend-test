import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Collapse, Button } from 'react-bootstrap'
import Select from 'react-select'
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { omit, uniqBy, debounce } from 'lodash'
import axios from 'axios'
import CustomPaging from "components/Common/CustomPagingNew"
import { useGuardStore } from '../../../modules'
import IconArrowRightWhite from '../../../assets/img/icon/pms/arrow-right-white.svg'
import IconArrowRightGray from '../../../assets/img/icon/pms/arrow-right-gray.svg'
import IconSearch from '../../../assets/img/icon/ic_search.svg'
import IconAdd from '../../../assets/img/icon/ic_btn_add_green.svg'
import IconRemove from '../../../assets/img/icon/ic_btn_remove_red.svg'
import IconSave from '../../../assets/img/ic-save.svg'
import IconCancel from '../../../assets/img/icon/ic_cancel_register_target.svg'
import IconSend from '../../../assets/img/icon/Icon_send.svg'
import IconPrevious from '../../../assets/img/icon/ic_previous_blue.svg'
import IconNext from '../../../assets/img/icon/ic_next_blue.svg'
import IconCollapseBlue from '../../../assets/img/icon/ic_collapse_blue.svg'
import IconExpandGreen from '../../../assets/img/icon/ic_expand_green.svg'
import IconCollapse from '../../../assets/img/icon/pms/icon-collapse.svg'
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconRemoveRed from '../../../assets/img/icon/ic_remove_red.svg'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, formatStringByMuleValue } from '../../../commons/Utils'
import {
    MODAL_TYPES,
    CREATE_TARGET_REGISTER,
    getUserInfo,
} from "./Constant"
import Constants from '../../../commons/Constants'

const stepConfig = {
    selectTarget: 1,
    done: 2,
}

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        minHeight: '35px',
        height: '35px',
        boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        height: '35px',
        padding: '0 5px'
    }),

    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '35px',
    }),
}

const RegistrationStep = ({ stepActive, totalItemAdded = 0, isDisableNextStep, handleChangeStep }) => {
    const isActiveSelectTargetStep = stepActive === stepConfig.selectTarget
    const isActiveDoneStep = stepActive === stepConfig.done

    return (
        <div className="step-block">
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info ${isActiveSelectTargetStep ? 'active' : ''}`}>
                    <button className="item" onClick={() => handleChangeStep(stepConfig.selectTarget)}>
                        <span className="no"><span>1</span></span>
                        <span className="name">Lựa chọn mục tiêu</span>
                        <img src={isActiveSelectTargetStep ? IconArrowRightWhite : IconArrowRightGray} alt="Next" className="next" />
                    </button>
                </div>
            </div>
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info ${isActiveDoneStep ? 'active' : ''}`}>
                    <button className="item" onClick={() => handleChangeStep(stepConfig.done)} disabled={isDisableNextStep}>
                        <span className="no"><span>2</span></span>
                        <span className="name">Hoàn thành thông tin</span>
                        <img src={IconArrowRightGray} alt="Next" className="next" />
                    </button>
                </div>
                { totalItemAdded > 0 && <span className="notice-total">{totalItemAdded}</span> }
            </div>
        </div>
    )
}

const formatTargetText = str => str?.replace(/\n|\r/g, "")

const SelectTargetTabContent = ({ filter, listTarget = [], targetSelected = [], handleInputChange, changePageSize, handleSelectTarget, submitFilterOnParent }) => {
    const { t } = useTranslation()
    const guiIDSelected = targetSelected.map(item => item?.guiID)

    const handleAction = (item, needRemove = false) => {
        handleSelectTarget([item], needRemove)
    } 

    return (
        <div className="select-target-tab-content">
            <div className="search-region">
                <div className="row-form">
                    <label>Chọn kỳ đánh giá<span className="required">(*)</span></label>
                    <Select
                        isClearable={true}
                        onChange={period => handleInputChange('period', period)}
                        value={filter?.period}
                        placeholder={t('Select')}
                        options={filter?.listPeriod || []}
                        styles={customStyles}
                    />
                </div>
                <div className="row-form">
                    <label>Tìm kiếm mục tiêu</label>
                    <div className="region-input">
                        <div className="block-input-text">
                            <span><img src={IconSearch} alt="Icon search" /></span>
                            <input type='text' placeholder="Nhập từ khóa" value={filter?.keyword || ''} onChange={e => handleInputChange('keyword', e?.target?.value || '')} />
                        </div>
                        <div className="block-button">
                            <button type="submit" onClick={submitFilterOnParent}>Tìm kiếm</button>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
            <div className="select-target-tab-content">
                <div className="region-result">
                    <div className="header-region">
                        <span className="font-weight-bold title">Thư viện mục tiêu</span>
                        <span className="select-all" onClick={() => handleSelectTarget(listTarget)}>Chọn tất cả</span>
                    </div>
                    <div className="result-block">
                        <table>
                            <thead>
                                <tr>
                                    <th className="target-col">Tên mục tiêu</th>
                                    <th className="measure-col">Cách đo lường</th>
                                    <th className="action-col text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listTarget.map((item, index) => {
                                        let needRemove = guiIDSelected.includes(item?.guiID)

                                        return (
                                            <tr key={index}>
                                                <td className="target-col">{item?.targetName || ''}</td>
                                                <td className="measure-col">
                                                    <div>
                                                        <ul>
                                                            <li>{!item?.metric1 ? '--' : formatTargetText(item?.metric1)}</li>
                                                            <li>{!item?.metric2 ? '--' : formatTargetText(item?.metric2)}</li>
                                                            <li>{!item?.metric3 ? '--' : formatTargetText(item?.metric3)}</li>
                                                            <li>{!item?.metric4 ? '--' : formatTargetText(item?.metric4)}</li>
                                                            <li>{!item?.metric5 ? '--' : formatTargetText(item?.metric5)}</li>
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td className="action-col text-center">
                                                    <span className="btn-action" onClick={() => handleAction(item, needRemove)}><img src={needRemove ? IconRemove : IconAdd} alt={needRemove ? 'Remove' : 'Add'} /></span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {/* 
                                <tr>
                                    <td className="target-col">Tham gia các chương trình đào tạo do Tập đoàn, Công ty, Cơ sở tổ chức</td>
                                    <td className="measure-col">
                                        <div>
                                            <ul>
                                                <li>{`5 điểm: Đạt 100%`}</li>
                                                <li>{`4 điểm: Đạt 90% - dưới 100%`}</li>
                                                <li>{`3 điểm: Đạt 80% < 90%`}</li>
                                                <li>{`2 điểm: Đạt 70% < 80%`}</li>
                                                <li>{`1 điểm: Đạt 60% < 70%`}</li>
                                            </ul>
                                        </div>
                                    </td>
                                    <td className="action-col text-center">
                                        <span className="btn-action"><img src={IconRemove} alt='Remove' /></span>
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                        <div className="paging-region">
                            <div className="show-block">
                                <label>Hiển thị</label>
                                <select onChange={e => {
                                    const size = parseInt(e.target.value)
                                    changePageSize(size)
                                }}>
                                    <option>10</option>
                                    <option>20</option>
                                </select>
                            </div>
                            {/* <CustomPaging
                                onChangePageSize={setPageSize}
                                onChangePageIndex={setPageIndex}
                                totalRecords={totalRecords}
                                pageSize={pageSize}
                                pageIndex={pageIndex}
                            /> */}
                            <div className="show-block">
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DoneTabContent = ({ filter, targetSelected = [], handleInputChange, handleSelectTarget, handleViewListTargetSelected }) => {
    const { t } = useTranslation()

    const handleRemoveItem = (e, item) => {
        e.stopPropagation()
        handleSelectTarget([item], true)
    }
    
    const renderListTargetSelected = () => {
        return (
            targetSelected.map((item, i) => {
                return (
                    <div className="item" key={i}>
                        <Button
                            onClick={() => handleViewListTargetSelected(!item?.isExpand, i)}
                            aria-controls={`item-${i}`}
                            aria-expanded={item?.isExpand || false}
                        >
                            <div className="title">
                                <img src={item?.isExpand ? IconCollapse : IconExpand} alt='Collapse' />
                                <span className="font-weight-bold">Mục tiêu {i + 1}</span>
                                {
                                    !item?.isExpand &&
                                    <>
                                        <span className="divider">|</span>
                                        <span>{item?.targetName}</span>
                                        <span className="divider">|</span>
                                        <span className="percent">{item?.weight}%</span>
                                    </>
                                }
                            </div>
                            <span role='button' className="btn-remove" onClick={(e) => handleRemoveItem(e, item)}>
                                <img src={IconRemoveRed} alt='Remove' />
                                Xóa
                            </span>
                        </Button>
                        <Collapse in={item?.isExpand}>
                            <div id={`item-${i}`} className="item-content">
                                <div className="content">
                                    <div className="wrap-target-info">
                                        <div className="row-customize header-row">
                                            <div className="col-first font-weight-bold">Tên mục tiêu</div>
                                            <div className="col-second font-weight-bold">Cách đo lường</div>
                                        </div>
                                        <div className="row-customize content-row">
                                            <div className="col-first">{item?.targetName || ''}</div>
                                            <div className="col-second">
                                                <ul>
                                                    <li>{!item?.metric1 ? '--' : formatTargetText(item?.metric1)}</li>
                                                    <li>{!item?.metric2 ? '--' : formatTargetText(item?.metric2)}</li>
                                                    <li>{!item?.metric3 ? '--' : formatTargetText(item?.metric3)}</li>
                                                    <li>{!item?.metric4 ? '--' : formatTargetText(item?.metric4)}</li>
                                                    <li>{!item?.metric5 ? '--' : formatTargetText(item?.metric5)}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <label>Trọng số</label>
                                        <div className="input-block input-border input-text-customize">
                                            <span className="unit">%</span>
                                            <input type="text" value={item?.weight || ''} placeholder="Nhập" onChange={e => handleInputChange('weight', e?.target?.value || '', i)} />   
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <label>Mục tiêu cần đạt</label>
                                        <div className="input-block">
                                            <textarea rows={3} value={item?.target || ''} className="input-border" placeholder="Nhập" onChange={e => handleInputChange('target', e?.target?.value || '', i)} />   
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Collapse>
                    </div>
                )
            })
        )
    }

    return (
        <div className="done-tab-content">
            <div className="search-region">
                <div className="row-form">
                    <label>Chọn kỳ đánh giá<span className="required">(*)</span></label>
                    <Select
                        isClearable={true}
                        onChange={period => handleInputChange('period', period)}
                        value={filter?.period}
                        placeholder={t('Select')}
                        options={filter?.listPeriod || []}
                        styles={customStyles}
                    />
                </div>
            </div>
            <div className="collapse-expand-block">
                <button className="btn-collapse" onClick={() => handleViewListTargetSelected(false)}>
                    <img src={IconCollapseBlue} alt='Collapse' />
                    <span>Thu gọn</span>
                </button>
                <button className="btn-expand" onClick={() => handleViewListTargetSelected(true)}>
                    <img src={IconExpandGreen} alt='Expand' />
                    <span>Mở rộng</span>
                </button>
            </div>
            <div className="list-target">
                { renderListTargetSelected() }
            </div>
        </div>
    )
}

const ActionButton = ({ stepActive, totalWeight, isDisableNextStep, isDisableSaveRequest, isDisableSendRequest, errorMissingApproverInfo, onHideRegisterTargetModal, handleChangeStep, handleSubmitRequest }) => {
    const totalWeightToShow = Number(totalWeight).toFixed(2)
    const totalWeightClass = totalWeightToShow >= 99.5 && totalWeightToShow <= 100 ? 'full-weight' : ''
    const isSendRequest = true

    return (
        <div className="wrap-action-region">
            { errorMissingApproverInfo && <div className="approver-info-missing">{errorMissingApproverInfo}</div> }
            <div className="action-region">
                <span className="total-weight">
                    {
                        stepActive === stepConfig.done &&
                        <span className={`wrap-total-weight ${totalWeightClass}`}>
                            <span className="font-weight-bold label">*Tổng trọng số:</span>
                            <span>{totalWeight}%</span>
                        </span>
                    }
                </span>
                <div className="button-block">
                    <button className="btn-cancel" onClick={() => onHideRegisterTargetModal(true)}>
                        <img src={IconCancel} alt='Cancel' />
                        <span>Hủy</span>
                    </button>

                    <button className="btn-save" onClick={() => handleSubmitRequest(stepActive)} disabled={isDisableSaveRequest}>
                        <img src={IconSave} alt='Save' />
                        <span>Lưu</span>
                    </button>

                    {
                        stepActive !== stepConfig.selectTarget &&
                        <button className="btn-previous" onClick={() => handleChangeStep(stepConfig.selectTarget)}>
                            <img src={IconPrevious} alt='Previous' />
                            <span>Quay lại</span>
                        </button>
                    }
                    {
                        stepActive !== stepConfig.done &&
                        <button className="btn-next" onClick={() => handleChangeStep(stepConfig.done)} disabled={isDisableNextStep}>
                            <img src={IconNext} alt='Next' />
                            <span>Tiếp theo</span>
                        </button>
                    }
                    {
                        stepActive === stepConfig.done &&
                        <button className="btn-send" onClick={() => handleSubmitRequest(stepActive, isSendRequest)} disabled={isDisableSendRequest}>
                            <img src={IconSend} alt='Send' />
                            <span>Gửi yêu cầu</span>
                        </button>
                    }

                </div>
            </div>
        </div>
    )
}

const MyOption = props => {
    const { t } = useTranslation()
    const { innerProps, innerRef, data } = props
    const addDefaultSrc = ev => {
      ev.target.src = 'data:image/png;base64,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'
    }
    
    return (
      <div ref={innerRef} {...innerProps} className="approver">
        <div className="d-flex align-items-center">
          <div className="avatar-block">
            <img className="avatar" src={`data:image/png;base64,${data.avatar}`} onError={addDefaultSrc} alt="avatar" />
          </div>
          <div className="main-info">
            <div className="title">{data.fullName}</div>
            <div className="other"><i>({data.account}) {data.current_position}</i></div>
          </div>
        </div>
      </div>
    )
}

const ApprovalManager = ({ t, approverInfo, approvers, setApprovers, setApproverInfo, stepActive, totalWeight, isDisableNextStep, onHideRegisterTargetModal, handleChangeStep, handleSubmitRequest }) => {
    const [keyword, SetKeyword] = useState('')

    // useEffect(() => {
    //     const searchUser = async () => {
    //         const config = getRequestConfigurations()
    //         const payload = {
    //             account: keyword,
    //             employee_type: "APPROVER",
    //             status: Constants.statusUserActiveMulesoft,
    //         }

    //         try {
    //             const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
    //             if (response && response.data && response.data.data) {
    //                 const users = (response.data.data || []).map(res => {
    //                     return {
    //                         account: res?.username, // AD
    //                         fullName: res?.fullname || "",
    //                         employeeLevel: formatStringByMuleValue(res.rank_title) || formatStringByMuleValue(res.rank),
    //                         organizationLv1: null,
    //                         organizationLv2: res.organization_lv2 || null,
    //                         organizationLv3: res.organization_lv3 || null,
    //                         organizationLv4: res.organization_lv4 || null,
    //                         organizationLv5: res.organization_lv5 || null,
    //                         organizationLv6: res.organization_lv6 || null,
    //                         EmployeeNo: res?.uid,
//                             current_position: res.position_name || "",
    //                         department: res?.department || "",
    
    //                         value: res?.uid, // Mã NV
    //                         label: res?.fullname || "",
    //                         avatar: res?.avatar || "",
    //                     }
    //                 })
    //                 setApprovers(users)
    //             }
    //         } catch (e) {

    //         }
    //     }

    //     searchUser()
    // }, [keyword])

    const filterOption = (option, inputValue) => {
        const options = (approvers || []).filter(opt => (opt.label?.includes(inputValue) || opt.value?.includes(inputValue) || opt.uid?.includes(inputValue)))
        return options
    }

    const handleSelectChange = e => {
        setApproverInfo(e)
    }

    const onInputChange = debounce(query => {      
        SetKeyword(query || '')
    }, 800)
    
    return (
        <div className="approval-manager-block">
            <div className="font-weight-bold title">CBQL phê duyệt</div>
            <div className="info">
                <div className="row">
                    <div className="col">
                        <p className="full-name">{t('FullName')}</p>
                        <div>
                            <Select
                                isClearable={true}
                                styles={customStyles}
                                components={{ Option: e => MyOption(e)}}
                                onInputChange={onInputChange}
                                onChange={handleSelectChange}
                                value={approverInfo}
                                placeholder={t('Search') + '...'}
                                filterOption={filterOption}
                                options={approvers}
                                isDisabled
                            />
                        </div>
                    </div>
                    <div className="col">
                        <p className="full-name">{t('Position')}</p>
                        <div className="value text-truncate">{approverInfo?.current_position || ''}</div>
                    </div>
                    <div className="col">
                        <p className="full-name">{t('DepartmentManage')}</p>
                        <div className="value text-truncate">{approverInfo?.department || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function RegisterTargetFromLibraryModal(props) {
    const { registerType, phaseOptions, onHideRegisterTargetModal, setModalManagement } = props
    const { t } = useTranslation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()

    const [stepActive, SetStepActive] = useState(stepConfig.selectTarget)
    const [filter, SetFilter] = useState({
        period: null,
        listPeriod: [
            { value: 1, label: 'Quý 1/2022' },
            { value: 2, label: 'Quý 2/2022' },
            { value: 3, label: 'Quý 3/2022' },
            { value: 4, label: 'Quý 4/2022' },
        ],
        keyword: '',
    })
    const [requestId, SetRequestId] = useState(0)
    const [paging, SetPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })
    const [listTarget, SetListTarget] = useState([])
    const [targetSelected, SetTargetSelected] = useState([])
    const [error, SetError] = useState({})
    const [approverInfo, SetApproverInfo] = useState(null)
    const [approvers, SetApprovers] = useState([])

    // const pageSizeMemo = useMemo(() => paging.pageSize, [paging.pageSize])

    const requestGetListTarget = () => {
        const config = getRequestConfigurations()
        let bodyFormData = new FormData()
        bodyFormData.append('Organization_lv2', user?.organizationLv2)
        bodyFormData.append('Organization_lv3', user?.organizationLv3)
        bodyFormData.append('Organization_lv4', user?.organizationLv4)
        bodyFormData.append('Employee_level', user?.employeeLevel)
        bodyFormData.append('EmployeeCode', user?.employeeNo)
        bodyFormData.append('PageIndex', paging.pageIndex)
        bodyFormData.append('PageSize', paging.pageSize)
        bodyFormData.append('JobCode', user?.jobCode)
        bodyFormData.append('SearchKeyWord', filter?.keyword?.trim())

        return axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/target/mylibrary`, bodyFormData, config)
    }

    const requestGetListEvaluationPeriod = () => {
        const config = getRequestConfigurations()
        let bodyFormData = new FormData()
        bodyFormData.append('nopaging', true)
        return axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/checkphase/list`, bodyFormData, config)
    }

    const requestGetApproverInfo = () => {
        const muleSoftConfig = getMuleSoftHeaderConfigurations()
        return axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/manager`, muleSoftConfig)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestListTarget = requestGetListTarget()
                const requestApproverInfo = requestGetApproverInfo()
                const { data: listTarget } = await requestListTarget
                const approverInfo = await requestApproverInfo

                if (approverInfo && approverInfo?.data && approverInfo?.data?.data && approverInfo?.data?.data?.length > 0) {
                    const approver = approverInfo.data.data[0]
                    SetApproverInfo({
                        account: approver?.username, // AD
                        fullName: approver?.fullname || "",
                        employeeLevel: approver?.rank_title,
                        organizationLv1: null,
                        organizationLv2: null,
                        organizationLv3: null,
                        organizationLv4: null,
                        organizationLv5: null,
                        organizationLv6: null,
                        EmployeeNo: approver?.uid,
                        current_position: approver?.title || "",
                        department: approver?.department || "",

                        value: approver?.uid, // Mã NV
                        label: approver?.fullname || "",
                        avatar: approver?.avatar || "",
                    })
                }

                SetFilter({
                    ...filter,
                    listPeriod: (phaseOptions || [])
                    .filter(item => item?.isAvailable && !item?.isDeleted && item?.status)
                })
                SetListTarget(listTarget?.data?.targets || [])
            } catch (e) {

            } finally {

            }
        }

        registerType === MODAL_TYPES.REGISTER_LIBRARY && fetchData()
    }, [registerType])

    useEffect(() => {
        (async function() {
            try {
                const requestListTarget = await requestGetListTarget()
                let listTarget = []
                if (requestListTarget && requestListTarget?.data && requestListTarget?.data?.data && requestListTarget?.data?.data?.targets?.length > 0) {
                    listTarget = requestListTarget?.data?.data?.targets
                }

                SetListTarget(listTarget)
            } catch (e) {

            }
        })()
    }, [paging])
    
    const handleChangeStep = stepCode => {
        SetStepActive(stepCode || stepConfig.selectTarget)
    }

    const handleInputChange = (key, val, targetIndex = null) => {
        if (['keyword', 'period'].includes(key)) { // Xử lý phần filter
            SetFilter({
                ...filter,
                [key]: val,
            })
        } else if (['weight', 'target']) { // Xử lý phần cập nhật thông tin mục tiêu
            const targetSelectedClone = [...targetSelected]
            targetSelectedClone[targetIndex].IsEdit = requestId ? true : false // Đã hình thành request IsEdit = true, ngược lại là false

            if (key === 'weight') {
                const re = /^[0-9\b]+$/
                if (val === '' || re.test(val)) {
                    targetSelectedClone[targetIndex][key] = val
                }
            } else {
                targetSelectedClone[targetIndex][key] = val
            }

            SetTargetSelected(targetSelectedClone)
        }
    }

    const changePageSize = async (pageSize = 10) => {
        const pagingConfig = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        SetPaging(pagingConfig)
    }

    const handleSelectTarget = (targets, needRemove = false) => {                                                                                             
        let targetSelectedClone = []
        if (needRemove) {
            targetSelectedClone = [...targetSelected].filter(item => item?.guiID !== targets[0]['guiID'])
        } else {
            targetSelectedClone = uniqBy([...targetSelected, ...targets], 'guiID')
        }
        targetSelectedClone = [...targetSelectedClone].map(item => ({
            ...item,
            isExpand: false,
        }))

        SetTargetSelected(targetSelectedClone)
    }

    const submitFilterOnParent = async () => {
        let listTarget = []
        const requestListTarget = await requestGetListTarget()
        if (requestListTarget && requestListTarget?.data && requestListTarget?.data?.data && requestListTarget?.data?.data?.targets?.length > 0) {
            listTarget = requestListTarget?.data?.data?.targets
        }

        SetListTarget(listTarget)
    }

    const totalWeight = (() => {
        return targetSelected.reduce((result, item) => {
            result += Number(item?.weight || 0)
            return result
        }, 0)
    })()

    const isDisableNextStep = (() => {
        return ((!targetSelected || targetSelected?.length === 0) && !filter?.period) || !approverInfo
    })()

    const isDisableSaveRequest = (() => {
        return !filter?.period || !approverInfo
    })()

    const isDisableSendRequest = (() => {
        return !filter?.period || !approverInfo || !targetSelected || targetSelected?.length === 0
    })()

    const preparePayload = (stepCode, isSendRequest) => {
        const payload = {
            checkPhaseId: filter?.period.value,
            id: requestId,
            RequestType: 1,
            type: isSendRequest ? 'Next' : 'Save',
            userInfo: JSON.stringify(getUserInfo()),
            ApproverInfo: JSON.stringify(omit(approverInfo, ['value', 'label', 'avatar'])),
            listTarget: (targetSelected || []).map((item, i) => {
                return {
                    guiID: item?.guiID,
                    targetName: item?.targetName,
                    jobDetail: item?.jobDetail,
                    metric1: item?.metric1,
                    metric2: item?.metric2,
                    metric3: item?.metric3,
                    metric4: item?.metric4,
                    metric5: item?.metric5,
                    weight: item?.weight,
                    target: item?.target,
                    kpiType: item?.kpiType,
                    order: i + 1,
                    IsEdit : item?.IsEdit || false,
                }
            })
        }

        return payload
    }

    const handleSubmitRequest = async (stepCode = stepConfig.selectTarget, isSendRequest = false) => {
        try {
            const config = getRequestConfigurations()
            const payload = preparePayload(stepCode, isSendRequest)

            console.log('payload ===> ', payload)

            const response = await axios.post(CREATE_TARGET_REGISTER, payload, config)

            if (response.data?.result?.code !== Constants.PMS_API_SUCCESS_CODE) {
                toast.error(response.data?.result?.message)
            } else {
                if (!isSendRequest) {
                    SetRequestId(response?.data?.data?.id || 0)
                }

                if (isSendRequest) {
                    setModalManagement({
                        type: MODAL_TYPES.SUCCESS,
                        data: "Yêu cầu của bạn đã được gửi đi!",
                    })
                }
            }
        } catch {
            toast.error(isSendRequest ? "Gửi yêu cầu thất bại. Xin vui lòng thử lại!" : "Lưu mục tiêu thất bại. Xin vui lòng thử lại!")
        } finally {

        }
    }

    const handleViewListTargetSelected = (isExpand = false, index = null) => {
        let targetSelectedClone = [...targetSelected]

        if (index !== null) {
            targetSelectedClone[index].isExpand = isExpand
        } else {
            targetSelectedClone = targetSelectedClone.map(item => ({
                ...item,
                isExpand: isExpand,
            }))
        }

        SetTargetSelected(targetSelectedClone)
    }

    return (
        <Modal 
            backdrop="static" 
            keyboard={false}
            className={'register-target-from-library-modal'}
            centered  
            show={true}
            onHide={() => onHideRegisterTargetModal(true)}
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div className="register-target-page">
                    <h1 className="content-page-header">Đăng ký mục tiêu</h1>
                    <RegistrationStep
                        stepActive={stepActive}
                        totalItemAdded={targetSelected?.length}
                        isDisableNextStep={isDisableNextStep}
                        handleChangeStep={handleChangeStep}
                    />
                    {
                        stepActive === stepConfig.selectTarget &&
                        <SelectTargetTabContent
                            filter={filter}
                            listTarget={listTarget}
                            targetSelected={targetSelected}
                            handleInputChange={handleInputChange}
                            changePageSize={changePageSize}
                            handleSelectTarget={handleSelectTarget}
                            submitFilterOnParent={submitFilterOnParent}
                        />
                    }
                    {
                        stepActive === stepConfig.done &&
                        <DoneTabContent
                            filter={omit(filter, ['keyword'])}
                            targetSelected={targetSelected}
                            handleInputChange={handleInputChange}
                            handleSelectTarget={handleSelectTarget}
                            handleViewListTargetSelected={handleViewListTargetSelected}
                        />
                    }
                    <ApprovalManager 
                        t={t}
                        approverInfo={approverInfo}
                        approvers={approvers}
                        setApproverInfo={SetApproverInfo}
                        setApprovers={SetApprovers}
                    />
                    <ActionButton
                        stepActive={stepActive}
                        totalWeight={totalWeight}
                        isDisableNextStep={isDisableNextStep}
                        isDisableSaveRequest={isDisableSaveRequest}
                        isDisableSendRequest={isDisableSendRequest}
                        errorMissingApproverInfo={!approverInfo ? '* Chưa có thông tin CBQL phê duyệt, vui lòng liên hệ Nhân sự để được hỗ trợ!' : ''}
                        error={error}
                        onHideRegisterTargetModal={() => onHideRegisterTargetModal(true)}
                        handleChangeStep={handleChangeStep}
                        handleSubmitRequest={handleSubmitRequest}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterTargetFromLibraryModal
