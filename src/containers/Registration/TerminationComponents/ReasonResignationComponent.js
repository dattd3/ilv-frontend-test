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
        let errorObj = {reason: this.props.t('resign_error_reason'), reasonDetailed: null}
        const infos = {...this.state.infos}
        infos.reason = null

        if (e) {
            infos.reason = {value: e.value, label: e.label}
            errorObj = {...errorObj, reason: null}
        }
        if(infos.reason?.value == 'GA' && !infos.reasonDetailed) {
            errorObj = {...errorObj, reasonDetailed: this.props.t('ReasonRequired')};
        }

        this.setState({infos: infos})
        this.props.updateResignationReasons(infos)
        this.props.updateErrors(errorObj)
    }

    handleDatePickerChange = date => {
        const infos = {...this.state.infos}
        infos.lastWorkingDay = null
        infos.dateTermination = null
        let errorObj = {lastWorkingDay: this.props.t('resign_error_lastWorkingDay')}

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
            let errorObj = {reasonDetailed: null};
            infos.reasonDetailed = e.target.value || ""
            if(infos.reason?.value == 'GA' && !infos.reasonDetailed) {
                errorObj = {reasonDetailed: this.props.t('ReasonRequired')};
            }
            this.setState({infos: infos})
            this.props.updateResignationReasons(infos)
            this.props.updateErrors(errorObj)
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
                    <h6 className="block-title">II. {isEmployee ? t('ly_do_xin_nghi') : t('ly_do_cbld_tt_de_xuat_cho_nghi')}</h6>
                    <div className="box shadow">
                    <div className="row">
                            <div className="col-4">
                                <p className="title">{t('ngay_lam_viec_cuoi_cung')}<span className="required">(*)</span></p>
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
                                        <span className="input-group-addon input-img" style={{top: '12px'}}><i className="fas fa-calendar-alt text-info"></i></span>
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
                                    <Select options={reasonTypes} placeholder={t('option')} onChange={this.handleSelectChange} value={infos.reason} styles={customStyles} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="title">{t('DetailedReason')}
                                    {infos?.reason?.value == 'GA' ? <span className="required">(*)</span>: null}
                                </p>
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
