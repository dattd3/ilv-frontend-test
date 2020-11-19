import React from 'react'
import axios from 'axios'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import Constants from '../../../commons/Constants'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

const CLOSING_SALARY_DATE_PRE_MONTH = 25

class InOutTimeUpdateComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: moment(this.getClosingSalaryDatePreMonth(), "DD/MM/YYYY").toDate(),
      endDate: new Date(),
      timesheets: [],
      approver: null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      isShowStatusModal: false,
      titleModal: "",
      messageModal: ""
    }
  }

  componentDidMount() {
    if (this.props.inOutTimeUpdate) {
      this.setState({
        isEdit: true,
        id: this.props.inOutTimeUpdate.id,
        startDate: moment(this.props.inOutTimeUpdate.userProfileInfo.startDate).toDate(),
        endDate: moment(this.props.inOutTimeUpdate.userProfileInfo.startDate).toDate(),
        timesheets: this.props.inOutTimeUpdate.userProfileInfo.timesheets,
        note: this.props.inOutTimeUpdate.comment,
        approver: this.props.inOutTimeUpdate.userProfileInfo.approver
      })
    }
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
    this.state.timesheets[index][name] = moment(startTime).isValid() && moment(startTime).format('HH:mm:ss')
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  setEndTime(index, name, endTime) {
    this.state.timesheets[index][name] = moment(endTime).isValid() && moment(endTime).format('HH:mm:ss')
    this.setState({
      timesheets: [...this.state.timesheets]
    })
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
    let errors = {...this.state.errors}
    this.state.timesheets.filter(t => t.isEdit == true).forEach((timesheet, index) => {
      errors['startTime1Fact' + index] = (timesheet.start_time1_plan && _.isNull(timesheet.startTime1Fact)) ? '(Bắt buộc)' : null
      errors['endTime1Fact' + index] = (timesheet.end_time1_plan && _.isNull(timesheet.endTime1Fact)) ? '(Bắt buộc)' : null
      errors['startTime2Fact' + index] = (timesheet.start_time2_plan && _.isNull(timesheet.startTime2Fact)) ? '(Bắt buộc)' : null
      errors['endTime2Fact' + index] = (timesheet.end_time2_plan && _.isNull(timesheet.endTime2Fact)) ? '(Bắt buộc)' : null
      errors['startTime3Fact' + index] = (timesheet.start_time3_plan && _.isNull(timesheet.startTime3Fact)) ? '(Bắt buộc)' : null
      errors['endTime3Fact' + index] = (timesheet.end_time3_plan && _.isNull(timesheet.endTime3Fact)) ? '(Bắt buộc)' : null
      errors['note' + index] = (_.isNull(timesheet.note) || !timesheet.note) ? '(Bắt buộc)' : null
    })
    if (_.isNull(this.state.approver)) {
      errors['approver'] = '(Bắt buộc)'
    }
    errors['files'] = (_.isNull(this.state.files) || this.state.files.length === 0) ? '(*) File đính kèm là bắt buộc' : null
    this.setState({ errors: errors })
    return errors
  }

  submit() {
    const errors = this.verifyInput()
    const hasErrors = !Object.values(errors).every(item => item === null)
    if (hasErrors) {
      return
    }
    const approver = {...this.state.approver}
    delete approver.avatar
    const data = {
      timesheets: this.state.timesheets,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      user: {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
      },
      approver: approver,
    }
    const comments = this.state.timesheets
    .filter(item => (item.note && item.note))
    .map(item => item.note).join(" - ")

    let bodyFormData = new FormData();
    bodyFormData.append('Name', 'Sửa giờ vào-ra')
    bodyFormData.append('RequestTypeId', '5')
    bodyFormData.append('Comment', comments)
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', {})
    bodyFormData.append('Region', localStorage.getItem('region'))
    bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
    bodyFormData.append('UserProfileInfoToSap', {})
    bodyFormData.append('UserManagerId', approver ? approver.userAccount : "")
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
        this.showStatusModal("Thành công", "Yêu cầu của bạn đã được gửi đi!", true)
      }
    })
    .catch(response => {
      this.showStatusModal("Lỗi", "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
    })
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
  }

  errorWithoutItem(name) {
    return this.state.errors[name] ? <div className="text-danger">{this.state.errors[name]}</div> : null
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

    axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/timeoverview`, {
      perno: localStorage.getItem('employeeNo'),
      from_date: start,
      to_date: end
    }, config)
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
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      })
  }

  showStatusModal = (title, message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({isUpdateFiles : status})
  }

  getClosingSalaryDatePreMonth = () => {
    const now = moment()
    const preMonth = now.month()
    const currentYear = preMonth == 0 ? now.year() - 1 : now.year()
    return `${CLOSING_SALARY_DATE_PRE_MONTH}/${preMonth}/${currentYear}`
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
  }

  formatData = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? "" : value
  }

  printTimeFormat = value => {
    return !this.isNullCustomize(value) && moment(this.formatData(value), "hhmmss").isValid() ? moment(this.formatData(value), "HHmmss").format("HH:mm:ss") : ""
  }

  render() {
    return (
      <div className="in-out-time-update">
        <ResultModal show={this.state.isShowStatusModal} title={this.state.titleModal} message={this.state.messageModal} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="row">
            <div className="col-4">
              <p className="title">Từ ngày</p>
              <div className="content input-container">
                <label>
                  <DatePicker
                    name="startDate"
                    selectsStart
                    autoComplete="off"
                    selected={this.state.startDate}
                    minDate={this.state.startDate}
                    maxDate={this.state.endDate}
                    onChange={this.setStartDate.bind(this)}
                    showDisabledMonthNavigation
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
                    autoComplete="off"
                    selected={this.state.endDate}
                    minDate={this.state.startDate}
                    maxDate={this.state.endDate}
                    onChange={this.setEndDate.bind(this)}
                    showDisabledMonthNavigation
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
                <button type="button" className="btn btn-warning w-100" onClick={this.search.bind(this)}>Tìm kiếm</button>
              </div>
            </div>
          </div>
        </div>
        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="row">
              <div className="col-2"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-4">
                {!timesheet.isEdit ? <p>Bắt đầu 1: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b> | Kết thúc 1: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b></p> : null}
                {!timesheet.isEdit ? <p>Bắt đầu 3: <b>{this.printTimeFormat(timesheet.start_time3_fact)}</b> | Kết thúc 3: <b>{this.printTimeFormat(timesheet.end_time3_fact)}</b></p> : null}
              </div>
              <div className="col-4">
                {!timesheet.isEdit ? <p>Bắt đầu 2: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b> | Kết thúc 2: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b></p> : null}
              </div>
              <div className="col-2 ">
                {!timesheet.isEdit
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> Sửa</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-times-circle"></i> Hủy</p>}
              </div>
            </div>
            {timesheet.isEdit ? <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thực tế</p>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{this.printTimeFormat(timesheet.start_time3_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{this.printTimeFormat(timesheet.end_time3_fact)}</b>
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
                                selected={!this.isNullCustomize(timesheet.startTime1Fact) ? moment(timesheet.startTime1Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setStartTime.bind(this, index, 'startTime1Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock text-warning"><i className="fa fa-clock-o"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'startTime1Fact')}
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
                                selected={!this.isNullCustomize(timesheet.endTime1Fact) ? moment(timesheet.endTime1Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setEndTime.bind(this, index, 'endTime1Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock"><i className="fa fa-clock-o text-warning"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'endTime1Fact')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Bắt đầu:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.startTime2Fact) ? moment(timesheet.startTime2Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setStartTime.bind(this, index, 'startTime2Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock text-warning"><i className="fa fa-clock-o"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'startTime2Fact')}
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
                                selected={!this.isNullCustomize(timesheet.endTime2Fact) ? moment(timesheet.endTime2Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setEndTime.bind(this, index, 'endTime2Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock"><i className="fa fa-clock-o text-warning"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'endTime2Fact')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Bắt đầu:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.startTime3Fact) ? moment(timesheet.startTime3Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setStartTime.bind(this, index, 'startTime3Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock text-warning"><i className="fa fa-clock-o"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'startTime3Fact')}
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
                                selected={!this.isNullCustomize(timesheet.endTime3Fact) ? moment(timesheet.endTime3Fact, 'HH:mm:ss').toDate() : null}
                                onChange={this.setEndTime.bind(this, index, 'endTime3Fact')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input" />
                              <span className="input-group-addon input-clock"><i className="fa fa-clock-o text-warning"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'endTime3Fact')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null}

            {timesheet.isEdit ? <div className="row">
              <div className="col-12">
                <p className="title">Lý do sửa giờ vào - ra</p>
                <div>
                  <textarea className="form-control" value={timesheet.note || ""} name="note" placeholder="Nhập lý do" rows="3" onChange={this.handleInputChange.bind(this, index)}></textarea>
                </div>
                {this.error(index, 'note')}
              </div>
            </div> : null}
          </div>
        })}
        
        {this.state.timesheets.filter(t => t.isEdit).length > 0 ? <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.approver : null} /> : null}
        
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

        {
          this.state.timesheets.filter(t => t.isEdit).length > 0 ? 
          <div className="p-3 mb-2 bg-warning text-dark">Yêu cầu bắt buộc có tài liệu chứng minh (Biên bản vi phạm từ màn hình in-out từ máy chấm công, biên bản ghi nhận của Bảo vệ ...)</div>
          : null
        }
        {this.errorWithoutItem("files")}
        
        {this.state.timesheets.filter(t => t.isEdit).length > 0 ? <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} /> : null}
      </div>
    )
  }
}

export default InOutTimeUpdateComponent
