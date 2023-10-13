import React, { useState, useEffect, useRef, Fragment } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
import { evaluationStatus, actionButton, processStep, stepEvaluation360Config, evaluation360Status, evaluationApiVersion } from '../Constants'
import Constants from '../../../commons/Constants'
import { getRequestConfigurations, getMuleSoftHeaderConfigurations, getCurrentLanguage } from '../../../commons/Utils'
import { isJsonString } from "utils/string"
import LoadingModal from '../../../components/Common/LoadingModal'
import StatusModal from '../../../components/Common/StatusModal'
import EvaluationDetailModal from '../EvaluationDetailModal'
import SearchUser from '../SearchUser'
import CustomPaging from '../../../components/Common/CustomPaging'
import HOCComponent from '../../../components/Common/HOCComponent'
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconCollapse from '../../../assets/img/icon/pms/icon-collapse.svg'
import IconSearch from '../../../assets/img/icon/Icon_Loop.svg'
import IconReject from '../../../assets/img/icon/Icon_Cancel.svg'
import IconApprove from '../../../assets/img/icon/Icon_Check.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const employeeCode = localStorage.getItem('employeeNo')
const employeeAD = localStorage.getItem('email').split('@')[0]
const approvalTabCode = 'approval'
const batchApprovalTabCode = 'batchApproval'

