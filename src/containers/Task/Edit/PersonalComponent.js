import React from 'react'
import axios from 'axios'
import AddressModal from '../../PersonalInfo/edit/AddressModal'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import { connect } from 'react-redux'
import * as actions from '../../../actions'
import { withTranslation } from "react-i18next"

registerLocale("vi", vi)

class PersonalComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            userDetail: {},
            isAddressEdit: false,
            isTmpAddressEdit: false,
            countryId: '',
            provinces: []
        }
    }

    async componentDidMount() {

    }

    //#region ======== private function  ================


    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
            return true;
        }
        return false;
    }

    SummaryAddress(obj) {
        let result = '';
        if (typeof (obj) == 'object' && obj.length > 0) {
            for (let i = 0; i < obj.length; i++) {
                const element = obj[i];
                if (this.isNotNull(element)) {
                    result += element + ', '
                }
            }
        }
        result = result.trim();
        if (result.length > 0) { result = result.substring(0, result.length - 1); }
        return result;
    }

    handleTextInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name;

        if (value !== this.props.userDetail[this.props.mappingFieldFn(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.props.mappingFieldFn(name)], value)
        } else {
            this.props.removeInfo(name)
        }
        this.props.dispatch(actions.updateInformationDataAction({
            [this.props.mappingFieldFn(name)]: value
        }));
    }

    handleSelectInputs = (e, name) => {
        let val;
        let label;
        if (e != null) {
            val = e.value;
            label = e.label;
        } else {
            val = "";
            label = "";
        }
        this.props.dispatch(actions.updateInformationDataAction({
            [this.props.mappingFieldFn(name)]: val
        }));

        if (val !== this.props.userDetail[this.props.mappingFieldFn(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.props.mappingFieldFn(name)], val, label)
        } else {
            this.props.removeInfo(name)
        }
    }

    handleDatePickerInputChange(dateInput, name) {
        const date = moment(dateInput).format('DD-MM-YYYY');
        if (date !== this.props.userDetail[this.props.mappingFieldFn(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.props.mappingFieldFn(name)], date)
        } else {
            this.props.removeInfo(name)
        }
        this.props.dispatch(actions.updateInformationDataAction({
            [this.props.mappingFieldFn(name)]: date
        }));
    }

    showModal(name) {
        this.props.dispatch(actions.updateInformationDataAction({ [name]: true }));
    }

    hideModal(name) {
        this.props.dispatch(actions.updateInformationDataAction({ [name]: false }));
    }

    updateAddress(name, item) {
        if (name !== "StreetName") {
            this.handleUpdateAddressForInput(name, item.value||'', "", item.label); // For select tag
        } else {
            this.handleUpdateAddressForInput(name, item.target.value||'', ""); // For input text tag
        }

    }

    updateTmpAddress(name, item) {
        if (name !== "StreetName") {
            this.handleUpdateAddressForInput(name, item.value||'', "Temp", item.label); // For select tag
        } else {
            this.handleUpdateAddressForInput(name, item.target.value||'', "Temp"); // For input text tag
        }
    }

    handleUpdateAddressForInput = (name, value, prefix, displayText) => {
        if (value !== this.props.userDetail[this.props.mappingFieldFn(prefix + name)]) {
            this.props.updateInfo(prefix + name, this.props.userDetail[this.props.mappingFieldFn(prefix + name)], value, displayText)
        } else {
            this.props.removeInfo(prefix + name)
        }
        this.props.dispatch(actions.updateInformationDataAction({
            [this.props.mappingFieldFn(prefix + name)]: value
        }));
    }

    getDocumentType = (code) => {
        return this.props.documentTypes.filter(e => {
            return e.ID == code;
        })
    }
    //#endregion
    render() {
        const { t } = this.props
        const userDetail = this.props.userDetail
        const genders = this.props.genders.map(gender => { return { value: gender.ID, label: gender.TEXT } })
        const races = this.props.races.map(race => { return { value: race.ID, label: race.TEXT } })
        const marriages = this.props.marriages.map(marriage => { return { value: marriage.ID, label: marriage.TEXT } })
        const nations = this.props.nations.map(nation => { return { value: nation.ID, label: nation.TEXT } })
        const countries = this.props.countries.map(country => { return { value: country.ID, label: country.TEXT } })
        const banks = this.props.banks.map(bank => { return { value: bank.ID, label: bank.TEXT } })
        const marriage = this.props.marriages.find(m => m.ID == userDetail.marital_status_code)
        const provinces = this.props.provinces.map(province => { return { value: province.ID, label: province.TEXT } })
        const religions = this.props.religions.map(r => { return { value: r.ID, label: r.TEXT } })
        const documentTypes = this.props.documentTypes.map(d => { return { value: d.ID, label: d.TEXT } })
        return (
            <div className="info">
                <h4 className="title text-uppercase">{t("PersonalInformation")}</h4>
                <div className="box shadow">
                    <div className="row">
                        <div className="col">
                            <i className="note note-old"></i> {t("Record")}
                </div>
                        <div className="col">
                            <i className="note note-new"></i> {t("NewInformation")}
                </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("DateOfBirth")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birthday || ""}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label>
                                <DatePicker
                                    name="Birthday"
                                    key="Birthday"
                                    selected={this.props.userDetailEdited.birthday ? moment(this.props.userDetailEdited.birthday, 'DD-MM-YYYY').toDate() : null}
                                    onChange={birthday => this.handleDatePickerInputChange(birthday, "Birthday")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("CountryOfBirth")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birth_country_name || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="BirthCountry" placeholder={t("SelectCountryOfBirth")} key="BirthCountry" options={provinces}
                                value={countries.filter(p => p.value == this.props.userDetailEdited.birth_country_id)} onChange={e => this.handleSelectInputs(e, 'BirthCountry')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("BirthCity")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birth_province || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="BirthProvince" placeholder="Lựa chọn nơi sinh" key="birthProvince" options={provinces}
                                value={provinces.filter(p => p.value == this.props.userDetailEdited.birth_province_id)} onChange={e => this.handleSelectInputs(e, 'BirthProvince')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Gender")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{(userDetail.gender !== undefined && userDetail.gender !== '2') ? 'Nam' : 'Nữ'}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Gender" placeholder={t("SelectGender")} key="gender" options={genders} value={genders.filter(g => g.value == this.props.userDetailEdited.gender)}
                                onChange={e => this.handleSelectInputs(e, 'Gender')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Ethnics")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.ethinic || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Ethinic" placeholder={t("SelectEthnics")} options={races} value={races.filter(r => r.value == this.props.userDetailEdited.race_id)}
                                onChange={e => this.handleSelectInputs(e, "Ethinic")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Religion")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.religion || 'Không'}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Religion" placeholder={t("SelectReligion")} options={religions}
                                value={religions.filter(r => r.value == (this.props.userDetailEdited.religion_id || '0'))} onChange={e => this.handleSelectInputs(e, "Religion")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("IdNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.personal_id_no || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PersonalIdentifyNumber" type="text" value={this.props.userDetailEdited.personal_id_no || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("IdDateOfIssue")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.pid_date_of_issue}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label>
                                <DatePicker
                                    name="PersonalIdentifyDate"
                                    key="PersonalIdentifyDate"
                                    selected={this.props.userDetailEdited.pid_date_of_issue ? moment(this.props.userDetailEdited.pid_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={dateOfIssue => this.handleDatePickerInputChange(dateOfIssue, "PersonalIdentifyDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("IdPlaceOfIssue")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.pid_place_of_issue || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PersonalIdentifyPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                value={this.props.userDetailEdited.pid_place_of_issue || ""} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PassportNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_id_no || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PassportNumber" type="text" value={this.props.userDetailEdited.passport_id_no || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PassportDateOfIssue")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_date_of_issue}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label>
                                <DatePicker
                                    name="PassportDate"
                                    key="PassportDate"
                                    selected={this.props.userDetailEdited.passport_date_of_issue ? moment(this.props.userDetailEdited.passport_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={dateOfIssue => this.handleDatePickerInputChange(dateOfIssue, "PassportDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PassportPlaceOfIssue")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_place_of_issue || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PassportPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                value={this.props.userDetailEdited.passport_place_of_issue || ""} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Nationality")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.nationality || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Nationality" placeholder={t("SelectNationality")} options={nations} value={nations.filter(n => n.value == this.props.userDetailEdited.nationality_id)}
                                onChange={e => this.handleSelectInputs(e, 'Nationality')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PermanentAddress")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([userDetail.street_name || "", userDetail.wards || "", userDetail.district || "", userDetail.province || ""])}</div>
                        </div>
                        <div className="col-6">
                            {this.props.isAddressEdit ? <AddressModal
                                title={t("PermanentAddress")}
                                show={this.props.isAddressEdit}
                                onHide={this.hideModal.bind(this, 'isAddressEdit')}
                                street_name={this.props.userDetailEdited.street_name}
                                ward_id={this.props.userDetailEdited.ward_id}
                                district_id={this.props.userDetailEdited.district_id}
                                province_id={this.props.userDetailEdited.province_id}
                                country_id={this.props.userDetailEdited.country_id}
                                countries={this.props.countries}
                                updateAddress={this.updateAddress.bind(this)}
                            /> : null}
                            <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>{this.SummaryAddress([this.props.userDetailEdited.street_name, this.props.userDetailEdited.wards, this.props.userDetailEdited.district, this.props.userDetailEdited.province])}</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("TemporaryAddress")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([userDetail.tmp_street_name || "", userDetail.tmp_wards || "", userDetail.tmp_district || "", userDetail.tmp_province || ""])}</div>
                        </div>
                        <div className="col-6">
                            {this.props.isTmpAddressEdit ? <AddressModal
                                title={t("TemporaryAddress")}
                                show={this.props.isTmpAddressEdit}
                                onHide={this.hideModal.bind(this, 'isTmpAddressEdit')}
                                street_name={this.props.userDetailEdited.tmp_street_name}
                                ward_id={this.props.userDetailEdited.tmp_ward_id}
                                district_id={this.props.userDetailEdited.tmp_district_id}
                                province_id={this.props.userDetailEdited.tmp_province_id}
                                country_id={this.props.userDetailEdited.tmp_country_id}
                                countries={this.props.countries}
                                updateAddress={this.updateTmpAddress.bind(this)}
                            /> : null}
                            <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>{this.SummaryAddress([this.props.userDetailEdited.tmp_street_name, this.props.userDetailEdited.tmp_wards, this.props.userDetailEdited.tmp_district, this.props.userDetailEdited.tmp_province])}</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("MaritalStatus")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{marriage ? marriage.TEXT : null}</div>
                        </div>
                        <div className="col-6">
                            <Select name="MaritalStatus" placeholder={t("SelectMaritalStatus")} options={marriages}
                                value={marriages.filter(m => m.value == this.props.userDetailEdited.marital_status_code)} onChange={e => this.handleSelectInputs(e, 'MaritalStatus')} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("DateOfChange")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.marital_date}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label>
                                <DatePicker
                                    name="MarriageDate"
                                    key="MarriageDate"
                                    selected={(this.props.userDetailEdited.marital_date && this.props.userDetailEdited.marital_date != "") ? moment(this.props.userDetailEdited.marital_date, 'DD-MM-YYYY').toDate() : null}
                                    onChange={marriageDate => this.handleDatePickerInputChange(marriageDate, "MarriageDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PersonalEmail")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.personal_email || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PersonalEmail" type="text" value={this.props.userDetailEdited.personal_email || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("MobileNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.cell_phone_no || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="CellPhoneNo" type="text" value={this.props.userDetailEdited.cell_phone_no || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("EmergencyPhoneNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.isNotNull(userDetail.urgent_contact_no) ? userDetail.urgent_contact_no : ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="UrgentContactNo" type="text"
                                value={this.isNotNull(this.props.userDetailEdited.urgent_contact_no) ? this.props.userDetailEdited.urgent_contact_no : ""} onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("BankAccountNumber")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.bank_number || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="BankAccountNumber" type="text" value={this.props.userDetailEdited.bank_number || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Bank")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.bank_name || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select placeholder={t("SelectBank")} name="Bank" options={banks} value={banks.filter(b => b.value == this.props.userDetailEdited.bank_name_id)}
                                onChange={e => this.handleSelectInputs(e, 'Bank')} />
                        </div>
                    </div>
                </div>
            </div>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userDetailEdited: state.requestDetail.information,
        provinces: state.requestDetail.provinces,
        //countryId: state.requestDetail.information.country_id,
        isAddressEdit: state.requestDetail.information.isAddressEdit,
        isTmpAddressEdit: state.requestDetail.information.isTmpAddressEdit
    };
}
export default connect(mapStateToProps)(withTranslation()(PersonalComponent));
