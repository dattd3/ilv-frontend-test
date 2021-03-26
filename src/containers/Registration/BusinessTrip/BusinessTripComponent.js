import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import Constants from '../../../commons/Constants'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
import moment from 'moment'
import { withTranslation  } from "react-i18next";

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
      note: null,
      approver: null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      titleModal: "",
      messageModal: "",
      isShowAddressAndVehicle: true,
      disabledSubmitButton : false,
      requestInfo: [
        {
          groupItem: 1,
          startDate: null,
          startTime: null,
          endDate: null,
          endTime: null,
          comment: null,
          totalTimes: 0,
          totalDays: 0,
          isAllDay: true,
          attendanceQuotaType:null,
          place: null,
          vehicle: null,
          groupId: 1,
          errors: {},
        }
      ],
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

  setStartDate(startDate, groupId, groupItem) {
    let { requestInfo } = this.state;
    const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem);
    const { endDate, startTime, endTime } = request
    const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

    const start = moment(startDate).isValid() ? moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : null
    const end = endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) > endDate)
      || !requestInfo[indexReq].isAllDay ? moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : endDate
    requestInfo[indexReq].startDate = start
    requestInfo[indexReq].endDate = end
    requestInfo[indexReq].errors.startDate = null
    requestInfo[indexReq].errors.overlapDateTime = null
    this.setState({ requestInfo })
    this.calculateTotalTime(start, end, startTime, endTime, indexReq)
  }

  setEndDate(endDate, groupId, groupItem) {
    let { requestInfo } = this.state
    const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
    const { startDate, startTime, endTime } = request
    const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);
    const start = !requestInfo[indexReq].isAllDay ? moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT) : startDate
    const end = moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT)
    requestInfo[indexReq].startDate = start
    requestInfo[indexReq].endDate = end
    requestInfo[indexReq].errors.endDate = null
    requestInfo[indexReq].errors.overlapDateTime = null
    this.setState({ requestInfo })
    this.calculateTotalTime(start, end, startTime, endTime, indexReq)
  }

  setStartTime(startTime, groupId, groupItem){
    let { requestInfo } = this.state
    const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
    const { startDate, endTime, endDate } = request
    const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem);

    const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
    const startTimeToSave = moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
    let end = endTime

    if (end === undefined || (moment(startTime).isValid() && moment(startTimeToSave, Constants.LEAVE_TIME_FORMAT) > moment(endTime, Constants.LEAVE_TIME_FORMAT))) {
      end = moment(startTime).isValid() && moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
    }

    if ((moment(startTime).isValid() && moment(startTimeToSave, "HH:mm") >= moment("16:00", Constants.LEAVE_TIME_FORMAT))
      && (moment(endTime, "HH:mm").isValid() && moment(endTime, "HH:mm") < moment("08:00", "HH:mm"))) {
      end = endTime
    }
    requestInfo[indexReq].startTime = start
    requestInfo[indexReq].endTime = end
    requestInfo[indexReq].errors.startTime = null
    requestInfo[indexReq].errors.overlapDateTime = null
    this.setState({ requestInfo })
    this.calculateTotalTime(startDate, endDate, start, end, indexReq)
  }

  setEndTime(endTime, groupId, groupItem) {
    let { requestInfo } = this.state
    const request = requestInfo.find(req => req.groupId === groupId && req.groupItem === groupItem)
    const { startTime, startDate, endDate } = request
    const indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)

    const endTimeToSave = moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
    let start = startTime

    if (startTime === undefined || (moment(endTime).isValid() && moment(endTimeToSave, Constants.LEAVE_TIME_FORMAT) < moment(startTime, Constants.LEAVE_TIME_FORMAT))) {
      start = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
    }

    if ((moment(startTime, "HH:mm").isValid() && moment(startTime, "HH:mm") >= moment("16:00", Constants.LEAVE_TIME_FORMAT))
      && (moment(endTime).isValid() && moment(endTimeToSave, "HH:mm") < moment("08:00", "HH:mm"))) {
      start = startTime
    }

    const end = moment(endTime).isValid() && moment(endTime).format(Constants.LEAVE_TIME_FORMAT)
    requestInfo[indexReq].startTime = start
    requestInfo[indexReq].endTime = end
    requestInfo[indexReq].errors.endTime = null
    requestInfo[indexReq].errors.overlapDateTime = null
    this.setState({ requestInfo })
    this.calculateTotalTime(startDate, endDate, start, end, indexReq)
  }

  calculateTotalTime(startDateInput, endDateInput, startTimeInput = null, endTimeInput = null, indexReq) {
    const { requestInfo } = this.state
    const { isAllDay, errors } = requestInfo[indexReq]
    if ((isAllDay && (!startDateInput || !endDateInput))
      || (!isAllDay && (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput))) {
      return false
    }

    const startDateTime = moment(`${startDateInput} ${startTimeInput || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
    const endDateTime = moment(`${endDateInput} ${endTimeInput || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')

    const isOverlapDateTime = this.isOverlapDateTime(startDateTime, endDateTime, indexReq)
    if(isOverlapDateTime && startDateTime && endDateTime){
      requestInfo[indexReq].errors.startTimeAndEndTime = "Trùng với thời gian nghỉ đã chọn trước đó. Vui lòng chọn lại thời gian !"
      this.setState({ requestInfo })
      return
    }

    const isVerifiedDateTime = this.validateTimeRequest(requestInfo)

    if(!isVerifiedDateTime) return

    const start = moment(startDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
    const end = moment(endDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }
    if(startDateTime && endDateTime){
      this.validationFromDB(start, end, startTimeInput, endTimeInput, indexReq)
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user/leave`, {
      perno: localStorage.getItem('employeeNo'),
      from_date: start,
      from_time: isAllDay ? "" : moment(startTimeInput, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      to_date: end,
      to_time: isAllDay ? "" : moment(endTimeInput, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      leaveType: ""
    }, config)
      .then(res => {
        if (res && res.data) {
          const data = res.data
          const result = data.result
          if (data.data && result && result.code != Constants.API_ERROR_CODE) {
            errors.startTimeAndEndTime = 
              ((isAllDay && data.data.days === 0) || (!isAllDay && data.data.hours === 0)) 
              ? "Tổng thời gian nghỉ phải khác 0"
              : null
            requestInfo[indexReq].totalDays = data.data.days
            requestInfo[indexReq].totalTimes = data.data.hours
            this.setState({ requestInfo })
          } else {
            if (!_.isNull(result) && result.code === Constants.API_ERROR_CODE) {
              errors.startTimeAndEndTime = result.message
            } else {
              errors.startTimeAndEndTime = null
            }
            errors.startTimeAndEndTime = data.result.message
            this.setState({ requestInfo })
          }
        }
      }).catch(error => {

      })
  }

  validateTimeRequest(requestInfo){
    let newRequestInfo = []
    const times = requestInfo.map(req => ({
      id: req.groupItem,
      from_date: moment(req.startDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
      from_time: moment(req.endDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString(),
      to_date: req.isAllDay ? "" : moment(req.startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      to_time: req.isAllDay ? "" : moment(req.endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      leave_type: req.absenceType?.value || ""
    }))

    let verifiedDateTime = true
    axios.post(`${process.env.REACT_APP_REQUEST_URL}request/validate`, {
      perno: localStorage.getItem('employeeNo'),
      times: times,
    })
    .then(res => {
      if(res && res.data && res.data.data){
        newRequestInfo = requestInfo.map((req, index) => {
          res.data.data.forEach(time => {
            if(!time.is_valid && time.groupId === req.groupId &&  time.id === req.groupItem){
              verifiedDateTime = false
              return ({
                ...req,
                errors: {
                  ...req.errors,
                  startTimeAndEndTime: time.message
                }
              })
            }
          })
          return req
        })
      }
    })
    .then(error => console.log(error))

    this.setState({ requestInfo: newRequestInfo })
    return verifiedDateTime;
  }

  isOverlapDateTime(startDateTime, endDateTime, indexReq) {
    let { requestInfo } = this.state
    const hasOverlap = requestInfo.flat().filter(req => {
      const start = moment(`${req.startDate} ${req.startTime || "00:00"}`, 'DD/MM/YYYY hh:mm').format('x')
      const end = moment(`${req.endDate} ${req.endTime || "23:59"}`, 'DD/MM/YYYY hh:mm').format('x')

      if((startDateTime >= start && startDateTime <= end) || (endDateTime >= start && endDateTime <= end) || (startDateTime <= start && endDateTime >= end)){
        return req
      }
    })
    return Boolean(hasOverlap.length > 1)
  }

  validationFromDB = (startDate, endDate, startTime = null, endTime = null, indexReq) => {
    const { requestInfo } = this.state
    let { errors } = requestInfo[indexReq]
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user/validation-business-trip`, {
      from_date: startDate,
      to_date: endDate,
      from_time: startTime,
      to_time: endTime
    }, config)
      .then(res => {
        if (res && res.data) {
          const data = res.data
          if (!_.isNull(data.result) && data.result.code === Constants.API_ERROR_CODE) {
            errors.startTimeAndEndTime = data.result.message
          } else {
            errors.startTimeAndEndTime = null
          }
          this.setState({ requestInfo })
        }
      }).catch(error => {

      })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver, isApprover) {
    this.setState({ approver: approver })
    const errors = { ...this.state.errors }
    if (!isApprover) {
      errors.approver = this.props.t("InvalidApprover")
    } else {
      errors.approver = null
    }
    this.setState({ errors: errors })
  }

  updateAppraiser(appraiser, isAppraiser) {
    this.setState({ appraiser: appraiser })
    const errors = { ...this.state.errors }
    if (!isAppraiser) {
      errors.appraiser = this.props.t("InvalidApprover")
    } else {
      errors.appraiser = null
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

  handleSelectChange(name, value, groupId) {
    const { requestInfo } = this.state

    
    if (name === "attendanceQuotaType" && value.value === TRAINING_OPTION_VALUE) {
      this.setState({ isShowAddressAndVehicle: false })
    } else {
      this.setState({ isShowAddressAndVehicle: true })
    }
    const newRequestInfo = requestInfo.map(req => {
      const errors = {
        ...req.errors,
        [name]: null
      }
      if(req.groupId === groupId){
        return {
          ...req,
          [name]: value,
          errors
        }
      }
      return {...req}
    })
    this.setState({ requestInfo: newRequestInfo })
  }

  verifyInput() {
    let { requestInfo, approver, appraiser, errors } = this.state
    const employeeLevel = localStorage.getItem("employeeLevel")

    requestInfo.forEach((req, indexReq) => {
      const {startDate, endDate, startTime, endTime, attendanceQuotaType, vehicle, place, comment, isAllDay } = req
        requestInfo[indexReq].errors["startDate"] = !startDate ? this.props.t('Required') : null
        requestInfo[indexReq].errors["endDate"] = !endDate ? this.props.t('Required'): null
        requestInfo[indexReq].errors["startTime"] = !startTime && !isAllDay  ? this.props.t('Required'): null
        requestInfo[indexReq].errors["endTime"] = !endTime && !isAllDay ? this.props.t('Required'): null
        requestInfo[indexReq].errors.attendanceQuotaType = !attendanceQuotaType  ? this.props.t('Required'): null
        requestInfo[indexReq].errors.vehicle = !vehicle ? this.props.t('Required'): null
        requestInfo[indexReq].errors.place = !place  ? this.props.t('Required'): null
        requestInfo[indexReq].errors.comment = !comment  ? this.props.t('Required'): null
    })
    this.setState({
      requestInfo,
      errors: {
        approver: !approver ? this.props.t('Required') : errors.approver,
        appraiser: !appraiser && employeeLevel === "N0" ? this.props.t('Required') : errors.approver
      }
    })
    const listError = requestInfo.map(req => _.compact(_.valuesIn(req.errors))).flat()
    if(listError.length > 0 || errors.approver || (errors.appraiser && employeeLevel === "N0")){
      return false
    }
    return true
  }

  setDisabledSubmitButton(status)
  {
    this.setState({disabledSubmitButton: status})
  }

  submit() {
    const { t } = this.props 
    const { requestInfo } = this.state
    this.setDisabledSubmitButton(true)
    const err = this.verifyInput()
    this.setDisabledSubmitButton(true)
    if (!err) {
      this.setDisabledSubmitButton(false)
      return
    }
    const dataRequestInfo = requestInfo.map(req => {
      return ({
        startDate: req.startDate,
        startTime: req.startTime,
        endDate: req.endDate,
        endTime: req.endTime,
        comment: req.comment,
        totalTimes: req.totalTimes,
        totalDays: req.totalDays,
        attendanceQuotaType: req.attendanceQuotaType,
        isAllDay: req.isAllDay,
        funeralWeddingInfo: req.funeralWeddingInfo,
        groupId: req.groupId,
        leaveType: "",
        vehicle: req.vehicle,
        place: req.place,
      })
    })

    const approver = { ...this.state.approver }
    const appraiser = { ...this.state.appraiser }
    delete approver.avatar
    delete appraiser.avatar

    let bodyFormData = new FormData();
    this.state.files.forEach(file => {
      bodyFormData.append('Files', file)
    })

    bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
    bodyFormData.append('userId', localStorage.getItem("email"))
    bodyFormData.append('fullName', localStorage.getItem('fullName'))
    bodyFormData.append('jobTitle', localStorage.getItem('jobTitle'))
    bodyFormData.append('department', localStorage.getItem('department'))
    bodyFormData.append('employeeNo', localStorage.getItem('employeeNo'))
    bodyFormData.append('approver', JSON.stringify(approver))
    bodyFormData.append('appraiser', JSON.stringify(appraiser))
    bodyFormData.append('RequestType', JSON.stringify({
      requestType: {
        id: 3,
        name: "Đăng ký công tác/đào tạo"
      }
    }))
    bodyFormData.append('requestInfo', JSON.stringify(dataRequestInfo))

    axios({
      method: 'POST',
      url: this.state.isEdit && this.state.id ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.state.id}/registration-update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
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
        this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        this.setDisabledSubmitButton(false)
      })
  }

  error(name, groupId, groupItem) {
    const { requestInfo } = this.state
    let indexReq
    if(groupItem){
      indexReq = requestInfo.findIndex(req => req.groupId === groupId && req.groupItem === groupItem)
    } else {
      indexReq = requestInfo.findIndex(req => req.groupId === groupId)
    }
    const errorMsg = requestInfo[indexReq].errors[name]
    return errorMsg ? <p className="text-danger">{errorMsg}</p> : null
  }

  showStatusModal = (title, message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  }

  updateLeaveType(isAllDay, groupId) {
    const { requestInfo } = this.state
    const newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
    newRequestInfo.push({
      groupItem: 1,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      comment: null,
      totalTimes: 0,
      totalDays: 0,
      isAllDay: isAllDay,
      attendanceQuotaType:null,
      place: null,
      vehicle: null,
      groupId: groupId,
      errors: {},
    })
    this.setState({ requestInfo: newRequestInfo})
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({ isUpdateFiles: status })
  }

  addMultiDateTime(groupId, requestItem, isAllDay) {
    const { requestInfo } = this.state;
    const maxIndex = _.maxBy(requestItem, 'groupItem') ? _.maxBy(requestItem, 'groupItem').groupItem : 1;
    requestInfo.push({
      groupItem: maxIndex + 1,
      groupId: groupId,
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      comment: null,
      totalTimes: 0,
      totalDays: 0,
      isAllDay: isAllDay,
      attendanceQuotaType:null,
      place: null,
      vehicle: null,
      errors: {},
  })
    this.setState({ requestInfo })
  }

  removeIndex(index, indexDetail) {
    let { requestList } = this.state;
    requestList[index].requestDetails.splice(indexDetail, 1)
    if(requestList[index].requestDetails.length > 1){
      requestList[index].totalDays = requestList[index].requestDetails.reduce((cur, acc) => cur.totalDays + acc.totalDays)
      requestList[index].totalTimes = requestList[index].requestDetails.reduce((cur, acc) => cur.totalTimes + acc.totalTimes)
    } else {
      requestList[index].totalDays = requestList[index].requestDetails[0].totalDays
      requestList[index].totalTimes = requestList[index].requestDetails[0].totalTimes
    }
    this.setState({ requestList })
  }

  onAddBizTrip() {
    const { requestInfo } = this.state;
    const maxGroup = _.maxBy(requestInfo, 'groupId').groupId;
    requestInfo.push({
        groupItem: 1,
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        comment: null,
        totalTimes: 0,
        totalDays: 0,
        isAllDay: true,
        attendanceQuotaType:null,
        place: null,
        vehicle: null,
        groupId: maxGroup + 1,
        errors: {},
    })
    this.setState({ requestInfo })
  }

  onRemoveBizTrip(groupId, groupItem){
    let { requestInfo } = this.state;
    let newRequestInfo = []
    if(!groupItem){
      newRequestInfo = requestInfo.filter(req => req.groupId !== groupId)
    } else {
      newRequestInfo = requestInfo.filter(req => req.groupId !== groupId || req.groupItem !== groupItem )
    }
    this.setState({ requestInfo: newRequestInfo })
  }

  render() {
    const { t } = this.props;
    const { requestInfo, errors } = this.state
    const sortRequestListByGroup = requestInfo.sort((reqPrev, reqNext) =>  reqPrev.groupId - reqNext.groupId)
    const requestInfoArr = _.valuesIn(_.groupBy(sortRequestListByGroup, (req) => req.groupId))
    const employeeLevel = localStorage.getItem("employeeLevel")
    const vehicles = [
      { value: '1', label: t('PrivateVehicles') },
      { value: '2', label: t('Taxi') },
      { value: '3', label: t('Train') },
      { value: '4', label: t('Flight') },
      { value: '5', label: t('Others') }
    ]

    const places = [
      { value: '1', label: t('Domestic') },
      { value: '2', label: t('Foreign') }
    ]
    
    let attendanceQuotaTypes = [
      { value: 'CT01', label: t('BizTripHasPerDiemNoMeals') },
      { value: 'CT02', label: t('BizTripHasPerDiemHasMeals') },
      { value: 'CT03', label: t('BizTripNoPerDiemHasMeals') },
      { value: 'CT04', label: t('BizTripNoPerDiemNoMeals') },
      { value: 'DT01', label: t('Menu_Training') },
    ]
    if(['V073'].includes(localStorage.getItem("companyCode")))
    {
      attendanceQuotaTypes = [
        { value: 'CT03', label: t('BizTripNoPerDiemHasMeals') },
        { value: 'CT04', label: t('BizTripNoPerDiemNoMeals') },
        { value: 'DT01', label: t('Menu_Training') },
      ]
    }
    return (
      <div className="business-trip">
        <ResultModal show={this.state.isShowStatusModal} title={this.state.titleModal} message={this.state.messageModal} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        {requestInfoArr && requestInfoArr.map((req, index) => {
          const totalDay = req.length > 1 ? req.reduce((acc, cur) => acc.totalDays + cur.totalDays) : req[0].totalDays
          const totalTime = req.length > 1 ? req.reduce((acc, cur) => acc.totalTimes + cur.totalTimes) : req[0].totalTimes
          return (
          <div className="box shadow position-relative" key={index}>
            <div className="form">
              <div className="row">
                <div className="col-7">
                  <p className="text-uppercase"><b>{t('BizTrip_TrainingTime')}</b></p>
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label onClick={this.updateLeaveType.bind(this, true, req[0].groupId)} className={req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                      {t('FullDay')}
                    </label>
                    <label onClick={this.updateLeaveType.bind(this, false, req[0].groupId)} className={!req[0].isAllDay ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                      {t('ByHours')}
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-8 col-xl-8">
                  {req.map((reqDetail, indexDetail) => 
                  <div className="time-area" key={indexDetail + index}>
                    <div className="row p-2">
                      <div className="col-lg-12 col-xl-6">
                        <p className="title">{t('StartDateTime')}</p>
                        <div className="row">
                          <div className="col-6">
                            <div className="content input-container">
                              <label>
                                <DatePicker
                                  name="startDate"
                                  selectsStart
                                  autoComplete="off"
                                  selected={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                  startDate={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                  endDate={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                  minDate = {['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, DATE_FORMAT).toDate() : null}
                                  onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem)}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText= {t('Select')}
                                  locale="vi"
                                  className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                              </label>
                            </div>
                            {reqDetail.errors.startDate ? this.error('startDate', reqDetail.groupId, reqDetail.groupItem) : null}
                          </div>
                          <div className="col-6">
                            <div className="content input-container">
                              <label>
                                <DatePicker
                                  selected={reqDetail.startTime ? moment(reqDetail.startTime, TIME_FORMAT).toDate() : null}
                                  onChange={time => this.setStartTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                  autoComplete="off"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Giờ"
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  placeholderText={t('Select')}
                                  className="form-control input"
                                  disabled={req[0].isAllDay} />
                              </label>
                            </div>
                            {reqDetail.errors.startTime ? this.error('startTime', reqDetail.groupId, reqDetail.groupItem) : null}
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6">
                        <p className="title">{t('EndDateTime')}</p>
                        <div className="row">
                          <div className="col-6">
                            <div className="content input-container">
                              <label>
                                <DatePicker
                                  name="endDate"
                                  selectsEnd
                                  autoComplete="off"
                                  selected={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                  startDate={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : null}
                                  endDate={reqDetail.endDate ? moment(reqDetail.endDate, DATE_FORMAT).toDate() : null}
                                  minDate={reqDetail.startDate ? moment(reqDetail.startDate, DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null)}
                                  onChange={date => this.setEndDate(date, reqDetail.groupId, reqDetail.groupItem)}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText={t('Select')}
                                  locale="vi"
                                  className="form-control input" />
                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                              </label>
                            </div>
                            {reqDetail.errors.endDate ? this.error('endDate', reqDetail.groupId, reqDetail.groupItem) : null}
                          </div>
                          <div className="col-6">
                            <div className="content input-container">
                              <label>
                                <DatePicker
                                  selected={reqDetail.endTime ? moment(reqDetail.endTime, TIME_FORMAT).toDate() : null}
                                  onChange={time => this.setEndTime(time, reqDetail.groupId, reqDetail.groupItem)}
                                  autoComplete="off"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Giờ"
                                  dateFormat="HH:mm"
                                  timeFormat="HH:mm"
                                  placeholderText={t('Select')}
                                  className="form-control input"
                                  disabled={req[0].isAllDay}
                                />
                              </label>
                            </div>
                            {reqDetail.errors.endTime ? this.error('endTime', reqDetail.groupId, reqDetail.groupItem) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!indexDetail ?
                      <button type="button" className="btn btn-add-multiple-in-out" style={{ right: 0 }}  onClick={() => this.addMultiDateTime(req[0].groupId, req, req[0].isAllDay)}><i className="fas fa-plus"></i> {t("AddMore")}</button>
                    :
                      <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveBizTrip(reqDetail.groupId, reqDetail.groupItem)}><i className="fas fa-times"></i> {t("Cancel")}</button>
                    }
                    {
                        reqDetail.errors.startTimeAndEndTime ?
                          <>
                            <div className="row">
                              <div className="col">
                                {this.error('startTimeAndEndTime', reqDetail.groupId, reqDetail.groupItem)}
                              </div>
                            </div>
                          </>
                          : null
                      }
                  </div>
                  )}
                </div>
                <div className="col-lg-4 col-xl-4">
                  <p className="title">{t('TotalTimeForBizTripAndTraining')}</p>
                  <div className="text-lowercase">
                    <input type="text" className="form-control" value={req[0].isAllDay ? (totalDay ? totalDay + ` ${"day"}` : "") : (totalTime ? totalTime + ` ${t("Hour")}` : "")} readOnly />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-5">
                  <p className="title">{t('TypeOfBizTripAndTraining')}</p>
                  <div>
                    <Select name="attendanceQuotaType" value={req[0].attendanceQuotaType} onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType, req[0].groupId)} placeholder={t('Select')} key="attendanceQuotaType" options={attendanceQuotaTypes} />
                  </div>

                  {this.error('attendanceQuotaType', req[0].groupId)}
                </div>
                {
                  this.state.isShowAddressAndVehicle && !['V073'].includes(localStorage.getItem("companyCode")) ?
                    <>
                      <div className="col-5">
                        <p className="title">{t('Location')}</p>
                        <div>
                          <Select name="place" value={req[0].place} onChange={place => this.handleSelectChange('place', place, req[0].groupId)} placeholder={t('Select')} key="place" options={places} />
                        </div>
                        {this.error('place', req[0].groupId)}
                      </div>
                      <div className="col-2">
                        <p className="title">{t('MeansOfTransportation')}</p>
                        <div>
                          <Select name="vehicle" value={req[0].vehicle} onChange={vehicle => this.handleSelectChange('vehicle', vehicle, req[0].groupId)} placeholder={t('Select')} key="vehicle" options={vehicles} />
                        </div>
                        {this.error('vehicle', req[0].groupId)}
                      </div>
                    </>
                    : null
                }
              </div>
              <div className="row business-type">
                <div className="col-12">
                  <div className="row">
                    <div className="col-lg-3 col-md-6 text-info smaller">* {t('PerDiemIncluded')}</div>
                    <div className="col-lg-4 col-md-6 text-info">* {t('NoPerDiem')}</div>
                  </div>
                  <div className="row">
                    <div className="col-lg-3 col-md-6 text-info smaller">* {t('MealsIncluded')}</div>
                    <div className="col-lg-4 col-md-6 text-info">* {t('NoMeals')}</div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <p className="title">{t('ReasonTripAndTrainning')}</p>
                  <div>
                    <textarea className="form-control" name="note" value={this.state.note || ""} onChange={this.handleInputChange.bind(this)} placeholder={t('EnterReason')} rows="3"></textarea>
                  </div>
                  {this.error('comment', req[0].groupId)}
                </div>
              </div>
            </div>
            {!index ?
              <button type="button" className="btn btn-add-multiple" onClick={() => this.onAddBizTrip()}><i className="fas fa-plus"></i> {t("AddBizTrip")}</button>
              :
              <button type="button" className="btn btn-danger btn-top-right-corner" onClick={() => this.onRemoveBizTrip(req[0].groupId)}><i className="fas fa-times"></i> {t("RemoveBizTrip")}</button>
            }
          </div>
        )})}
        <AssesserComponent errors={errors} updateAppraiser={this.updateAppraiser.bind(this)} appraiser={this.props.businessTrip ? this.props.businessTrip.userProfileInfo.approver : null} />
        <ApproverComponent errors={errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.businessTrip ? this.props.businessTrip.userProfileInfo.approver : null} />
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
        <ButtonComponent files={this.state.files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus}  disabledSubmitButton = {this.state.disabledSubmitButton}/>
      </div>
    )
  }
}
export default withTranslation()(BusinessTripComponent)