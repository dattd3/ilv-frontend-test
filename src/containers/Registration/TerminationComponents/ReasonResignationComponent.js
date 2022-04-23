import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import 'react-datepicker/dist/react-datepicker.css'
import { vi, enUS } from 'date-fns/locale'
import _ from 'lodash';

class ReasonResignationComponent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            infos: {}
        }
    }

    handleSelectChange = e => {
        let errorObj = {reason: "Vui lòng chọn lý do chấm dứt hợp đồng!"}
        const infos = {...this.state.infos}
        infos.reason = null

        if (e) {
            infos.reason = {value: e.value, label: e.label}
            errorObj = {reason: null}
        }

        this.setState({infos: infos})
        this.props.updateResignationReasons(infos)
        this.props.updateErrors(errorObj)
    }

    handleDatePickerChange = date => {
        const infos = {...this.state.infos}
        infos.lastWorkingDay = null
        infos.dateTermination = null
        let errorObj = {lastWorkingDay: "Vui lòng nhập ngày làm việc cuối cùng!"}

        if (moment(date, 'YYYY-MM-DD').isValid()) {
            infos.lastWorkingDay = moment(date).format('YYYY-MM-DD')
            infos.dateTermination = moment(date, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
            errorObj = {lastWorkingDay: null}
        }

        this.setState({infos: infos})
        this.props.updateResignationReasons(infos)
        this.props.updateErrors(errorObj)
    }

    handleInputChange = e => {
        if (e && e.target) {
            const infos = {...this.state.infos}
            infos.reasonDetailed = e.target.value || ""
            this.setState({infos: infos})
            this.props.updateResignationReasons(infos)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.data && _.isEmpty(this.state.infos)) {
            this.setState({infos: nextProps.data});
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
        const { t, isEdit, reasonTypes, isEmployee } = this.props
        const infos = this.state.infos

        return <div className="block reason-resignation-block">
                    <h6 className="block-title">II. {isEmployee ? 'LÝ DO XIN NGHỈ' : 'Lý do CBLĐ TT đề xuất cho nghỉ'}</h6>
                    <div className="box shadow">
                    <div className="row">
                            <div className="col-4">
                                <p className="title">{t('LastWorkingDay')}<span className="required">(*)</span></p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selectsStart
                                            autoComplete="off"
                                            selected={infos.lastWorkingDay ? moment(infos.lastWorkingDay, "YYYY-MM-DD").toDate() : null}
                                            onChange={date => this.handleDatePickerChange(date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText={t('Select')}
                                            locale={t("locale")}
                                            className="form-control input" />
                                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractTerminationDate')}</p>
                                <div>
                                    <input type="text" className="form-control" value={infos.dateTermination ? moment(infos.dateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ReasonForContractTermination')}<span className="required">(*)</span></p>
                                <div>
                                    <Select options={reasonTypes} placeholder="Vui lòng chọn lý do" onChange={this.handleSelectChange} value={infos.reason} styles={customStyles} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="title">{t('DetailedReason')}</p>
                                <div>
                                    <input type="text" className="form-control" value={infos.reasonDetailed || ""} onChange={this.handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(ReasonResignationComponent)
