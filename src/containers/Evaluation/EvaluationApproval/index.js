import React, { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Modal, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import { evaluationStatus, actionButton } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations } from '../../../commons/Utils'
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import EvaluationDetailModal from '../EvaluationDetailModal'
import SearchUser from '../SearchUser'
import CustomPaging from '../../../components/Common/CustomPaging'
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconCollapse from '../../../assets/img/icon/pms/icon-collapse.svg'
import IconSearch from '../../../assets/img/icon/Icon_Loop.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const PnLOrgNumber = localStorage.getItem('organizationLv2')
const employeeCode = localStorage.getItem('employeeNo')
const employeeAD = localStorage.getItem('email').split('@')[0]

const formStatuses = [
    {value: 0, label: 'Đang đánh giá'},
    {value: 1, label: 'Hoàn thành'},
]
const currentSteps = [
    {value: evaluationStatus.selfAssessment, label: 'QLTT đánh giá'},
    {value: evaluationStatus.qlttAssessment, label: 'CBLĐ phê duyệt'},
    {value: evaluationStatus.cbldApproved, label: 'Hoàn thành'}
]

function AdvancedFilter(props) {
    const { masterData, filter, updateData } = props

    const handleInputChange = (key, value, childKey) => {
        updateData(key, value, childKey)
    }

    return (
        <>
            <Row>
                <Col md={6}>
                    <Form.Group as={Row} controlId="current-step">
                        <Form.Label column sm={12}>Bước hiện tại</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.currentStep} 
                                options={currentSteps} 
                                onChange={e => handleInputChange('currentStep', e)} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group as={Row} controlId="block">
                        <Form.Label column sm={12}>Ban/Chuỗi/Khối</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.block} 
                                options={masterData.blocks} 
                                onChange={e => handleInputChange('block', e, 'regions')} />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group as={Row} controlId="region">
                        <Form.Label column sm={12}>Phòng/Vùng/Miền</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.region} 
                                options={filter.regions} 
                                onChange={e => handleInputChange('region', e, 'units')} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group as={Row} controlId="unit">
                        <Form.Label column sm={12}>Các đơn vị thành viên</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.unit} 
                                options={filter.units} 
                                onChange={e => handleInputChange('unit', e, 'groups')} />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group as={Row} controlId="group">
                        <Form.Label column sm={12}>Phòng/Bộ phận/Nhóm</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.group} 
                                options={filter.groups} 
                                onChange={e => handleInputChange('group', e)} />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <Form.Group as={Row} controlId="rank">
                        <Form.Label column sm={12}>Cấp bậc</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.rank} 
                                options={masterData?.ranks} 
                                onChange={e => handleInputChange('rank', e)} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="title">
                        <Form.Label column sm={12}>Chức danh</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder="Lựa chọn" 
                                isClearable={true} 
                                value={filter.title} 
                                options={masterData?.titles} 
                                onChange={e => handleInputChange('title', e)} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="from-date">
                        <Form.Label column sm={12}>Từ ngày</Form.Label>
                        <Col sm={12}>
                            <DatePicker
                                selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                onChange={fromDate => handleInputChange('fromDate', fromDate ? moment(fromDate).format('YYYY-MM-DD') : null)}
                                dateFormat="dd/MM/yyyy"
                                showMonthDropdown={true}
                                showYearDropdown={true}
                                locale="vi"
                                className="form-control input" />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="to-date">
                        <Form.Label column sm={12}>Đến ngày</Form.Label>
                        <Col sm={12}>
                            <DatePicker 
                                selected={filter.toDate ? moment(filter.toDate, 'YYYY-MM-DD').toDate() : null}
                                minDate={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                onChange={toDate => handleInputChange('toDate', toDate ? moment(toDate).format('YYYY-MM-DD') : null)}
                                dateFormat="dd/MM/yyyy"
                                showMonthDropdown={true}
                                showYearDropdown={true}
                                locale="vi"
                                className="form-control input" />
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}

