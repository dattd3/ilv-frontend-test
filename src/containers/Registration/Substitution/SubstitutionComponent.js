import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import moment from 'moment'
import ShiftTable from './ShiftTable'
import ShiftForm from './ShiftForm'
import DatePicker, { registerLocale } from 'react-datepicker'
import StatusModal from '../../../components/Common/StatusModal'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const SHIFT_CODE = 1
const SHIFT_UPDATE = 2

class SubstitutionComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: moment().startOf('month').toDate(),
      endDate: new Date(),
      timesheets: [],
      shifts: [],
      substitutionType: null,
      approver: null,
      files: [],
      isUpdateFiles: false,
      errors: {}
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/shifts`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const shifts = res.data.data.filter((shift, index, arr) => arr.findIndex(a => a.shift_id === shift.shift_id) === index)
          this.setState({ shifts: shifts })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      })
  }

  verifyInput() {
    let errors = {}
    const RequiredFields = ['note', 'startDate', 'startTime', 'endTime', 'substitutionType']
    this.state.substitutions && this.state.substitutions.forEach((substitution, index) => {
      RequiredFields.forEach(name => {
        if (_.isNull(substitution[name])) {
          errors[name + index] = '(Bắt buộc)'
        }
      })
    })

    if (_.isNull(this.state.approver)) {
      errors['approver'] = '(Bắt buộc)'
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
      timesheets: this.state.timesheets,
      substitutionType: this.state.substitutionType,
      approver: this.state.approver,
      user: {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
      }
    }

    let bodyFormData = new FormData();
    bodyFormData.append('Name', 'Thay đổi phân ca')
    bodyFormData.append('RequestTypeId', '4')
    bodyFormData.append('Comment', '')
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', {})
    bodyFormData.append('Region', localStorage.getItem('region'))
    bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
    bodyFormData.append('UserProfileInfoToSap', {})
    bodyFormData.append('UserManagerId', this.state.approver.userAccount)
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
          this.showStatusModal(`Cập nhập thành công!`, true)
        }
      })
      .catch(response => {
      })
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
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

  updateTime(index, name, value) {
    this.state.timesheets[index][name] = value
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  updateNote(index, e) {
    this.state.timesheets[index].note = e.currentTarget.value
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver) {
    this.setState({ approver: approver })
  }

  updateEditMode(index) {
    this.state.timesheets[index].isEdit = !this.state.timesheets[index].isEdit
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  updateShiftType(shiftType, index) {
    if (shiftType !== this.state.timesheets[index].shiftType) {
      this.state.timesheets[index].shiftType = shiftType
      this.state.timesheets[index].startTime = null
      this.state.timesheets[index].endTime = null
      this.state.timesheets[index].startBreakTime = null
      this.state.timesheets[index].endBreakTime = null
      this.setState({
        timesheets: [...this.state.timesheets]
      })
    }
  }

  updateShift(index, shiftId) {
    this.state.timesheets[index].shiftId = shiftId
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  handleSelectChange(substitutionType) {
    this.setState({
      substitutionType: substitutionType
    })
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({isUpdateFiles : status})
  }

  search() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    const start = moment(this.state.startDate).format('YYYYMMDD').toString()
    const end = moment(this.state.endDate).format('YYYYMMDD').toString()

    axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/timeoverview`, {
      perno: localStorage.getItem('employeeNo'),
      from_date: start,
      to_date: end
    }, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const shifts = ['1', '2', '3']
          const timesheets = res.data.data.flatMap(timesheet => {
            return shifts.map(shiftIndex => {
              return timesheet[`from_time${shiftIndex}`] && timesheet[`from_time${shiftIndex}`] !== '#' ? {
                date: timesheet.date,
                fromTime: timesheet[`from_time${shiftIndex}`],
                toTime: timesheet[`to_time${shiftIndex}`],
                isEdit: false,
                note: null,
                error: {},
                startTime: null,
                endTime: null,
                startBreakTime: null,
                endBreakTime: null,
                shiftType: SHIFT_CODE,
                shiftId: null,
                shiftIndex: shiftIndex
              } : undefined
            })
          }).filter(t => t !== undefined)
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => { })
  }

  render() {
    const substitutionTypes = [
      { value: '01', label: 'Phân ca làm việc' },
      { value: '02', label: 'Phân ca gãy' },
      { value: '03', label: 'Phân ca bờ đảo full ngày' }
    ]

    return (
      <div className="shift-work">
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="row">
            <div className="col-4">
              <p className="title">Từ ngày</p>
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

            <div className="col-4">
              <p className="title">Đến ngày</p>
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
                  <span className="input-group-addon input-img text-info"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
              {this.error('endDate')}
            </div>

            <div className="col-4">
              <p className="title">Loại phân ca</p>
              <div>
                <Select name="substitutionType" value={this.state.substitutionType} onChange={substitutionType => this.handleSelectChange(substitutionType)} placeholder="Lựa chọn" key="timeTotal" options={substitutionTypes} />
              </div>
              {this.error('substitutionType')}
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <button type="button" className="btn btn-warning w-100" onClick={this.search.bind(this)}>Tìm kiếm</button>
            </div>
          </div>
        </div>

        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="row">
              <div className="col-2"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-8">
                <p className="text-uppercase"><b>Giờ kế hoạch</b></p>

                <p>Bắt đầu {timesheet.shiftIndex}: <b>{moment(timesheet.fromTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)}</b> | Kết thúc {timesheet.shiftIndex}: <b>{moment(timesheet.toTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)}</b></p>
              </div>
              <div className="col-2 ">
                {!timesheet.isEdit
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> Sửa</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-times-circle"></i> Hủy</p>}
              </div>
            </div>

            {timesheet.isEdit ? <hr /> : null}

            {timesheet.isEdit ? <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label onClick={this.updateShiftType.bind(this, SHIFT_CODE, index)} className={timesheet.shiftType === SHIFT_CODE ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                Chọn mã ca làm việc
                </label>
              <label onClick={this.updateShiftType.bind(this, SHIFT_UPDATE, index)} className={timesheet.shiftType === SHIFT_UPDATE ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                Nhập giờ thay đổi phân ca
                </label>
            </div> : null}

            {timesheet.isEdit && timesheet.shiftType === SHIFT_CODE ? <ShiftTable shifts={this.state.shifts} timesheet={{ index: index, shiftId: timesheet.shiftId }} updateShift={this.updateShift.bind(this)} /> : null}
            {timesheet.isEdit && timesheet.shiftType === SHIFT_UPDATE
              ? <ShiftForm updateTime={this.updateTime.bind(this)} timesheet={{ index: index, startTime: timesheet.startTime, endTime: timesheet.endTime, startBreakTime: timesheet.startBreakTime, endBreakTime: timesheet.endBreakTime }} />
              : null}

            {timesheet.isEdit ? <div>
              <p>Lý do đăng ký thay đổi phân ca</p>
              <textarea placeholder="Nhập lý do" value={timesheet.note} onChange={this.updateNote.bind(this, index)} className="form-control mt-3" name="note" rows="4" />
            </div> : null}
          </div>
        })}
        {/* <div className="block-status">
          <span className={`status ${Constants.mappingStatus[this.props.businessTrip.status].className}`}>{Constants.mappingStatus[this.props.businessTrip.status].label}</span>
        </div> */}
        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} />

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
      </div >
    )
  }
}
export default SubstitutionComponent