import React from 'react'
import axios from 'axios'
import AddressModal from './AddressModal'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

class PersonalComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            userDetail: {},
            isAddressEdit: false,
            isTmpAddressEdit: false,
            countryId: props.birthCountry,
            provinces: [],
            mainAddressFromModal: {},
            tempAddressFromModal: {},
            birthProvinces: [],
            birthCountryNotUpdate: "",
            validationMessagesFromParent: props.validationMessages
        }

        this.mappingFields = {
            Birthday: "birthday",
            DateOfIssue: "date_of_issue",
            MarriageDate: "marital_date",
            Gender: "gender",
            PersonalEmail: "personal_email",
            CellPhoneNo: "cell_phone_no",
            UrgentContactNo: "urgent_contact_no",
            BankAccountNumber: "bank_number",
            PlaceOfIssue: "place_of_issue",
            Ethinic: "race_id",
            Religion: "religion_id",
            BirthProvince: "birth_province_id",
            Nationality: "nationality_id",
            BirthCountry: "birth_country_id",
            MaritalStatus: "marital_status_code",
            Bank: "bank_name_id",
            PersonalIdentifyNumber: "personal_id_no",
            PersonalIdentifyDate: "pid_date_of_issue",
            PersonalIdentifyPlace: "pid_place_of_issue",
            PassportNumber: "passport_id_no",
            PassportDate: "passport_date_of_issue",
            PassportPlace: "passport_place_of_issue",
            Country: "country_id",
            CountryText: "nation",
            Province: "province_id",
            ProvinceText: "province",
            District: "district_id",
            DistrictText: "district",
            Wards: "ward_id",
            WardsText: "wards",
            StreetName: "street_name",
            TempCountry: "tmp_country_id",
            TempCountryText: "tmp_nation",
            TempProvince: "tmp_province_id",
            TempProvinceText: "tmp_province",
            TempDistrict: "tmp_district_id",
            TempDistrictText: "tmp_district",
            TempWards: "tmp_ward_id",
            TempWardsText: "tmp_wards",
            TempStreetName: "tmp_street_name"
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.validationMessages !== this.props.validationMessages) {
            this.setState({ validationMessagesFromParent: nextProps.validationMessages })
        }
    }

    async componentDidMount() {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }
        const profileEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/profile`;
        const personalInfoEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/personalinfo`;
        const requestProfile = axios.get(profileEndpoint, config);
        const requestPersonalInfo = axios.get(personalInfoEndpoint, config);

        await axios.all([requestProfile, requestPersonalInfo]).then(axios.spread((...responses) => {
            this.processProfile(responses[0]);
            this.processPersonalInfo(responses[1]);
        })).catch(errors => {
            console.log(errors);
        })

        this.bindBirthCountryAndProvince(config);

        if (this.props.requestedUserProfile) {
            const requestedUserProfile = this.props.requestedUserProfile
            if (requestedUserProfile.userProfileInfo.update && requestedUserProfile.userProfileInfo.update.userProfileHistoryMainInfo) {
                let userDetail = {}
                Object.keys(this.mappingFields).forEach(key => {
                    if (this.props.requestedUserProfile.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo[key]) {
                        userDetail[this.mappingFields[key]] = this.props.requestedUserProfile.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo[key]
                    }
                });
                this.setState({
                    userDetail: userDetail
                })
            }
        }
    }

    bindBirthCountryAndProvince = (config) => {
        if (!this.props.isEdit) {
            // Edit profile
        } else {
            if (this.state.countryId) {
                axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=${this.state.countryId}`, config)
                    .then(res => {
                        if (res && res.data && res.data.data) {
                            const data = res.data.data;
                            this.setState({
                                birthProvinces: data
                            })
                        }
                    }).catch(error => {

                    })
            } else if (!this.state.countryId) {
                const birthCountryId = this.props.userDetail.birth_country_id;
                this.getBirthProvinces(birthCountryId);
                this.setState({ birthCountryNotUpdate: birthCountryId });
            }
        }
    }

    processProfile = (res) => {
        if (res && res.data && res.data.data) {
            let userProfile = res.data.data[0];
            this.props.setState({ userProfile: userProfile })
        }
    }

    processPersonalInfo = (res) => {
        if (res && res.data && res.data.data) {
            let userDetail = res.data.data[0];
            // this.setState({countryId: userDetail.country_id, userDetail: userDetail});
            this.props.setState({ userDetail: userDetail });
        }
    }

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
        this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], value)
        this.setState({
            userDetail: {
                ...this.state.userDetail,
                [this.mappingFields[name]]: value
            }
        })
    }

    handleSelectInputs = (e, name, textOld) => {
        let val;
        let label;
        if (e != null) {
            val = e.value;
            label = e.label;
        } else {
            val = "";
            label = "";
        }
        if (name == "BirthCountry") {
            this.getBirthProvinces(val);
        }
        this.setState({
            userDetail: {
                ...this.state.userDetail,
                [this.mappingFields[name]]: val
            }
        })
        this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], val, textOld, label)
    }

    getBirthProvinces = (country_id) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=${country_id}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let provinces = res.data.data;
                    this.setState({ birthProvinces: provinces })
                }
            }).catch(error => {
                this.setState({ birthProvinces: [] })
            })
    }

    handleDatePickerInputChange(dateInput, name) {
        const date = moment(dateInput, 'DD-MM-YYYY').isValid() ? moment(dateInput).format('DD-MM-YYYY') : null
        this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], date)
        this.setState({
            userDetail: {
                ...this.state.userDetail,
                [this.mappingFields[name]]: date
            }
        })
    }

    showModal(name) {
        this.setState({ [name]: true })
    }

    hideModal(name) {
        this.setState({ [name]: false })
    }

    updateAddress(country, province, district, ward, streetName) {
        const mainAddressFromModal = { ...this.state.mainAddressFromModal }
        mainAddressFromModal.country_id = country.value
        mainAddressFromModal.nation = country.label
        mainAddressFromModal.province_id = province.value
        mainAddressFromModal.province = province.label
        mainAddressFromModal.district_id = district ? district.value : null
        mainAddressFromModal.district = district ? district.label : null
        mainAddressFromModal.ward_id = ward ? ward.value : null
        mainAddressFromModal.wards = ward ? ward.label : null
        mainAddressFromModal.street_name = streetName
        this.setState({ mainAddressFromModal: mainAddressFromModal })

        const userDetail = { ...this.props.userDetail }
        const oldMainAddress = {
            Country: userDetail.country_id,
            CountryText: userDetail.nation,
            Province: userDetail.province_id,
            ProvinceText: userDetail.province,
            District: userDetail.district_id,
            DistrictText: userDetail.district,
            Wards: userDetail.ward_id,
            WardsText: userDetail.wards,
            StreetName: userDetail.street_name
        }
        const newMainAddress = {
            Country: country.value,
            CountryText: country.label,
            Province: province.value,
            ProvinceText: province.label,
            District: district ? district.value : null,
            DistrictText: district ? district.label : null,
            Wards: ward ? ward.value : null,
            WardsText: ward ? ward.label : null,
            StreetName: streetName
        }
        this.props.updateAddress(oldMainAddress, newMainAddress)
    }

    updateTmpAddress(country, province, district, ward, streetName) {
        const tempAddressFromModal = { ...this.state.tempAddressFromModal }
        tempAddressFromModal.tmp_country_id = country.value
        tempAddressFromModal.tmp_nation = country.label
        tempAddressFromModal.tmp_province_id = province.value
        tempAddressFromModal.tmp_province = province.label
        tempAddressFromModal.tmp_district_id = district ? district.value : null
        tempAddressFromModal.tmp_district = district ? district.label : null
        tempAddressFromModal.tmp_ward_id = ward ? ward.value : null
        tempAddressFromModal.tmp_wards = ward ? ward.label : null
        tempAddressFromModal.tmp_street_name = streetName
        this.setState({ tempAddressFromModal: tempAddressFromModal })

        const userDetail = { ...this.props.userDetail }
        const oldTempAddress = {
            TempCountry: userDetail.tmp_country_id,
            TempCountryText: userDetail.tmp_nation,
            TempProvince: userDetail.tmp_province_id,
            TempProvinceText: userDetail.tmp_province,
            TempDistrict: userDetail.tmp_district_id,
            TempDistrictText: userDetail.tmp_district,
            TempWards: userDetail.tmp_ward_id,
            TempWardsText: userDetail.tmp_wards,
            TempStreetName: userDetail.tmp_street_name
        }
        const newTempAddress = {
            TempCountry: country.value,
            TempCountryText: country.label,
            TempProvince: province.value,
            TempProvinceText: province.label,
            TempDistrict: district ? district.value : null,
            TempDistrictText: district ? district.label : null,
            TempWards: ward ? ward.value : null,
            TempWardsText: ward ? ward.label : null,
            TempStreetName: streetName
        }
        this.props.updateAddress(oldTempAddress, newTempAddress)
    }

    handleUpdateAddressForInput = (name, value, prefix, oldText, newText) => {
        this.props.updateInfo(prefix + name, this.props.userDetail[this.mappingFields[prefix + name]], value, oldText, newText)
        this.setState({
            userDetail: {
                ...this.state.userDetail,
                [this.mappingFields[prefix + name]]: value
            }
        })
    }

    getDocumentType = (code) => {
        return this.props.documentTypes.filter(e => {
            return e.ID == code;
        })
    }

    render() {
        const userDetail = this.props.userDetail
        const genders = this.props.genders.map(gender => { return { value: gender.ID, label: gender.TEXT } })
        const races = this.props.races.map(race => { return { value: race.ID, label: race.TEXT } })
        const marriages = this.props.marriages.map(marriage => { return { value: marriage.ID, label: marriage.TEXT } })
        const nations = this.props.nations.map(nation => { return { value: nation.ID, label: nation.TEXT } })
        const countries = this.props.countries.map(country => { return { value: country.ID, label: country.TEXT } })
        const banks = this.props.banks.map(bank => { return { value: bank.ID, label: bank.TEXT } })
        const marriage = this.props.marriages.find(m => m.ID == userDetail.marital_status_code)
        const provinces = this.state.provinces.map(province => { return { value: province.ID, label: province.TEXT } })
        const religions = this.props.religions.map(r => { return { value: r.ID, label: r.TEXT } })
        const birthProvinces = this.state.birthProvinces.map(province => { return { value: province.ID, label: province.TEXT } })
        return (
            <div className="info">
                <h4 className="title text-uppercase">Thông tin cá nhân</h4>
                <div className="box shadow">
                    <div className="row">
                        <div className="col">
                            <i className="note note-old"></i> Thông tin cũ
                </div>
                        <div className="col">
                            <i className="note note-new"></i> Nhập thông tin điều chỉnh
                </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Ngày sinh</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birthday || ""}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label className="date-label">
                                <DatePicker
                                    name="Birthday"
                                    key="Birthday"
                                    maxDate={new Date()}
                                    selected={this.state.userDetail.birthday ? moment(this.state.userDetail.birthday, 'DD-MM-YYYY').toDate() : null}
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
                            <div className="label">Quốc gia sinh</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birth_country_name || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="BirthCountry" placeholder="Lựa chọn quốc gia sinh" key="birthCountry"
                                isClearable={true}
                                options={countries} value={countries.filter(n => n.value == (this.state.birthCountryNotUpdate ? this.state.birthCountryNotUpdate : this.state.userDetail.birth_country_id))}
                                onChange={e => this.handleSelectInputs(e, 'BirthCountry', userDetail.birth_country_name || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Nơi sinh</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birth_province || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="BirthProvince" placeholder="Lựa chọn nơi sinh" key="birthProvince" options={birthProvinces} isClearable={true}
                                value={birthProvinces.filter(p => p.value == this.state.userDetail.birth_province_id)} onChange={e => this.handleSelectInputs(e, 'BirthProvince', userDetail.birth_province)} />
                            {
                            (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.birthProvince) ? <p className="text-danger">{this.state.validationMessagesFromParent.birthProvince}</p> : null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Giới tính</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{(userDetail.gender !== undefined && userDetail.gender !== '2') ? 'Nam' : 'Nữ'}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Gender" placeholder="Lựa chọn giới tính" isClearable={true} key="gender" options={genders} value={genders.filter(g => g.value == this.state.userDetail.gender)}
                                onChange={e => this.handleSelectInputs(e, 'Gender', (userDetail.gender !== undefined && userDetail.gender !== '2') ? 'Nam' : 'Nữ')} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Dân tộc</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.ethinic || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Ethinic" placeholder="Lựa chọn dân tộc" isClearable={true} options={races} value={races.filter(r => r.value == this.state.userDetail.race_id)}
                                onChange={e => this.handleSelectInputs(e, "Ethinic", userDetail.ethinic || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Tôn giáo</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.religion || 'Không'}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Religion" placeholder="Lựa chọn tôn giáo" isClearable={true} options={religions}
                                value={religions.filter(r => r.value == (this.state.userDetail.religion_id))} onChange={e => this.handleSelectInputs(e, "Religion", userDetail.religion)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Số CMND/CCCD</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.personal_id_no || ""}</div>
                        </div>
                        <div className="col-6 form-inline">
                            <input className="form-control" name="PersonalIdentifyNumber" type="text"
                                value={this.state.userDetail.personal_id_no || ""} onChange={this.handleTextInputChange.bind(this)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.personalIdentifyNumber) ? <p className="text-danger">{this.state.validationMessagesFromParent.personalIdentifyNumber}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Ngày cấp CMND/CCCD</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.pid_date_of_issue}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label className="date-label">
                                <DatePicker
                                    name="PersonalIdentifyDate"
                                    key="PersonalIdentifyDate"
                                    maxDate={new Date()}
                                    selected={this.state.userDetail.pid_date_of_issue ? moment(this.state.userDetail.pid_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={pidDateOfIssue => this.handleDatePickerInputChange(pidDateOfIssue, "PersonalIdentifyDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.personalIdentifyDate) ? <p className="text-danger">{this.state.validationMessagesFromParent.personalIdentifyDate}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Nơi cấp CMND/CCCD</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.pid_place_of_issue || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PersonalIdentifyPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                value={this.state.userDetail.pid_place_of_issue || ""} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.personalIdentifyPlace) ? <p className="text-danger">{this.state.validationMessagesFromParent.personalIdentifyPlace}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Số Hộ chiếu</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_id_no || ""}</div>
                        </div>
                        <div className="col-6 form-inline">
                            <input className="form-control" name="PassportNumber" type="text"
                                value={this.state.userDetail.passport_id_no || ""} onChange={this.handleTextInputChange.bind(this)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.passportNumber) ? <p className="text-danger">{this.state.validationMessagesFromParent.passportNumber}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Ngày cấp Hộ chiếu</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_date_of_issue}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label className="date-label">
                                <DatePicker
                                    name="PassportDate"
                                    key="PassportDate"
                                    maxDate={new Date()}
                                    selected={this.state.userDetail.passport_date_of_issue ? moment(this.state.userDetail.passport_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={passportDateOfIssue => this.handleDatePickerInputChange(passportDateOfIssue, "PassportDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.passportDate) ? <p className="text-danger">{this.state.validationMessagesFromParent.passportDate}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Nơi cấp Hộ chiếu</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_place_of_issue || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PassportPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                value={this.state.userDetail.passport_place_of_issue || ""} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.passportPlace) ? <p className="text-danger">{this.state.validationMessagesFromParent.passportPlace}</p> : null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Quốc tịch</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.nationality || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Nationality" placeholder="Lựa chọn quốc tịch" isClearable={true} options={nations} value={nations.filter(n => n.value == this.state.userDetail.nationality_id)}
                                onChange={e => this.handleSelectInputs(e, 'Nationality', userDetail.nationality || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Địa chỉ thường trú</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([userDetail.street_name || "", userDetail.wards || "", userDetail.district || "", userDetail.province || ""])}</div>
                        </div>
                        <div className="col-6">
                            {this.state.isAddressEdit ? <AddressModal
                                title="Địa chỉ thường trú"
                                show={this.state.isAddressEdit}
                                onHide={this.hideModal.bind(this, 'isAddressEdit')}
                                countries={this.props.countries}
                                country={_.size(this.state.mainAddressFromModal) > 0 ? { value: this.state.mainAddressFromModal.country_id, label: this.state.mainAddressFromModal.nation } : { value: this.state.userDetail.country_id, label: this.state.userDetail.nation }}
                                province={_.size(this.state.mainAddressFromModal) > 0 ? { value: this.state.mainAddressFromModal.province_id, label: this.state.mainAddressFromModal.province } : { value: this.state.userDetail.province_id, label: this.state.userDetail.province }}
                                district={_.size(this.state.mainAddressFromModal) > 0 ? { value: this.state.mainAddressFromModal.district_id, label: this.state.mainAddressFromModal.district } : { value: this.state.userDetail.district_id, label: this.state.userDetail.district }}
                                ward={_.size(this.state.mainAddressFromModal) > 0 ? { value: this.state.mainAddressFromModal.ward_id, label: this.state.mainAddressFromModal.wards } : { value: this.state.userDetail.ward_id, label: this.state.userDetail.wards }}
                                street={_.size(this.state.mainAddressFromModal) > 0 ? this.state.mainAddressFromModal.street_name : this.state.userDetail.street_name}
                                updateAddress={this.updateAddress.bind(this)}
                            /> : null}
                            {
                                _.size(this.state.mainAddressFromModal) > 0 ?
                                    <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>
                                        {this.SummaryAddress([this.state.mainAddressFromModal.street_name, this.state.mainAddressFromModal.wards, this.state.mainAddressFromModal.district, this.state.mainAddressFromModal.province])}
                                    </div>
                                    : <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>{this.SummaryAddress([this.state.userDetail.street_name, this.state.userDetail.wards, this.state.userDetail.district, this.state.userDetail.province])}</div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Địa chỉ tạm trú</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([userDetail.tmp_street_name || "", userDetail.tmp_wards || "", userDetail.tmp_district || "", userDetail.tmp_province || ""])}</div>
                        </div>
                        <div className="col-6">
                            {this.state.isTmpAddressEdit ? <AddressModal
                                title="Địa chỉ tạm trú"
                                show={this.state.isTmpAddressEdit}
                                onHide={this.hideModal.bind(this, 'isTmpAddressEdit')}
                                countries={this.props.countries}
                                country={_.size(this.state.tempAddressFromModal) > 0 ? { value: this.state.tempAddressFromModal.tmp_country_id, label: this.state.tempAddressFromModal.tmp_nation } : { value: this.state.userDetail.tmp_country_id, label: this.state.userDetail.tmp_nation }}
                                province={_.size(this.state.tempAddressFromModal) > 0 ? { value: this.state.tempAddressFromModal.tmp_province_id, label: this.state.tempAddressFromModal.tmp_province } : { value: this.state.userDetail.tmp_province_id, label: this.state.userDetail.tmp_province }}
                                district={_.size(this.state.tempAddressFromModal) > 0 ? { value: this.state.tempAddressFromModal.tmp_district_id, label: this.state.tempAddressFromModal.tmp_district } : { value: this.state.userDetail.tmp_district_id, label: this.state.userDetail.tmp_district }}
                                ward={_.size(this.state.tempAddressFromModal) > 0 ? { value: this.state.tempAddressFromModal.tmp_ward_id, label: this.state.tempAddressFromModal.tmp_wards } : { value: this.state.userDetail.tmp_ward_id, label: this.state.userDetail.tmp_wards }}
                                street={_.size(this.state.tempAddressFromModal) > 0 ? this.state.tempAddressFromModal.tmp_street_name : this.state.userDetail.tmp_street_name}
                                updateAddress={this.updateTmpAddress.bind(this)}
                            /> : null}
                            {
                                _.size(this.state.tempAddressFromModal) > 0 ?
                                    <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>
                                        {this.SummaryAddress([this.state.tempAddressFromModal.tmp_street_name, this.state.tempAddressFromModal.tmp_wards, this.state.tempAddressFromModal.tmp_district, this.state.tempAddressFromModal.tmp_province])}
                                    </div>
                                    : <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>{this.SummaryAddress([this.state.userDetail.tmp_street_name, this.state.userDetail.tmp_wards, this.state.userDetail.tmp_district, this.state.userDetail.tmp_province])}</div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Tình trạng hôn nhân</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{marriage ? marriage.TEXT : null}</div>
                        </div>
                        <div className="col-6">
                            <Select name="MaritalStatus" placeholder="Lựa chọn tình trạng hôn nhân" isClearable={true} options={marriages}
                                value={marriages.filter(m => m.value == this.state.userDetail.marital_status_code)} onChange={e => this.handleSelectInputs(e, 'MaritalStatus', marriage ? marriage.TEXT : null)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.maritalStatus) ? <p className="text-danger">{this.state.validationMessagesFromParent.maritalStatus}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Ngày của TT hôn nhân</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.marital_date}</div>
                        </div>
                        <div className="col-6 input-container">
                            <label className="date-label">
                                <DatePicker
                                    name="MarriageDate"
                                    key="MarriageDate"
                                    maxDate={new Date()}
                                    selected={this.state.userDetail.marital_date ? moment(this.state.userDetail.marital_date, 'DD-MM-YYYY').toDate() : null}
                                    onChange={maritalDate => this.handleDatePickerInputChange(maritalDate, "MarriageDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.maritalDate) ? <p className="text-danger">{this.state.validationMessagesFromParent.maritalDate}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Email cá nhân</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.personal_email || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="PersonalEmail" type="text" value={this.state.userDetail.personal_email || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.personalEmail) ? <p className="text-danger">{this.state.validationMessagesFromParent.personalEmail}</p> : null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Điện thoại di động</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.cell_phone_no || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="CellPhoneNo" type="text" value={this.state.userDetail.cell_phone_no || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.cellPhoneNo) ? <p className="text-danger">{this.state.validationMessagesFromParent.cellPhoneNo}</p> : null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Điện thoại khẩn cấp</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.isNotNull(userDetail.urgent_contact_no) ? userDetail.urgent_contact_no : ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="UrgentContactNo" type="text"
                                value={this.isNotNull(this.state.userDetail.urgent_contact_no) ? this.state.userDetail.urgent_contact_no : ""} onChange={this.handleTextInputChange.bind(this)} />
                            {
                                (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.urgentContactNo) ? <p className="text-danger">{this.state.validationMessagesFromParent.urgentContactNo}</p> : null
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">Số TK ngân hàng</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.bank_number || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control" name="BankAccountNumber" type="text" value={this.state.userDetail.bank_number || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                            {
                            (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.bankAccountNumber) ? <p className="text-danger">{this.state.validationMessagesFromParent.bankAccountNumber}</p> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">Ngân hàng</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.bank_name || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select placeholder="Lựa chọn ngân hàng" name="Bank" isClearable={true} options={banks} value={banks.filter(b => b.value == this.state.userDetail.bank_name_id)}
                                onChange={e => this.handleSelectInputs(e, 'Bank', userDetail.bank_name || "")} />
                            {
                            (this.state.validationMessagesFromParent && this.state.validationMessagesFromParent.bank) ? <p className="text-danger">{this.state.validationMessagesFromParent.bank}</p> : null
                            }
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default PersonalComponent
