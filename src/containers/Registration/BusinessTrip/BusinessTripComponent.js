import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import StatusModal from '../../../components/Common/StatusModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import Constants from '../../../commons/Constants'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import moment from 'moment'

registerLocale("vi", vi)

class BusinessTripComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: null,
      startTime: null,
      endTime: null,
      endDate: null,
      totalTime: 2,
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
    if (this.props.businessTrip) {
      this.setState({
        isEdit: true,
        id: this.props.businessTrip.id,
        startDate: moment(this.props.businessTrip.userProfileInfo.startDate).toDate(),
        startTime: moment(this.props.businessTrip.userProfileInfo.startTime).toDate(),
        endDate: moment(this.props.businessTrip.userProfileInfo.endDate).toDate(),
        endTime: moment(this.props.businessTrip.userProfileInfo.endTime).toDate(),
        totalTime: this.props.businessTrip.userProfileInfo.totalTime,
        attendanceQuotaType: this.props.businessTrip.userProfileInfo.attendanceQuotaType,
        place: this.props.businessTrip.userProfileInfo.place,
        vehicle: this.props.businessTrip.userProfileInfo.vehicle,
        note: this.props.businessTrip.comment,
        approver: this.props.businessTrip.userProfileInfo.approver
      })
    }
  }

  setStartDate(startDate) {
    this.setState({
      startDate: startDate,
      endDate: this.state.endDate === undefined || startDate > this.state.endDate ? startDate : this.state.endDate
    })
  }

  setStartTime(startTime) {
    this.setState({
      startTime: startTime,
      endTime: this.state.endTime === undefined || startTime > this.state.endTime ? startTime : this.state.endTime
    })
  }

  setEndTime(endTime) {
    this.setState({
      endTime: endTime
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
    if (!_.isEmpty(errors)) {
      return
    }

    const data = {
      startDate: this.state.startDate,
      startTime: this.state.startTime,
      endDate: this.state.startDate,
      endTime: this.state.endTime,
      attendanceQuotaType: this.state.attendanceQuotaType,
      approver: this.state.approver,
      totalTime: this.state.totalTime,
      vehicle: this.state.vehicle,
      place: this.state.place,
      user: {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
      }
    }

    let bodyFormData = new FormData();
    bodyFormData.append('Name', 'Đăng ký Công tác/Đào tạo')
    bodyFormData.append('RequestTypeId', Constants.BUSINESS_TRIP)
    bodyFormData.append('Comment', this.state.note)
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', JSON.stringify({}))
    bodyFormData.append('Region', localStorage.getItem('region'))
    bodyFormData.append('UserProfileInfoToSap', JSON.stringify({}))
    this.state.files.forEach(file => {
      bodyFormData.append('Files', file)
    })

    axios({
      method: 'POST',
      url: this.state.isEdit && this.state.id ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.state.id}/update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
    })
      .then(response => {
        if (response && response.data && response.data.result) {
          this.showStatusModal(`Cập nhập thành công!`, true)
        }
      })
      .catch(response => {
      })
  }

  error(name) {
    return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({isShowStatusModal: true, content: message, isSuccess: isSuccess});
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
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
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal}/>
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-5">
                <p className="title">Ngày/giờ bắt đầu</p>
                <div className="row">
                  <div className="col">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          name="startDate"
                          selectsStart
                          selected={this.state.startDate}
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          onChange={this.setStartDate.bind(this)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Lựa chọn"
                          locale="vi"
                          className="form-control input" />
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                    {this.error('startDate')}
                  </div>
                  <div className="col">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          selected={this.state.startTime}
                          onChange={this.setStartTime.bind(this)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                        />
                        <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                      </label>
                    </div>
                    {this.error('startTime')}
                  </div>

                </div>

              </div>

              <div className="col-5">
                <p className="title">Ngày/giờ kết thúc</p>
                <div className="row">
                  <div className="col">
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
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Lựa chọn"
                          locale="vi"
                          className="form-control input" />
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                    {this.error('endDate')}
                  </div>
                  <div className="col">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          selected={this.state.endTime}
                          onChange={this.setEndTime.bind(this)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                        />
                        <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                      </label>
                    </div>
                    {this.error('startTime')}
                  </div>
                </div>

              </div>

              <div className="col-2">
                <p className="title">Tổng thời gian CT/ĐT</p>
                <div>
                  <input type="text" class="form-control" value="2 ngày" readOnly />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <p className="title">Loại chuyến Công tác/Đào tạo</p>
                <div>
                  <Select name="attendanceQuotaType" value={this.state.attendanceQuotaType} onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType)} placeholder="Lựa chọn" key="attendanceQuotaType" options={attendanceQuotaTypes} />
                </div>
                {this.error('attendanceQuotaType')}
              </div>

              <div className="col-5">
                <p className="title">Địa điểm</p>
                <div>
                  <Select name="place" value={this.state.place} onChange={place => this.handleSelectChange('place', place)} placeholder="Lựa chọn" key="place" options={places} />
                </div>
                {this.error('place')}
              </div>

              <div className="col-2">
                <p className="title">Phương tiện</p>
                <div>
                  <Select name="vehicle" value={this.state.vehicle} onChange={vehicle => this.handleSelectChange('vehicle', vehicle)} placeholder="Lựa chọn" key="vehicle" options={vehicles} />
                </div>
                {this.error('vehicle')}
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="title">Lý do đăng ký Công tác/Đào tạo</p>
                <div>
                  <textarea class="form-control" name="note" value={this.state.note} onChange={this.handleInputChange.bind(this)} placeholder="Nhập lý do" rows="3"></textarea>
                </div>
                {this.error('note')}
              </div>
            </div>
          </div>
        </div>

        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.businessTrip ? this.props.businessTrip.userProfileInfo.approver : null} />
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
      </div>
    )
  }
}
export default BusinessTripComponent