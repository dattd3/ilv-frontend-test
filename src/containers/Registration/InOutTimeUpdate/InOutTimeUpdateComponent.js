import React from 'react'
import axios from 'axios'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import { withTranslation } from "react-i18next";
registerLocale("vi", vi)

const CLOSING_SALARY_DATE_PRE_MONTH = 26

class InOutTimeUpdateComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: moment(this.getClosingSalaryDatePreMonth(), "DD/MM/YYYY").toDate(),
      endDate: new Date(),
      timesheets: [],
      approver: null,
      appraiser:null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      isShowStatusModal: false,
      titleModal: "",
      messageModal: "",
      disabledSubmitButton: false
    }
  }

  componentDidMount() {
    if (this.props.inOutTimeUpdate) {
      this.setState({
        isEdited: true,
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
    this.state.timesheets[index][name] = moment(startTime).isValid() && moment(startTime).format('HHmmss')
    this.setState({
      timesheets: [...this.state.timesheets]
    }, () => { this.verifyInput() })

  }

  setEndTime(index, name, endTime) {
    this.state.timesheets[index][name] = moment(endTime).isValid() && moment(endTime).format('HHmmss')
    this.setState({
      timesheets: [...this.state.timesheets]
    }, () => { this.verifyInput() })

  }

  updateFiles(files) {
    this.setState({ files: files }, () => { this.verifyInput() })
  }

  updateApprover(approver, isApprover) {
    this.setState({ approver: approver })
    const errors = { ...this.state.errors }
    if (!isApprover) {
      errors.approver = 'Người phê duyệt không có thẩm quyền!'
    } else {
      errors.approver = null
    }
    this.setState({ errors: errors })
  }

  updateAppraiser(appraiser, isAppraiser) {
    this.setState({ appraiser: appraiser })
    const errors = { ...this.state.errors }
    if (!isAppraiser) {
        errors.appraiser = this.props.t("InvalidAppraiser")
    } else {
        errors.appraiser = null
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
    }, () => { this.verifyInput() })
  }

  handleSelectChange(index, name, value) {
    this.state.timesheets[index][name] = value
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  verifyInput() {  
    const { t } = this.props
    let errors = {}
    this.state.timesheets.forEach((timesheet, index) => {
      if (timesheet.isEdited) {
        if (this.isNullCustomize(timesheet.start_time1_fact_update) && this.isNullCustomize(timesheet.end_time1_fact_update)) {
          errors['start_time1_fact_update' + index] = this.props.t("Required")
          errors['end_time1_fact_update' + index] = this.props.t("Required")
        } else {
          errors['start_time1_fact_update' + index] = null;
          errors['end_time1_fact_update' + index] = null
        }
        // Optional
        if (!this.isNullCustomize(timesheet.start_time2_fact_update) || !this.isNullCustomize(timesheet.end_time2_fact_update)) {
          errors['start_time2_fact_update' + index] = this.isNullCustomize(timesheet.start_time2_fact_update) ? this.props.t("Required") : null
          errors['end_time2_fact_update' + index] = this.isNullCustomize(timesheet.end_time2_fact_update) ? this.props.t("Required") : null
        } else {
          errors['start_time2_fact_update' + index] = null
          errors['end_time2_fact_update' + index] = null
        }
        errors['note' + index] = (_.isNull(timesheet.note) || !timesheet.note) ? this.props.t("Required") : null
      }
    })

    if (_.isNull(this.state.approver)) {
      errors['approver'] = this.props.t("Required")
    }
    errors['files'] = ((_.isNull(this.state.files) || this.state.files.length === 0) && !['V070', 'V077', 'V073'].includes(localStorage.getItem("companyCode"))) ? t("AttachmentRequired") : null
    this.setState({ errors: errors })
    return errors
  }

  setDisabledSubmitButton(status) {
    this.setState({ disabledSubmitButton: status })
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
  }

  submit() {
    this.setDisabledSubmitButton(true)
    const { t } = this.props
    const errors = this.verifyInput()
    const hasErrors = !Object.values(errors).every(item => item === null)
    if (hasErrors) {
      this.setDisabledSubmitButton(false)
      return
    }
    
    const timesheets = [...this.state.timesheets].filter(item => item.isEdited)
    const approver = { ...this.state.approver }
    const appraiser = this.state.appraiser ? this.state.appraiser  : null
    
    delete approver.avatar
    // delete appraiser.avatar

    const data = {
      timesheets: timesheets,
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

    const user = {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
    }

    timesheets.map( item => {
        Object.assign(item,
          {
            hours: item.hours ? parseFloat(item.hours) : null,
            date: moment(item.date, "DD-MM-YYYY").format('YYYYMMDD').toString()
          });
    })
    
    const comments = timesheets
      .filter(item => (item.note))
      .map(item => item.note).join(" - ")

    let bodyFormData = new FormData();
    bodyFormData.append('Name', t("ModifyInOut"))
    bodyFormData.append('RequestTypeId', '5')
    bodyFormData.append('Comment', comments)
    bodyFormData.append('requestInfo', JSON.stringify(timesheets))
    // bodyFormData.append('UpdateField', {})
    bodyFormData.append("divisionId", !this.isNullCustomize(localStorage.getItem('divisionId')) ? localStorage.getItem('divisionId') : "")
    bodyFormData.append("division", !this.isNullCustomize(localStorage.getItem('division')) ? localStorage.getItem('division') : "")
    bodyFormData.append("regionId", !this.isNullCustomize(localStorage.getItem('regionId')) ? localStorage.getItem('regionId') : "")
    bodyFormData.append("region", !this.isNullCustomize(localStorage.getItem('region')) ? localStorage.getItem('region') : "")
    bodyFormData.append("unitId", !this.isNullCustomize(localStorage.getItem('unitId')) ? localStorage.getItem('unitId') : "")
    bodyFormData.append("unit", !this.isNullCustomize(localStorage.getItem('unit')) ? localStorage.getItem('unit') : "")
    bodyFormData.append("partId", !this.isNullCustomize(localStorage.getItem('partId')) ? localStorage.getItem('partId') : "")
    bodyFormData.append("part", !this.isNullCustomize(localStorage.getItem('part')) ? localStorage.getItem('part') : "")
    // bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
    bodyFormData.append('appraiser', JSON.stringify(appraiser))
    bodyFormData.append('approver', JSON.stringify(approver))
    bodyFormData.append('user', JSON.stringify(user))
    // bodyFormData.append('UserProfileInfoToSap', {})
    // bodyFormData.append('UserManagerId', approver ? approver.userAccount : "")
    bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
    this.state.files.forEach(file => {
      bodyFormData.append('Files', file)
    })

    axios({
      method: 'POST',
      url: this.state.isEdited && this.state.id ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.state.id}/update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
    })
      .then(response => {
        if (response && response.data && response.data.result) {
          this.showStatusModal(this.props.t("Successful"), this.props.t("RequestSent"), true)
          this.setDisabledSubmitButton(false)
        }
      })
      .catch(response => {
        this.showStatusModal(this.props.t("Notification"), this.props.t("Error"), false)
        this.setDisabledSubmitButton(false)
      })
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
  }

  errorWithoutItem(name) {
    return this.state.errors[name] ? <div className="text-danger">{this.state.errors[name]}</div> : null
  }

  updateEditMode(index) {
    this.state.timesheets[index].isEdited = !this.state.timesheets[index].isEdited
    this.setState({
      timesheets: [...this.state.timesheets]
    })
  }

  search() {
    const start = moment(this.state.startDate).format('YYYYMMDD').toString()
    const end = moment(this.state.endDate).format('YYYYMMDD').toString()
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        // 'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        // 'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      },
      params: {
        from_date: start,
        to_date: end
      }
    }
    // {
    //   perno: localStorage.getItem('employeeNo'),
    //   from_date: start,
    //   to_date: end
    // },
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timeoverview`, config)
      .then(res => {
        if (res && res.data && res.data.data) {

          let dataSort = res.data.data.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)

          const timesheets = dataSort.map(ts => {
            return Object.assign({
              isEdited: false,
              note: null,
              error: {},
              start_time1_fact_update: null,
              start_time2_fact_update: null,
              end_time1_fact_update: null,
              end_time2_fact_update: null
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
    this.setState({ isUpdateFiles: status })
  }

  getClosingSalaryDatePreMonth = () => {
    const now = moment()
    let preMonth = now.month()
    const currentYear = preMonth === 0 ? now.year() - 1 : now.year()
    preMonth = preMonth === 0 ? 12 : preMonth
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

  getDayName = (date) => {
    var days = [this.props.t("Sun"), this.props.t("Mon"), this.props.t("Tue"), this.props.t("Wed"), this.props.t("Thu"), this.props.t("Fri"), this.props.t("Sat")];
    var dayStr = moment(date, "DD-MM-YYYY").format("MM/DD/YYYY").toString()
    var d = new Date(dayStr);
    var dayName = days[d.getDay()];
    return dayName
  }

  render() {
    const { t } = this.props;
    const lang = localStorage.getItem("locale")
    return (
      <div className="in-out-time-update">
        <ResultModal show={this.state.isShowStatusModal} title={this.state.titleModal} message={this.state.messageModal} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="row">
            <div className="col-4">
              <p className="title">{t('From')}</p>
              <div className="content input-container">
                <label>
                  <DatePicker
                    name="startDate"
                    selectsStart
                    autoComplete="off"
                    selected={this.state.startDate}
                    maxDate={this.state.endDate}
                    onChange={this.setStartDate.bind(this)}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale="vi"
                    shouldCloseOnSelect={true}
                    className="form-control input" />
                  <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                </label>
              </div>
              {this.error('startDate')}
            </div>

            <div className="col-4">
              <p className="title">{t('To')}</p>
              <div className="content input-container">
                <label>
                  <DatePicker
                    name="endDate"
                    selectsEnd
                    autoComplete="off"
                    selected={this.state.endDate}
                    minDate={this.state.startDate}
                    maxDate={new Date()}
                    onChange={this.setEndDate.bind(this)}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
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
                <button type="button" className="btn btn-warning w-100" onClick={this.search.bind(this)}>{t('Search')}</button>
              </div>
            </div>
          </div>
        </div>
        {this.state.timesheets.map((timesheet, index) => {
          return <div className="box shadow pt-1 pb-1" key={index}>
            <div className="row">
              <div className="col-4 pl-0 pr-0"><p><i className="fa fa-clock-o"></i> <b>{this.getDayName(timesheet.date)} {lang === "vi-VN" ? t("Day") : null} {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-6">
                {!timesheet.isEdited ? <p>{t("StartTime")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b> | {t("EndTime")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b></p> : null}
                {!timesheet.isEdited && (!this.isNullCustomize(timesheet.start_time2_fact) || !this.isNullCustomize(timesheet.end_time2_fact)) ?
                  <p>{t("StartTime")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b> | {t("EndTime")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b></p>
                  : null}
                {!timesheet.isEdited && (!this.isNullCustomize(timesheet.start_time3_fact) || !this.isNullCustomize(timesheet.end_time3_fact)) ?
                  <p>{t("StartTime")} 3 (OT): <b>{this.printTimeFormat(timesheet.start_time3_fact)}</b> | {t("EndTime")} 3 (OT): <b>{this.printTimeFormat(timesheet.end_time3_fact)}</b></p>
                  : null}

              </div>
              <div className="col-2 pr-0 pl-0">
                {!timesheet.isEdited
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> {t("Modify")}</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-times-circle"></i> {t("Cancel")}</p>}
              </div>
            </div>
            {timesheet.isEdited ? <div className="row block-time-item-edit">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t('ActualTime')}</p>
                  <div className="row">
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("StartTime")} 1:</div>
                        <div className="col-6"><b>{this.printTimeFormat(timesheet.start_time1_fact)}</b></div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("EndTime")} 1:</div>
                        <div className="col-6"><b>{this.printTimeFormat(timesheet.end_time1_fact)}</b></div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("StartTime")} 2:</div>
                        <div className="col-6"><b>{this.printTimeFormat(timesheet.start_time2_fact)}</b></div>
                      </div>

                    </div>
                    <div className="col-lg-12 col-xl-6 ">
                      <div className="row">
                        <div className="col-6">{t("EndTime")} 2:</div>
                        <div className="col-6"> <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b></div>
                      </div>
                    </div>
                  </div>
                  <>
                    <hr />
                    <p className="text-center">{t("PlannedShift")}</p>
                    <div className="row">
                      <div className="col-lg-12 col-xl-6">
                        <div className="row">
                          <div className="col-6">{t("StartTime")} 1:</div>
                          <div className="col-6"> <b>{this.printTimeFormat(timesheet.from_time1)}</b></div>
                        </div>

                      </div>
                      <div className="col-lg-12 col-xl-6">
                        <div className="row">
                          <div className="col-6">{t("EndTime")} 1:</div>
                          <div className="col-6"> <b>{this.printTimeFormat(timesheet.to_time1)}</b></div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-xl-6">
                        <div className="row">
                          <div className="col-6">{t("StartTime")} 2:</div>
                          <div className="col-6"> <b>{this.printTimeFormat(timesheet.from_time2)}</b></div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6">
                        <div className="row">
                          <div className="col-6">{t("EndTime")} 2:</div>
                          <div className="col-6"> <b>{this.printTimeFormat(timesheet.to_time2)}</b></div>
                        </div>
                      </div>
                    </div>
                  </>
                </div>

              </div>

              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t('InOutChangeRequest')}</p>
                  <div className="row">
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("StartTime")} 1:</div>
                        <div className="col-6">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.start_time1_fact_update) ? moment(timesheet.start_time1_fact_update, 'HH:mm:ss').toDate() : null}
                                onChange={this.setStartTime.bind(this, index, 'start_time1_fact_update')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className="form-control input" />
                            </label>
                          </div>
                          {this.error(index, 'start_time1_fact_update')}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("EndTime")} 1:</div>
                        <div className="col-6">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.end_time1_fact_update) ? moment(timesheet.end_time1_fact_update, 'HH:mm:ss').toDate() : null}
                                onChange={this.setEndTime.bind(this, index, 'end_time1_fact_update')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className="form-control input" />
                            </label>
                          </div>
                          {this.error(index, 'end_time1_fact_update')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("StartTime")} 2:</div>
                        <div className="col-6">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.start_time2_fact_update) ? moment(timesheet.start_time2_fact_update, 'HH:mm:ss').toDate() : null}
                                onChange={this.setStartTime.bind(this, index, 'start_time2_fact_update')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className="form-control input" />
                            </label>
                          </div>
                          {this.error(index, 'start_time2_fact_update')}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-12 col-xl-6">
                      <div className="row">
                        <div className="col-6">{t("EndTime")} 2:</div>
                        <div className="col-6">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={!this.isNullCustomize(timesheet.end_time2_fact_update) ? moment(timesheet.end_time2_fact_update, 'HH:mm:ss').toDate() : null}
                                onChange={this.setEndTime.bind(this, index, 'end_time2_fact_update')}
                                autoComplete="off"
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className="form-control input" />
                            </label>
                          </div>
                          {this.error(index, 'end_time2_fact_update')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null}

            {timesheet.isEdited ? <div className="row block-note-item-edit">
              <div className="col-12 pb-2">
                <p className="title">{t('ReasonModifyInOut')}</p>
                <div>
                  <textarea className="form-control" value={timesheet.note || ""} name="note" placeholder={t('EnterReason')} rows="3" onChange={this.handleInputChange.bind(this, index)}></textarea>
                </div>
                {this.error(index, 'note')}
              </div>
            </div> : null}
          </div>
        })}

        {this.state.timesheets.filter(t => t.isEdited).length > 0 ? 
        <>
          <AssesserComponent isEdit={t.isEdited} errors={this.state.errors} approver={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.approver : null} appraiser={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.appraiser : null} updateAppraiser={this.updateAppraiser.bind(this)} />
          <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.approver : null} /> 
        </>
          : null}

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
          (this.state.timesheets.filter(t => t.isEdited).length > 0 && !["V070", "V077", "V073"].includes(localStorage.getItem("companyCode"))) ?
            <div className="p-3 mb-2 bg-warning text-dark">{t('EvidenceRequired')}</div>
            : null
        }
        {this.errorWithoutItem("files")}

        {this.state.timesheets.filter(t => t.isEdited).length > 0 ? <ButtonComponent files={this.state.files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={this.state.disabledSubmitButton} /> : null}
      </div>
    )
  }
}

export default withTranslation()(InOutTimeUpdateComponent)
