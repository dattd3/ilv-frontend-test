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

const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const SHIFT_CODE = 1
const SHIFT_UPDATE = 2

class SubstitutionComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      timesheets: [],
      shifts: [],
      substitutionType: null,
      approver: null,
      files: [],
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
      }).catch(error => { })

    if (this.props.substitution) {
      this.setState({
        isEdit: true,
        id: this.props.substitution.id,
        startDate: this.props.substitution.userProfileInfo.startDate,
        endDate: this.props.substitution.userProfileInfo.endDate,
        substitutionType: this.props.substitution.userProfileInfo.substitutionType,
        timesheets: this.props.substitution.userProfileInfo.timesheets,
        note: this.props.substitution.comment,
        approver: this.props.substitution.userProfileInfo.approver,
        files: this.props.substitution.userProfileInfoDocuments.map(file => {
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

  verifyInput() {
    let errors = {}
    const shiftRequiredFields = ['startTime', 'endTime']
    this.state.timesheets.filter(t => t.isEdit).forEach((timesheet, index) => {
      if (timesheet.shiftType === SHIFT_CODE) {
        if (_.isNull(timesheet['shiftId'])) {
          errors['shiftId' + index] = '(Bắt buộc)'
        }
      }

      if (timesheet.shiftType === SHIFT_UPDATE) {
        shiftRequiredFields.forEach(name => {
          if (_.isNull(timesheet[name])) {
            errors[name + index] = '(Bắt buộc)'
          }
        })
      }

      if (_.isNull(timesheet['note'])) {
        errors['note' + index] = '(Bắt buộc)'
      }
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
      endDate: this.state.endDate,
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
    bodyFormData.append('Name', 'Đăng ký nghỉ phép')
    bodyFormData.append('RequestTypeId', '4')
    bodyFormData.append('Comment', '')
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', {})
    bodyFormData.append('Region', localStorage.getItem('region'))
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
      startDate: moment(startDate).format(DATE_FORMAT),
      endDate: this.state.endDate === undefined || startDate > this.state.endDate ? moment(startDate).format(DATE_FORMAT) : this.state.endDate
    })
  }

  setEndDate(endDate) {
    this.setState({
      endDate: moment(endDate).format(DATE_FORMAT)
    })
  }

  updateTime(index, name, value) {
    let timesheets = this.state.timesheets
    timesheets[index][name] = value
    this.setState({
      timesheets: [...timesheets]
    })
  }

  updateNote(index, e) {
    let timesheets = this.state.timesheets
    timesheets[index].note = e.currentTarget.value
    this.setState({
      timesheets: [...timesheets]
    })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver) {
    this.setState({ approver: approver })
  }

  updateEditMode(index) {
    let timesheets = this.state.timesheets
    timesheets[index].isEdit = !this.state.timesheets[index].isEdit
    this.setState({
      timesheets: [...timesheets]
    })
  }

  updateShiftType(shiftType, index) {
    if (shiftType !== this.state.timesheets[index].shiftType) {
      let timesheets = this.state.timesheets
      timesheets[index].shiftType = shiftType
      timesheets[index].startTime = null
      timesheets[index].endTime = null
      timesheets[index].startBreakTime = null
      timesheets[index].endBreakTime = null
      timesheets[index].shiftId = null
      timesheets[index].shiftHours = null
      this.setState({
        timesheets: [...timesheets],
        errors: {}
      })
    }
  }

  updateShift(index, shift) {
    let timesheets = this.state.timesheets
    timesheets[index].shiftId = shift.shift_id
    timesheets[index].shiftHours = shift.hours
    timesheets[index].startTime = moment(shift.from_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)
    timesheets[index].endTime = moment(shift.to_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)
    this.setState({
      timesheets: [...timesheets]
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

  search() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    const start = moment(this.state.startDate, DATE_FORMAT).format('YYYYMMDD').toString()
    const end = moment(this.state.endDate, DATE_FORMAT).format('YYYYMMDD').toString()

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
                shiftHours: null,
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
        <div className="row">
          <div className="col">
            <div className="text-danger"><i className="fa fa-info-circle"></i> Không áp dụng đối với CBNV thuộc HO và CBNV Vận hành làm ca Hành chính</div>
          </div>
        </div>
        <div className="box shadow">
          <div className="row">
            <div className="col-4">
              <p className="title">Từ ngày</p>
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

            <div className="col-4">
              <p className="title">Đến ngày</p>
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
              <button type="button" class="btn btn-warning w-100" onClick={this.search.bind(this)}>Tìm kiếm</button>
            </div>
          </div>
        </div>

        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow">
            <div className="row">
              <div className="col-2"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-8">
                <p className="text-uppercase"><b>Giờ kế hoạch</b></p>

                <p>Bắt đầu {timesheet.shiftIndex}: <b>{moment(timesheet.fromTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)}</b> | Kết thúc {timesheet.shiftIndex}: <b>{moment(timesheet.toTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)}</b></p>
              </div>
              <div className="col-2 ">
                {!timesheet.isEdit
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> Sửa</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i class="fas fa-times-circle"></i> Hủy</p>}
              </div>
            </div>

            {timesheet.isEdit ? <hr /> : null}

            {timesheet.isEdit ? <div>
              <p className="text-uppercase"><b>Lựa chọn hình thức thay đổi phân ca</b></p>
              <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label onClick={this.updateShiftType.bind(this, SHIFT_CODE, index)} className={timesheet.shiftType === SHIFT_CODE ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                Chọn mã ca làm việc
                </label>
              <label onClick={this.updateShiftType.bind(this, SHIFT_UPDATE, index)} className={timesheet.shiftType === SHIFT_UPDATE ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                Nhập giờ thay đổi phân ca
                </label>
            </div></div> : null}

            {timesheet.isEdit && timesheet.shiftType === SHIFT_CODE ?
              <>
                <ShiftTable shifts={this.state.shifts} timesheet={{ index: index, shiftId: timesheet.shiftId }} updateShift={this.updateShift.bind(this)} />
                {this.error(index, 'shiftId')}
              </>
             : null}
            {timesheet.isEdit && timesheet.shiftType === SHIFT_UPDATE
              ? <ShiftForm updateTime={this.updateTime.bind(this)} errors={this.state.errors} timesheet={{ index: index, startTime: timesheet.startTime, endTime: timesheet.endTime, startBreakTime: timesheet.startBreakTime, endBreakTime: timesheet.endBreakTime }} />
              : null}

            {timesheet.isEdit ? <div>
              <p>Lý do đăng ký thay đổi phân ca</p>
              <textarea placeholder="Nhập lý do" value={timesheet.note} onChange={this.updateNote.bind(this, index)} className="form-control mt-3" name="note" rows="4" />
              {this.error(index, 'note')}
            </div> : null}
          </div>
        })}

        {this.state.timesheets.filter(t => t.isEdit).length > 0 ? <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.substitution ? this.props.substitution.userProfileInfo.approver : null} /> : null}
        <ul className="list-inline">
          {this.state.files.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
            </li>
          })}
        </ul>

        {this.state.timesheets.filter(t => t.isEdit).length > 0 ? <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} /> : null}
      </div >
    )
  }
}
export default SubstitutionComponent