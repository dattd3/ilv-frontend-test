import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import _, { debounce } from 'lodash'
import { withTranslation } from "react-i18next"
import Constants from "../../../commons/Constants"

class ResignationRequestsManagementActionButton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            exportOption: null,
            keywords: "",
            keywordsTyping: "",
            files: []
        }

        this.onInputChange = debounce(this.updateKeywordsToFilter, 800)
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

    updateKeywordsToFilter = value => {
        this.props.updateKeywordsToFilter(value)
    }

    save = () => {
        this.props.save()
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
        const { t, isEdit } = this.props
        const {exportOption, keywords} = this.state

        const exportOptions = [
            {value: 1, label: 'Báo cáo yêu cầu nghỉ việc'},
            {value: 2, label: 'Tình trạng bàn giao'},
            {value: 3, label: 'Đơn xin nghỉ việc'},
            {value: 4, label: 'Báo cáo kết quả phỏng vấn'},
            {value: 5, label: 'Biên bản thanh lý'},
            {value: 6, label: 'Thỏa thuận chấm dứt hợp đồng'},
            {value: 7, label: 'Quyết định chấm dứt hợp đồng'}
        ]

        return <div className="block resignation-requests-management-action-button">
                    <div className="row filter-action-block">
                        <div className="col-1 action-group">
                            <button type="button" className="save" onClick={this.save}>
                                <i className="fas fa-save"></i>
                                <span>Lưu</span>
                            </button>
                        </div>
                        <div className="col-3">
                            <div className="input-filter">
                                <input type="text" value={keywords || ""} placeholder="Tìm kiếm theo từ khóa" onChange={e => this.handleInputChange(e)} />
                            </div>
                        </div>
                        <div className="col-4 btn-action-group">
                            <div className="row action-group">
                                <div className="col-8">
                                    <div>
                                        <Select options={exportOptions} onChange={e => this.handleSelectChange(e)} value={exportOption} placeholder="Xuất file" isClearable={true} styles={customStyles} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <label htmlFor="i_files" className="attachment">
                                        <i className="fas fa-paperclip"></i>
                                        <span>Đính kèm</span>
                                        <input id="i_files" type="file" name="i_files" style={{display: 'none'}} onChange={this.handleChangeFileInput} multiple accept="image/jpeg, image/png, .doc, .pdf, .docx, .xls, .xlsx" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ResignationRequestsManagementActionButton)
