import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import moment from 'moment'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
class SubstitutionComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      substitutions: [
        {
          startDate: moment().startOf('month').toDate(),
          endDate: new Date(),
          startTime: null,
          endTime: null,
          substitutionType: null,

          note: null,
          errors: {}
        }
      ],
      startDate: moment().startOf('month').toDate(),
      endDate: new Date(),
      timesheets: [],
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

    axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/timeoverview`, {
      perno: localStorage.getItem('employeeNo'),
      from_date: '',
      to_date: ''
    }, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          console.log(res.data.data)
          // this.setState({ timesheets: timesheets })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      })
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

  setDate(index, startDate) {
    this.state.substitutions[index].startDate = startDate
    this.setState({
      substitutions: [...this.state.substitutions]
    })
  }

  setStartTime(index, startTime) {
    this.state.substitutions[index].startTime = startTime
    this.setState({
      substitutions: [...this.state.substitutions]
    })
  }

  setEndTime(index, endTime) {
    this.state.substitutions[index].endTime = endTime
    this.setState({
      substitutions: [...this.state.substitutions]
    })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver) {
    this.setState({ approver: approver })
  }

  handleInputChange(index, event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.state.substitutions[index][name] = value
    this.setState({
      substitutions: [...this.state.substitutions]
    })
  }

  handleSelectChange(index, name, value) {
    this.state.substitutions[index][name] = value
    this.setState({
      substitutions: [...this.state.substitutions]
    })
  }

  addSubstitution() {
    this.setState({
      substitutions: [...this.state.substitutions, {
        startDate: null,
        startTime: null,
        endTime: null,
        endDate: null,
        substitutionType: null,
        note: null,
        errors: {}
      }]
    })
  }

  removeSubstitution(index) {
    this.setState({ substitutions: [...this.state.substitutions.slice(0, index), ...this.state.substitutions.slice(index + 1)] })
  }

  verifyInput() {
    let errors = {}
    const RequiredFields = ['note', 'startDate', 'startTime', 'endTime', 'substitutionType']
    this.state.substitutions.forEach((substitution, index) => {
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
    if (errors) {
      return
    }
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
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
      this.setState({
        timesheets: [...this.state.timesheets]
      })
    }
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
                  shiftType: 1,
                  shiftIndex: shiftIndex
                } :  undefined
            })
          }).filter(t => t!== undefined)
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      })
  }

  render() {
    const substitutionTypes = [
      { value: '01', label: 'Phân ca làm việc' },
      { value: '02', label: 'Phân ca gãy' },
      { value: '03', label: 'Phân ca bờ đảo full ngày' }
    ]

    return (
      <div className="shift-work">
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
                <Select name="substitutionType" value={this.state.substitutionType} onChange={substitutionType => this.handleSelectChange('substitutionType', substitutionType)} placeholder="Lựa chọn" key="timeTotal" options={substitutionTypes} />
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

              {timesheet.isEdit ? <div className="btn-group btn-group-toggle" data-toggle="buttons">
                <label onClick={this.updateShiftType.bind(this, 1, index)} className={timesheet.shiftType === 1 ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                  Chọn mã ca làm việc
                </label>
                <label onClick={this.updateShiftType.bind(this, 2, index)} className={timesheet.shiftType === 2 ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                  Nhập giờ thay đổi phân ca
                </label>
              </div> : null}
            </div>
        })}

        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} />
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
      </div >
    )
  }
}
export default SubstitutionComponent