function AdvancedFilter(props) {
    const { t } = useTranslation()
    const { masterData, filter, updateData, tab } = props

    const currentSteps = [
        { value: evaluation360Status.waitingEvaluation, label: t("WaitingForFeedback360") },
        { value: evaluationStatus.selfAssessment, label: t("EvaluationDetailEmployeeManagerAssessment") },
        { value: evaluationStatus.qlttAssessment, label: t("EvaluationDetailEmployeeManagerApprove") },
        { value: evaluationStatus.cbldApproved, label: t("EvaluationDetailCompleted") }
    ]

    const handleInputChange = (key, value, childKey) => {
        updateData(key, value, childKey)
    }

    const showPartAdvancedSearch = () => {
        if (tab === batchApprovalTabCode) {
            return (
                <>
                    <Row>
                        <Col md={6}>
                            <Form.Group as={Row} controlId="block">
                                <Form.Label column sm={12}>{t("EvaluationDetailEmployeeDivision")}</Form.Label>
                                <Col sm={12}>
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        value={filter.block} 
                                        options={masterData.blocks} 
                                        onChange={e => handleInputChange('block', e, 'regions')} />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group as={Row} controlId="region">
                                <Form.Label column sm={12}>{t("EvaluationDetailEmployeeDepartment")}</Form.Label>
                                <Col sm={12}>
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        value={filter.region} 
                                        options={filter.regions} 
                                        onChange={e => handleInputChange('region', e, 'units')} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group as={Row} controlId="unit">
                                <Form.Label column sm={12}>{t("EvaluationMemberUnits")}</Form.Label>
                                <Col sm={12}>
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        value={filter.unit} 
                                        options={filter.units} 
                                        onChange={e => handleInputChange('unit', e, 'groups')} />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group as={Row} controlId="group">
                                <Form.Label column sm={12}>{t("EvaluationTeam")}</Form.Label>
                                <Col sm={12}>
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        isMulti 
                                        value={filter.group} 
                                        options={filter.groups} 
                                        onChange={e => handleInputChange('group', e)} />
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                </>
            )
        }

        return (
            <>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="current-step">
                            <Form.Label column sm={12}>{t("EvaluationCurrentStep")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
                                    isClearable={true} 
                                    isMulti={false}
                                    value={filter.currentStep} 
                                    options={currentSteps} 
                                    onChange={e => handleInputChange('currentStep', e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="block">
                            <Form.Label column sm={12}>{t("EvaluationDetailEmployeeDivision")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
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
                            <Form.Label column sm={12}>{t("EvaluationDetailEmployeeDepartment")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
                                    isClearable={true} 
                                    value={filter.region} 
                                    options={filter.regions} 
                                    onChange={e => handleInputChange('region', e, 'units')} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="unit">
                            <Form.Label column sm={12}>{t("EvaluationMemberUnits")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
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
                            <Form.Label column sm={12}>{t("EvaluationTeam")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
                                    isClearable={true} 
                                    isMulti 
                                    value={filter.group} 
                                    options={filter.groups} 
                                    onChange={e => handleInputChange('group', e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </>
        )
    }

    return (
        <>
            { showPartAdvancedSearch() }
            <Row>
                <Col md={3}>
                    <Form.Group as={Row} controlId="rank">
                        <Form.Label column sm={12}>{t("EvaluationGrade")}</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder={t("Select")} 
                                isClearable={true} 
                                value={filter.rank} 
                                options={masterData?.ranks} 
                                onChange={e => handleInputChange('rank', e)} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="title">
                        <Form.Label column sm={12}>{t("EvaluationTitle")}</Form.Label>
                        <Col sm={12}>
                            <Select 
                                placeholder={t("Select")} 
                                isClearable={true} 
                                value={filter.title} 
                                options={masterData?.titles} 
                                onChange={e => handleInputChange('title', e)} />
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="from-date">
                        <Form.Label column sm={12}>{t("EvaluationFromDate")}</Form.Label>
                        <Col sm={12}>
                            <label className="wrap-date-input">
                                <DatePicker
                                    selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                    onChange={fromDate => handleInputChange('fromDate', fromDate ? moment(fromDate).format('YYYY-MM-DD') : null)}
                                    dateFormat="dd/MM/yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                            </label>
                        </Col>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group as={Row} controlId="to-date">
                        <Form.Label column sm={12}>{t("EvaluationToDate")}</Form.Label>
                        <Col sm={12}>
                            <label className="wrap-date-input">
                                <DatePicker 
                                    selected={filter.toDate ? moment(filter.toDate, 'YYYY-MM-DD').toDate() : null}
                                    minDate={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                    onChange={toDate => handleInputChange('toDate', toDate ? moment(toDate).format('YYYY-MM-DD') : null)}
                                    dateFormat="dd/MM/yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                            </label>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
        </>
    )
}

function ApprovalTabContent(props) {
    const { t } = useTranslation()
    const { isOpen, handleFilter, masterData, resetPaging } = props
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
        toDate: null,
    })
    const formStatuses = [
        { value: 0, label: t("EvaluationInProgress") },
        { value: 1, label: t("EvaluationDetailCompleted") },
    ]
    const prevFilter = useRef(null)

    useEffect(() => {
        if (isOpen) {
            SetFilter({
                ...filter,
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
                toDate: null,
            })
            // resetPaging('batchApproval')
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
            ...(key === 'block' && { region: null, unit: null, group: null, units: [], groups: [] }),
            ...(key === 'region' && { unit: null, group: null, groups: [] }),
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
        handleFilter(filterToSubmit, null, null, prevFilter?.current)
        prevFilter.current = filterToSubmit
    }

    return (
        <div className="approval-tab-content">
            <Form id="approval-form" onSubmit={e => handleFormFilter(e)}>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="status">
                            <Form.Label column sm={12}>{t("Status")}</Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
                                    isClearable={true} 
                                    value={filter.status} 
                                    options={formStatuses} 
                                    onChange={e => handleInputChange('status', e)} />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="employee">
                            <Form.Label column sm={12}>{t("EvaluationSearchForEmployees")}</Form.Label>
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
                            >{t("EvaluationAdvancedSearch")}<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
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
                        <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt="Search" />{t("Search")}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

function BatchApprovalTabContent(props) {
    const { isOpen, masterData, handleFilter, processLoading, resetPaging } = props
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
        isFormFilterValid: true,
    })

    useEffect(() => {
        const processEvaluationForms = response => {
            if (response && response.data) {
                const result = response.data.result
                if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    const data = (response?.data?.data || []).map(item => {
                        return {value: item?.id, label: item?.name}
                    })
                    SetFilter({
                        ...filter,
                        isOpenFilterAdvanced: false,
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
                        isFormFilterValid: true,
                        evaluationForms: data,
                    })
                }
            }
            processLoading(false)
        }

        const fetchEvaluationForms = async () => {
            processLoading(true)
            const config = getRequestConfigurations()
            const response = await axios.get(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/listFormToApprove?EmployeeCode=${employeeCode}&ApproverEmployeeAdCode=${employeeAD}`, config)
            processEvaluationForms(response)
        }

        if (isOpen) {
            // resetPaging('approval')
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
        handleFilter(filterToSubmit)
    }

    return (
        <div className="batch-approval-tab-content">
            <Form id="batch-approval-form" onSubmit={e => handleFormFilter(e)}>
                <Row>
                    <Col md={6}>
                        <Form.Group as={Row} controlId="form">
                            <Form.Label column sm={12}>{t("EvaluationSelectForm")}<span className="required">(*)</span></Form.Label>
                            <Col sm={12}>
                                <Select 
                                    placeholder={t("Select")} 
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
                            <Form.Label column sm={12}>{t("EvaluationSearchForEmployees")}</Form.Label>
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
                            >{t("EvaluationAdvancedSearch")}<Image src={filter.isOpenFilterAdvanced ? IconCollapse : IconExpand} alt='Toggle' /></span>
                        </div>
                    </Col>
                </Row>
                <Collapse in={filter.isOpenFilterAdvanced}>
                    <div className="filter-advanced-form" id="filter-advanced-block">
                        <AdvancedFilter 
                            tab={batchApprovalTabCode}
                            masterData={{blocks: masterData.blocks, ranks: masterData.ranks, titles: masterData.titles}} 
                            filter={_.omit({...filter}, 'isOpenFilterAdvanced', 'status', 'employees', 'employee')} 
                            updateData={updateData} />
                    </div>
                </Collapse>
                <Row>
                    <Col md={12}>
                        <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt={t("Search")} />{t("Search")}</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
}

function EvaluationApproval(props) {
    const { t } = useTranslation()
    const history = useHistory()
    const [isLoading, SetIsLoading] = useState(false)
    const [isSelectedAll, SetIsSelectedAll] = useState(false)
    const [refresh, SetRefresh] = useState(false)
    const [evaluationDetailPopup, SetEvaluationDetailPopup] = useState({
        isShow: false,
        evaluationFormId: null,
        formCode: null,
        employeeCode: null,
        version: evaluationApiVersion.v1,
        isEvaluation360: false,
    })
    const [statusModal, SetStatusModal] = useState({isShow: false, isSuccess: true, content: "", needReload: true})
    const [paging, SetPaging] = useState({
        approval: {
            pageIndex: 1,
            pageSize: 10,
        },
        batchApproval: {
            pageIndex: 1,
            pageSize: 10,
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
    const [activeTab, SetActiveTab] = useState(approvalTabCode)
    const [evaluationData, SetEvaluationData] = useState({
        data: [],
        total: 0
    })
    const [dataFilter, SetDataFilter] = useState(null)

    const statusDone = 5
    const listPageSizes = [10, 20, 30, 40, 50]
    const currentSteps = [
        { value: evaluationStatus.selfAssessment, label: t("EvaluationDetailEmployeeManagerAssessment") },
        { value: evaluationStatus.qlttAssessment, label: t("EvaluationDetailEmployeeManagerApprove") },
        { value: evaluationStatus.cbldApproved, label: t("EvaluationDetailCompleted") }
    ]
    
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
                if (dataValue && dataValue?.data && dataValue?.data?.result && dataValue?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    // const data = (dataValue?.data?.data || []).map(item => {
                    //     return {value: item[key], label: item?.organization_name, parentId: item?.parent_id}
                    // })
                    return dataValue?.data?.data
                }
            }
            return null
        }

        const processMasterData = response => {
            const masterDataTemp = {...masterData}
            // const [level3Response, level4Response, level5Response, level6Response, rankAndTitleResponse] = response
            // masterDataTemp.blocks = prepareOrgData(level3Response, 'organization_lv3')
            // masterDataTemp.regions = prepareOrgData(level4Response, 'organization_lv4')
            // masterDataTemp.units = prepareOrgData(level5Response, 'organization_lv5')
            // masterDataTemp.groups = prepareOrgData(level6Response, 'organization_lv6')
            // masterDataTemp.ranks = prepareRanksAndTitles('ranks', rankAndTitleResponse)
            // masterDataTemp.titles = prepareRanksAndTitles('titles', rankAndTitleResponse)

            const [masterDataResponse] = response
            const dataPrepared = prepareOrgData(masterDataResponse)

            masterDataTemp.blocks = (dataPrepared?.listOrg3 || []).map(item => {
                return {
                    value: item?.organization_lv3,
                    label: item?.organization_name,
                    parentId: item?.parent_id
                }
            })
            masterDataTemp.regions = (dataPrepared?.listOrg4 || []).map(item => {
                return {
                    value: item?.organization_lv4,
                    label: item?.organization_name,
                    parentId: item?.parent_id
                }
            })
            masterDataTemp.units = (dataPrepared?.listOrg5 || []).map(item => {
                return {
                    value: item?.organization_lv5,
                    label: item?.organization_name,
                    parentId: item?.parent_id
                }
            })
            masterDataTemp.groups = (dataPrepared?.listOrg6 || []).map(item => {
                return {
                    value: item?.organization_lv6,
                    label: item?.organization_name,
                    parentId: item?.parent_id
                }
            })
            masterDataTemp.ranks = (dataPrepared?.ranks || []).map(item => {
                return {
                    value: item?.rank,
                    label: item?.text
                }
            })
            masterDataTemp.titles = (dataPrepared?.titles || []).map(item => {
                return {
                    value: item?.short,
                    label: item?.title
                }
            })

            SetMasterData(masterDataTemp)
            SetIsLoading(false)
        }

        const fetchMasterData = async () => {
            SetIsLoading(true)

            // const muleSoftConfig = getMuleSoftHeaderConfigurations()
            const config = getRequestConfigurations()
            let formData = new FormData()
            formData.append('ReviewerEmployeeCode', employeeCode)
            formData.append('ReviewerEmployeeAdCode', employeeAD)

            // const requestGetOrgLevel3 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=3&parent_id=${PnLOrgNumber}`, config)
            // const requestGetOrgLevel4 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=4`, config)
            // const requestGetOrgLevel5 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=5`, config)
            // const requestGetOrgLevel6 = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&level=6`, config)

            const requestGetMasterData = axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/MasterData`, formData, config)
            // const requestGetRanksAndTitles = axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/position`, muleSoftConfig)
            const response = await Promise.allSettled([requestGetMasterData])
            processMasterData(response)
        }

        fetchMasterData()
    }, [])

    useEffect(() => {
        SetDataFilter(null)

        if (activeTab === approvalTabCode) {
            const pagingTemp = {...paging}
            pagingTemp.batchApproval.pageIndex = 1
            pagingTemp.batchApproval.pageSize = listPageSizes[0]
            SetPaging(pagingTemp)

            handleFilter(null)
        } else if (activeTab === batchApprovalTabCode) {
            const pagingTemp = {...paging}
            pagingTemp.approval.pageIndex = 1
            pagingTemp.approval.pageSize = listPageSizes[0]
            SetPaging(pagingTemp)

            SetEvaluationData({
                ...evaluationData,
                data: [],
                total: 0
            })
        }

        SetRefresh(true)
    }, [activeTab])

    const handleChangePage = (key, page) => {
        const pagingTemp = {...paging}
        pagingTemp[key].pageIndex = page
        SetPaging(pagingTemp)
        handleFilter(null, page, null, dataFilter)
    }

    const prepareStatusToFilter = status => {
        if (status === null || status === undefined || status === '') {
            return ''
        }
        return status
    }

    const handleFilter = async (dataFilterInput, pageIndex = null, pageSize = null, prevFilter = null) => {
        SetIsLoading(true)
        const data = dataFilterInput ? dataFilterInput : dataFilter
        const hasFilterChanged = JSON.stringify(data) !== JSON.stringify(prevFilter)

        const config = getRequestConfigurations()
        config.headers['content-type'] = 'multipart/form-data'
        const organizationLevel6Selected = (data?.group || []).map(item => item.value)
        let apiPath = ''
        let formData = new FormData()
        
        // formData.append('PageIndex', hasFilterChanged ? 1 : paging[tab].pageIndex)
        // formData.append('PageSize', paging[tab].pageSize)
        formData.append('PageIndex', hasFilterChanged ? 1 : pageIndex ? pageIndex : paging[activeTab].pageIndex)
        formData.append('PageSize', pageSize ? pageSize : paging[activeTab].pageSize)
        formData.append('Employee', data?.employee?.value || '')
        formData.append('startDate', data?.fromDate || '')
        formData.append('endDate', data?.toDate || '')
        formData.append('organization_lv3', data?.block?.value || '')
        formData.append('organization_lv4', data?.region?.value || '')
        formData.append('organization_lv5', data?.unit?.value || '')
        formData.append('organization_lv6', organizationLevel6Selected?.length === 0 ? '' : JSON.stringify(organizationLevel6Selected))
        formData.append('employee_level', data?.rank?.value || '')
        formData.append('positionName', data?.title?.value || '')

        if (activeTab === approvalTabCode) {
            formData.append('ReviewerEmployeeCode', employeeCode || '')
            formData.append('ReviewerEmployeeAdCode', employeeAD || '')
            formData.append('CurrentStatus', prepareStatusToFilter(data?.status?.value))
            apiPath = `${process.env.REACT_APP_HRDX_PMS_URL}api/form/listReview`
        } else if (activeTab === batchApprovalTabCode) {
            if (!data?.evaluationForm?.value) {
                return
            }
            formData.append('ApproveEmployeeCode', employeeCode || '')
            formData.append('ApproveEmployeeAdCode', employeeAD || '')
            formData.append('CheckPhaseFormId', data?.evaluationForm?.value || null)
            apiPath = `${process.env.REACT_APP_HRDX_PMS_URL}api/form/listApprove`
        }
        formData.append('CurrentStep', data?.currentStep?.value || 0)
        SetDataFilter(data)

        if (hasFilterChanged) {
            SetRefresh(true)
        } else {
            SetRefresh(false)
        }

        try {
            const response = await axios.post(apiPath, formData, config)
            if (response && response?.data) {
                const result = response?.data?.result
                if (result?.code == Constants.PMS_API_SUCCESS_CODE) {
                    let data = response?.data?.data
                    if (activeTab === batchApprovalTabCode) {
                        data = [...data].map(item => ({...item, isSelected: false}))
                    }
                    SetEvaluationData({
                        ...evaluationData,
                        data: data,
                        total: result?.totalRecords || 0
                    })
                }
            }
        } finally {
            SetIsLoading(false)
        }
    }

    const handleShowEvaluationDetail = (formCode, checkPhaseFormId, employeeCode, version = evaluationApiVersion.v1, reviewStreamCode) => {
        SetEvaluationDetailPopup({
            ...evaluationDetailPopup,
            isShow: true,
            evaluationFormId: checkPhaseFormId,
            formCode: formCode,
            employeeCode: employeeCode,
            version: version,
            isEvaluation360: reviewStreamCode === processStep.level360
        })
    }

    const onHideEvaluationDetailModal = (statusModalFromChild, keepPopupEvaluationDetail = false) => {
        if (!keepPopupEvaluationDetail) {
            SetEvaluationDetailPopup({
                ...evaluationDetailPopup,
                isShow: false,
            })
        }

        if (statusModalFromChild) {
            SetStatusModal({
                ...statusModal,
                isShow: statusModalFromChild?.isShow,
                isSuccess: statusModalFromChild?.isSuccess,
                content: statusModalFromChild?.content,
                needReload: keepPopupEvaluationDetail ? false : true
            })
        }
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
                success: t("EvaluationFormApprovedSuccessfully"),
                failed: t("EvaluationFailedToApproveForm"),
            },
            [actionButton.reject]: {
                success: t("EvaluationFormSubmittedToManager"),
                failed: t("EvaluationFailedToReSubmitForm"),
            }
        }
        return messageMapping[actionCode][apiStatus]
    }

    const handleAction = async (actionCode) => {
        SetIsLoading(true)
        const statusModalTemp = {...statusModal}
        try {
            const config = getRequestConfigurations()
            const itemSelected = (evaluationData?.data || [])
            .filter(item => item?.isSelected)
            .map(item => {
                return {
                    formCode: item?.formCode,
                    Approver: item?.approver,
                    Reviewer: item?.reviewer
                }
            })

            const payload = {
                ListFormCode: itemSelected,
                type: actionCode,
                CurrentStatus: evaluationStatus.qlttAssessment
            }

            const response = await axios.post(`${process.env.REACT_APP_HRDX_PMS_URL}api/form/ApproveBothReject`, payload, config)
            SetIsLoading(false)
            statusModalTemp.isShow = true
            statusModalTemp.needReload = true
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
            statusModalTemp.needReload = true
            SetStatusModal(statusModalTemp)
        }
    }

    const onHideStatusModal = () => {
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = false
        statusModalTemp.isSuccess = true
        statusModalTemp.content = ""
        SetStatusModal(statusModalTemp)

        if (statusModalTemp.needReload) {
            window.location.reload()
        }
    }

    const processLoading = (status) => {
        SetIsLoading(status)
    }

    const handleChangePageSize = (key, pageSize) => {
        const pagingTemp = {...paging}
        pagingTemp[key].pageSize = pageSize
        pagingTemp[key].pageIndex = 1
        SetPaging(pagingTemp)
        handleFilter(null, 1, pageSize, dataFilter)
    }

    const resetPaging = key => {
        const pagingTemp = {...paging}
        pagingTemp[key].pageIndex = 1
        pagingTemp[key].pageSize = listPageSizes[0]
        SetPaging(pagingTemp)
    }

    const stepEvaluation360 = stepEvaluation360Config.map(item => {
        return {
          ...item,
          label: t(item?.label)
        }
    })

    const lang = getCurrentLanguage()

    return (
        <>
        <LoadingModal show={isLoading} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={onHideStatusModal} className='evaluation-status-modal' />
        <EvaluationDetailModal 
            isShow={evaluationDetailPopup.isShow} 
            evaluationFormId={evaluationDetailPopup.evaluationFormId} 
            formCode={evaluationDetailPopup.formCode} 
            employeeCode={evaluationDetailPopup.employeeCode} 
            version={evaluationDetailPopup?.version}
            isEvaluation360={evaluationDetailPopup?.isEvaluation360}
            onHide={onHideEvaluationDetailModal} />
        <div className="evaluation-approval-page">
            <h1 className="content-page-header">{t("EvaluationLabel")}</h1>
            <div className="filter-block">
                <div className="card card-filter">
                    <Tabs defaultActiveKey={activeTab} onSelect={key => SetActiveTab(key)}>
                        <Tab eventKey={approvalTabCode} title={t("EvaluationApprovalTab")} className="tab-item" id='approval-tab'>
                            <ApprovalTabContent 
                                isOpen={activeTab === approvalTabCode} 
                                masterData={masterData} 
                                // resetPaging={resetPaging} 
                                handleFilter={handleFilter} />
                            </Tab>
                        <Tab eventKey={batchApprovalTabCode} title={t("EvaluationBulkApproval")} className="tab-item" id='batch-approval-tab'>
                            <BatchApprovalTabContent 
                                isOpen={activeTab === batchApprovalTabCode} 
                                masterData={masterData} 
                                // resetPaging={resetPaging} 
                                handleFilter={handleFilter} 
                                processLoading={processLoading} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className="data-block">
                {
                    activeTab === approvalTabCode && 
                    <div className="card approval-data">
                    {
                        evaluationData?.data?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-form-code"><div className="form-code">{t("EvaluationFormCode")}</div></th>
                                        <th className="c-form-sender"><div className="form-sender">{t("EvaluationSubmittedBy")}</div></th>
                                        <th className="c-form-name"><div className="form-name">{t("EvaluationFormName")}</div></th>
                                        <th className="c-sent-date"><div className="sent-date">{t("EvaluationSubmittedDate")}</div></th>
                                        <th className="c-status"><div className="status">{t("EvaluationStatus")}</div></th>
                                        <th className="c-current-step"><div className="current-step">{t("EvaluationCurrentStep")}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        evaluationData?.data.map((item, index) => {
                                            let isEvaluation360 = item?.reviewStreamCode === processStep.level360
                                            let currentStep = isEvaluation360
                                            ? stepEvaluation360.find(se => se.value == item?.status)?.label
                                            : currentSteps.find(step => step?.value == item?.status)?.label
                                            let sendDate = isEvaluation360 ? (item?.runFormDate && moment(item?.runFormDate).format('DD/MM/YYYY')) : (item?.sendDateLv1 && moment(item?.sendDateLv1).format('DD/MM/YYYY'))
                                            let formCode = isEvaluation360 ? (`${item?.formCode} - ${item?.reviewFor}`) : (item?.formCode || '')
                                            let formName = isEvaluation360
                                            ? `${t("360DegreeFeedbackFormFor")} ${item?.poolUser?.fullname}`
                                            : item?.checkPhaseFormName

                                            return <tr key={index} role='button' onClick={() => handleShowEvaluationDetail(item?.formCode, item?.checkPhaseFormId, item?.employeeCode, item?.version, item?.reviewStreamCode)}>
                                                        <td className="c-form-code"><div className="form-code">{formCode}</div></td>
                                                        <td className="c-form-sender">
                                                            <div className="form-sender">{item?.poolUser?.fullname || ''}</div>
                                                            { item?.poolUser?.username && <div className="ad">({item?.poolUser?.username || ''})</div> }
                                                        </td>
                                                        <td className="c-form-name">
                                                            <div className="form-name">{formName || ''}</div>
                                                        </td>
                                                        <td className="c-sent-date"><div className="sent-date">{sendDate}</div></td>
                                                        <td className="c-status"><div className={`status ${item?.status == statusDone ? 'done' : 'in-progress'}`}>{item?.status == statusDone ? t("EvaluationDetailCompleted") : t("EvaluationInProgress")}</div></td>
                                                        <td className="c-current-step"><div className="current-step">{currentStep}</div></td>
                                                    </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>{t("EvaluationShow")}</label>
                                <select value={paging.approval.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize('approval', e?.target?.value)}>
                                    {
                                        listPageSizes.map((page, i) => {
                                            return <option value={page} key={i}>{page}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(paging.approval.pageSize)} onChangePage={(page) => handleChangePage('approval', page)} totalRecords={evaluationData?.total} needRefresh={refresh} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
                {
                    activeTab === batchApprovalTabCode &&
                    <div className="card shadow batch-approval-data">
                    {
                        evaluationData?.data?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <div className="select-item-block">
                                <input type="checkbox" checked={isSelectedAll} id="check-all" name="check-all" onChange={(e) => handleCheckboxChange(e, null)} />
                                <label htmlFor="check-all">{t("EvaluationSelectAll")}</label>
                            </div>
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"></th>
                                        {
                                            (evaluationData?.data[0]?.listGroup || []).map((item, index) => {
                                                let groupName = isJsonString(item?.groupName) ? (JSON.parse(item?.groupName)?.[lang] || JSON.parse(item?.groupName)?.['vi']) : item?.groupName
                                                return (
                                                    <th key={`n1-${index}`} className="text-center text-uppercase" colSpan="2">{ groupName }</th>
                                                )
                                            })
                                        }
                                        <th className="text-center text-uppercase highlight-third c-summary" colSpan="2">{t("EvaluationSummary")}</th>
                                    </tr>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"><div className="user-info">{t("EvaluationEmployeeFullName")}</div></th>
                                        {
                                            (evaluationData?.data[0]?.listGroup || []).map((item, index) => {
                                                return (
                                                    <Fragment key={`n2-${index}`}>
                                                        <th className="c-self-assessment"><div className="text-center self-assessment">{t("EvaluationSelfAssessment")}</div></th>
                                                        <th className="highlight-first c-cbql-assessment"><div className="text-center cbql-assessment">{t("EvaluationDetailManagerAssessment")}</div></th>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                        <th className="highlight-second c-self-assessment"><div className="text-center self-assessment">{t("EvaluationSelfAssessment")}</div></th>
                                        <th className="highlight-third c-cbql-assessment"><div className="text-center cbql-assessment">{t("EvaluationDetailManagerAssessment")}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        evaluationData?.data.map((item, i) => {
                                            // let attitudeData = item?.listGroup?.filter(item => item.groupTargetCode == 'G1')?.length > 0 ? item?.listGroup?.filter(item => item.groupTargetCode == 'G1')[0] : null
                                            // let workResultData = item?.listGroup?.filter(item => item.groupTargetCode == 'G2')?.length > 0 ? item?.listGroup?.filter(item => item.groupTargetCode == 'G2')[0] : null
                                            return (
                                                <Fragment key={`r- ${i}`}>
                                                    <tr className="divider"></tr>
                                                    <tr>
                                                        <td className="c-check"><div className="check"><input type="checkbox" checked={item?.isSelected || false} onChange={(e) => handleCheckboxChange(e, i)} /></div></td>
                                                        <td className="c-full-name"><div className="full-name">{item?.fullName || ''} ({item?.username || ''})</div></td>
                                                        {
                                                            (item?.listGroup || []).map((sub, subIndex) => {
                                                                return (
                                                                    <Fragment key={`rc-${subIndex}`}>
                                                                        <td className="text-center c-self-assessment">{sub?.seftPoint?.toFixed(2) || 0}</td>
                                                                        <td className="text-center highlight-first c-cbql-assessment">{sub?.leadReviewPoint?.toFixed(2) || 0}</td>
                                                                    </Fragment>
                                                                )
                                                            })
                                                        }
                                                        <td className="text-center highlight-second c-self-assessment">{item?.totalSeftPoint?.toFixed(2) || 0}</td>
                                                        <td className="text-center highlight-third c-cbql-assessment">{item?.totalLeadReviewPoint?.toFixed(2) || 0}</td>
                                                    </tr>
                                                </Fragment>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>{t("EvaluationShow")}</label>
                                <select value={paging.batchApproval.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize('batchApproval', e?.target?.value)}>
                                    {
                                        listPageSizes.map((page, i) => {
                                            return <option value={page} key={i}>{page}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(paging.batchApproval.pageSize)} onChangePage={(page) => handleChangePage('batchApproval', page)} totalRecords={evaluationData?.total} needRefresh={refresh} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
                {
                    activeTab === batchApprovalTabCode && evaluationData?.data?.length > 0 && 
                    <div className="button-block">
                        <button className="btn-action reject" onClick={() => handleAction(actionButton.reject)}><Image src={IconReject} alt="Reject" />{t("EvaluationDetailPartReject")}</button>
                        <button className="btn-action approve" onClick={() => handleAction(actionButton.approve)}><Image src={IconApprove} alt="Approve" />{t("EvaluationDetailPartApprove")}</button>
                    </div>
                }
            </div>
        </div>
        </>
    )
}

export default HOCComponent(EvaluationApproval)
