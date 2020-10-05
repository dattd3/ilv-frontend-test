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
    constructor() {
        super();
        this.state = {
            userDetail: {},
            isAddressEdit: false,
            isTmpAddressEdit: false,
            countryId: '',
            provinces: [],
            mainAddress: {},
            tempAddress: {}
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

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/provinces?country_id=${this.state.countryId}`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            this.setState({
                provinces: data,
             })
          }
        }).catch(error => {

        })
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
            this.setState({countryId: userDetail.country_id, userDetail: userDetail});
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

        if(value !== this.props.userDetail[this.mappingFields(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields(name)], value)
        } else {
            this.props.removeInfo(name)
        }
        this.setState({
            userDetail : {
                ...this.state.userDetail,
                [this.mappingFields(name)]: value
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

        this.setState({
            userDetail : {
                ...this.state.userDetail,
                [this.mappingFields(name)]: val
            }
        })

        if (val !== this.props.userDetail[this.mappingFields(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields(name)], val, textOld, label)
        } else {
            this.props.removeInfo(name)
        }
    }

    handleDatePickerInputChange(dateInput, name) {
        const date = moment(dateInput).format('DD-MM-YYYY');
        if(date !== this.props.userDetail[this.mappingFields(name)]) {
            this.props.updateInfo(name, this.props.userDetail[this.mappingFields(name)], date)
        } else {
            this.props.removeInfo(name)
        }
        this.setState({
            userDetail : {
                ...this.state.userDetail,
                [this.mappingFields(name)]: date
            }
        })
    }

    mappingFields = key => {
        switch (key) {
            case "Birthday":
                return "birthday";
            case "DateOfIssue":
                return "date_of_issue";
            case "Gender":
                return "gender";
            case "PersonalEmail":
                return "personal_email";
            case "CellPhoneNo":
                return "cell_phone_no";
            case "UrgentContactNo":
                return "urgent_contact_no";
            case "BankAccountNumber":
                return "bank_number";
            case "PlaceOfIssue":
                return "place_of_issue";
            case "Ethinic":
                return "race_id";
            case "Religion":
                return "religion_id";
            case "BirthProvince":
                return "province_id";
            case "Nationality":
                return "country_id";
            case "MaritalStatus":
                return "marital_status_code";
            case "Bank":
                return "bank_name_id";
            case "DocumentTypeId":
                return "document_type_id";
            case "DocumentTypeValue":
                return "passport_no";
            case "Province":
                return "province_id";
            case "District":
                return "district_id";
            case "Wards":
                return "ward_id";
            case "TempProvince":
                return "tmp_province_id";
            case "TempDistrict":
                return "tmp_district_id";
            case "TempWards":
                return "tmp_ward_id";
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
            this.handleUpdateAddressForInput(name, item.value, ""); // For select tag
        } else {
            this.handleUpdateAddressForInput(name, item.target.value, ""); // For input text tag
        }
    }

    handleUpdateAddressForInput = (name, value, prefix) => {
        if(value !== this.props.userDetail[this.mappingFields(prefix + name)]) {
            this.props.updateInfo(prefix + name, this.props.userDetail[this.mappingFields(prefix + name)], value)
        } else {
            this.props.removeInfo(prefix + name)
        }
        this.setState({
            userDetail : {
                ...this.state.userDetail,
                [this.mappingFields(prefix + name)]: value
            }
        })
    }

    updateTmpAddress(name, item, tempAddress) {
        this.setState({tempAddress: tempAddress});
        if (name !== "StreetName") {
            this.handleUpdateAddressForInput(name, item.value, "Temp"); // For select tag
        } else {
            this.handleUpdateAddressForInput(name, item.target.value, "Temp"); // For input text tag
        }
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
        const banks = this.props.banks.map(bank =>  { return { value: bank.ID, label: bank.TEXT } } )
        const marriage = this.props.marriages.find(m => m.ID == userDetail.marital_status_code)
        const provinces = this.state.provinces.map(province =>  { return { value: province.ID, label: province.TEXT } } )
        const religions = this.props.religions.map(r =>  { return { value: r.ID, label: r.TEXT } } )
        const documentTypes = this.props.documentTypes.map(d =>  { return { value: d.ID, label: d.TEXT } } )
        const documentTypeLabel = this.props.documentTypes.filter(item => { return item.ID == this.state.userDetail.document_type_id})
        let tempDocumentTypeLabel = "";
        if (documentTypeLabel && documentTypeLabel.length > 0) {
            tempDocumentTypeLabel = documentTypeLabel[0].TEXT;
        }
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
                   <div className="label">Nơi sinh</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{userDetail.birth_province || ""}</div>
                </div>
                <div className="col-6">
                    <Select name="BirthProvince" placeholder="Lựa chọn nơi sinh" key="birthProvince" options={provinces} 
                    value={provinces.filter(p => p.value == this.state.userDetail.province_id)} onChange={e => this.handleSelectInputs(e, 'BirthProvince', userDetail.birth_province)} />
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
                   <div className="label">Số CMND/CCCD/Hộ chiếu/Giấy phép lao động</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{userDetail.passport_no || ""}</div>
                </div>
                <div className="col-6 form-inline">
                    <Select name="DocumentTypeId" className="w-25 mr-3" placeholder="Lựa chọn..." options={documentTypes} 
                    value={documentTypes.filter(d => d.value == this.state.userDetail.document_type_id )} onChange={e => this.handleSelectInputs(e, "DocumentTypeId", tempDocumentTypeLabel)} /> 
                    <input className="form-control w-50" name="DocumentTypeValue" type="text" value={this.state.userDetail.passport_no || ""} 
                    onChange={this.handleTextInputChange.bind(this)} />
                </div>
            </div>

            <div className="row">
                <div className="col-2">
                   <div className="label">Ngày cấp</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{userDetail.date_of_issue}</div>
                </div>
                <div className="col-6 input-container">
                    <label>
                    <DatePicker 
                        name="DateOfIssue" 
                        key="DateOfIssue"
                        selected={this.state.userDetail.date_of_issue ? moment(this.state.userDetail.date_of_issue, 'DD-MM-YYYY').toDate() : null}
                        onChange={dateOfIssue => this.handleDatePickerInputChange(dateOfIssue, "DateOfIssue")}
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
                   <div className="label">Nơi cấp</div>
                </div>
                <div className="col-4 old">
                    <div className="detail">{userDetail.place_of_issue || ""}</div>
                </div>
                <div className="col-6">
                    <input className="form-control" name="PlaceOfIssue" type="text" onChange={this.handleTextInputChange.bind(this)} 
                    value={this.state.userDetail.place_of_issue || ""} />
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
                    <Select name="Nationality" placeholder="Lựa chọn quốc tịch" options={nations} value={nations.filter(n => n.value == this.state.userDetail.country_id)} 
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
                        ward_id={this.state.mainAddress.wardId ? this.state.mainAddress.wardId : this.state.userDetail.ward_id}
                        district_id={this.state.mainAddress.districtId ? this.state.mainAddress.districtId : this.state.userDetail.district_id}
                        province_id={this.state.mainAddress.provinceId ? this.state.mainAddress.provinceId : this.state.userDetail.province_id}
                        country_id={this.state.userDetail.country_id}
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
                        ward_id={this.state.tempAddress.wardId ? this.state.tempAddress.wardId : this.state.userDetail.tmp_ward_id}
                        district_id={this.state.tempAddress.districtId ? this.state.tempAddress.districtId : this.state.userDetail.tmp_district_id}
                        province_id={this.state.tempAddress.provinceId ? this.state.tempAddress.provinceId : this.state.userDetail.tmp_province_id}
                        country_id={this.state.userDetail.tmp_country_id}
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
