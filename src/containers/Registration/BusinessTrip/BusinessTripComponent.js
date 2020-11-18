import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Constants from '../../../commons/Constants'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import moment from 'moment'

registerLocale("vi", vi)

const FULL_DAY = 1
const DURING_THE_DAY = 2
const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'
const TIME_OF_SAP_FORMAT = 'HHmm00'

const TRAINING_OPTION_VALUE = "DT01"

class BusinessTripComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: null,
      startTime: null,
      endTime: null,
      endDate: null,
      totalTime: null,
      attendanceQuotaType: null,
      leaveType: FULL_DAY,
      vehicle: null,
      place: null,
      note: null,
      approver: null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      titleModal: "",
      messageModal: "",
      isShowAddressAndVehicle: true
    }
  }

  componentDidMount() {
    if (this.props.businessTrip) {
      this.setState({
        isEdit: true,
        id: this.props.businessTrip.id,
        startDate: this.props.businessTrip.userProfileInfo.startDate,
        startTime: this.props.businessTrip.userProfileInfo.startTime,
        endDate: this.props.businessTrip.userProfileInfo.endDate,
        endTime: this.props.businessTrip.userProfileInfo.endTime,
        totalTime: this.props.businessTrip.userProfileInfo.totalTime,
        attendanceQuotaType: this.props.businessTrip.userProfileInfo.attendanceQuotaType,
        leaveType: this.props.businessTrip.userProfileInfo.leaveType,
        place: this.props.businessTrip.userProfileInfo.place,
        vehicle: this.props.businessTrip.userProfileInfo.vehicle,
        note: this.props.businessTrip.comment,
        approver: this.props.businessTrip.userProfileInfo.approver,
        files: this.props.businessTrip.userProfileInfoDocuments.map(file => {
          return {
            id: file.id,
            name: file.fileName,
            fileSize: file.fileSize,
            fileType: file.fileType,
            fileUrl: file.fileUrl
          }
        }),
      })
    }
  }

  setStartDate(startDate) {
    const start = moment(startDate).isValid() ? moment(startDate).format(DATE_FORMAT) : null
    const end = this.state.endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(DATE_FORMAT) > this.state.endDate) 
    || this.state.leaveType === DURING_THE_DAY ? moment(startDate).isValid() && moment(startDate).format(DATE_FORMAT) : this.state.endDate
    this.setState({
      startDate: start,
      endDate: end
    })
    this.calculateTotalTime(start, end)
  }

  setStartTime(startTime) {
    const start = moment(startTime).isValid() ? moment(startTime).format(TIME_FORMAT) : null
    const end = this.state.endTime === undefined || (moment(startTime).isValid() && moment(startTime).format(TIME_FORMAT) > this.state.endTime) ? moment(startTime).isValid() && moment(startTime).format(TIME_FORMAT) : this.state.endTime
    this.setState({
        startTime: start,
        endTime: end
    })
    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
  }

  setEndTime(endTime) {
    const start = this.state.startTime === undefined || (moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT) < this.state.startTime) ? moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT) : this.state.startTime
    const end =  moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT)
    this.setState({
        startTime: start,
        endTime: end
    })
    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
  }

  setEndDate(endDate) {
    const start = this.state.leaveType === DURING_THE_DAY ? moment(endDate).isValid() && moment(endDate).format(DATE_FORMAT) : this.state.startDate
    const end = moment(endDate).isValid() && moment(endDate).format(DATE_FORMAT)
    this.setState({
      startDate: start,
      endDate: end
    })
    this.calculateTotalTime(start, end)
  }

  calculateTotalTime(startDate, endDate, startTime = this.state.startTime, endTime = this.state.endTime) {
    if (!startDate || !endDate) return

    const config = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
            'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
        }
    }

    const start = moment(startDate, DATE_FORMAT).format('YYYYMMDD').toString()
    const end = moment(endDate, DATE_FORMAT).format('YYYYMMDD').toString()

    axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/timeoverview`, {
        perno: localStorage.getItem('employeeNo'),
        from_date: start,
        to_date: end
    } ,config)
        .then(res => {
            if (res && res.data && res.data.data) {
                this.setState({totalTime: this.state.leaveType === FULL_DAY ? this.calFullDay(res.data.data) : this.calDuringTheDay(res.data.data, startTime, endTime)})
            }
        }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
        })
}

calFullDay(timesheets) {
    const hours = timesheets.filter(timesheet => timesheet.shift_id !== 'OFF').reduce((accumulator, currentValue) => {
        return accumulator + parseFloat(currentValue.hours)
    }, 0)
    
    return hours ? (hours / 8) : 0
}

calDuringTheDay(timesheets, startTime, endTime) {
    if (!startTime || !endTime) return
    
    let startTimeSAP = moment(startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT)
    let endTimeSAP = moment(endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT)
    let hours = 0

    if ( timesheets.length > 0) {
        const timesheet = timesheets[0]
        const shiftIndex = ['1', '2']

        shiftIndex.forEach(index => {
            
            if (timesheet['from_time' + index] && endTimeSAP > timesheet['from_time'+ index] && startTimeSAP < timesheet['to_time'+ index]) {
                
                // correct time if startTime < from_time and endTime > to_time
                startTimeSAP = startTimeSAP < timesheet['from_time'+ index] ? timesheet['from_time'+ index] : startTimeSAP
                endTimeSAP = endTimeSAP > timesheet['to_time'+ index] ? timesheet['to_time'+ index] : endTimeSAP

                // the startTime and the endTime are setted in the break time
                startTimeSAP = startTimeSAP >= timesheet['break_from_time_'+ index] && startTimeSAP <= timesheet['break_to_time'+ index] ? timesheet['break_to_time'+ 1] : startTimeSAP
                endTimeSAP = endTimeSAP >= timesheet['break_from_time_'+ index] && endTimeSAP <= timesheet['break_to_time'+ index] ? timesheet['break_from_time_'+ index] : endTimeSAP

                // endtime < startime ex: starTime = 23:00:00 endTime = 06:00:00 
                endTimeSAP = endTimeSAP < startTimeSAP ? moment(endTimeSAP, TIME_OF_SAP_FORMAT).add(1, 'days').format(TIME_OF_SAP_FORMAT) : endTimeSAP
                
                const differenceInMs = moment(endTimeSAP, TIME_OF_SAP_FORMAT).diff(moment(startTimeSAP, TIME_OF_SAP_FORMAT))
                hours = hours + Math.abs(moment.duration(differenceInMs).asHours())

                if(startTimeSAP < timesheet['break_from_time_'+ index] && endTimeSAP > timesheet['break_to_time'+ index]) {
                    const differenceInMsBreakTime = moment(timesheet['break_to_time'+ index], TIME_OF_SAP_FORMAT).diff(moment(timesheet['break_from_time_'+ index], TIME_OF_SAP_FORMAT))
                    hours = hours - Math.abs(moment.duration(differenceInMsBreakTime).asHours())
                }
            }
        })
    }
 
    return hours ? (hours / 8) : 0
}

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver, isApprover) {
    this.setState({ approver: approver })
    const errors = {...this.state.errors}
    if (!isApprover) {
      errors.approver = 'Người phê duyệt không có thẩm quyền!'
    } else {
      errors.approver = null
    }
    this.setState({ errors: errors })
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
    if (name === "attendanceQuotaType" && value.value === TRAINING_OPTION_VALUE) {
      this.setState({isShowAddressAndVehicle : false})
    } else {
      this.setState({isShowAddressAndVehicle : true})
    }
    this.setState({ [name]: value })
  }

  verifyInput() {
    let errors = {...this.state.errors}
    let requiredFields = ['note', 'startDate', 'endDate', 'attendanceQuotaType', 'approver', 'place', 'vehicle']
    if (this.state.attendanceQuotaType && this.state.attendanceQuotaType.value === TRAINING_OPTION_VALUE) {
      requiredFields = ['note', 'startDate', 'endDate', 'attendanceQuotaType', 'approver']
    }
    requiredFields.forEach(name => {
      if (_.isNull(this.state[name]) || !this.state[name]) {
        errors[name] = '(Bắt buộc)'
      } else {
        if (name !== "approver") {
          errors[name] = null
        }
      }
    })
    errors['startTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['startTime'])) ? '(Bắt buộc)' : null
    errors['endTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['endTime'])) ? '(Bắt buộc)' : null
    this.setState({ errors: errors })
    return errors
  }

  submit() {
    const errors = this.verifyInput()
    const hasErrors = !Object.values(errors).every(item => item === null)
    if (hasErrors) {
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
      leaveType: this.state.leaveType,
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
    bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
    bodyFormData.append('UserProfileInfoToSap', JSON.stringify({}))
    bodyFormData.append('UserManagerId', this.state.approver ? this.state.approver.userAccount : "")
    this.state.files.forEach(file => {
      bodyFormData.append('Files', file)
    })

    axios({
      method: 'POST',
      url: this.state.isEdit && this.state.id ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.state.id}/registration-update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
    })
    .then(response => {
      if (response && response.data && response.data.result) {
        this.showStatusModal("Thành công", "Yêu cầu của bạn đã được gửi đi!", true)
      }
    })
    .catch(response => {
      this.showStatusModal("Lỗi", "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
    })
  }

  error(name) {
    return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
  }

  showStatusModal = (title, message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  }

  updateLeaveType(leaveType) {
    if (leaveType == this.state.leaveType) {
      return
    }
    this.setState({ leaveType: leaveType, startTime: null, endTime: null, startDate: null, endDate: null, totalTime: null })
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({isUpdateFiles : status})
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
        <ResultModal show={this.state.isShowStatusModal} title={this.state.titleModal} message={this.state.messageModal} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-7">
                <p className="text-uppercase"><b>Lựa chọn thời gian công tác/đào tạo</b></p>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label onClick={this.updateLeaveType.bind(this, FULL_DAY)} className={this.state.leaveType === FULL_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Cả ngày
                  </label>
                  <label onClick={this.updateLeaveType.bind(this, DURING_THE_DAY)} className={this.state.leaveType === DURING_THE_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Theo giờ
                  </label>
                </div>
              </div>
            </div>
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
                          autoComplete="off"
                          selected={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
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
                          selected={this.state.startTime ? moment(this.state.startTime, TIME_FORMAT).toDate() : null}
                          onChange={this.setStartTime.bind(this)}
                          autoComplete="off"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false} />
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
                          autoComplete="off"
                          selected={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                          startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                          minDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
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
                          selected={this.state.endTime ? moment(this.state.endTime, TIME_FORMAT).toDate() : null}
                          onChange={this.setEndTime.bind(this)}
                          autoComplete="off"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false} />
                        <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                      </label>
                    </div>
                    {this.error('endTime')}
                  </div>
                </div>
              </div>

              <div className="col-2">
                <p className="title">Tổng thời gian CT/ĐT</p>
                <div>
                  <input type="text" className="form-control" value={this.state.totalTime && !_.isNull(this.state.totalTime) ? this.state.leaveType == FULL_DAY ? this.state.totalTime + ' ngày' : this.state.totalTime* 8 + ' giờ' : ''} readOnly />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <p className="title">Loại chuyến Công tác/Đào tạo</p>
                <div>
                  <Select name="attendanceQuotaType" value={this.state.attendanceQuotaType} onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType)} placeholder="Lựa chọn" key="attendanceQuotaType" options={attendanceQuotaTypes} />
                </div>
                <div className="business-type">
                  <span className="text-info smaller">* Có CTP: được trả Công tác phí</span>
                  <span className="text-info">* Không CTP: không được trả Công tác phí</span>
                  <span className="text-info smaller">* Có ăn ca: được trả tiền ăn ca</span>
                  <span className="text-info">* Không ăn ca: không được trả tiền ăn ca</span>
                </div>
                {this.error('attendanceQuotaType')}
              </div>
              {
                this.state.isShowAddressAndVehicle ?
                <>
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
                </>
              : null
              }
            </div>

            <div className="row">
              <div className="col-12">
                <p className="title">Lý do đăng ký Công tác/Đào tạo</p>
                <div>
                  <textarea className="form-control" name="note" value={this.state.note || ""} onChange={this.handleInputChange.bind(this)} placeholder="Nhập lý do" rows="3"></textarea>
                </div>
                {this.error('note')}
              </div>
            </div>
          </div>
        </div>

        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.businessTrip ? this.props.businessTrip.userProfileInfo.approver : null} />
        <ul className="list-inline">
          {this.state.files.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <span className="file-name">
                <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i>
              </span>
            </li>
          })}
        </ul>
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} />
      </div>
    )
  }
}
export default BusinessTripComponent