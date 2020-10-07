import React from 'react'
// import axios from 'axios'
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
      startDate: null,
      endDate: null,
      timesheets: [
        {
          date: null,
          startTime: null,
          endTime: null,
          endDate: null,
          substitutionType: null,
          note: null,
          errors: {}
        }
      ],
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

  setStartTime(index, startTime) {
    this.state.timesheets[index].startTime = startTime
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  setEndTime(index, endTime) {
    this.state.timesheets[index].endTime = endTime
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
    const errors = this.verifyInput()
    if (errors) {
      return
    }
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
  }

  render() {
    const options = [
      { value: '1', label: '01 ngày' },
      { value: '2', label: '02 ngày' },
      { value: '3', label: '03 ngày' }
    ]
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
              <p className="title">Tìm kiếm ngày</p>
              <div>
                <button type="button" class="btn btn-warning w-100">Tìm kiếm</button>
              </div>
            </div>
          </div>
        </div>
        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow">
            <p><i className="fa fa-clock-o"></i> <b>Ngày 25/09/2020</b></p>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thực tế</p>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>09:00:00</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>09:00:00</b>
                    </div>
                  </div>
                </div>

              </div>

              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Sửa giờ vào ra</p>
                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Bắt đầu:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={timesheet.startTime}
                                onChange={this.setStartTime.bind(this, index)}
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
                                selected={timesheet.endTime}
                                onChange={this.setEndTime.bind(this, index)}
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
                  </div>
                </div>
              </div>

            </div>

            <div className="row">
              <div className="col-12">
                <p className="title">Lý do sửa giờ vào - ra</p>
                <div>
                  <textarea class="form-control" value={timesheet.note} name="note" placeholder="Nhập lý do" rows="3" onChange={this.handleInputChange.bind(this, index)}></textarea>
                </div>
                {this.error(index, 'note')}
              </div>
            </div>

          </div>
        })}

        {this.state.timesheets.length > 0 ? <ApproverComponent errors={this.state.errors}  updateApprover={this.updateApprover.bind(this)} /> : null }
        {this.state.timesheets.length > 0 ? <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} /> : null }
      </div>
    )
  }
}
export default InOutTimeUpdateComponent