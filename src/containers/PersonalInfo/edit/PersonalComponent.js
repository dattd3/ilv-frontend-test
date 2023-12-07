import React from 'react'
import axios from 'axios'
import AddressModal from './AddressModal'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import { withTranslation } from "react-i18next"
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getMuleSoftHeaderConfigurations, getRequestConfigurations, genderConfig, marriageConfig, isVinFast, formatStringByMuleValue } from "commons/Utils"
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconClear from 'assets/img/icon/icon_x.svg'
import LoadingModal from 'components/Common/LoadingModal'

registerLocale("vi", vi)
const placeCodeOther = -1

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
            validationMessagesFromParent: props.validationMessages,
            places: [],
            isLoading: false,
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
            TempStreetName: "tmp_street_name",
            passportPlaceOfIssue: "passport_place_of_issue",
            personalIdentifyPlace: "pid_place_of_issue",
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.validationMessages !== this.props.validationMessages) {
            this.setState({ validationMessagesFromParent: nextProps.validationMessages })
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        this.fetchMasterData()
        this.bindBirthCountryAndProvince()
    }

    fetchMasterData = () => {
        const muleConfig = getMuleSoftHeaderConfigurations()
        const config = getRequestConfigurations()
        const profileEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`
        const personalInfoEndpoint = `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/personalinfo`
        const placeInfoEndpoint = `${process.env.REACT_APP_REQUEST_URL}user/places`
        const requestProfile = axios.get(profileEndpoint, muleConfig)
        const requestPersonalInfo = axios.get(personalInfoEndpoint, muleConfig)
        const requestPlaceInfo = axios.get(placeInfoEndpoint, config)

        axios.all([requestProfile, requestPersonalInfo, requestPlaceInfo]).then(axios.spread((...responses) => {
            this.processProfile(responses[0]);
            this.processPersonalInfo(responses[1]);
            this.processPlaceInfo(responses[2]?.data?.data || [])
        })).catch(errors => {
            console.log(errors);
        }).finally(() => {
            this.setState({ isLoading: false })
        })
    }

    processPlaceInfo = (res = []) => {
        const places = res
        .filter(item => !item?.isDeleted)
        .map(item => {
            return {
                value: item?.id,
                label: item?.name,
                type: item?.code,
            }
        })
        this.setState({ places })
    }

    bindBirthCountryAndProvince = () => {
        const config = getMuleSoftHeaderConfigurations()
        if (!this.props.isEdit) {
            // Edit profile
        } else {
            if (this.state.countryId) {
                axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/provinces?country_id=${this.state.countryId}`, config)
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
            this.props.setState({ userDetail: userDetail });
        }
    }

    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
            return true;
        }
        return false;
    }

    SummaryAddress(lstLocation = []) {
        const address = lstLocation.filter(item => item).join(', ')
        return address || ''
    }

    handleTextInputChange = (event) => {
        let targetVal = event.target
        const target = targetVal
        const value = target.type === 'checkbox' ? target.checked : target?.value
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
        const val = e != null ? e.value : ''
        const label = e != null ? e.label : ''

        if (name == "BirthCountry") {
            this.getBirthProvinces(val);
        }

        const userDetail = {...this.state.userDetail}
        if (['passportPlaceOfIssue', 'personalIdentifyPlace']?.includes(name)) {
            const placeMapping = {
                passportPlaceOfIssue: 'PassportPlace',
                personalIdentifyPlace: 'PersonalIdentifyPlace',
            }
            userDetail[name] = e
            if (val == placeCodeOther) {
                if (name === 'passportPlaceOfIssue') {
                    userDetail.passport_place_of_issue = ''
                } else {
                    userDetail.pid_place_of_issue = ''
                }
            } else {
                this.props.updateInfo(placeMapping[name], this.props.userDetail[this.mappingFields[name]], label)
            }
        } else {
            userDetail[this.mappingFields[name]] = val
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], val, textOld, label)
        }

        this.setState({ userDetail })
    }

    getBirthProvinces = (country_id) => {
        const config = getMuleSoftHeaderConfigurations()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/provinces?country_id=${country_id}`, config)
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
        mainAddressFromModal.province_id = province ? province.value : null
        mainAddressFromModal.province = province ? province.label : null
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
            Province: province ? province.value : null,
            ProvinceText: province ? province.label : null,
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
        tempAddressFromModal.tmp_province_id = province ? province.value : null
        tempAddressFromModal.tmp_province = province ? province.label : null
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
            TempProvince: province ? province.value : null,
            TempProvinceText: province ? province.label : null,
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

    handleRemoveInput = (name) => {
        const userDetail = {...this.state.userDetail}
        userDetail[name] = null
        this.setState({ userDetail })
    }

    render() {
        const genderMapping = genderConfig()
        const marriageMapping = marriageConfig()
        const marriageStatus = {
            [Constants.MARRIAGE_STATUS.SINGLE]: marriageMapping.single,
            [Constants.MARRIAGE_STATUS.MARRIED]: marriageMapping.married,
            [Constants.MARRIAGE_STATUS.DIVORCED]: marriageMapping.divorced,
        }
        const { t, userDetail } = this.props
        const { validationMessagesFromParent, places, userDetail: userDetailState, isLoading, mainAddressFromModal, tempAddressFromModal } = this.state
        const genders = this.props.genders.map(gender => { return { value: gender.ID, label: gender.ID == Constants.GENDER.MALE ? genderMapping.male : genderMapping.female} })
        const races = this.props.races.map(race => { return { value: race.ID, label: race.TEXT } })
        const marriages = this.props.marriages.map(marriage => { return { value: marriage.ID, label: marriageStatus[marriage.ID] } })
        const nations = this.props.nations.map(nation => { return { value: nation.ID, label: nation.TEXT + " (" + nation.ID + ")" } })
        const countries = this.props.countries.map(country => { return { value: country.ID, label: country.TEXT } })
        const banks = this.props.banks.map(bank => { return { value: bank.ID, label: bank.TEXT } })
        const marriage = marriages.find(m => m.value == userDetail?.marital_status_code)
        const religions = this.props.religions.map(r => { return { value: r.ID, label: r.TEXT } })
        const birthProvinces = this.state.birthProvinces.map(province => { return { value: province.ID, label: province.TEXT } })
        const passportPlaceOfIssue = (places || []).filter(item => item?.type === 'HC')
        const personalIdentifyPlace = (places || []).filter(item => ['CCCD', 'CMT']?.includes(item?.type))

        console.log('userDetailState => ', userDetailState)
        console.log('this.state.userDetail => ', this.state.userDetail)

        return (
            <>
            <LoadingModal show={isLoading} />
            <div className="info edit-main-user-info">
                <div className="box" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                    <div className="row">
                        <div className="col"><i className="note note-old"></i> {t("Record")}</div>
                        <div className="col"><i className="note note-new"></i> {t("NewInformation")}</div>
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
                            <label className="date-label">
                                <DatePicker
                                    name="Birthday"
                                    key="Birthday"
                                    maxDate={new Date()}
                                    selected={userDetailState?.birthday ? moment(userDetailState?.birthday, 'DD-MM-YYYY').toDate() : null}
                                    onChange={birthday => this.handleDatePickerInputChange(birthday, "Birthday")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
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
                            <Select name="BirthCountry" placeholder={t("SelectCountryOfBirth")} key="birthCountry"
                                isClearable={true}
                                options={countries} value={countries.filter(n => n.value == (this.state.birthCountryNotUpdate ? this.state.birthCountryNotUpdate : userDetailState?.birth_country_id))}
                                onChange={e => this.handleSelectInputs(e, 'BirthCountry', userDetail.birth_country_name || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PlaceOfBirth")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.birth_province || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="BirthProvince" placeholder={t("SelectPlaceOfBirth")} key="birthProvince" options={birthProvinces} isClearable={true}
                                value={birthProvinces.filter(p => p.value == userDetailState?.birth_province_id)} onChange={e => this.handleSelectInputs(e, 'BirthProvince', userDetail.birth_province)} />
                            {
                                validationMessagesFromParent?.birthProvince && <p className="text-danger error-message">{validationMessagesFromParent?.birthProvince}</p>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Gender")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail?.gender == Constants.GENDER.MALE ? t("Male") : t("Female")}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Gender" placeholder={t("SelectGender")} isClearable={true} key="gender" options={genders} value={genders.filter(g => g.value == userDetailState?.gender)}
                                onChange={e => this.handleSelectInputs(e, 'Gender', userDetail?.gender == Constants.GENDER.MALE ? t("Male") : t("Female"))} />
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
                            <Select name="Ethinic" placeholder={t("SelectEthnics")} isClearable={true} options={races} value={races.filter(r => r.value == userDetailState?.race_id)}
                                onChange={e => this.handleSelectInputs(e, "Ethinic", userDetail.ethinic || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Religion")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.religion || t("None")}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Religion" placeholder={t("SelectReligion")} isClearable={true} options={religions}
                                value={religions.filter(r => r.value == (userDetailState?.religion_id))} onChange={e => this.handleSelectInputs(e, "Religion", userDetail.religion)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("IdNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.personal_id_no || ""}</div>
                        </div>
                        <div className="col-6 form-inline">
                            <input className="form-control input" name="PersonalIdentifyNumber" type="text"
                                value={userDetailState?.personal_id_no || ""} onChange={(e) => this.handleTextInputChange(e)} />
                            {
                                validationMessagesFromParent?.personalIdentifyNumber && <span className="text-danger error-message-inline">{validationMessagesFromParent?.personalIdentifyNumber}</span>
                            }
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
                            <label className="date-label">
                                <DatePicker
                                    name="PersonalIdentifyDate"
                                    key="PersonalIdentifyDate"
                                    maxDate={new Date()}
                                    selected={userDetailState?.pid_date_of_issue ? moment(userDetailState?.pid_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={pidDateOfIssue => this.handleDatePickerInputChange(pidDateOfIssue, "PersonalIdentifyDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                            </label>
                            {
                                validationMessagesFromParent?.personalIdentifyDate && <p className="text-danger error-message">{validationMessagesFromParent?.personalIdentifyDate}</p>
                            }
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
                            {
                                (personalIdentifyPlace?.length > 0 && userDetailState?.personalIdentifyPlace?.value != placeCodeOther) && (
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        options={personalIdentifyPlace.concat([{value: placeCodeOther, label: t("Other")}])}
                                        value={personalIdentifyPlace.concat([{value: placeCodeOther, label: t("Other")}]).find(o => o?.value == userDetailState?.personalIdentifyPlace?.value)} 
                                        onChange={e => this.handleSelectInputs(e, 'personalIdentifyPlace', userDetail?.pid_place_of_issue || null)} />
                                )
                            }
                            {
                                (!personalIdentifyPlace || personalIdentifyPlace?.length === 0 || userDetailState?.personalIdentifyPlace?.value == placeCodeOther) && (
                                    <div className="wrap-input-text">
                                        <input className="form-control input" name="PersonalIdentifyPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                        value={userDetailState?.pid_place_of_issue || ""} />
                                        <img src={IconClear} alt='Clear' className='remove-input cursor-pointer' title='Exit' onClick={() => this.handleRemoveInput('personalIdentifyPlace')} />
                                    </div>
                                )
                            }
                            {
                                validationMessagesFromParent?.personalIdentifyPlace && <p className="text-danger error-message">{validationMessagesFromParent?.personalIdentifyPlace}</p>
                            }


                            {/* <input className="form-control input" name="PersonalIdentifyPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                value={userDetailState?.pid_place_of_issue || ""} />
                            {
                                validationMessagesFromParent?.personalIdentifyPlace && <p className="text-danger">{validationMessagesFromParent?.personalIdentifyPlace}</p>
                            } */}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PassportNo")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_id_no || ""}</div>
                        </div>
                        <div className="col-6 form-inline">
                            <input className="form-control input" name="PassportNumber" type="text"
                                value={userDetailState?.passport_id_no || ""} onChange={this.handleTextInputChange.bind(this)} />
                            {
                                validationMessagesFromParent?.passportNumber && <p className="text-danger error-message-inline">{validationMessagesFromParent?.passportNumber}</p>
                            }
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
                            <label className="date-label">
                                <DatePicker
                                    name="PassportDate"
                                    key="PassportDate"
                                    maxDate={new Date()}
                                    selected={userDetailState?.passport_date_of_issue ? moment(userDetailState?.passport_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                                    onChange={passportDateOfIssue => this.handleDatePickerInputChange(passportDateOfIssue, "PassportDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                            </label>
                            {
                                validationMessagesFromParent?.passportDate && <p className="text-danger error-message">{validationMessagesFromParent?.passportDate}</p>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t('PassportPlaceOfIssue')}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.passport_place_of_issue || ""}</div>
                        </div>
                        <div className="col-6">
                            {
                                (passportPlaceOfIssue?.length > 0 && userDetailState?.passportPlaceOfIssue?.value != placeCodeOther) && (
                                    <Select 
                                        placeholder={t("Select")} 
                                        isClearable={true} 
                                        options={passportPlaceOfIssue.concat([{value: placeCodeOther, label: t("Other")}])}
                                        value={passportPlaceOfIssue.concat([{value: placeCodeOther, label: t("Other")}]).find(o => o?.value == userDetailState?.passportPlaceOfIssue?.value)} 
                                        onChange={e => this.handleSelectInputs(e, 'passportPlaceOfIssue', userDetail?.passport_place_of_issue || null)} />
                                )
                            }
                            {
                                (!passportPlaceOfIssue || passportPlaceOfIssue?.length === 0 || userDetailState?.passportPlaceOfIssue?.value == placeCodeOther) && (
                                    <div className="wrap-input-text">
                                        <input className="form-control input" name="PassportPlace" type="text" onChange={this.handleTextInputChange.bind(this)}
                                        value={userDetailState?.passport_place_of_issue || ""} />
                                        <img src={IconClear} alt='Clear' className='remove-input cursor-pointer' title='Exit' onClick={() => this.handleRemoveInput('passportPlaceOfIssue')} />
                                    </div>
                                )
                            }
                            {
                                validationMessagesFromParent?.passportPlace && <p className="text-danger error-message">{validationMessagesFromParent?.passportPlace}</p>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("Country")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.nationality || ""}</div>
                        </div>
                        <div className="col-6">
                            <Select name="Nationality" placeholder={t("SelectNationality")} isClearable={true} options={nations} value={nations.filter(n => n.value == userDetailState?.nationality_id)}
                                onChange={e => this.handleSelectInputs(e, 'Nationality', userDetail.nationality || "")} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("PermanentAddress")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([formatStringByMuleValue(userDetail?.street_name), formatStringByMuleValue(userDetail?.wards), formatStringByMuleValue(userDetail?.district), formatStringByMuleValue(userDetail?.province), formatStringByMuleValue(userDetail?.nation)])}</div>
                        </div>
                        <div className="col-6">
                            {this.state.isAddressEdit ? <AddressModal
                                title={t("PermanentAddress")}
                                show={this.state.isAddressEdit}
                                onHide={this.hideModal.bind(this, 'isAddressEdit')}
                                countries={this.props.countries}
                                country={_.size(mainAddressFromModal) > 0 ? { value: mainAddressFromModal.country_id, label: mainAddressFromModal.nation } : null}
                                province={_.size(mainAddressFromModal) > 0 ? { value: mainAddressFromModal.province_id, label: mainAddressFromModal.province } : null}
                                district={_.size(mainAddressFromModal) > 0 ? { value: mainAddressFromModal.district_id, label: mainAddressFromModal.district } : null}
                                ward={_.size(mainAddressFromModal) > 0 ? { value: mainAddressFromModal.ward_id, label: mainAddressFromModal.wards } : null}
                                street={_.size(mainAddressFromModal) > 0 ? mainAddressFromModal.street_name : ''}
                                updateAddress={this.updateAddress.bind(this)}
                            /> : null}
                            {
                                _.size(mainAddressFromModal) > 0 ?
                                    <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>
                                        {this.SummaryAddress([formatStringByMuleValue(mainAddressFromModal?.street_name), formatStringByMuleValue(mainAddressFromModal?.wards), formatStringByMuleValue(mainAddressFromModal?.district), formatStringByMuleValue(mainAddressFromModal?.province), formatStringByMuleValue(mainAddressFromModal?.nation)])}
                                    </div>
                                    : <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>{this.SummaryAddress([formatStringByMuleValue(userDetailState?.street_name), formatStringByMuleValue(userDetailState?.wards), formatStringByMuleValue(userDetailState?.district), formatStringByMuleValue(userDetailState?.province)])}</div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("TemporaryAddress")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{this.SummaryAddress([formatStringByMuleValue(userDetail?.tmp_street_name), formatStringByMuleValue(userDetail?.tmp_wards), formatStringByMuleValue(userDetail?.tmp_district), formatStringByMuleValue(userDetail?.tmp_province), formatStringByMuleValue(userDetail?.tmp_nation)])}</div>
                        </div>
                        <div className="col-6">
                            {this.state.isTmpAddressEdit ? <AddressModal
                                title={t("TemporaryAddress")}
                                show={this.state.isTmpAddressEdit}
                                onHide={this.hideModal.bind(this, 'isTmpAddressEdit')}
                                countries={this.props.countries}
                                country={_.size(tempAddressFromModal) > 0 ? { value: tempAddressFromModal.tmp_country_id, label: tempAddressFromModal.tmp_nation } : null}
                                province={_.size(tempAddressFromModal) > 0 ? { value: tempAddressFromModal.tmp_province_id, label: tempAddressFromModal.tmp_province } : null}
                                district={_.size(tempAddressFromModal) > 0 ? { value: tempAddressFromModal.tmp_district_id, label: tempAddressFromModal.tmp_district } : null}
                                ward={_.size(tempAddressFromModal) > 0 ? { value: tempAddressFromModal.tmp_ward_id, label: tempAddressFromModal.tmp_wards } : null}
                                street={_.size(tempAddressFromModal) > 0 ? tempAddressFromModal.tmp_street_name : ''}
                                updateAddress={this.updateTmpAddress.bind(this)}
                            /> : null}
                            {
                                _.size(tempAddressFromModal) > 0 ?
                                    <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>
                                        {this.SummaryAddress([formatStringByMuleValue(tempAddressFromModal?.tmp_street_name), formatStringByMuleValue(tempAddressFromModal?.tmp_wards), formatStringByMuleValue(tempAddressFromModal?.tmp_district), formatStringByMuleValue(tempAddressFromModal?.tmp_province), formatStringByMuleValue(tempAddressFromModal?.tmp_nation)])}
                                    </div>
                                    : <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>{this.SummaryAddress([formatStringByMuleValue(userDetailState?.tmp_street_name), formatStringByMuleValue(userDetailState?.tmp_wards), formatStringByMuleValue(userDetailState?.tmp_district), formatStringByMuleValue(userDetailState?.tmp_province)])}</div>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t("MaritalStatus")}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{marriage?.label || null}</div>
                        </div>
                        <div className="col-6">
                            <Select name="MaritalStatus" placeholder={t("SelectMaritalStatus")} isClearable={true} options={marriages}
                                value={marriages.filter(m => m.value == userDetailState?.marital_status_code)} onChange={e => this.handleSelectInputs(e, 'MaritalStatus', marriage?.label || null)} />
                            {
                                validationMessagesFromParent?.maritalStatus && <p className="text-danger error-message">{validationMessagesFromParent?.maritalStatus}</p>
                            }
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
                            <label className="date-label">
                                <DatePicker
                                    name="MarriageDate"
                                    key="MarriageDate"
                                    maxDate={new Date()}
                                    selected={userDetailState?.marital_date ? moment(userDetailState?.marital_date, 'DD-MM-YYYY').toDate() : null}
                                    onChange={maritalDate => this.handleDatePickerInputChange(maritalDate, "MarriageDate")}
                                    dateFormat="dd-MM-yyyy"
                                    showMonthDropdown={true}
                                    showYearDropdown={true}
                                    locale="vi"
                                    className="form-control input" />
                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                            </label>
                            {
                                validationMessagesFromParent?.maritalDate && <p className="text-danger error-message">{validationMessagesFromParent?.maritalDate}</p>
                            }
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
                            <input className="form-control input" name="PersonalEmail" type="text" value={userDetailState?.personal_email || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                            {
                                validationMessagesFromParent?.personalEmail && <p className="text-danger error-message">{validationMessagesFromParent?.personalEmail}</p>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-2">
                            <div className="label">{t('MobileNo')}</div>
                        </div>
                        <div className="col-4 old">
                            <div className="detail">{userDetail.cell_phone_no || ""}</div>
                        </div>
                        <div className="col-6">
                            <input className="form-control input" name="CellPhoneNo" type="text" value={userDetailState?.cell_phone_no || ""}
                                onChange={this.handleTextInputChange.bind(this)} />
                            {
                                validationMessagesFromParent?.cellPhoneNo && <p className="text-danger error-message">{validationMessagesFromParent?.cellPhoneNo}</p>
                            }
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
                            <input className="form-control input" name="UrgentContactNo" type="text"
                                value={this.isNotNull(userDetailState?.urgent_contact_no) ? userDetailState?.urgent_contact_no : ""} onChange={this.handleTextInputChange.bind(this)} />
                            {
                                validationMessagesFromParent?.urgentContactNo && <p className="text-danger error-message">{validationMessagesFromParent?.urgentContactNo}</p>
                            }
                        </div>
                    </div>
                    {
                        !isVinFast() ?
                        <>
                            <div className="row">
                                <div className="col-2">
                                    <div className="label">{t("BankAccountNumber")}</div>
                                </div>
                                <div className="col-4 old">
                                    <div className="detail">{userDetail.bank_number || ""}</div>
                                </div>
                                <div className="col-6">
                                    <input className="form-control input" name="BankAccountNumber" type="text" value={userDetailState?.bank_number || ""}
                                        onChange={this.handleTextInputChange.bind(this)} />
                                    {
                                        validationMessagesFromParent?.bankAccountNumber && <p className="text-danger error-message">{validationMessagesFromParent?.bankAccountNumber}</p>
                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-2">
                                    <div className="label">{t("BankName")}</div>
                                </div>
                                <div className="col-4 old">
                                    <div className="detail">{userDetail.bank_name || ""}</div>
                                </div>
                                <div className="col-6">
                                    <Select placeholder={t("SelectBank")} name="Bank" isClearable={true} options={banks} value={banks.filter(b => b.value == userDetailState?.bank_name_id)}
                                        onChange={e => this.handleSelectInputs(e, 'Bank', userDetail.bank_name || "")} />
                                    {
                                        validationMessagesFromParent?.bank && <p className="text-danger error-message">{validationMessagesFromParent?.bank}</p>
                                    }
                                </div>
                            </div>
                        </>
                        : null
                    }
                </div>
            </div>
            </>
        )
    }
}

export default withTranslation()(PersonalComponent)
