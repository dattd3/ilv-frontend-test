import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Modal, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import { evaluationStatus } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations } from '../../../commons/Utils'
import LoadingModal from '../../../components/Common/LoadingModal'
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
const formStatuses = [
    {value: 0, label: 'Đang đánh giá'},
    {value: 1, label: 'Hoàn thành'},
]
const currentSteps = [
    // {value: evaluationStatus.launch, label: 'Tự đánh giá'},
    {value: evaluationStatus.selfAssessment, label: 'QLTT đánh giá'},
    {value: evaluationStatus.qlttAssessment, label: 'CBLĐ phê duyệt'},
    // {value: evaluationStatus.launch, label: 'Hoàn thành'},
]

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
        console.log("user selected ...")
        console.log(user)
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
                                aria-controls="approval-form-filter-advanced-collapse"
                                aria-expanded={filter.isOpenFilterAdvanced}
                            >Tìm kiếm nâng cao<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
                        </div>
                    </Col>
                </Row>
                <Collapse in={filter.isOpenFilterAdvanced}>
                    <div id="approval-form-filter-advanced-collapse" className="filter-advanced-form">
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
        console.log("user selected ...")
        console.log(user)
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

    const handleShowFilterAdvanced = () => {
        SetFilter({
            ...filter,
            isOpenFilterAdvanced: !filter.isOpenFilterAdvanced
        })
    }

    const handleFormFilter = (e, tab) => {
        e.preventDefault()
        handleFilter()
    }

    return (
        <div className="batch-approval-tab-content">
            <Form id="batch-approval-form" onSubmit={e => handleFormFilter(e, 'batch-approval')}>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="form">
                            <Form.Label column sm={12}>Chọn biểu mẫu<span className="required">(*)</span></Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder="Lựa chọn" 
                                    isClearable={true} 
                                    value={null} 
                                    options={[]} 
                                    onChange={e => handleInputChange('form', e)} />
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
                                aria-controls="approval-form-filter-advanced-collapse"
                                aria-expanded={filter.isOpenFilterAdvanced}
                            >Tìm kiếm nâng cao<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
                        </div>
                    </Col>
                </Row>
                <Collapse in={filter.isOpenFilterAdvanced}>
                    <div id="approval-form-filter-advanced-collapse" className="filter-advanced-form">
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
    const [paging, SetPaging] = useState({
        pageIndex: 1,
        pageSize: 10
    })
    const [masterData, SetMasterData] = useState({
        blocks: [],
        regions: [],
        units: [],
        groups: [],
        ranks: [],
        titles: []
    })
    const [activeTab, SetActiveTab] = useState('approval')

    const evaluationForms = [1]
    const pageSize = 10
    const total = 30

    useEffect(() => {
        const prepareRanksAndTitles = (name, raw) => {
            const rankCodeLevelMapping = {
                'C': {value: 'C', label: 'C'},
                'C1': {value: 'C', label: 'C'},
                'M0': {value: 'CV', label: 'Chuyên viên'},
                'M1': {value: 'CV', label: 'Chuyên viên'},
                'M2': {value: 'CV', label: 'Chuyên viên'},
                'M3': {value: 'CV', label: 'Chuyên viên'},
                'L0': {value: 'CG', label: 'Chuyên gia'},
                'L1': {value: 'CG', label: 'Chuyên gia'},
                'L2': {value: 'CG', label: 'Chuyên gia'},
                'L3': {value: 'CG', label: 'Chuyên gia'},
                'L4': {value: 'CG', label: 'Chuyên gia'},
                'N0': {value: 'NV', label: 'Nhân viên'},
                'N1': {value: 'NV', label: 'Nhân viên'},
                'N2': {value: 'NV', label: 'Nhân viên'},
                'N3': {value: 'NV', label: 'Nhân viên'}
            }
    
            if (raw && raw?.status === 'fulfilled') {
                const dataValue = raw?.value
                if (dataValue && dataValue?.data && dataValue?.data?.result && dataValue?.data?.result?.code == Constants.API_SUCCESS_CODE) {
                    const ranksAndTitles = dataValue?.data?.data
                    let result = (ranksAndTitles[name] || []).map(item => {
                        return item && { value: name === "titles" ? item.short : rankCodeLevelMapping[item.rank] ? rankCodeLevelMapping[item.rank].value : item.rank,
                        label: name === "titles" ? item.title : rankCodeLevelMapping[item.rank] ? rankCodeLevelMapping[item.rank].label : item.text }
                    })
                    result =  _.uniqWith(result, _.isEqual)
                    return result
                }
            }

            return []

            // if (rankAndTitleResponses && rankAndTitleResponses.data) {
            //     const ranksAndTitles = rankAndTitleResponses.data.data
            //     const result = (ranksAndTitles[name] || []).map(item => {
            //         return item && { value: name === "titles" ? item.short : rankCodeLevelMapping[item.rank] ? rankCodeLevelMapping[item.rank].value : item.rank,
            //         label: name === "titles" ? item.title : rankCodeLevelMapping[item.rank] ? rankCodeLevelMapping[item.rank].label : item.text }
            //     });
            //     this.setState({[nameMappingState[name]] : _.uniqWith(result, _.isEqual)});
            // }
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
            SetIsLoading(false)
        }

        const fetchMasterData = async () => {
            SetIsLoading(true)
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

    const onChangePage = () => {

    }

    const handleFilter = async (data, tab) => {
        SetIsLoading(true)
        const config = getRequestConfigurations()
        config.headers['content-type'] = 'multipart/form-data'
        const organizationLevel6Selected = (data?.group || []).map(item => item.value)
        let formData = new FormData()
        formData.append('PageIndex', paging.pageIndex)
        formData.append('PageSize', paging.pageSize)
        formData.append('startDate', data?.fromDate || '')
        formData.append('endDate', data?.toDate || '')
        formData.append('organization_lv3', data?.block?.value || '')
        formData.append('organization_lv4', data?.region?.value || '')
        formData.append('organization_lv5', data?.unit?.value || '')
        formData.append('organization_lv6', organizationLevel6Selected?.length === 0 ? '' : JSON.stringify(organizationLevel6Selected))
        formData.append('employee_level', data?.rank?.value || '')
        formData.append('positionName', data?.title?.value || '')
        formData.append('ReviewerEmployeeCode', localStorage.getItem('employeeNo') || '')
        formData.append('CurrentStatus', data?.status?.value || null)
        formData.append('CurrentStep', data?.currentStep?.value || 0)
     
        if (tab === 'approval') {
            const response = await axios.post(`${process.env.REACT_APP_HRDX_URL}api/form/listReview`, formData, config)
            SetIsLoading(false)
            console.log("TTTYYYYYYYYYYYYYYYYY")
            console.log(response)
            // console.log(data)
        }

        if (tab === 'batch-approval') {

        }
    }

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="evaluation-approval-page">
            <h1 className="content-page-header">Đánh giá</h1>
            <div className="filter-block">
                <div className="card shadow card-filter">
                    <Tabs id="filter-tabs" defaultActiveKey={activeTab} onSelect={key => SetActiveTab(key)}>
                        <Tab eventKey="approval" title='Đánh giá/Phê duyệt' className="tab-item">
                            <ApprovalTabContent masterData={masterData} handleFilter={handleFilter} />
                        </Tab>
                        <Tab eventKey="batch-approval" title='Phê duyệt hàng loạt' className="tab-item">
                            <BatchApprovalTabContent masterData={masterData} handleFilter={handleFilter} />
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <div className="data-block">
                {
                    activeTab === 'approval' && 
                    <div className="card shadow approval-data">
                    {
                        evaluationForms?.length > 0 ?
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
                                    <tr>
                                        <td className="c-form-code"><div className="form-code">A12345</div></td>
                                        <td className="c-form-sender"><div className="form-sender">Nguyễn Văn An</div></td>
                                        <td className="c-form-name"><div className="form-name">Biểu mẫu Q1/2022</div></td>
                                        <td className="c-sent-date"><div className="sent-date">01/03/2021</div></td>
                                        <td className="c-status"><div className="status">Đang đánh giá</div></td>
                                        <td className="c-current-step"><div className="current-step">QLTT đánh giá</div></td>
                                    </tr>
                                    <tr>
                                        <td className="c-form-code"><div className="form-code">A12345</div></td>
                                        <td className="c-form-sender"><div className="form-sender">Nguyễn Văn An</div></td>
                                        <td className="c-form-name"><div className="form-name">Biểu mẫu Q1/2022</div></td>
                                        <td className="c-sent-date"><div className="sent-date">01/03/2021</div></td>
                                        <td className="c-status"><div className="status">Đang đánh giá</div></td>
                                        <td className="c-current-step"><div className="current-step">QLTT đánh giá</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select>
                                    <option></option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }

                {
                    activeTab === 'batch-approval' &&
                    <div className="card shadow batch-approval-data">
                    {
                        evaluationForms?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <div className="select-item-block">
                                <input type="checkbox" checked={false} id="check-all" name="check-all" />
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
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="text-center c-self-assessment">80</td>
                                        <td className="text-center highlight-first c-cbql-assessment">85</td>
                                        <td className="text-center c-self-assessment">100</td>
                                        <td className="text-center highlight-first c-cbql-assessment">90</td>
                                        <td className="text-center highlight-second c-self-assessment">96</td>
                                        <td className="text-center highlight-third c-cbql-assessment">89</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select>
                                    <option></option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
                <div className="button-block">
                    <button className="btn-action reject"><Image src={IconReject} alt="Reject" />Từ chối</button>
                    <button className="btn-action approve"><Image src={IconApprove} alt="Approve" />Phê duyệt</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default EvaluationApproval