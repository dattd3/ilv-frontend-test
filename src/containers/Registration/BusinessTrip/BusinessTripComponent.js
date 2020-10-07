import React from 'react'
// import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'

registerLocale("vi", vi)

class BusinessTripComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      totalTime: null,
      attendanceQuotaType: null,
      vehicle: null,
      place: null,
      note: null,
      approver: null,
      files: [],
      errors: {}
    }
  }

  componentDidMount() {
    //   const config = {
    //     headers: {
    //       'Authorization': `${localStorage.getItem('accessToken')}`
    //     }
    //   }
    //   axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/approval`, config)
    //   .then(res => {
    //     if (res && res.data && res.data.data && res.data.result) {
    //       const result = res.data.result;
    //       if (result.code != Constants.API_ERROR_CODE) {
    //         this.setState({tasks : res.data.data.listUserProfileHistories});
    //       }
    //     }
    //   }).catch(error => {
    //     this.props.sendData(null);
    //     this.setState({tasks : []});
    //   });
  }

  setStartDate(startDate) {
    this.setState({
      startDate: startDate,
      endDate: this.state.endDate === undefined || startDate > this.state.endDate ? startDate : this.state.endDate
    })
  }

  setEndDate(endDate) {
    this.setState({
      endDate: endDate
    })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver) {
    this.setState({ approver: approver })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
  }

  verifyInput() {
    let errors = {}
    const RequiredFields = ['note', 'startDate', 'endDate', 'attendanceQuotaType', 'approver', 'place', 'vehicle']
    RequiredFields.forEach(name => {
      if (_.isNull(this.state[name])) {
        errors[name] = '(Bắt buộc)'
      }
    })

    this.setState({ errors: errors })
    return errors
  }

  submit() {
    const errors = this.verifyInput()
    if (errors) {
      return
    }
  }

  error(name) {
    return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
  }

  render() {
    const vehicles = [
      { value: '1', label: 'Xe cá nhân' },
      { value: '2', label: 'Taxi' },
      { value: '3', label: 'Tàu hỏa' },
      { value: '4', label: 'Máy bay' },
      { value: '5', label: 'Các phương thức vận chuyển khác' }
    ]

    const places = [
      { value: '1', label: 'Trong nước' },
      { value: '2', label: 'Nước ngoài' }
    ]

    const attendanceQuotaTypes = [
      { value: 'CT01', label: 'C/t (có CTP, không ăn ca)' },
      { value: 'CT02', label: 'C/t (có CTP, có ăn ca)' },
      { value: 'CT03', label: 'C/t (không CTP, có ăn ca)' },
      { value: 'CT04', label: 'C/t (ko CTP, không ăn ca)' },
      { value: 'DT01', label: 'Đào tạo' },
    ]
    return (
      <div className="business-trip">
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-4">
                <p className="title">Từ ngày/giờ</p>
                <div className="content input-container">
                  <label>
                    <DatePicker
                      name="startDate"
                      selectsStart
                      selected={this.state.startDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.setStartDate.bind(this)}
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Lựa chọn"
                      locale="vi"
                      showTimeSelect
                      className="form-control input" />
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                  </label>
                </div>
                {this.error('startDate')}
              </div>

              <div className="col-4">
                <p className="title">Đến ngày/giờ</p>
                <div className="content input-container">
                  <label>
                    <DatePicker
                      name="endDate"
                      selectsEnd
                      selected={this.state.endDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      minDate={this.state.startDate}
                      onChange={this.setEndDate.bind(this)}
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Lựa chọn"
                      locale="vi"
                      showTimeSelect
                      className="form-control input" />
                    <span className="input-group-addon input-img text-info"><i className="fas fa-calendar-alt"></i></span>
                  </label>
                </div>
                {this.error('endDate')}
              </div>

              <div className="col-4">
                <p className="title">Tổng thời gian Công tác/Đào tạo</p>
                <div>
                  <input type="text" class="form-control" value="2 ngày" readOnly />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <p className="title">Loại chuyến Công tác/Đào tạo</p>
                <div>
                  <Select name="attendanceQuotaType" value={this.state.attendanceQuotaType}  onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType)} placeholder="Lựa chọn" key="attendanceQuotaType" options={attendanceQuotaTypes} />
                </div>
                {this.error('attendanceQuotaType')}
              </div>

              <div className="col-4">
                <p className="title">Địa điểm</p>
                <div>
                  <Select name="place" value={this.state.place}  onChange={place => this.handleSelectChange('place', place)} placeholder="Lựa chọn" key="place" options={places} />
                </div>
                {this.error('place')}
              </div>

              <div className="col-4">
                <p className="title">Phương tiện</p>
                <div>
                  <Select name="vehicle" value={this.state.vehicle}  onChange={vehicle => this.handleSelectChange('vehicle', vehicle)} placeholder="Lựa chọn" key="vehicle" options={vehicles} />
                </div>
                {this.error('vehicle')}
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="title">Lý do đăng ký Công tác/Đào tạo</p>
                <div>
                  <textarea class="form-control" name="note" onChange={this.handleInputChange.bind(this)} placeholder="Nhập lý do" rows="3"></textarea>
                </div>
                {this.error('note')}
              </div>
            </div>
          </div>
        </div>

        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} />
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
      </div>
    )
  }
}
export default BusinessTripComponent