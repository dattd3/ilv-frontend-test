import React from 'react'
import axios from 'axios'
import AddressModal from './AddressModal'
import Select from 'react-select'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)


class PersonalComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            userDetail: {},
            insurance_number: '',
            isAddressEdit: false,
            isTmpAddressEdit: false
        }
    }

    componentDidMount() {
        let config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
            'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
          }
        }
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/profile`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userProfile = res.data.data[0];
              this.props.setState({ userProfile: userProfile })
              this.setState({insurance_number: userProfile.insurance_number })
            }
          }).catch(error => {
          })
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/personalinfo`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userDetail = res.data.data[0]
              this.setState({ userDetail: userDetail })
              this.props.setState({ userDetail: userDetail })
            }
          }).catch(error => {
          })
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

    handleInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        if(value !== this.props.userDetail[name]) {
            this.props.updateInfo(name, this.props.userDetail[name], value)
            
        } else {
            this.props.removeInfo(name)
        }
        this.setState({
            userDetail: {[name]: value}
        })
    }

    showModal(name) {
        this.setState({[name]: true})
    }
  
    hideModal(name) {
        this.setState({[name]: false})
    }
    
    render() {
        const userDetail = this.props.userDetail
        const userProfile = this.props.userProfile
        const genders = this.props.genders.map(gender =>  { return { value: gender.ID, label: gender.TEXT } } )
        const races = this.props.races.map(race =>  { return { value: race.ID, label: race.TEXT } } )
        const marriages = this.props.marriages.map(marriage =>  { return { value: marriage.ID, label: marriage.TEXT } } )
        const nations = this.props.nations.map(nation =>  { return { value: nation.ID, label: nation.TEXT } } )
        const banks = this.props.banks.map(bank =>  { return { value: bank.ID, label: bank.TEXT } } )

        const marriage = this.props.marriages.find(m => m.ID == userDetail.marital_status_code)

      return (
      <div className="info">
        <h4 className="title text-uppercase">Thông tin cá nhân</h4>
        <div className="box shadow">
            <div class="row">
                <div class="col">
                    <i className="note-old"> </i> Thông tin cũ
                </div>
                <div class="col">
                <i className="note-new"> </i> Nhập thông tin điều chỉnh
                </div>
            </div>

            <hr/>

            <div class="row">
                <div class="col-2">
                   <div className="label">Họ và tên</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.fullname}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="fullname" onChange={this.handleInputChange.bind(this)} value={this.state.userDetail.fullname}/>
                </div>
            </div>
            <div class="row">
                <div class="col-2">
                   <div className="label">Số sổ bảo hiểm</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userProfile.insurance_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="insurance_number" onChange={this.handleInputChange.bind(this)} value={this.state.insurance_number} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Mã số thuế</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.tax_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" type="text" name="tax_number" value={this.state.userDetail.tax_number} onChange={this.handleInputChange.bind(this)}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày sinh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.birthday}</div>
                </div>
                <div class="col-6 input-container">
                    <label>
                        <DatePicker 
                            name="birthday" 
                            selectsStart 
                            selected={this.state.userDetail.birthday ? moment(this.state.userDetail.birthday, 'DD-MM-YYYY').toDate() : null}
                            // onChange={this.setStartDate}
                            dateFormat="dd-MM-yyyy"
                            locale="vi"
                            className="form-control input"/>
                            <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Nơi sinh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.birth_province}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="birth_province" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.userDetail.birth_province}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Giới tính</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{(userDetail.gender !== undefined && userDetail.gender !== '2') ? 'Nam' : 'Nữ'}</div>
                </div>
                <div class="col-6">
                    <Select placeholder="Lựa chọn giới tính" options={genders} value={genders.filter(g => g.value == this.state.userDetail.gender)} onChange={this.handleInputChange.bind(this)} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Dân tộc</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.ethinic}</div>
                </div>
                <div class="col-6">
                    <Select placeholder="Lựa chọn dân tộc" options={races} value={races.filter(r => r.value == this.state.userDetail.race_id)} onChange={this.handleInputChange.bind(this)} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Tôn giáo</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.religion ? userDetail.religion : 'Không'}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="religion" type="text" value={this.state.userDetail.religion}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Số CMND/CCCD/Hộ chiếu</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.passport_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="passport_no" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.userDetail.passport_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.date_of_issue}</div>
                </div>
                <div class="col-6 input-container">
                    <label>
                    <DatePicker 
                        name="date_of_issue" 
                        selectsStart 
                        selected={this.state.userDetail.date_of_issue ? moment(this.state.userDetail.date_of_issue, 'DD-MM-YYYY').toDate() : null}
                        // onChange={this.setStartDate}
                        dateFormat="dd-MM-yyyy"
                        locale="vi"
                        className="form-control input"/>
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Nơi cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.place_of_issue}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="place_of_issue" type="text" onChange={this.handleInputChange.bind(this)} value={this.state.userDetail.place_of_issue}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Quốc tịch</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.nationality}</div>
                </div>
                <div class="col-6">
                    <Select placeholder="Lựa chọn quốc tịch" options={nations} value={nations.filter(n => n.value == this.state.userDetail.country_id)} onChange={this.handleInputChange.bind(this)} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Địa chỉ thường trú</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{this.SummaryAddress([userDetail.street_name, userDetail.wards, userDetail.district, userDetail.province])}</div>
                </div>
                <div class="col-6">
                    {this.state.isAddressEdit ? <AddressModal
                        title="Địa chỉ thường trú"
                        show={this.state.isAddressEdit} 
                        onHide={this.hideModal.bind(this, 'isAddressEdit')}
                        street_name={this.state.userDetail.street_name}
                        ward_id={this.state.userDetail.ward_id}
                        district_id={this.state.userDetail.district_id}
                        province_id={this.state.userDetail.province_id}
                    /> : null}
                    <div className="edit" onClick={this.showModal.bind(this, 'isAddressEdit')}>{this.SummaryAddress([this.state.userDetail.street_name, this.state.userDetail.wards, this.state.userDetail.district, this.state.userDetail.province])}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Địa chỉ tạm trú</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{this.SummaryAddress([userDetail.tmp_street_name, userDetail.tmp_wards, userDetail.tmp_district, userDetail.tmp_province])}</div>
                </div>
                <div class="col-6">
                    {this.state.isTmpAddressEdit ? <AddressModal
                        title="Địa chỉ tạm trú"
                        show={this.state.isTmpAddressEdit} 
                        onHide={this.hideModal.bind(this, 'isTmpAddressEdit')}
                        street_name={this.state.userDetail.street_name}
                        ward_id={this.state.userDetail.tmp_ward_id}
                        district_id={this.state.userDetail.tmp_district_id}
                        province_id={this.state.userDetail.tmp_province_id}
                    /> : null}  
                    <div className="edit" onClick={this.showModal.bind(this, 'isTmpAddressEdit')}>{this.SummaryAddress([this.state.userDetail.tmp_street_name, this.state.userDetail.tmp_wards, this.state.userDetail.tmp_district, this.state.userDetail.tmp_province])}</div>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Tình trạng hôn nhân</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{marriage ? marriage.TEXT : null}</div>
                </div>
                <div class="col-6">
                    <Select placeholder="Lựa chọn tình trạng hôn nhân" options={marriages} value={marriages.filter(m => m.value == this.state.userDetail.marital_status_code)} onChange={this.handleInputChange.bind(this)} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Giấy phép lao động</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.work_permit_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="work_permit_no" type="text" value={this.state.userDetail.work_permit_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngày hết hạn</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.expiry_date}</div>
                </div>
                <div class="col-6 input-container">
                <label>
                    <DatePicker 
                        name="expiry_date" 
                        selected={this.state.userDetail.date_of_issue ? moment(this.state.userDetail.expiry_date, 'DD-MM-YYYY').toDate() : null}
                        // onChange={this.setStartDate}
                        dateFormat="dd-MM-yyyy"
                        locale="vi"
                        className="form-control input"/>
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                    </label>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Email cá nhân</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.personal_email}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="personal_email" type="text" value={this.state.userDetail.personal_email}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Điện thoại di động</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.cell_phone_no}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="cell_phone_no" type="text" value={this.state.userDetail.cell_phone_no}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Điện thoại khẩn cấp</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{ this.isNotNull(userDetail.urgent_contact_no) ? userDetail.urgent_contact_no : null }</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="urgent_contact_no" type="text" value={this.isNotNull(userDetail.urgent_contact_no) ? userDetail.urgent_contact_no : null}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Số TK ngân hàng</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_number}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="bank_number" type="text" value={this.state.userDetail.bank_number}/>
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Ngân hàng</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_name}</div>
                </div>
                <div class="col-6">
                    <Select placeholder="Lựa chọn ngân hàng" name="bank_name" options={banks} value={banks.filter(b => b.value == this.state.userDetail.bank_name_id)} onChange={this.handleInputChange.bind(this)} />
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                   <div className="label">Chi nhánh</div> 
                </div>
                <div class="col-4">
                    <div className="detail">{userDetail.bank_branch}</div>
                </div>
                <div class="col-6">
                    <input class="form-control" name="bank_branch" type="text" value={this.state.userDetail.bank_branch}/>
                </div>
            </div>
        </div>
      </div>)
    }
  }
export default PersonalComponent