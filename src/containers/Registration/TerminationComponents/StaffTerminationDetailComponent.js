import React from 'react'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"

class StaffTerminationDetailComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            infos: {}
        }
    }

    componentDidMount() {
        
    }

    handleSelectChange = e => {
        if (e) {
            const infos = {...this.state.infos}
            infos.reason = {value: e.value, label: e.label}
            this.setState({infos: infos})
            this.props.updateStaffTerminationDetail(infos)
        }
    }

    handleDatePickerChange = date => {
        const infos = {...this.state.infos}
        infos.lastWorkingDay = null
        infos.dateTermination = null

        if (moment(date, 'YYYY-MM-DD').isValid()) {
            infos.lastWorkingDay = moment(date).format('YYYY-MM-DD')
            infos.dateTermination = moment(date, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')
        }

        this.setState({infos: infos})
        this.props.updateStaffTerminationDetail(infos)
    }

    handleInputChange = e => {
        if (e && e.target) {
            const infos = {...this.state.infos}
            infos.reasonDetailed = e.target.value || ""
            this.setState({infos: infos})
            this.props.updateStaffTerminationDetail(infos)
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
        const { t, reasonTypes } = this.props
        const infos = this.state.infos

        return <div className="block staff-information-block">
                    <h6 className="block-title">II. {t('StaffInformationProposedToTerminateContract')}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('LastWorkingDay')}</p>
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
                                <p className="title">{t('ReasonForContractTermination')}</p>
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

export default withTranslation()(StaffTerminationDetailComponent)
