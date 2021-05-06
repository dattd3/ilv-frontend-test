import React from 'react'
import Select from 'react-select'
import { withTranslation } from "react-i18next";

class ReasonResignationComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            infos: {}
        }
    }

    handleSelectChange = e => {
        if (e) {
            const infos = {...this.state.infos}
            infos.reason = {value: e.value, label: e.label}
            this.setState({infos: infos})
            this.props.updateResignationReasons(infos)
        }
    }

    handleInputChange = e => {
        if (e && e.target) {
            const infos = {...this.state.infos}
            infos.reasonDetailed = e.target.value || ""
            this.setState({infos: infos})
            this.props.updateResignationReasons(infos)
        }
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
        const { t, isEdit, reasonTypes } = this.props
        const infos = this.state.infos

        return <div className="block reason-resignation-block">
                    <h6 className="block-title">II. Lý do CBLĐ TT đề xuất cho nghỉ</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('ReasonForContractTermination')}</p>
                                <div>
                                    <Select options={reasonTypes} placeholder="Vui lòng chọn lý do" onChange={this.handleSelectChange} value={infos.reason} styles={customStyles} />
                                </div>
                            </div>
                            <div className="col-8">
                                <p className="title">{t('DetailedReason')}</p>
                                <div>
                                    <input type="text" placeholder="Nhập lý do chi tiết" className="form-control" value={infos.reasonDetailed || ""} onChange={this.handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ReasonResignationComponent)
