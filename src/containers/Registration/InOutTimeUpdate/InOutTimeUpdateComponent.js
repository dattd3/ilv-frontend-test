import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

class InOutTimeUpdateComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: moment().startOf('month').toDate(),
      endDate: new Date(),
      timesheets: [],
      approver: null,
      files: [],
      errors: {}
    }
  }

  componentDidMount() {

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

  setStartTime(index, name, startTime) {
    this.state.timesheets[index][name] = startTime
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  setEndTime(index, name, endTime) {
    this.state.timesheets[index][name] = endTime
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

  handleInputChange(index, event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.state.timesheets[index][name] = value
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  handleSelectChange(index, name, value) {
    this.state.timesheets[index][name] = value
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  verifyInput() {
    let errors = {}
    const RequiredFields = ['note', 'startDate', 'startTime', 'endTime', 'substitutionType']
    this.state.timesheets.forEach((timesheet, index) => {
      RequiredFields.forEach(name => {
        if (_.isNull(timesheet[name])) {
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
    // const errors = this.verifyInput()
    // if (!_.isEmpty(errors)) {
    //   return
    // }

    const data = {
      timesheets: this.state.timesheets,
      user: {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
      }
    }

    let bodyFormData = new FormData();
    bodyFormData.append('Name', 'Sửa giờ vào-ra')
    bodyFormData.append('RequestTypeId', '5')
    bodyFormData.append('Comment', '')
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', {})
    bodyFormData.append('Region', localStorage.getItem('region'))
    bodyFormData.append('UserProfileInfoToSap', {})
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
          console.log(response.data)
        }
      })
      .catch(response => {
      })
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

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/timekeeping/detail?from_time=${start}&to_time=${end}`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const timesheets = res.data.data.map(ts => {
            return Object.assign({
              isEdit: false,
              note: null,
              error: {},
              startTime1Fact: ts.start_time1_fact ? ts.start_time1_fact : null,
              startTime2Fact: ts.start_time2_fact ? ts.start_time2_fact : null,
              startTime3Fact: ts.start_time3_fact ? ts.start_time3_fact : null,
              endTime1Fact: ts.end_time1_fact ? ts.end_time1_fact : null,
              endTime2Fact: ts.end_time2_fact ? ts.end_time2_fact : null,
              endTime3Fact: ts.end_time3_fact ? ts.end_time3_fact : null
            }, ts)
          })
          console.log(timesheets)
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      })
  }

  render() {
    return (
      <div className="in-out-time-update">
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
              <p className="title">&nbsp;</p>
              <div>
                <button type="button" class="btn btn-warning w-100" onClick={this.search.bind(this)}>Tìm kiếm</button>
              </div>
            </div>
          </div>
        </div>
        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow">
            <div className="row">
              <div className="col-2"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-4">
                {!timesheet.isEdit && timesheet.start_time1_fact ? <p>Bắt đầu 1: <b>{timesheet.start_time1_fact}</b> | Kết thúc 1: <b>{timesheet.end_time1_fact}</b></p> : null}
                {!timesheet.isEdit && timesheet.start_time3_fact ? <p>Bắt đầu 3: <b>{timesheet.start_time3_fact}</b> | Kết thúc 3: <b>{timesheet.end_time3_fact}</b></p> : null}
              </div>
              <div className="col-4">
                {!timesheet.isEdit && timesheet.start_time2_fact ? <p>Bắt đầu 2: <b>{timesheet.start_time2_fact}</b> | Kết thúc 2: <b>{timesheet.end_time2_fact}</b></p> : null}
              </div>
              <div className="col-2 ">
                {!timesheet.isEdit
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> Sửa</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i class="fas fa-times-circle"></i> Hủy</p>}
              </div>
            </div>
            {timesheet.isEdit ? <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thực tế</p>
                  {timesheet.start_time1_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time1_fact ? timesheet.start_time1_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time1_fact ? timesheet.end_time1_fact : null}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time2_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time2_fact ? timesheet.start_time2_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time2_fact ? timesheet.end_time2_fact : null}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time3_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time3_fact ? timesheet.start_time3_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time3_fact ? timesheet.end_time3_fact : null}</b>
                    </div>
                  </div> : null}
                </div>

              </div>

              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Sửa giờ vào ra</p>
                  {timesheet.start_time1_plan ? <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Bắt đầu:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={timesheet.startTime1Fact}
                                onChange={this.setStartTime.bind(this, index, 'startTime1Fact')}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input"
                              />
                              <span className="input-group-addon input-clock text-warning"><i className="fa fa-clock-o"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'startTime')}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Kết thúc:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={timesheet.endTime1Fact}
                                onChange={this.setEndTime.bind(this, index, 'endTime1Fact')}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input"
                              />
                              <span className="input-group-addon input-clock"><i className="fa fa-clock-o text-warning"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'endTime')}
                        </div>
                      </div>
                    </div>
                  </div> : null}
                </div>
              </div>

            </div> : null}

            {timesheet.isEdit ? <div className="row">
              <div className="col-12">
                <p className="title">Lý do sửa giờ vào - ra</p>
                <div>
                  <textarea class="form-control" value={timesheet.note} name="note" placeholder="Nhập lý do" rows="3" onChange={this.handleInputChange.bind(this, index)}></textarea>
                </div>
                {this.error(index, 'note')}
              </div>
            </div> : null}

          </div>
        })}

        {this.state.timesheets.length > 0 ? <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} /> : null}
        {this.state.timesheets.length > 0 ? <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} /> : null}
      </div>
    )
  }
}
export default InOutTimeUpdateComponent