function ApprovalTabContent(props) {
    const { handleFilter, masterData } = props
    const [filter, SetFilter] = useState({
        isOpenFilterAdvanced: false,
        status: null,
        employees: [],
        employee: null,
        currentStep: null,
        blocks: [],
        block: null,
        regions: [],
        region: null,
        units: [],
        unit: null,
        groups: [],
        group: [],
        rank: null,
        title: null,
        fromDate: null,
        toDate: null
    })

    const updateUser = (user) => {
        SetFilter({
            ...filter,
            employee: _.omit({...user}, 'avatar', 'current_position')
        })
    }

    const handleInputChange = (key, value, childKey) => {
        let childData = []
        if (childKey) {
            switch (key) {
                case 'block':
                    childData = (masterData?.regions || []).filter(item => item?.parentId === value?.value)
                    break
                case 'region':
                    childData = (masterData?.units || []).filter(item => item?.parentId === value?.value)
                    break
                case 'unit':
                    childData = (masterData?.groups || []).filter(item => item?.parentId === value?.value)
                    break
            }
        }
        SetFilter({
            ...filter,
            [key]: value,
            ...(childKey && { [childKey]: childData }),
            ...(key === 'block' && { region: null, unit: null, group: null }),
            ...(key === 'region' && { unit: null, group: null }),
            ...(key === 'unit' && { group: null })
        })
    }

    const updateData = (key, value, childKey) => {
        handleInputChange(key, value, childKey)
    }

    const handleShowFilterAdvanced = () => {
        SetFilter({
            ...filter,
            isOpenFilterAdvanced: !filter.isOpenFilterAdvanced
        })
    }

    const handleFormFilter = (e, tab) => {
        e.preventDefault()
        const filterToSubmit = _.omit({...filter}, 'blocks', 'employees', 'groups', 'isOpenFilterAdvanced', 'regions', 'units')
        handleFilter(filterToSubmit, 'approval')
    }

    return (
        <div className="approval-tab-content">
            <Form id="approval-form" onSubmit={e => handleFormFilter(e)}>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="status">
                            <Form.Label column sm={12}>Trạng thái</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder="Lựa chọn" 
                                    isClearable={true} 
                                    value={filter.status} 
                                    options={formStatuses} 
                                    onChange={e => handleInputChange('status', e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="employee">
                            <Form.Label column sm={12}>Tìm kiếm nhân viên</Form.Label>
                            <Col sm={12}>
                                <SearchUser updateUser={updateUser} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className="filter-advanced-block">
                            <span 
                                className="btn-filter-advanced" 
                                onClick={handleShowFilterAdvanced}
                                aria-controls="filter-advanced-block"
                                aria-expanded={filter?.isOpenFilterAdvanced}
                            >Tìm kiếm nâng cao<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
                        </div>
                    </Col>
                </Row>
                <Collapse in={filter?.isOpenFilterAdvanced}>
                    <div className="filter-advanced-form" id="filter-advanced-block">
                        <AdvancedFilter 
                            masterData={{blocks: masterData.blocks, ranks: masterData.ranks, titles: masterData.titles}} 
                            filter={_.omit({...filter}, 'isOpenFilterAdvanced', 'status', 'employees', 'employee')} 
                            updateData={updateData} />
                    </div>
                </Collapse>
                <Row>
                    <Col md={12}>
                        <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt="Search" />Tìm kiếm</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

function BatchApprovalTabContent(props) {
    const { isOpen, masterData, handleFilter, processLoading } = props
    const { t } = useTranslation()
    const [filter, SetFilter] = useState({
        isOpenFilterAdvanced: false,
        evaluationForms: [],
        evaluationForm: null,
        employees: [],
        employee: null,
        currentStep: null,
        blocks: [],
        block: null,
        regions: [],
        region: null,
        units: [],
        unit: null,
        groups: [],
        group: [],
        rank: null,
        title: null,
        fromDate: null,
        toDate: null,
        isFormFilterValid: true
    })

    useEffect(() => {
        const processEvaluationForms = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.PMS_API_SUCCESS_CODE) {
                    const data = (response?.data?.data || []).map(item => {
                        return {value: item?.id, label: item?.name}
                    })
                    SetFilter({
                        ...filter,
                        evaluationForms: data
                    })
                }
            }
            processLoading(false)
        }

        const fetchEvaluationForms = async () => {
            processLoading(true)
            const config = getRequestConfigurations()
            const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listFormToApprove?EmployeeCode=${employeeCode}`, config)
            processEvaluationForms(response)
        }

        if (isOpen && filter.evaluationForms?.length === 0) {
            fetchEvaluationForms()
        }
    }, [isOpen])

    const updateUser = (user) => {
        SetFilter({
            ...filter,
            employee: _.omit({...user}, 'avatar', 'current_position')
        })
    }

    const handleInputChange = (key, value, childKey) => {
        let childData = []
        if (childKey) {
            switch (key) {
                case 'block':
                    childData = (masterData?.regions || []).filter(item => item?.parentId === value?.value)
                    break
                case 'region':
                    childData = (masterData?.units || []).filter(item => item?.parentId === value?.value)
                    break
                case 'unit':
                    childData = (masterData?.groups || []).filter(item => item?.parentId === value?.value)
                    break
            }
        }
        SetFilter({
            ...filter,
            [key]: value,
            ...(childKey && { [childKey]: childData }),
            ...(key === 'block' && { region: null, unit: null, group: null }),
            ...(key === 'region' && { unit: null, group: null }),
            ...(key === 'unit' && { group: null })
        })
    }

    const updateData = (key, value, childKey) => {
        handleInputChange(key, value, childKey)
    }

    const handleShowFilterAdvanced = () => {
        SetFilter({
            ...filter,
            isOpenFilterAdvanced: !filter.isOpenFilterAdvanced
        })
    }

    const isFormFilterValid = () => {
        let isValid = true
        if (!filter.evaluationForm || _.size(filter.evaluationForm) === 0) {
            isValid = false
        }
        SetFilter({
            ...filter,
            isFormFilterValid: isValid
        })
        return isValid
    }

    const handleFormFilter = (e) => {
        e.preventDefault()
        const isValid = isFormFilterValid()
        if (!isValid) {
            return
        }

        const filterToSubmit = _.omit({...filter}, 'evaluationForms', 'blocks', 'employees', 'groups', 'isOpenFilterAdvanced', 'regions', 'units')
        handleFilter(filterToSubmit, 'batchApproval')
    }

    return (
        <div className="batch-approval-tab-content">
            <Form id="batch-approval-form" onSubmit={e => handleFormFilter(e)}>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="form">
                            <Form.Label column sm={12}>Chọn biểu mẫu<span className="required">(*)</span></Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder="Lựa chọn" 
                                    isClearable={true} 
                                    value={filter.evaluationForm} 
                                    options={filter.evaluationForms} 
                                    onChange={e => handleInputChange('evaluationForm', e)} />
                            </Col>
                            <Col sm={12}>
                                {
                                    !filter.isFormFilterValid && <p className="alert alert-danger invalid-message" role="alert">{t('Required')}</p>
                                }
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="employee">
                            <Form.Label column sm={12}>Tìm kiếm nhân viên</Form.Label>
                            <Col sm={12}>
                                <SearchUser updateUser={updateUser} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className="filter-advanced-block">
                            <span 
                                className="btn-filter-advanced" 
                                onClick={handleShowFilterAdvanced}
                                aria-controls="filter-advanced-block"
                                aria-expanded={filter.isOpenFilterAdvanced}
                            >Tìm kiếm nâng cao<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
                        </div>
                    </Col>
                </Row>
                <Collapse in={filter.isOpenFilterAdvanced}>
                    <div className="filter-advanced-form" id="filter-advanced-block">
                        <AdvancedFilter 
                            masterData={{blocks: masterData.blocks, ranks: masterData.ranks, titles: masterData.titles}} 
                            filter={_.omit({...filter}, 'isOpenFilterAdvanced', 'status', 'employees', 'employee')} 
                            updateData={updateData} />
                    </div>
                </Collapse>
                <Row>
                    <Col md={12}>
                        <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt="Search" />Tìm kiếm</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

function EvaluationApproval(props) {
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [isSelectedAll, SetIsSelectedAll] = useState(false)
    const [evaluationDetailPopup, SetEvaluationDetailPopup] = useState({
        isShow: false,
        evaluationFormId: null,
        formCode: null,
        employeeCode: null
    })
    const [statusModal, SetStatusModal] = useState({isShow: false, isSuccess: true, content: ""})
    const [paging, SetPaging] = useState({
        approval: {
            pageIndex: 1,
            pageSize: 10
        },
        batchApproval: {
            pageIndex: 1,
            pageSize: 10
        }
    })
    const [masterData, SetMasterData] = useState({
        blocks: [],
        regions: [],
        units: [],
        groups: [],
        ranks: [],
        titles: []
    })
    const [hasChangePageSize, SetHasChangePageSize] = useState(false)
    const [activeTab, SetActiveTab] = useState('approval')
    const [evaluationData, SetEvaluationData] = useState({
        data: [],
        total: 0
    })
    const [dataFilter, SetDataFilter] = useState(null)

    const statusDone = 5
    const listPageSizes = [10, 20, 30, 40, 50]

    const useHasChanged= (val) => {
        const prevVal = usePrevious(val)
        return prevVal !== val
    }
    
    const usePrevious = (value) => {
        const ref = useRef()
        useEffect(() => {
          ref.current = value
        })
        return ref.current
    }

    const hasPageIndexChanged = useHasChanged(paging[activeTab].pageIndex)
    
    useEffect(() => {
        const prepareRanksAndTitles = (name, raw) => {
            // const rankCodeLevelMapping = {
            //     'C': {value: 'C', label: 'C'},
            //     'C1': {value: 'C', label: 'C'},
            //     'M0': {value: 'CV', label: 'Chuyên viên'},
            //     'M1': {value: 'CV', label: 'Chuyên viên'},
            //     'M2': {value: 'CV', label: 'Chuyên viên'},
            //     'M3': {value: 'CV', label: 'Chuyên viên'},
            //     'L0': {value: 'CG', label: 'Chuyên gia'},
            //     'L1': {value: 'CG', label: 'Chuyên gia'},
            //     'L2': {value: 'CG', label: 'Chuyên gia'},
            //     'L3': {value: 'CG', label: 'Chuyên gia'},
            //     'L4': {value: 'CG', label: 'Chuyên gia'},
            //     'N0': {value: 'NV', label: 'Nhân viên'},
            //     'N1': {value: 'NV', label: 'Nhân viên'},
            //     'N2': {value: 'NV', label: 'Nhân viên'},
            //     'N3': {value: 'NV', label: 'Nhân viên'}
            // }
    
            if (raw && raw?.status === 'fulfilled') {
                const dataValue = raw?.value
                if (dataValue && dataValue?.data && dataValue?.data?.result && dataValue?.data?.result?.code == Constants.API_SUCCESS_CODE) {
                    const ranksAndTitles = dataValue?.data?.data
                    let result = (ranksAndTitles[name] || []).map(item => {
                        return item && { value: name === "titles" ? item.short : item.rank,
                        label: name === "titles" ? item.title : `${item.text} (${item.rank})` }
                    })
                    result =  _.uniqWith(result, _.isEqual)
                    return result
                }
            }
            return []
        }

        const prepareOrgData = (raw, key) => {
            if (raw && raw?.status === 'fulfilled') {
                const dataValue = raw?.value
                if (dataValue && dataValue?.data && dataValue?.data?.result && dataValue?.data?.result?.code == Constants.API_SUCCESS_CODE) {
                    const data = (dataValue?.data?.data || []).map(item => {
                        return {value: item[key], label: item?.organization_name, parentId: item?.parent_id}
                    })
                    return data
                }
            }
            return []
        }

        const processMasterData = response => {
            const masterDataTemp = {...masterData}
            const [level3Response, level4Response, level5Response, level6Response, rankAndTitleResponse] = response
            masterDataTemp.blocks = prepareOrgData(level3Response, 'organization_lv3')
            masterDataTemp.regions = prepareOrgData(level4Response, 'organization_lv4')
            masterDataTemp.units = prepareOrgData(level5Response, 'organization_lv5')
            masterDataTemp.groups = prepareOrgData(level6Response, 'organization_lv6')
            masterDataTemp.ranks = prepareRanksAndTitles('ranks', rankAndTitleResponse)
            masterDataTemp.titles = prepareRanksAndTitles('titles', rankAndTitleResponse)
            SetMasterData(masterDataTemp)
            if (isLoading) {
                SetIsLoading(false)
            }
        }

        const fetchMasterData = async () => {
            if (!isLoading) {
                SetIsLoading(true)
            }
            const config = getMuleSoftHeaderConfigurations()
            const requestGetOrgLevel3 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=3&parent_id=${PnLOrgNumber}`, config)
            const requestGetOrgLevel4 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=4`, config)
            const requestGetOrgLevel5 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=5`, config)
            const requestGetOrgLevel6 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=6`, config)
            const requestGetRanksAndTitles = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/position`, config)
            const response = await Promise.allSettled([requestGetOrgLevel3, requestGetOrgLevel4, requestGetOrgLevel5, requestGetOrgLevel6, requestGetRanksAndTitles])
            processMasterData(response)
        }

        fetchMasterData()
    }, [])

    useEffect(() => {
        const pagingTemp = {...paging}
        pagingTemp.approval.pageIndex = 1
        pagingTemp.batchApproval.pageIndex = 1
        SetPaging(pagingTemp)
        handleFilter(dataFilter, activeTab)
    }, [paging[activeTab].pageSize])

    useEffect(() => {
        if (hasPageIndexChanged) {
            handleFilter(dataFilter, activeTab)
        }
    }, [paging[activeTab].pageIndex])
    
    const handleChangePage = (key, page) => {
        const pagingTemp = {...paging}
        pagingTemp[key].pageIndex = page
        SetPaging(pagingTemp)
    }

    const handleTabChange = key => {
        SetActiveTab(key)
        SetEvaluationData({
            ...evaluationData,
            data: [],
            total: 0
        })
    }

    const handleFilter = async (data, tab) => {
        SetIsLoading(true)
        SetDataFilter(data)
        const config = getRequestConfigurations()
        config.headers['content-type'] = 'multipart/form-data'
        const organizationLevel6Selected = (data?.group || []).map(item => item.value)
        let apiPath = ''
        let formData = new FormData()
        formData.append('PageIndex', paging[tab].pageIndex)
        formData.append('PageSize', paging[tab].pageSize)
        formData.append('Employee', data?.employee?.value || '')
        formData.append('startDate', data?.fromDate || '')
        formData.append('endDate', data?.toDate || '')
        formData.append('organization_lv3', data?.block?.value || '')
        formData.append('organization_lv4', data?.region?.value || '')
        formData.append('organization_lv5', data?.unit?.value || '')
        formData.append('organization_lv6', organizationLevel6Selected?.length === 0 ? '' : JSON.stringify(organizationLevel6Selected))
        formData.append('employee_level', data?.rank?.value || '')
        formData.append('positionName', data?.title?.value || '')

        if (tab === 'approval') {
            formData.append('ReviewerEmployeeCode', employeeCode || '')
            formData.append('ReviewerEmployeeAdCode', employeeAD || '')
            formData.append('CurrentStatus', data?.status?.value)
            apiPath = `${process.env.REACT_APP_HRDX_PMS_URL}api/form/listReview`
        } else if (tab === 'batchApproval') {
            formData.append('ApproveEmployeeCode', employeeCode || '')
            formData.append('ApproveEmployeeAdCode', employeeAD || '')
            formData.append('CheckPhaseFormId', data?.evaluationForm?.value || null)
            apiPath = `${process.env.REACT_APP_HRDX_PMS_URL}api/form/listApprove`
        }
        formData.append('CurrentStep', data?.currentStep?.value || 0)
     
        try {
            const response = await axios.post(apiPath, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    let data = response?.data?.data
                    if (tab === 'batchApproval') {
                        data = [...data].map(item => ({...item, isSelected: false}))
                    }
                    SetEvaluationData({
                        ...evaluationData,
                        data: data,
                        total: result?.totalRecords || 0
                    })
                }
            }
            SetIsLoading(false)
        } catch (e) {
            SetIsLoading(false)
        }
    }

    const handleShowEvaluationDetailPopup = (formCode, checkPhaseFormId, employeeCode) => {
        SetEvaluationDetailPopup({
            ...evaluationDetailPopup,
            isShow: true,
            evaluationFormId: checkPhaseFormId,
            formCode: formCode,
            employeeCode: employeeCode
        })
    }

    const onHideEvaluationDetailModal = (statusModalFromChild) => {
        SetEvaluationDetailPopup({
            ...evaluationDetailPopup,
            isShow: false,
            evaluationFormId: null,
            formCode: null,
            employeeCode: null
        })

        SetStatusModal({
            ...statusModal,
            isShow: statusModalFromChild?.isShow,
            isSuccess: statusModalFromChild?.isSuccess,
            content: statusModalFromChild?.content
        })
    }

    const isAllEvaluationFormSelected = (data) => {
        const isSelectedAll = (data || []).every(item => item?.isSelected)
        return isSelectedAll
    }

    const handleCheckboxChange = (element, index) => {
        const value = element?.target?.checked || false
        const evaluationDataTemp = {...evaluationData}
        if (index !== null) {
            evaluationDataTemp.data[index].isSelected = value
            const isSelectedAllEvaluationForm = isAllEvaluationFormSelected(evaluationDataTemp.data)
            SetIsSelectedAll(isSelectedAllEvaluationForm)
            SetEvaluationData(evaluationDataTemp)
        } else {
            SetIsSelectedAll(value)
            if (value) {
                evaluationDataTemp.data = [...evaluationDataTemp.data].map(item => ({...item, isSelected: true}))
            } else {
                evaluationDataTemp.data = [...evaluationDataTemp.data].map(item => ({...item, isSelected: false}))
            }
            SetEvaluationData(evaluationDataTemp)
        }
    }

    const getResponseMessages = (actionCode, apiStatus) => {
        const messageMapping = {
            [actionButton.approve]: {
                success: 'Phê duyệt biểu mẫu thành công!',
                failed: 'Phê duyệt biểu mẫu thất bại. Xin vui lòng thử lại!',
            },
            [actionButton.reject]: {
                success: 'Biểu mẫu đã được gửi lại QLTT thành công!',
                failed: 'Biểu mẫu chưa được gửi lại QLTT. Xin vui lòng thử lại!',
            }
        }
        return messageMapping[actionCode][apiStatus]
    }

    const handleAction = async (actionCode) => {
        SetIsLoading(true)
        const statusModalTemp = {...statusModal}
        try {
            const config = getRequestConfigurations()
            const formCodeSelected = evaluationData?.data.filter(item => item?.isSelected).map(item => item?.formCode)
            const payload = {
                ListFormCode: formCodeSelected,
                type: actionCode,
                CurrentStatus: evaluationStatus.qlttAssessment
            }
            const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/ApproveBothReject`, payload, config)
            SetIsLoading(false)
            statusModalTemp.isShow = true
            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.PMS_API_SUCCESS_CODE) {
                    statusModalTemp.isSuccess = true
                    statusModalTemp.content = getResponseMessages(actionCode, 'success')
                } else {
                    statusModalTemp.isSuccess = false
                    statusModalTemp.content = getResponseMessages(actionCode, 'failed')
                }
            } else {
                statusModalTemp.isSuccess = false
                statusModalTemp.content = getResponseMessages(actionCode, 'failed')
            }
            SetStatusModal(statusModalTemp)
        } catch (e) {
            SetIsLoading(false)
            statusModalTemp.isShow = false
            statusModalTemp.isSuccess = false
            statusModalTemp.content = t("AnErrorOccurred")
            SetStatusModal(statusModalTemp)
        }
    }

    const onHideStatusModal = () => {
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = false
        statusModalTemp.isSuccess = true
        statusModalTemp.content = ""
        SetStatusModal(statusModalTemp)
        window.location.reload()
    }

    const processLoading = (status) => {
        SetIsLoading(status)
    }

    const handleChangePageSize = (key, e) => {
        const pagingTemp = {...paging}
        pagingTemp[key].pageSize = e?.target?.value
        SetPaging(pagingTemp)
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} />
        <EvaluationDetailModal 
            isShow={evaluationDetailPopup.isShow} 
            evaluationFormId={evaluationDetailPopup.evaluationFormId} 
            formCode={evaluationDetailPopup.formCode} 
            employeeCode={evaluationDetailPopup.employeeCode} 
            onHide={onHideEvaluationDetailModal} />
        <div className="evaluation-approval-page">
            <h1 className="content-page-header">Đánh giá</h1>
            <div className="filter-block">
                <div className="card shadow card-filter">
                    <Tabs id="filter-tabs" defaultActiveKey={activeTab} onSelect={key => handleTabChange(key)}>
                        <Tab eventKey="approval" title='Đánh giá/Phê duyệt' className="tab-item">
                            <ApprovalTabContent 
                                masterData={masterData} 
                                hasChangePageSize={hasChangePageSize} 
                                handleFilter={handleFilter} />
                        </Tab>
                        <Tab eventKey="batchApproval" title='Phê duyệt hàng loạt' className="tab-item">
                            <BatchApprovalTabContent 
                                isOpen={activeTab === 'batchApproval'} 
                                masterData={masterData} 
                                hasChangePageSize={hasChangePageSize} 
                                handleFilter={handleFilter} 
                                processLoading={processLoading} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className="data-block">
                {
                    activeTab === 'approval' && 
                    <div className="card shadow approval-data">
                    {
                        evaluationData?.data?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-form-code"><div className="form-code">Mã biểu mẫu</div></th>
                                        <th className="c-form-sender"><div className="form-sender">Người gửi biểu mẫu</div></th>
                                        <th className="c-form-name"><div className="form-name">Tên biểu mẫu</div></th>
                                        <th className="c-sent-date"><div className="sent-date">Ngày gửi</div></th>
                                        <th className="c-status"><div className="status">Tình trạng</div></th>
                                        <th className="c-current-step"><div className="current-step">Bước hiện tại</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        evaluationData?.data.map((item, index) => {
                                            return <tr key={index}>
                                                        <td className="c-form-code"><div className="form-code" onClick={() => handleShowEvaluationDetailPopup(item?.formCode, item?.checkPhaseFormId, item?.employeeCode)}>{item?.formCode || ''}</div></td>
                                                        <td className="c-form-sender"><div className="form-sender">{item?.poolUser?.fullname || ''}</div></td>
                                                        <td className="c-form-name"><div className="form-name">{item?.checkPhaseFormName || ''}</div></td>
                                                        <td className="c-sent-date"><div className="sent-date">{item?.sendDateLv1 && moment(item?.sendDateLv1).format('DD/MM/YYYY')}</div></td>
                                                        <td className="c-status"><div className={`status ${item?.status == statusDone ? 'done' : 'in-progress'}`}>{item?.status == statusDone ? 'Đã hoàn thành' : 'Đang đánh giá'}</div></td>
                                                        <td className="c-current-step"><div className="current-step">{currentSteps.find(step => step?.value == item?.status)?.label}</div></td>
                                                    </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select value={paging.approval.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize('approval', e)}>
                                    {
                                        listPageSizes.map((page, i) => {
                                            return <option value={page} key={i}>{page}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(paging.approval.pageSize)} onChangePage={(page) => handleChangePage('approval', page)} totalRecords={evaluationData?.total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
                {
                    activeTab === 'batchApproval' &&
                    <div className="card shadow batch-approval-data">
                    {
                        evaluationData?.data?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <div className="select-item-block">
                                <input type="checkbox" checked={isSelectedAll} id="check-all" name="check-all" onChange={(e) => handleCheckboxChange(e, null)} />
                                <label htmlFor="check-all">Chọn tất cả</label>
                            </div>
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"></th>
                                        <th className="text-center text-uppercase c-attitude" colSpan="2">Tinh thần thái độ</th>
                                        <th className="text-center text-uppercase c-work-results" colSpan="2">Kết quả công việc</th>
                                        <th className="text-center text-uppercase highlight-third c-summary" colSpan="2">Tổng kết</th>
                                    </tr>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"><div className="user-info">Họ và tên CBNV được đánh giá</div></th>
                                        <th className="c-self-assessment"><div className="text-center self-assessment">Tự đánh giá</div></th>
                                        <th className="highlight-first c-cbql-assessment"><div className="text-center cbql-assessment">CBQL đánh giá</div></th>
                                        <th className="c-self-assessment"><div className="text-center self-assessment">Tự đánh giá</div></th>
                                        <th className="highlight-first c-cbql-assessment"><div className="text-center cbql-assessment">CBQL đánh giá</div></th>
                                        <th className="highlight-second c-self-assessment"><div className="text-center self-assessment">Tự đánh giá</div></th>
                                        <th className="highlight-third c-cbql-assessment"><div className="text-center cbql-assessment">CBQL đánh giá</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        evaluationData?.data.map((item, i) => {
                                            let attitudeData = item?.listGroup[0]
                                            let workResultData = item?.listGroup[1]
                                            return <Fragment key={i}>
                                                        <tr className="divider"></tr>
                                                        <tr>
                                                            <td className="c-check"><div className="check"><input type="checkbox" checked={item?.isSelected || false} onChange={(e) => handleCheckboxChange(e, i)} /></div></td>
                                                            <td className="c-full-name"><div className="full-name">{item?.fullName || ''}</div></td>
                                                            <td className="text-center c-self-assessment">{attitudeData?.seftPoint || 0}</td>
                                                            <td className="text-center highlight-first c-cbql-assessment">{attitudeData?.leadReviewPoint || 0}</td>
                                                            <td className="text-center c-self-assessment">{workResultData?.seftPoint || 0}</td>
                                                            <td className="text-center highlight-first c-cbql-assessment">{workResultData?.leadReviewPoint || 0}</td>
                                                            <td className="text-center highlight-second c-self-assessment">{item?.totalSeftPoint || 0}</td>
                                                            <td className="text-center highlight-third c-cbql-assessment">{item?.totalLeadReviewPoint || 0}</td>
                                                        </tr>
                                                    </Fragment>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select value={paging.batchApproval.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize('batchApproval', e)}>
                                    {
                                        listPageSizes.map((page, i) => {
                                            return <option value={page} key={i}>{page}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(paging.batchApproval.pageSize)} onChangePage={(page) => handleChangePage('batchApproval', page)} totalRecords={evaluationData?.total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
                {
                    activeTab === 'batchApproval' && evaluationData?.data?.length > 0 && 
                    <div className="button-block">
                        <button className="btn-action reject" onClick={() => handleAction(actionButton.reject)}><Image src={IconReject} alt="Reject" />Từ chối</button>
                        <button className="btn-action approve" onClick={() => handleAction(actionButton.approve)}><Image src={IconApprove} alt="Approve" />Phê duyệt</button>
                    </div>
                }
            </div>
        </div>
        </>
    )
}

export default EvaluationApproval