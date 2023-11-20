import React from 'react'
import axios from 'axios'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import map from '../../../../src/containers/map.config'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import { withTranslation } from "react-i18next";
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations, isEnableFunctionByFunctionName, getRegistrationMinDateByConditions, isValidDateRequest, formatStringByMuleValue } from "../../../commons/Utils"
import Constants from '../../../commons/Constants'
import NoteModal from 'components/Common/NoteModal'
import LoadingModal from 'components/Common/LoadingModal'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconClock from 'assets/img/icon/ic_clock.svg'
registerLocale("vi", vi)

const CLOSING_SALARY_DATE_PRE_MONTH = 26
const queryString = window.location.search
const currentUserPnLCode = localStorage.getItem("companyCode")
const listCompanyCodeIgnoreEvidence = [Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinSmart, "V001", Constants.pnlVCode.VinES, "V002"]

class InOutTimeUpdateComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      // startDate: getValueParamByQueryString(queryString, 'date') || moment(this.getClosingSalaryDatePreMonth(), "DD/MM/YYYY").format("DD/MM/YYYY"),
      startDate: getValueParamByQueryString(queryString, 'date') || (getRegistrationMinDateByConditions() ? moment(getRegistrationMinDateByConditions()).format("DD/MM/YYYY") : moment(this.getClosingSalaryDatePreMonth(), "DD/MM/YYYY").format("DD/MM/YYYY")),
      endDate: getValueParamByQueryString(queryString, 'date') || moment().format("DD/MM/YYYY"),
      timesheets: [],
      approver: null,
      appraiser:null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      isShowStatusModal: false,
      titleModal: "",
      messageModal: "",
      disabledSubmitButton: false,
      needReload: true,
      isLoading: false,
      noteModal: {
        isShow: false,
        content: ''
      }
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

  processTimeZero(time) {
    let t = new Date(time);
    if (t.getHours() == 0 && t.getMinutes() == 0 && t.getSeconds() == 0) {
      t.setSeconds(t.getSeconds() + 1);
    }
    return t;
  }
  
  setStartTime(index, name, startTime) {
    // let t = this.processTimeZero(startTime)
    this.state.timesheets[index][name] = moment(startTime).isValid() && moment(startTime)
    this.setState({
      timesheets: [...this.state.timesheets]
    }, () => { this.verifyInput() })

  }

  setEndTime(index, name, endTime) {
    // let t = this.processTimeZero(endTime)
    this.state.timesheets[index][name] = moment(endTime).isValid() && moment(endTime)
    this.setState({
      timesheets: [...this.state.timesheets]
    }, () => { this.verifyInput() })

  }

  handleCheckboxChange = (index, name, e) => {
    const timesheets = [...this.state.timesheets]
    timesheets[index][name] = e.target.checked

    this.setState({
      timesheets: timesheets
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
    const { timesheets, appraiser, approver, files } = this.state

    const errors = { ...this.state.errors }
    timesheets.forEach((timesheet, index) => {
      if (timesheet.isEdited) {
        if (this.isNullCustomize(timesheet.start_time1_fact_update) && this.isNullCustomize(timesheet.end_time1_fact_update)) {
          errors['start_time1_fact_update' + index] = this.props.t("Required")
          errors['end_time1_fact_update' + index] = this.props.t("Required")
        } else {
          errors['start_time1_fact_update' + index] = this.isNullCustomize(timesheet.start_time1_fact_update) ? this.props.t("Required") : null;
          errors['end_time1_fact_update' + index] = this.isNullCustomize(timesheet.end_time1_fact_update) ? this.props.t("Required") : null
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

    if (_.isNull(approver)) {
      errors['approver'] = this.props.t("Required")
    }

    errors['approverAppraiser'] = null
    if (approver?.account?.trim() && appraiser?.account?.trim() && approver?.account?.trim()?.toLowerCase() === appraiser?.account?.trim()?.toLowerCase()) {
      errors['approverAppraiser'] = t("ApproverAndConsenterCannotBeIdentical")
      this.showStatusModal(t("Notification"), t("ApproverAndConsenterCannotBeIdentical"), false)
      this.setState({ needReload: false })
    }

    errors['files'] = (!listCompanyCodeIgnoreEvidence.includes(currentUserPnLCode) && (!files || files?.length === 0)) ? this.props.t("Required") : null

    this.setState({ errors: errors })
    return errors
  }

  setDisabledSubmitButton(status) {
    this.setState({ disabledSubmitButton: status })
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == "#") ? true : false
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

    const hasNotErrorBackDate = (timesheets || []).every(item => isValidDateRequest(moment(item?.date, 'DD-MM-YYYY').format('DD/MM/YYYY')))
    if (!hasNotErrorBackDate) {
      this.showStatusModal(t("Notification"), t("ErrorBackDateRequestVinpearl"), false)
      this.setState({ needReload: false })
      return
    }

    const approver = { ...this.state.approver }
    const appraiser = this.state.appraiser ? this.state.appraiser  : null
     
    delete approver.avatar
    // delete appraiser.avatar

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
          date: moment(item.date, "DD-MM-YYYY").format('YYYYMMDD').toString(),
          end_time1_fact_update: item.end_time1_fact_update ? moment(this.processTimeZero(item.end_time1_fact_update)).format('HHmmss') : null,
          end_time2_fact_update: item.end_time2_fact_update ? moment(this.processTimeZero(item.end_time2_fact_update)).format('HHmmss') : null,
          start_time1_fact_update: item.start_time1_fact_update ? moment(this.processTimeZero(item.start_time1_fact_update)).format('HHmmss') : null,
          start_time2_fact_update: item.start_time2_fact_update ? moment(this.processTimeZero(item.start_time2_fact_update)).format('HHmmss') : null,
        });
    })
    
    const comments = timesheets.filter(item => (item.note)).map(item => item.note).join(" - ")

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
    bodyFormData.append('companyCode', currentUserPnLCode)
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
      const result = response?.data?.result
      if (result?.code === Constants.API_SUCCESS_CODE) {
        this.showStatusModal(t("Successful"), t("RequestSent"), true)
      } else if (result?.code == Constants.API_ERROR_CODE_WORKING_DAY_LOCKED) {
        this.setState({ needReload: true })
        this.showStatusModal(t("Notification"), result?.message, false, true)
      } else {
        this.showStatusModal(t("Notification"), result?.message, false)
      }
    })
    .catch(error => {
      this.showStatusModal(t("Notification"), error?.response?.data?.result?.message || t("AnErrorOccurred"), false)
    })
    .finally(() => {
      this.setState({ needReload: true })
      this.setDisabledSubmitButton(false)
    })
  }

  error = (index, name) => {
    return this.state.errors[name + index] && <div className="text-danger validation">{this.state.errors[name + index]}</div>
  }

  errorWithoutItem = (name) => {
    return this.state.errors[name] && <div className="text-danger">{this.state.errors[name]}</div>
  }

  updateEditMode(index) {
    const timeSheets = [...this.state.timesheets]
    timeSheets[index].isEdited = !timeSheets[index].isEdited
    this.setState({ timesheets: timeSheets })
  }

  search() {
    this.setState({ isLoading: true })
    const { startDate, endDate } = this.state
    const start = moment(startDate, "DD/MM/YYYY").format('YYYYMMDD')
    const end = moment(endDate, "DD/MM/YYYY").format('YYYYMMDD')

    const config = getMuleSoftHeaderConfigurations()
    config['params'] = {
      from_date: start,
      to_date: end
    }

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/timeoverview`, config)
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
              end_time2_fact_update: null,
              isNextDay: false,
              isPrevDay: false
            }, ts)
          })
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      }).finally(() => {
        this.setState({ isLoading: false })
      })
  }

  showStatusModal = (title, message, isSuccess = false, isWarningCreateRequest = false) => {
    this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess, isWarningCreateRequest: isWarningCreateRequest });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false, disabledSubmitButton: false });
    if (this.state.needReload) {
      window.location.href = `${map.Registration}?tab=InOutTimeUpdate`
    }
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
    //|| value == 0 |
    return (value == null || value == "null" || value == "" || value == undefined || value == "#") ? true : false
  }

  formatData = value => {
    //|| value == 0 |
    return (value == null || value == "null" || value == "" || value == undefined || value == "#") ? "" : value
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

  handleShowNoteModal = () => {
    const { t } = this.props
    const noteModal = {...this.state.noteModal}
    noteModal.isShow = true
    noteModal.content = t("PreviousDayNoteUpdateInOutTime")
    this.setState({noteModal})
  }

  handleHideNoteModal = () => {
    this.setState({
      noteModal: {
        ...this.state.noteModal,
        isShow: false,
      }
    })
  }

  prepareInterDayShift = (date, shiftFromTimeInput, shiftToTimeInput, actualFromTimeInput, actualToTimeInput, isPreviousDay = false) => {
    try {
      const shiftFromTime = formatStringByMuleValue(shiftFromTimeInput) || 0
      const shiftToTime = formatStringByMuleValue(shiftToTimeInput) || 0
      const actualFromTime = !actualFromTimeInput ? 0 : moment(actualFromTimeInput).format("HHmmss")
      const actualToTime = !actualToTimeInput ? 0 : moment(actualToTimeInput).format("HHmmss")
  
      if (!date || !shiftFromTime || !shiftToTime || !actualFromTime || !actualToTime) {
        return null
      }
  
      const { t } = this.props
      if (parseInt(shiftFromTime) > parseInt(shiftToTime)) {
        switch (true) {
          case (parseInt(actualFromTime) < parseInt(actualToTime) && isPreviousDay):
            return t("InterDayShiftNotice", { day: moment(date, "DD-MM-YYYY").subtract(1, 'day').format("DD/MM/YYYY") })
          case (parseInt(actualFromTime) < parseInt(actualToTime) && !isPreviousDay):
          case (parseInt(actualFromTime) > parseInt(actualToTime) && isPreviousDay):
          case (parseInt(actualFromTime) > parseInt(actualToTime) && !isPreviousDay):
            return t("InterDayShiftNotice", { day: moment(date, "DD-MM-YYYY").format("DD/MM/YYYY") })
        }
      }
  
      return null
    } catch (error) {
      return null
    }
  }

  isInterDayShift = (shiftFromTimeInput1, shiftToTimeInput1, shiftFromTimeInput2, shiftToTimeInput2) => {
    try {
      const shiftFromTime1 = formatStringByMuleValue(shiftFromTimeInput1) || 0
      const shiftToTime1 = formatStringByMuleValue(shiftToTimeInput1) || 0
      const shiftFromTime2 = formatStringByMuleValue(shiftFromTimeInput2) || 0
      const shiftToTime2 = formatStringByMuleValue(shiftToTimeInput2) || 0
      return parseInt(shiftFromTime1) > parseInt(shiftToTime1) || parseInt(shiftFromTime2) > parseInt(shiftToTime2)
    } catch (error) {
      return false
    }
  }

  render() {
    const { startDate, endDate, timesheets, errors, files, disabledSubmitButton, isShowStatusModal, titleModal, messageModal, isSuccess, isLoading, noteModal, isWarningCreateRequest } = this.state
    const { t, recentlyManagers } = this.props;
    const lang = localStorage.getItem("locale")
    const isShowSelectWorkingShift24h = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.selectWorkingShift24h)
    const minDate = getRegistrationMinDateByConditions()

    return (
      <div className="in-out-time-update">
        <LoadingModal show={isLoading} />
        <ResultModal show={isShowStatusModal} title={titleModal} message={messageModal} isSuccess={isSuccess} isWarningCreateRequest={isWarningCreateRequest} onHide={this.hideStatusModal} />
        <NoteModal isShow={noteModal?.isShow} content={noteModal?.content} onHide={this.handleHideNoteModal} />
        <div className="box search-form">
          <div className="row">
            <div className="col-4">
              <p className="title">{t('From')}</p>
              <div className="content input-container">
                <label className="wrap-date-input">
                  <DatePicker
                    name="startDate"
                    selectsStart
                    autoComplete="off"
                    selected={startDate ? moment(startDate, 'DD/MM/YYYY').toDate() : null}
                    maxDate={endDate ? moment(endDate, 'DD/MM/YYYY').toDate() : null}
                    minDate={minDate ? moment(minDate).toDate() : null}
                    onChange={this.setStartDate.bind(this)}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale="vi"
                    shouldCloseOnSelect={true}
                    className="form-control input" />
                  <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                </label>
              </div>
              {this.error('startDate')}
            </div>

            <div className="col-4">
              <p className="title">{t('To')}</p>
              <div className="content input-container">
                <label className="wrap-date-input">
                  <DatePicker
                    name="endDate"
                    selectsEnd
                    autoComplete="off"
                    selected={endDate ? moment(endDate, 'DD/MM/YYYY').toDate() : null}
                    minDate={startDate ? moment(startDate, 'DD/MM/YYYY').toDate() : null}
                    maxDate={new Date()}
                    onChange={this.setEndDate.bind(this)}
                    showDisabledMonthNavigation
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t('Select')}
                    locale="vi"
                    className="form-control input" />
                  <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                </label>
              </div>
              {this.error('endDate')}
            </div>

            <div className="col-4">
              <p className="title">&nbsp;</p>
              <div>
                <button type="button" className="btn btn-warning btn-search-in-out-time w-100" onClick={this.search.bind(this)}>{t('Search')}</button>
              </div>
            </div>
          </div>
        </div>
        {timesheets.map((timesheet, index) => {
          let interDayShift1Message = this.prepareInterDayShift(timesheet?.date, timesheet?.from_time1, timesheet?.to_time1, timesheet?.start_time1_fact_update, timesheet?.end_time1_fact_update, timesheet?.isPrevDay)
          let interDayShift2Message = this.prepareInterDayShift(timesheet?.date, timesheet?.from_time2, timesheet?.to_time2, timesheet?.start_time2_fact_update, timesheet?.end_time2_fact_update, timesheet?.isPrevDay)
          let isInterDayShift = this.isInterDayShift(timesheet?.from_time1, timesheet?.to_time1, timesheet?.from_time2, timesheet?.to_time2)

          return <div className="box shadow pt-1 pb-1" key={index}>
            <div className="row">
              <div className="col-4"><p className="d-inline-flex"><img src={IconClock} className="ic-clock" /><b style={{ marginLeft: 5 }}>{this.getDayName(timesheet.date)} {lang === Constants.LANGUAGE_VI ? t("Day") : null} {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-6">
                {!timesheet.isEdited ? <p>{t("StartTime")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b> | {t("EndTime")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b></p> : null}
                {!timesheet.isEdited && (!this.isNullCustomize(timesheet.start_time2_fact) || !this.isNullCustomize(timesheet.end_time2_fact)) ?
                  <p>{t("StartTime")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b> | {t("EndTime")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b></p>
                  : null}
                {!timesheet.isEdited && (!this.isNullCustomize(timesheet.start_time3_fact) || !this.isNullCustomize(timesheet.end_time3_fact)) ?
                  <p>{t("StartTime")} 3 (OT): <b>{this.printTimeFormat(timesheet.start_time3_fact)}</b> | {t("EndTime")} 3 (OT): <b>{this.printTimeFormat(timesheet.end_time3_fact)}</b></p>
                  : null}

              </div>
              <div className="col-2">
                {!timesheet.isEdited
                  ? <p className="edit text-warning text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-edit"></i> {t("Modify")}</p>
                  : <p className="edit text-danger text-right" onClick={this.updateEditMode.bind(this, index)}><i className="fas fa-times-circle"></i> {t("Cancel")}</p>}
              </div>
            </div>
            {timesheet.isEdited ? 
              <>
              <div className="block-time-item-edit">
                <div className="wrap-items">
                  <div className="item">
                    <div className="title plan">{t("PlannedShift")}</div>
                    <div className="content">
                      <div className="row-customize">
                        <div className="col-customize">
                          <span>{t("StartTime")} 1:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.from_time1)}</span>
                        </div>
                        <div className="col-customize">
                          <span>{t("EndTime")} 1:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.to_time1)}</span>
                        </div>
                      </div>
                      <div className="row-customize">
                        <div className="col-customize">
                          <span>{t("StartTime")} 2:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.from_time2)}</span>
                        </div>
                        <div className="col-customize">
                          <span>{t("EndTime")} 2:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.to_time2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="title actual">{t("ActualTime")}</div>
                    <div className="content">
                      <div className="row-customize">
                        <div className="col-customize">
                          <span>{t("StartTime")} 1:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.start_time1_fact)}</span>
                        </div>
                        <div className="col-customize">
                          <span>{t("EndTime")} 1:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.end_time1_fact)}</span>
                        </div>
                      </div>
                      <div className="row-customize">
                        <div className="col-customize">
                          <span>{t("StartTime")} 2:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.start_time2_fact)}</span>
                        </div>
                        <div className="col-customize">
                          <span>{t("EndTime")} 2:</span>
                          <span className="font-weight-bold value">{this.printTimeFormat(timesheet.end_time2_fact)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <div className="title editable">{t("InOutChangeRequest")}</div>
                    <div className="content">
                      <div className="row-customize">
                        <div className="col-customize">
                          <span className="label">{t("StartTime")} 1:</span>
                          <span className="value">
                            <DatePicker
                              selected={!this.isNullCustomize(timesheet.start_time1_fact_update) ? moment(timesheet.start_time1_fact_update, 'HH:mm:ss').toDate() : null}
                              onChange={this.setStartTime.bind(this, index, 'start_time1_fact_update')}
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm:ss"
                              timeFormat="HH:mm:ss"
                              className="form-control input"
                              disabled={!timesheet.from_time1 || timesheet.from_time1 == "#"} />
                            {this.error(index, 'start_time1_fact_update')}
                          </span>
                        </div>
                        <div className="col-customize">
                          <span className="label">{t("EndTime")} 1:</span>
                          <span className="value">
                            <DatePicker
                              selected={!this.isNullCustomize(timesheet.end_time1_fact_update) ? moment(timesheet.end_time1_fact_update, 'HH:mm:ss').toDate() : null}
                              onChange={this.setEndTime.bind(this, index, 'end_time1_fact_update')}
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm:ss"
                              timeFormat="HH:mm:ss"
                              className="form-control input" 
                              disabled={!timesheet.from_time1 || timesheet.from_time1 == "#"} />
                            {this.error(index, 'end_time1_fact_update')}
                          </span>
                        </div>
                        { interDayShift1Message && (<div style={{ width: "100%", textAlign: "center", margin: "10px 0", color: "#e52c08" }} dangerouslySetInnerHTML={{__html: interDayShift1Message}} />) }
                      </div>
                      <div className="row-customize">
                        <div className="col-customize">
                          <span className="label">{t("StartTime")} 2:</span>
                          <span className="value">
                            <DatePicker
                              selected={!this.isNullCustomize(timesheet.start_time2_fact_update) ? moment(timesheet.start_time2_fact_update, 'HH:mm:ss').toDate() : null}
                              onChange={this.setStartTime.bind(this, index, 'start_time2_fact_update')}
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm:ss"
                              timeFormat="HH:mm:ss"
                              className="form-control input" 
                              disabled={!timesheet.from_time2 || timesheet.from_time2 == "#"} />
                            {this.error(index, 'start_time2_fact_update')}
                          </span>
                        </div>
                        <div className="col-customize">
                          <span className="label">{t("EndTime")} 2:</span>
                          <span className="value">
                            <DatePicker
                              selected={!this.isNullCustomize(timesheet.end_time2_fact_update) ? moment(timesheet.end_time2_fact_update, 'HH:mm:ss').toDate() : null}
                              onChange={this.setEndTime.bind(this, index, 'end_time2_fact_update')}
                              autoComplete="off"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption={t("Hour")}
                              dateFormat="HH:mm:ss"
                              timeFormat="HH:mm:ss"
                              className="form-control input" 
                              disabled={!timesheet.from_time2 || timesheet.from_time2 == "#"} />
                            {this.error(index, 'end_time2_fact_update')}
                          </span>
                        </div>
                        { interDayShift2Message && (<div style={{ width: "100%", textAlign: "center", margin: "10px 0 0 0", color: "#e52c08" }} dangerouslySetInnerHTML={{__html: interDayShift2Message}} />) }
                      </div>
                      {
                        isInterDayShift && (
                          <div className='previous-day-selection'>
                            <input type="checkbox" id={`previous-day-selection-${index}`} name={`previous-day-selection-${index}`} checked={timesheet?.isPrevDay || false} onChange={e => this.handleCheckboxChange(index, 'isPrevDay', e)} />
                            <label htmlFor={`previous-day-selection-${index}`}>{t("PreviousDay")}</label>
                            <button
                                className="information-btn"
                                onClick={this.handleShowNoteModal}
                              >
                                <i className="fas fa-info" />
                            </button>
                          </div>
                        )
                      }
                      {
                        isShowSelectWorkingShift24h && 
                        <div className='next-day-selection'>
                          <input type="checkbox" id={`next-day-selection-${index}`} name={`next-day-selection-${index}`} checked={timesheet.isNextDay || false} onChange={e => this.handleCheckboxChange(index, 'isNextDay', e)} />
                          <label htmlFor={`next-day-selection-${index}`}>{t("InOutUpdateNextDaySelection")}</label>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </> : null}

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

        {timesheets.filter(t => t.isEdited).length > 0 ? 
        <>
          <AssesserComponent 
            isEdit={t.isEdited} 
            errors={errors} 
            approver={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.approver : null} 
            appraiser={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.appraiser : null} 
            recentlyAppraiser={recentlyManagers?.appraiser} 
            updateAppraiser={this.updateAppraiser.bind(this)} />
          <ApproverComponent 
            errors={errors} 
            updateApprover={this.updateApprover.bind(this)} 
            approver={this.props.inOutTimeUpdate ? this.props.inOutTimeUpdate.userProfileInfo.approver : null} 
            recentlyApprover={recentlyManagers?.approver} /> 
        </>
          : null}

        <ul className="list-inline">
          {files.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <span className="file-name">
                <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i>
              </span>
            </li>
          })}
        </ul>

        {
          (timesheets.filter(t => t.isEdited).length > 0 && !listCompanyCodeIgnoreEvidence.includes(currentUserPnLCode)) ?
            <div className="p-3 mb-2 bg-warning text-dark">{t('EvidenceRequired')}</div>
            : null
        }
        {this.errorWithoutItem("files")}

        {timesheets.filter(t => t.isEdited).length > 0 ? <ButtonComponent files={files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} /> : null}
      </div>
    )
  }
}

export default withTranslation()(InOutTimeUpdateComponent)
