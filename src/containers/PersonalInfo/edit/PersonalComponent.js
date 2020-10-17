import React from 'react'
import axios from 'axios'
import AddressModal from './AddressModal'
import Select from 'react-select'
import DatePicker, {registerLocale} from 'react-datepicker'
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
            mainAddress: {},
            tempAddress: {},
            birthProvinces: [],
            birthCountryNotUpdate: ""
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
            Province: "province_id",
            District: "district_id",
            Wards: "ward_id",
            TempCountry: "tmp_country_id",
            TempProvince: "tmp_province_id",
            TempDistrict: "tmp_district_id",
            TempWards: "tmp_ward_id"
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
        })).catch( errors => {
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
                this.setState({birthCountryNotUpdate: birthCountryId});
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

        if(value !== this.props.userDetail[this.mappingFields[name]]) {
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], value)
        } else {
            this.props.removeInfo(name)
        }

        this.setState({
            userDetail : {
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
            userDetail : {
                ...this.state.userDetail,
                [this.mappingFields[name]]: val
            }
        })

        if (val !== this.props.userDetail[this.mappingFields[name]]) {
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], val, textOld, label)
        } else {
            this.props.removeInfo(name)
        }
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
        if (moment(dateInput, 'DD-MM-YYYY').isValid()) {
            const date = moment(dateInput).format('DD-MM-YYYY');
            if(date !== this.props.userDetail[this.mappingFields[name]]) {
                this.props.updateInfo(name, this.props.userDetail[this.mappingFields[name]], date)
            } else {
                this.props.removeInfo(name)
            }
            this.setState({
                userDetail : {
                    ...this.state.userDetail,
                    [this.mappingFields[name]]: date
                }
            })
        }
    }

    showModal(name) {
        this.setState({[name]: true})
    }
  
    hideModal(name) {
        this.setState({[name]: false})
    }

    updateAddress(name, item, mainAddress) {
        this.setState({mainAddress: mainAddress});
        if (name !== "StreetName") {
            if (name == "Country") {
                this.handleUpdateAddressForInput(name, item.value, "", mainAddress.oldCountryName, mainAddress.countryName); // For select tag
            } else if (name == "Province") {
                this.handleUpdateAddressForInput(name, item.value, "", mainAddress.oldProvinceName, mainAddress.provinceName); // For select tag
            } else if (name == "District") {
                this.handleUpdateAddressForInput(name, item.value, "", mainAddress.oldDistrictName, mainAddress.districtName); // For select tag
            } else if (name == "Wards") {
                this.handleUpdateAddressForInput(name, item.value, "", mainAddress.oldWardName, mainAddress.wardName); // For select tag
            }
        } else {
            this.handleUpdateAddressForInput(name, item.target.value, "", mainAddress.oldStreetName, mainAddress.streetName); // For input text tag
        }
    }

    updateTmpAddress(name, item, tempAddress) {
        this.setState({tempAddress: tempAddress});
        if (name !== "StreetName") {
            if (name == "Country") {
                this.handleUpdateAddressForInput(name, item.value, "Temp", tempAddress.oldCountryName, tempAddress.countryName); // For select tag
            } else if (name == "Province") {
                this.handleUpdateAddressForInput(name, item.value, "Temp", tempAddress.oldProvinceName, tempAddress.provinceName); // For select tag
            } else if (name == "District") {
                this.handleUpdateAddressForInput(name, item.value, "Temp", tempAddress.oldDistrictName, tempAddress.districtName); // For select tag
            } else if (name == "Wards") {
                this.handleUpdateAddressForInput(name, item.value, "Temp", tempAddress.oldWardName, tempAddress.wardName); // For select tag
            }
        } else {
            this.handleUpdateAddressForInput(name, item.target.value, "Temp", tempAddress.oldStreetName, tempAddress.streetName); // For input text tag
        }
    }

    handleUpdateAddressForInput = (name, value, prefix, oldText, newText) => {
        this.props.updateInfo(prefix + name, this.props.userDetail[this.mappingFields[prefix + name]], value, oldText, newText)
        // if(value !== this.props.userDetail[this.mappingFields[prefix + name]]) {
        //     this.props.updateInfo(prefix + name, this.props.userDetail[this.mappingFields[prefix + name]], value, oldText, newText)
        // } else {
        //     this.props.removeInfo(prefix + name)
        // }
        this.setState({
            userDetail : {
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
        const genders = this.props.genders.map(gender =>  { return { value: gender.ID, label: gender.TEXT } } )
        const races = this.props.races.map(race =>  { return { value: race.ID, label: race.TEXT } } )
        const marriages = this.props.marriages.map(marriage =>  { return { value: marriage.ID, label: marriage.TEXT } } )
        const nations = this.props.nations.map(nation =>  { return { value: nation.ID, label: nation.TEXT } } )
        const countries = this.props.countries.map(country =>  { return { value: country.ID, label: country.TEXT } } )
        const banks = this.props.banks.map(bank =>  { return { value: bank.ID, label: bank.TEXT } } )
        const marriage = this.props.marriages.find(m => m.ID == userDetail.marital_status_code)
        const provinces = this.state.provinces.map(province =>  { return { value: province.ID, label: province.TEXT } } )
        const religions = this.props.religions.map(r =>  { return { value: r.ID, label: r.TEXT } } )
        const birthProvinces = this.state.birthProvinces.map(province =>  { return { value: province.ID, label: province.TEXT } } )
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
            <hr/>
            <div className="row">
                <div className="col-2">
                   <div className="label">Ngày sinh</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{userDetail.birthday || ""}</div>
                </div>
                <div className="col-6 input-container">
                    <label>
                        <DatePicker 
                            name="Birthday" 
                            key="Birthday"
                            selected={this.state.userDetail.birthday ? moment(this.state.userDetail.birthday, 'DD-MM-YYYY').toDate() : null}
                            onChange={birthday => this.handleDatePickerInputChange(birthday, "Birthday")}
                            dateFormat="dd-MM-yyyy"
                            showMonthDropdown={true}
                            showYearDropdown={true}
                            locale="vi"
                            className="form-control input"/>
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
                    <Select name="BirthProvince" placeholder="Lựa chọn nơi sinh" key="birthProvince" options={birthProvinces} 
                    value={birthProvinces.filter(p => p.value == this.state.userDetail.birth_province_id)} onChange={e => this.handleSelectInputs(e, 'BirthProvince', userDetail.birth_province)} />
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
                    <Select name="Gender" placeholder="Lựa chọn giới tính" key="gender" options={genders} value={genders.filter(g => g.value == this.state.userDetail.gender)}
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
                    <Select name="Ethinic" placeholder="Lựa chọn dân tộc" options={races} value={races.filter(r => r.value == this.state.userDetail.race_id)} 
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
                    <Select name="Religion" placeholder="Lựa chọn tôn giáo" options={religions} 
                    value={religions.filter(r => r.value == (this.state.userDetail.religion_id || '0'))} onChange={e => this.handleSelectInputs(e, "Religion", userDetail.religion || 'Không')} />
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
                    <label>
                    <DatePicker 
                        name="PersonalIdentifyDate" 
                        key="PersonalIdentifyDate"
                        selected={this.state.userDetail.pid_date_of_issue ? moment(this.state.userDetail.pid_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                        onChange={pidDateOfIssue => this.handleDatePickerInputChange(pidDateOfIssue, "PersonalIdentifyDate")}
                        dateFormat="dd-MM-yyyy"
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        locale="vi"
                        className="form-control input"/>
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
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
                    <label>
                    <DatePicker 
                        name="PassportDate" 
                        key="PassportDate"
                        selected={this.state.userDetail.passport_date_of_issue ? moment(this.state.userDetail.passport_date_of_issue, 'DD-MM-YYYY').toDate() : null}
                        onChange={passportDateOfIssue => this.handleDatePickerInputChange(passportDateOfIssue, "PassportDate")}
                        dateFormat="dd-MM-yyyy"
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        locale="vi"
                        className="form-control input"/>
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
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
                    <Select name="Nationality" placeholder="Lựa chọn quốc tịch" options={nations} value={nations.filter(n => n.value == this.state.userDetail.nationality_id)} 
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
                        street_name={this.state.mainAddress.streetName ? this.state.mainAddress.streetName : this.state.userDetail.street_name}
                        street_name_old={this.state.userDetail.street_name}
                        ward_id={this.state.mainAddress.wardId ? this.state.mainAddress.wardId : this.state.userDetail.ward_id}
                        ward_name={this.state.userDetail.wards}
                        district_id={this.state.mainAddress.districtId ? this.state.mainAddress.districtId : this.state.userDetail.district_id}
                        district_name={this.state.userDetail.district}
                        province_id={this.state.mainAddress.provinceId ? this.state.mainAddress.provinceId : this.state.userDetail.province_id}
                        province_name={this.state.userDetail.province}
                        country_id={this.state.userDetail.country_id}
                        country_name={this.state.userDetail.nation}
                        countries={this.props.countries}
                        updateAddress={this.updateAddress.bind(this)}
                    /> : null}
                    {
                        _.size(this.state.mainAddress) > 0 ?
                        <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>
                            {this.SummaryAddress([this.state.mainAddress.streetName, this.state.mainAddress.wardName, this.state.mainAddress.districtName, this.state.mainAddress.provinceName])}
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
                        street_name={this.state.tempAddress.streetName ? this.state.tempAddress.streetName : this.state.userDetail.tmp_street_name}
                        street_name_old={this.state.userDetail.tmp_street_name}
                        ward_id={this.state.tempAddress.wardId ? this.state.tempAddress.wardId : this.state.userDetail.tmp_ward_id}
                        ward_name={this.state.userDetail.tmp_wards}
                        district_id={this.state.tempAddress.districtId ? this.state.tempAddress.districtId : this.state.userDetail.tmp_district_id}
                        district_name={this.state.userDetail.tmp_district}
                        province_id={this.state.tempAddress.provinceId ? this.state.tempAddress.provinceId : this.state.userDetail.tmp_province_id}
                        province_name={this.state.userDetail.tmp_province}
                        country_id={this.state.userDetail.tmp_country_id}
                        country_name={this.state.userDetail.tmp_nation}
                        countries={this.props.countries}
                        updateAddress={this.updateTmpAddress.bind(this)}
                    /> : null}
                    {
                        _.size(this.state.tempAddress) > 0 ?
                        <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>
                            {this.SummaryAddress([this.state.tempAddress.streetName, this.state.tempAddress.wardName, this.state.tempAddress.districtName, this.state.tempAddress.provinceName])}
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
                    <Select name="MaritalStatus" placeholder="Lựa chọn tình trạng hôn nhân" options={marriages} 
                    value={marriages.filter(m => m.value == this.state.userDetail.marital_status_code)} onChange={e => this.handleSelectInputs(e, 'MaritalStatus', marriage ? marriage.TEXT : null)} />
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
                    <label>
                    <DatePicker 
                        name="MarriageDate" 
                        key="MarriageDate"
                        selected={this.state.userDetail.marital_date ? moment(this.state.userDetail.marital_date, 'DD-MM-YYYY').toDate() : null}
                        onChange={maritalDate => this.handleDatePickerInputChange(maritalDate, "MarriageDate")}
                        dateFormat="dd-MM-yyyy"
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        locale="vi"
                        className="form-control input"/>
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
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
                </div>
            </div>

            <div className="row">
                <div className="col-2">
                   <div className="label">Điện thoại khẩn cấp</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{ this.isNotNull(userDetail.urgent_contact_no) ? userDetail.urgent_contact_no : ""}</div>
                </div>
                <div className="col-6">
                    <input className="form-control" name="UrgentContactNo" type="text" 
                    value={this.isNotNull(this.state.userDetail.urgent_contact_no) ? this.state.userDetail.urgent_contact_no : ""} onChange={this.handleTextInputChange.bind(this)} />
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
                    <Select placeholder="Lựa chọn ngân hàng" name="Bank" options={banks} value={banks.filter(b => b.value == this.state.userDetail.bank_name_id)} 
                    onChange={e => this.handleSelectInputs(e, 'Bank', userDetail.bank_name || "")} />
                </div>
            </div>
        </div>
      </div>)
    }
  }

export default PersonalComponent
