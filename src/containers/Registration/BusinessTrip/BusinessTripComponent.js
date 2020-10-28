import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import StatusModal from '../../../components/Common/StatusModal'
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
      errors: {}
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
            fileType: file.other,
            fileUrl: file.Url
          }
        }),
      })
    }
  }

  setStartDate(startDate) {
    const start = moment(startDate).format(DATE_FORMAT)
    const end = this.state.endDate === undefined || moment(startDate).format(DATE_FORMAT) > this.state.endDate || this.state.leaveType === DURING_THE_DAY ? moment(startDate).format(DATE_FORMAT) : this.state.endDate
    this.setState({
      startDate: start,
      endDate: end
    })

    this.calculateTotalTime(start, end)
  }

  setStartTime(startTime) {
    const start = moment(startTime).format(TIME_FORMAT)
    const end = this.state.endTime === undefined || moment(startTime).format(TIME_FORMAT) > this.state.endTime ? moment(startTime).format(TIME_FORMAT) : this.state.endTime
    this.setState({
        startTime: start,
        endTime: end
    })

    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
}

setEndTime(endTime) {
    const start = this.state.startTime === undefined || moment(endTime).format(TIME_FORMAT) < this.state.startTime ? moment(endTime).format(TIME_FORMAT) : this.state.startTime
    const end = moment(endTime).format(TIME_FORMAT)
    this.setState({
        startTime: start,
        endTime: end
    })

    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
}

  setEndDate(endDate) {
    const start = this.state.leaveType === DURING_THE_DAY ? moment(endDate).format(DATE_FORMAT) : this.state.startDate
    const end = moment(endDate).format(DATE_FORMAT)
    this.setState({
      startDate: start,
      endDate: end
    })

    this.calculateTotalTime(start, end)
  }

  calculateTotalTime(startDate, endDate, startTime = null, endTime = null) {
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

    if (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['startTime'])) {
      errors['startTime'] = '(Bắt buộc)'
    }

    if (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['endTime'])) {
      errors['endTime'] = '(Bắt buộc)'
    }

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
    bodyFormData.append('UserProfileInfoToSap', JSON.stringify({}))
    bodyFormData.append('UserManagerId', this.state.approver.userAccount)
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
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  updateLeaveType(leaveType) {
    if (leaveType == this.state.leaveType) {
      return
    }
    this.setState({ leaveType: leaveType, startTime: null, endTime: null, startDate: null, endDate: null })
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
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
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-7">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label onClick={this.updateLeaveType.bind(this, FULL_DAY)} className={this.state.leaveType === FULL_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Nghỉ cả ngày
                  </label>
                  <label onClick={this.updateLeaveType.bind(this, DURING_THE_DAY)} className={this.state.leaveType === DURING_THE_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Nghỉ trong ngày
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
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false}
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
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="h:mm aa"
                          placeholderText="Lựa chọn"
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false}
                        />
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
                  <input type="text" className="form-control" value={this.state.totalTime ? this.state.totalTime + ' Ngày' : null} readOnly />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <p className="title">Loại chuyến Công tác/Đào tạo <OverlayTrigger
                  trigger="click"
                  placement="right"
                  overlay={<Popover id={'note'} className="registration-popover">
                    <Popover.Title as="h3" className="bg-secondary text-light">Ghi chú</Popover.Title>
                    <Popover.Content>
                      <p>* Có CTP: được trả Công tác phí</p>
                      <p>* Không CTP: không được trả Công tác phí</p>
                      <p>* Có ăn ca: được trả tiền ăn ca</p>
                      <p>* Không ăn ca: không được trả tiền ăn ca</p>
                    </Popover.Content>
                  </Popover>}>
                  <i className="fa fa-info-circle text-info" aria-hidden="true"></i>
                </OverlayTrigger></p>
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
                  <textarea className="form-control" name="note" value={this.state.note} onChange={this.handleInputChange.bind(this)} placeholder="Nhập lý do" rows="3"></textarea>
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
              <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
            </li>
          })}
        </ul>
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
      </div>
    )
  }
}
export default BusinessTripComponent