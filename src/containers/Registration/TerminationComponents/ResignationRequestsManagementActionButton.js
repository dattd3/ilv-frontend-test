import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import _, { debounce } from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from "../../../commons/Constants"
import AttachmentComponent from "../TerminationComponents/AttachmentComponent"

class ResignationRequestsManagementActionButton extends React.PureComponent {
    statusOptions = [
        {value: 0, label: "Chưa hoàn thành"},
        {value: 1, label: "Đã hoàn thành"}
    ];
    approvalOptions = [
        {value: 0, label: "Chưa phê duyệt"},
        {value: 1, label: "Đã phê duyệt"}
    ]
    
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

        this.onInputChange = debounce(this.updateKeywordsToFilter, 800)
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
        }});
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
        const { t, isEdit, listDepartments } = this.props
        const {exportOption, advancedData, keywords, massType, massValue, files} = this.state

        const exportOptions = [
            {value: 1, label: 'Báo cáo yêu cầu nghỉ việc'},
            {value: 2, label: 'Tình trạng bàn giao'},
            {value: 3, label: 'Đơn xin nghỉ việc'},
            {value: 4, label: 'Báo cáo kết quả phỏng vấn'},
            // {value: 5, label: 'Biên bản thanh lý'},
            // {value: 6, label: 'Thỏa thuận chấm dứt hợp đồng'},
            // {value: 7, label: 'Quyết định chấm dứt hợp đồng'}
        ]
        const taskLists = [
            {value: 'isHandoverWork', key: 'statusWork', label: 'Bàn giao công việc'},
            {value: 'isHandoverAsset', key: 'statusAsset', label: 'Bàn giao tài sản công ty'},
            {value: 'isHandoverSocial', key: 'statusSocial', label: 'Bàn giao BHXH và BHYT'},
            {value: 'isHandoverUniform', key: 'statusUniform', label: 'Bàn giao đồng phục'},
            {value: 'isHandoverFingerprintEmail', key: 'statusFingerprintEmail', label: 'Bàn giao vân tay/email'},
            {value: 'isHandoverDebt', key: 'statusDebt', label: 'Bàn giao công nợ'},
            {value: 'isHandoverSoftware', key: 'statusSoftware', label: 'Các phần mềm phục vụ công việc'},
            {value: 'isHandoverConfirmation', key: 'statusConfirmation', label: 'Xác nhận biên bản vi phạm chưa xử lý'},
        ]

        return <div className="block resignation-requests-management-action-button">
                    <div className="row filter-action-block">
                       
                        <div className="col-4">
                            <form >
                            <div className="input-filter d-flex">
                                {this.state.showAdvanced && <div className='popup row py-3'>
                                    <div className="col-6">
                                        <div>
                                            <input className='form-control' type="text" value={advancedData.employeeNo || ""} placeholder="Nhập mã nhân viên" onChange={e => this.handleInputAdvancedChange(e, 'employeeNo')}  />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div>
                                            <Select options={listDepartments} onChange={e => this.handleSelectAdvancedChange(e, 'departmentId')} value={listDepartments.filter(item => item.value == advancedData.departmentId)} placeholder="Khối/phòng/bộ phận" isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>  
                                    <div className="col-6 mt-3">
                                        <div>
                                            <Select options={this.statusOptions} onChange={e => this.handleSelectAdvancedChange(e, 'handoverStatus')} value={this.statusOptions.filter(item => item.value == advancedData.handoverStatus)} placeholder="Tình trạng bàn giao" isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <div>
                                            <Select options={this.approvalOptions} onChange={e =>this.handleSelectAdvancedChange(e, 'approvalStatus')} value={this.approvalOptions.filter(item => item.value == advancedData.approvalStatus)} placeholder="Tình trạng phê duyệt" isClearable={true} styles={customStyles} />
                                        </div>
                                    </div>    
                                    <div className="col-6 mt-3">
                                        <button type="button" className=" discard" onClick={() => this.resetAdvancedData()}>
                                            <i className="fas fa-times mr-2"></i>
                                            <span>Đặt lại</span>
                                        </button>
                                    </div>
                                    <div className="col-6 mt-3">
                                        <button type="submit" className="save" onClick={(e) => this.updateKeywordsToFilter(this.state.keywords, this.state.advancedData,e )}>
                                            <i className="fas fa-check mr-2"></i>
                                            <span>Áp dụng</span>
                                        </button>
                                    </div>
                                </div>
                                }
                                <input type="text" value={keywords || ""} placeholder="Nhập từ khóa" onChange={e => this.handleInputChange(e)}  />
                                <div className='d-flex align-items-center' onClick={() => this.setState({showAdvanced: !this.state.showAdvanced})}>
                                    <span>{"Tìm kiếm nâng cao"}</span>
                                    <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" ><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>
                                </div>
                                
                                
                            </div>
                            </form>
                        </div>
                        <div className="col-8 btn-action-group">
                            <div className="row action-group">
                                <div className="col-5">
                                    <div className="input-filter d-flex" style={{padding: '2px 5px'}}>
                                        <Select components={{ IndicatorSeparator: () => null }} options={taskLists} onChange={e => this.handleMassTypeChange(e)} value={taskLists.filter(item => item.value == massType)} placeholder="Loại bàn giao" isClearable={true} styles={customStatusStyles} />
                                        <Select components={{ IndicatorSeparator: () => null }} options={this.statusOptions} onChange={e => this.massUpdate(e)} value={this.statusOptions.filter(item => item.value == massValue)} placeholder="Tình trạng" isDisabled={massType ? false : true} isClearable={true} styles={customStatusStyles} />
                                    </div>
                                </div>
            
                                <div className="col-3">
                                    <div>
                                        <Select options={exportOptions} onChange={e => this.handleSelectChange(e)} value={exportOption} placeholder="Xuất file" isClearable={true} styles={customStyles} />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <label htmlFor="i_files" className="form-control attachment">
                                        <i className="fas fa-paperclip"></i>
                                        <span>Đính kèm</span>
                                        <input id="i_files" type="file" name="i_files" style={{display: 'none'}} onChange={this.handleChangeFileInput} multiple accept="image/jpeg, image/png, .doc, .pdf, .docx, .xls, .xlsx" />
                                    </label>
                                </div>
                                <div className="col-2 action-group">
                                    <button type="button" className="form-control save" onClick={this.save}>
                                        <i className="fas fa-save"></i>
                                        <span>Lưu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 text-right display-right">
                            <AttachmentComponent files={files} />
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ResignationRequestsManagementActionButton)
