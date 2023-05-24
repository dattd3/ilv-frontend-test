import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import _, { debounce } from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from "../../../commons/Constants"
import AttachmentComponent from "../TerminationComponents/AttachmentComponent"
import { t } from 'i18next'
import { validateFileMimeType, validateTotalFileSize } from '../../../utils/file'
import { IS_VINFAST } from 'commons/commonFunctions'

class ResignationRequestsManagementActionButton extends React.PureComponent {
    
    constructor(props) {
        super(props)
        this.state = {
            exportOption: null,
            keywords: "",
            keywordsTyping: "",
            advancedData: {
                employeeNo: null,
                department: null,
                handoverStatus: null,
                approvalStatus: null
            },
            massType: null,
            massKey: null,
            files: [],
            showAdvanced: false
        }
        this.searchForm = React.createRef(null);
        this.onInputChange = debounce(this.updateKeywordsToFilter, 800)
        this.statusOptions = [
            {value: 0, label: props.t('unfinished')},
            {value: 1, label: props.t('accomplished')}
        ];
        this.approvalOptions = [
            {value: 8, label: props.t('Waiting') },
            {value: 5, label: props.t('Consented') },
            {value: 2, label: props.t('Approved')},
            {value: 1, label: props.t('Rejected')}   
        ]
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.searchForm.current && !this.searchForm.current.contains(event?.target) && !['svg', 'path'].includes(event?.target?.tagName)) {
           this.hideAdvanceSearch();
          }
    }

    hideAdvanceSearch = () => {
        this.setState({showAdvanced: false});
    }

    handleInputAdvancedChange = (e, name) => {
        const value = e ? e.target.value || null : null
        this.setState({advancedData: {
            ...this.state.advancedData,
            [name]: value
        }});
    }

    handleSelectAdvancedChange = (e, name) => {
        const exportOption = e ? e : {}
        this.setState({advancedData: {
            ...this.state.advancedData,
            [name]: exportOption.value
        }});
    }

    handleInputChange = (e) => {
        const value = e ? e.target.value || "" : ""
        this.setState({ keywords: value || "" }, () => {
            this.onInputChange(value)
        })
    }

    handleSelectChange = e => {
        const exportOption = e ? e : {}
        this.setState({exportOption: exportOption})
        this.props.updateOptionToExport(e)
    }

    updateKeywordsToFilter = (value, _, e) => {
        e.preventDefault();
        this.props.updateKeywordsToFilter(value, this.state.advancedData);
    }

    resetAdvancedData = () => {
        this.setState({ advancedData: {
            employeeNo: null,
            department: null,
            handoverStatus: null,
            approvalStatus: null
        },
        showAdvanced: false
    });
    }

    save = () => {
        this.props.save()
    }

    massUpdate = (e) => {
        const exportOption = e ? e : {}
        this.setState({massValue: exportOption.value}, () => {
            if(e) {
                this.props.massUpdate(this.state.massType, this.state.massKey, this.state.massValue);
            }
        });
    }

    handleMassTypeChange = (e) => {
        const exportOption = e ? e : {};
        this.setState({ massType: exportOption.value || null, massKey: exportOption.key || null, massValue: null });
    }

    handleChangeFileInput = e => {
        const files = Object.values(e.target.files)
        if (validateFileMimeType(e, this.props.t, files) && validateTotalFileSize(files, this.props.t)) {
            this.setState({files: files})
            this.props.updateAttachedFiles(files)
        }
    }

    updateAttachedFiles = (files) => {
        this.setState({files: files})
        this.props.updateAttachedFiles(files)
    }

    render() {
        const customStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
            })
        }
        const customStatusStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
                border: 0,
                boxShadow: 'none'
            }),
            container: (styles) => ({
                width: '100%'
            })
        }
        const { t, isEdit, listDepartments, costCenters } = this.props
        const {exportOption, advancedData, keywords, massType, massValue, files} = this.state

        const exportOptions = [
            {value: 1, label: t('report_resign')},
            {value: 2, label: t('report_handover')},
            {value: 3, label: t('report_resign_form')},
            {value: 4, label: t('report_interview_result')},
            // {value: 5, label: 'Biên bản thanh lý'},
            // {value: 6, label: 'Thỏa thuận chấm dứt hợp đồng'},
            // {value: 7, label: 'Quyết định chấm dứt hợp đồng'}
        ]
        let taskLists = [
            {value: 'isHandoverWork', key: 'statusWork', label: t('work_status')},
            {value: 'isHandoverAsset', key: 'statusAsset', label: t('resource_status')},
            {value: 'isHandoverSocial', key: 'statusSocial', label: t('social_status')},
            {value: 'isHandoverUniform', key: 'statusUniform', label: t('uniform_status')},
            {value: 'isHandoverFingerprintEmail', key: 'statusFingerprintEmail', label: t('email_status')},
            {value: 'isHandoverDebt', key: 'statusDebt', label: t('timesheet_status')},
            {value: 'isHandoverSoftware', key: 'statusSoftware', label: t('software_status')},
            {value: 'isHandoverConfirmation', key: 'statusConfirmation', label: t('policy_status')},
        ]
        if(IS_VINFAST) {
            taskLists = [
                {value: 'isHandoverWork', key: 'statusWork', label: t('work_status')},
                {value: 'isHandoverAsset', key: 'statusAsset', label: t('laptop_status')},
                {value: 'isVehicleCard', key: 'vehicleCardStatus', label: t('taxi_status')},
                {value: 'isHandoverSocial', key: 'statusSocial', label: t('social_status')},
                {value: 'isHandoverUniform', key: 'statusUniform', label: t('uniform_status')},
                {value: 'isHandoverFingerprintEmail', key: 'statusFingerprintEmail', label: IS_VINFAST ? t('BlockFingerprint') : t('email_status')},
                {value: 'isHandOverFaceId', key: 'statusFaceId', label: t('BlockFaceID')},
                {value: 'isHandOverADBlock', key: 'statusADBlock', label: t('BlockEmailAdAccount')},
                {value: 'isHandoverDebt', key: 'statusDebt', label: t('timesheet_status')},
                {value: 'isHandoverSoftware', key: 'statusSoftware', label: t('software_status')},
                {value: 'isHandoverConfirmation', key: 'statusConfirmation', label: t('policy_status')},
                {value: 'isTrainingDebt', key: 'trainingDebtStatus', label: t('training_status')},
                {value: 'isInternalDebt', key: 'internalDebtStatus', label: t('internal_status')},
            ]
        }

        return <div className="block resignation-requests-management-action-button">
                    <div className="row filter-action-block">
                       
                        <div className="col-4">
                            <form >
                            <div className="input-filter d-flex">
                                {this.state.showAdvanced && <div ref={this.searchForm} className='popup row py-3'>
                                    <div className="col-6">
                                        <div>
                                            <input className='form-control' type="text" value={advancedData.employeeNo || ""} placeholder={t('import') + ' ' + t('EmployeeNo')} onChange={e => this.handleInputAdvancedChange(e, 'employeeNo')}  />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <Select options={listDepartments} onChange={e => this.handleSelectAdvancedChange(e, 'departmentId')} value={listDepartments.filter(item => item.value == advancedData.departmentId)} placeholder={t('DepartmentManage')} isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>  
                                    <div className="col-6 mt-3">
                                        <div>
                                            <Select options={this.statusOptions} onChange={e => this.handleSelectAdvancedChange(e, 'handoverStatus')} value={this.statusOptions.filter(item => item.value == advancedData.handoverStatus)} placeholder={t('handover_status')} isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <div>
                                            <Select options={this.approvalOptions} onChange={e =>this.handleSelectAdvancedChange(e, 'approvalStatus')} value={this.approvalOptions.filter(item => item.value == advancedData.approvalStatus)} placeholder={t('approval_status')} isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>    
                                    <div className="col-6 mt-3">
                                        <div>
                                            <Select options={costCenters } onChange={e => this.handleSelectAdvancedChange(e, 'costCenter')} value={costCenters?.filter(item => item.value == advancedData.costCenter)} placeholder="Cost Center" isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>
                                    <div className="col-6 mt-3">
                                    </div>   
                                    <div className="col-6 mt-3">
                                        <button type="button" className=" discard" onClick={() => this.resetAdvancedData()}>
                                            <i className="fas fa-times mr-2"></i>
                                            <span>{t('resetSearch')}</span>
                                        </button>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <button type="submit" className="save" onClick={(e) => this.updateKeywordsToFilter(this.state.keywords, this.state.advancedData,e )}>
                                            <i className="fas fa-check mr-2"></i>
                                            <span>{t('ApplySearch')}</span>
                                        </button>
                                    </div>
                                </div>
                                }
                                <input type="text" value={keywords || ""} placeholder={t('import')} onChange={e => this.handleInputChange(e)}  />
                                <div className='d-flex align-items-center' onClick={() => this.setState({showAdvanced: !this.state.showAdvanced})}>
                                    <span>{t('tim_kiem_nang_cao')}</span>
                                    <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" ><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
                                </div>
                                
                                
                            </div>
                            </form>
                        </div>
                        <div className="col-8 btn-action-group">
                            <div className="row action-group">
                                <div className="col-5">
                                    <div className="input-filter d-flex" style={{padding: '2px 5px'}}>
                                        <Select components={{ IndicatorSeparator: () => null }} options={taskLists} onChange={e => this.handleMassTypeChange(e)} value={taskLists.filter(item => item.value == massType)} placeholder={t('handover_type')} isClearable={true} styles={customStatusStyles}  menuPortalTarget={document.body}/>
                                        <Select components={{ IndicatorSeparator: () => null }} options={this.statusOptions} onChange={e => this.massUpdate(e)} value={this.statusOptions.filter(item => item.value == massValue)} placeholder={t("EvaluationStatus")} isDisabled={massType ? false : true} isClearable={true} styles={customStatusStyles}  menuPortalTarget={document.body}/>
                                    </div>
                                </div>
            
                                <div className="col-3">
                                    <div>
                                        <Select options={exportOptions} onChange={e => this.handleSelectChange(e)} value={exportOption} placeholder={t('ExportFile')} isClearable={true} styles={customStyles}  menuPortalTarget={document.body}/>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <label htmlFor="i_files" className="form-control attachment">
                                        <i className="fas fa-paperclip"></i>
                                        <span>{t('Attachment')}</span>
                                        <input id="i_files" type="file" name="i_files" style={{display: 'none'}} onChange={this.handleChangeFileInput} multiple accept="image/jpeg, image/png, .doc, .pdf, .docx, .xls, .xlsx" />
                                    </label>
                                </div>
                                <div className="col-2 action-group">
                                    <button type="button" className="form-control save" onClick={this.save}>
                                        <i className="fas fa-save"></i>
                                        <span>{t('Save')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-right display-right">
                            <AttachmentComponent files={files} updateFiles = {(files) => this.updateAttachedFiles(files)}/>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ResignationRequestsManagementActionButton)
