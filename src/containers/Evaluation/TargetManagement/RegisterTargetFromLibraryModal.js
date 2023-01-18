import React, { useState, useEffect, useMemo } from "react";
import { Modal, Collapse, Button } from 'react-bootstrap'
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import { omit, uniq } from 'lodash'
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
import { getRequestConfigurations } from '../../../commons/Utils'
import {
    MODAL_TYPES,
  } from "./Constant";

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

const RegistrationStep = ({ stepActive, totalItemAdded = 0, handleChangeStep }) => {
    const isActiveSelectTargetStep = stepActive === stepConfig.selectTarget
    const isActiveDoneStep = stepActive === stepConfig.done

    return (
        <div className="step-block">
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info ${isActiveSelectTargetStep ? 'active' : ''}`}>
                    <div className="item" onClick={() => handleChangeStep(stepConfig.selectTarget)}>
                        <span className="no"><span>1</span></span>
                        <span className="name">Lựa chọn mục tiêu</span>
                        <img src={isActiveSelectTargetStep ? IconArrowRightWhite : IconArrowRightGray} alt="Next" className="next" />
                    </div>
                </div>
            </div>
            <div className="wrap-item">
                <div className="line"><hr /></div>
                <div className={`info ${isActiveDoneStep ? 'active' : ''}`}>
                    <div className="item" onClick={() => handleChangeStep(stepConfig.done)}>
                        <span className="no"><span>2</span></span>
                        <span className="name">Hoàn thành thông tin</span>
                        <img src={IconArrowRightGray} alt="Next" className="next" />
                    </div>
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

const DoneTabContent = ({ filter, targetSelected = [], handleInputChange }) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    console.log('Ting ting', targetSelected)

    const renderListTargetSelected = () => {
        return (
            targetSelected.map((item, i) => {
                return (
                    <div className="item" key={i}>
                        <Button
                            onClick={() => setOpen(!open)}
                            aria-controls={`item-1`}
                            aria-expanded={open}
                        >
                            <div className="title">
                                <img src={open ? IconCollapse : IconExpand} alt='Collapse' />
                                <span className="font-weight-bold">Mục tiêu {i + 1}</span>
                                {
                                    !open &&
                                    <>
                                        <span className="divider">|</span>
                                        <span>{item?.targetName}</span>
                                        <span className="divider">|</span>
                                        <span className="percent">{item?.weight}%</span>
                                    </>
                                }
                            </div>
                            <span role='button' className="btn-remove" onClick={() => alert(1)}>
                                <img src={IconRemoveRed} alt='Remove' />
                                Xóa
                            </span>
                        </Button>
                        <Collapse in={open}>
                            <div id={`item-1`} className="item-content">
                                <div className="content">
                                    <div className="wrap-target-info">
                                        <div className="row-customize header-row">
                                            <div className="col-first font-weight-bold">Tên mục tiêu</div>
                                            <div className="col-second font-weight-bold">Cách đo lường</div>
                                        </div>
                                        <div className="row-customize content-row">
                                            <div className="col-first">{item?.targetName}</div>
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
                                            <input type="text" value={item?.weight || ''} placeholder="Nhập" onChange={handleInputChange} />   
                                        </div>
                                    </div>
                                    <div className="row-content">
                                        <label>Mục tiêu cần đạt</label>
                                        <div className="input-block">
                                            <textarea rows={3} value={item?.target || ''} className="input-border" placeholder="Nhập" onChange={handleInputChange} />   
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
                <button className="btn-collapse" onClick={() => setOpen(false)}>
                    <img src={IconCollapseBlue} alt='Collapse' />
                    <span>Thu gọn</span>
                </button>
                <button className="btn-expand" onClick={() => setOpen(true)}>
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

const ActionButton = ({ stepActive, totalWeight, onHideRegisterTargetModal }) => {
    const totalWeightToShow = Number(totalWeight).toFixed(2)
    const totalWeightClass = totalWeightToShow >= 99.5 && totalWeightToShow <= 100 ? 'full-weight' : ''

    return (
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
                <button className="btn-cancel" onClick={onHideRegisterTargetModal}>
                    <img src={IconCancel} alt='Cancel' />
                    <span>Hủy</span>
                </button>
                <button className="btn-save">
                    <img src={IconSave} alt='Save' />
                    <span>Lưu</span>
                </button>
                {
                    stepActive !== stepConfig.selectTarget &&
                    <button className="btn-previous">
                        <img src={IconPrevious} alt='Previous' />
                        <span>Quay lại</span>
                    </button>
                }
                {
                    stepActive !== stepConfig.done &&
                    <button className="btn-next">
                        <img src={IconNext} alt='Next' />
                        <span>Tiếp theo</span>
                    </button>
                }
                <button className="btn-send">
                    <img src={IconSend} alt='Send' />
                    <span>Gửi yêu cầu</span>
                </button>
            </div>
        </div>
    )
}

function RegisterTargetFromLibraryModal(props) {
    const { registerType, phaseOptions, onHideRegisterTargetModal } = props
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
    const [paging, SetPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
    })
    const [listTarget, SetListTarget] = useState([])
    const [targetSelected, SetTargetSelected] = useState([])

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestListTarget = requestGetListTarget()
                // const requestListEvaluationPeriod = requestGetListEvaluationPeriod()
                const { data: listTarget } = await requestListTarget
                // const { data: listEvaluationPeriod } = await requestListEvaluationPeriod

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
    
    const handleChangeStep = code => {
        SetStepActive(code || stepConfig.selectTarget)
    }

    const handleInputChange = (key, val) => {
        SetFilter({
            ...filter,
            [key]: val,
        })
    }

    const changePageSize = async (pageSize = 10) => {
        const pagingConfig = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        SetPaging(pagingConfig)
    }

    const handleSelectTarget = (targets, needRemove) => {
        let targetSelectedClone = []
        if (needRemove) {
            targetSelectedClone = [...targetSelected].filter(item => item?.guiID !== targets[0]['guiID'])
        } else {
            targetSelectedClone = uniq([...targetSelected, ...targets], 'guiID')
        }

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

    console.log('yyyyyyyyyyyy', targetSelected)

    const totalWeight = (()=>{
        return targetSelected.reduce((result, item) => {
            result += Number(item?.weight || 0)
            return result
        }, 0)
    })()

    const isDisableNextStep = (()=>{
        return !targetSelected || targetSelected?.length === 0
    })()
    
    return (
        <Modal 
            backdrop="static" 
            keyboard={false}
            className={'register-target-from-library-modal'}
            centered 
            show={true}
            onHide={onHideRegisterTargetModal}
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
                        />
                    }
                    <ActionButton
                        stepActive={stepActive}
                        totalWeight={totalWeight}
                        isDisableNextStep={isDisableNextStep}
                        onHideRegisterTargetModal={onHideRegisterTargetModal}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default RegisterTargetFromLibraryModal
