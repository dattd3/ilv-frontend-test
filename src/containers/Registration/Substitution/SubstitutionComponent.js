import React from 'react'
import Select from 'react-select'
import { Image } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { withTranslation } from "react-i18next"
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import { t } from 'i18next'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import AssesserComponent from '../AssesserComponent'
import StatusModal from "../../../components/Common/StatusModal"
import ShiftTable from './ShiftTable'
import ShiftForm from './ShiftForm'
import ResultModal from '../ResultModal'
import Constants from '../.../../../../commons/Constants'
import map from '../../../../src/containers/map.config'
import { getValueParamByQueryString, getMuleSoftHeaderConfigurations } from "../../../commons/Utils"
import EditIcon from '../../../assets/img/icon/Icon-edit.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const BROKEN_SHIFT_OPTION_VALUE = "02"
const queryString = window.location.search

class SubstitutionComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startDate: getValueParamByQueryString(queryString, 'date'),
      endDate: getValueParamByQueryString(queryString, 'date'),
      timesheets: [],
      shifts: [],
      approver: null,
      appraiser: null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      titleModal: "",
      messageModal: "",
      isShowStartBreakTimeAndEndBreakTime: false,
      totalHours: "",
      disabledSubmitButton: false,
      statusModal: {
        isShow: false,
        isSuccess: true,
        content: ""
      }
    }
  }

  componentDidMount() {
    const config = getMuleSoftHeaderConfigurations()

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/shifts`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          const shifts = res.data.data.filter((shift, index, arr) => arr.findIndex(a => a.shift_id === shift.shift_id) === index)
          .sort((a,b) =>  a.shift_id.includes("OFF") ? -1 : 1 ).sort((a,b) => a.shift_id < b.shift_id ? (a.shift_id.includes("OFF") ? -1 : 0) : 1)
          this.setState({ shifts: shifts })
        }
      }).catch(error => { })
    const {substitution} = this.props
    if (substitution) {
      this.setState({
        isEdited: true,
        id: substitution.id,
        startDate: substitution.userProfileInfo.startDate,
        endDate: substitution.userProfileInfo.endDate,
        timesheets: substitution.userProfileInfo.timesheets,
        note: substitution.comment,
        approver: substitution.userProfileInfo.approver,
        files: substitution.userProfileInfoDocuments.map(file => {
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
    const { t } = this.props
    const { timesheets } = this.state
    let errors = {}

    timesheets.forEach((timesheet, index) => {
      if (!timesheet.isEdited) return

      const startTime = moment(timesheet.startTime, "HH:mm:ss").isValid() ? moment(timesheet.startTime, "HH:mm:ss").format("HHmmss") : null
      const endTime = moment(timesheet.endTime, "HH:mm:ss").isValid() ? moment(timesheet.endTime, "HH:mm:ss").format("HHmmss") : null
      const startBreakTime = moment(timesheet.startBreakTime, "HH:mm:ss").isValid() ? moment(timesheet.startBreakTime, "HH:mm:ss").format("HHmmss") : null
      const endBreakTime = moment(timesheet.endBreakTime, "HH:mm:ss").isValid() ? moment(timesheet.endBreakTime, "HH:mm:ss").format("HHmmss") : null

      if (timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE) {
        errors['shiftId' + index] = _.isNull(timesheet['shiftId']) ? t('Required') : null
      }

      if (timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE) {
        let shiftRequiredFields = ['startTime', 'endTime', 'substitutionType']

        if (timesheet?.substitutionType?.value == BROKEN_SHIFT_OPTION_VALUE) {
          shiftRequiredFields = shiftRequiredFields.concat(['startBreakTime', 'endBreakTime'])
        }

        shiftRequiredFields.forEach(name => {
          errors[name + index] = _.isNull(timesheet[name]) ? t('Required') : null
        })
      }

      errors['applyFrom' + index] = (_.isNull(timesheet['applyFrom']) || !timesheet['applyFrom']) ? t('Required') : null
      errors['applyTo' + index] = (_.isNull(timesheet['applyTo']) || !timesheet['applyTo']) ? t('Required') : null

      if (timesheet['applyFrom'] && timesheet['applyTo']) {
        if (timesheet['applyFrom'] > timesheet['applyTo']) {
          errors['applyFrom' + index] = t('InvalidDate')
        } else {
          errors['applyFrom' + index] = null
        }
      }
      errors['substitutionType' + index] = (_.isNull(timesheet['substitutionType']) || !timesheet['substitutionType']) ? t('Required') : null
      
      if (_.isNull(timesheet['startBreakTime']) && !_.isNull(timesheet['endBreakTime'])) {
        errors['startBreakTime' + index] = t('Required')
      } else if (!_.isNull(timesheet['startBreakTime']) && _.isNull(timesheet['endBreakTime'])) {
        errors['endBreakTime' + index] = t('Required')
      }

      if (startTime && endTime) {
        if (startTime < endTime) {
          if (startBreakTime && endBreakTime) {
            if (startBreakTime > endBreakTime) {
              errors['startBreakTime' + index] = t('WarningBreakStartTimeEndTime')
            } else if (startBreakTime < startTime || endBreakTime > endTime) {
              errors['breakTime' + index] = t('WarningBreakTime')
            }
          }
        } else {
          if (startBreakTime && endBreakTime) {
            if (startBreakTime > startTime && endBreakTime > startTime) {
              if (startBreakTime > endBreakTime) {
                errors['startBreakTime' + index] = t('WarningBreakStartTimeEndTime')
              }
            } else if (startBreakTime < endTime && endBreakTime < endTime) {
              if (startBreakTime > endBreakTime) {
                errors['startBreakTime' + index] = t('WarningBreakStartTimeEndTime')
              }
            } else if ((startBreakTime < startTime && startBreakTime > endTime) || (startBreakTime >= endTime && startBreakTime < startTime) 
              || (startBreakTime > startTime && endBreakTime > endTime) || (startBreakTime < endTime && endBreakTime > endTime)) {
              errors['breakTime' + index] = t('WarningBreakTime')
            }
          }
        }

        if (startBreakTime && endBreakTime) {
          if (timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE) {
            const duration = moment.duration(moment(endBreakTime, "HHmmss").diff(moment(startBreakTime, "HHmmss")))
            const totalHoursBreak = duration.asHours()
            const totalTimeBreakValid = 2
            const totalTimeWorkingValid = 10
            if (timesheet['substitutionType'] && timesheet['substitutionType'].value == BROKEN_SHIFT_OPTION_VALUE && totalHoursBreak < totalTimeBreakValid) {
              errors['totalHours' + index] = t("WarningTotalBreakTime")
            } else if (timesheet['substitutionType'] && timesheet['substitutionType'].value == BROKEN_SHIFT_OPTION_VALUE && moment.duration(this.state.totalHours).asHours() > totalTimeWorkingValid) {
              errors['totalHours' + index] = t("WarningTotalRegisTime")
            } else {
              errors['totalHours' + index] = null
            }
          }
        }
      }
      errors['note' + index] = (_.isNull(timesheet['note']) || !timesheet['note']) ? t('Required') : null
    })
    if (_.isNull(this.state.approver)) {
      errors['approver'] = t('Required')
    }

    this.setState({ errors: errors })
    return errors
  }

  setDisabledSubmitButton(status) {
    this.setState({ disabledSubmitButton: status })
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
  }

  formatTime(time, defaultFormat, format="HHmm00") {
    if (time == "00:00:00") {
      format = "HHmm01"
    }
    return moment(time, defaultFormat).format(format).toString()
  }

  submit() {
    this.setDisabledSubmitButton(true)
    const errors = this.verifyInput()
    const hasErrors = !Object.values(errors).every(item => item === null)
    if (hasErrors) {
      this.setDisabledSubmitButton(false)
      return
    }

    const currentUserNo = localStorage.getItem('employeeNo')
    const { timesheets, startDate, endDate, approver, appraiser, isEdited, id } = this.state

    let timeSheetsToSubmit = (timesheets || []).map(item => {
      return {
        pernr: currentUserNo,
        isEdited: item.isEdited,
        date: moment(item.date, "DD/MM/YYYY").format('YYYYMMDD'),
        endBreakTimeEdited: item.endBreakTime ? this.formatTime(item.endBreakTime, Constants.SUBSTITUTION_TIME_FORMAT): null,
        toTimeEdited: item.endTime ? this.formatTime(item.endTime, Constants.SUBSTITUTION_TIME_FORMAT) : null, // sửa giờ kết thúc
        fromTimeByPlan: item.fromTime ? moment(item.fromTime, Constants.SUBSTITUTION_TIME_FORMAT).format('HHmm00') : null, // giờ bắt đầu theo kế hoạch
        note: item.note,
        shiftHours: item.shiftHours,
        shiftId: item.shiftId,
        shiftIndex: 1,
        // shiftType: item.shiftType,
        startBreakTimeEdited: item.startBreakTime ? this.formatTime(item.startBreakTime, Constants.SUBSTITUTION_TIME_FORMAT) : null,
        fromTimeEdited: item.startTime ? this.formatTime(item.startTime, Constants.SUBSTITUTION_TIME_FORMAT) : null, //sửa giờ bắt đầu
        substitutionType: item.substitutionType,
        toTimeByplan: item.toTime ? moment(item.toTime, Constants.SUBSTITUTION_TIME_FORMAT).format('HHmm00') : null, //giờ kết thúc theo kế hoạch
        startDateSearching: moment(startDate, "DD/MM/YYYY").format('YYYYMMDD'),
        endDateSearching: moment(endDate, "DD/MM/YYYY").format('YYYYMMDD'),
        applyFrom: item.applyFrom,
        applyTo: item.applyTo
      }
    })

    timeSheetsToSubmit = timeSheetsToSubmit.filter(item => item.isEdited)
    delete approver.avatar
    const user = {
      fullname: localStorage.getItem('fullName'),
      jobTitle: localStorage.getItem('jobTitle'),
      department: localStorage.getItem('department'),
      employeeNo: currentUserNo
    }
    const comments = timeSheetsToSubmit
      .filter(item => (item.note))
      .map(item => item.note).join(" - ")

    let bodyFormData = new FormData();
    bodyFormData.append('Name', 'Thay đổi phân ca')
    bodyFormData.append('RequestTypeId', Constants.SUBSTITUTION)
    bodyFormData.append('Comment', comments)
    bodyFormData.append('requestInfo', JSON.stringify(timeSheetsToSubmit))
    bodyFormData.append("divisionId", !this.isNullCustomize(localStorage.getItem('divisionId')) ? localStorage.getItem('divisionId') : "")
    bodyFormData.append("division", !this.isNullCustomize(localStorage.getItem('division')) ? localStorage.getItem('division') : "")
    bodyFormData.append("regionId", !this.isNullCustomize(localStorage.getItem('regionId')) ? localStorage.getItem('regionId') : "")
    bodyFormData.append("region", !this.isNullCustomize(localStorage.getItem('region')) ? localStorage.getItem('region') : "")
    bodyFormData.append("unitId", !this.isNullCustomize(localStorage.getItem('unitId')) ? localStorage.getItem('unitId') : "")
    bodyFormData.append("unit", !this.isNullCustomize(localStorage.getItem('unit')) ? localStorage.getItem('unit') : "")
    bodyFormData.append("partId", !this.isNullCustomize(localStorage.getItem('partId')) ? localStorage.getItem('partId') : "")
    bodyFormData.append("part", !this.isNullCustomize(localStorage.getItem('part')) ? localStorage.getItem('part') : "")
    bodyFormData.append('appraiser', JSON.stringify(appraiser))
    bodyFormData.append('approver', JSON.stringify(approver))
    bodyFormData.append('user', JSON.stringify(user))
    bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
    this.state.files.forEach(file => {
      bodyFormData.append('Files', file)
    })

    axios({
      method: 'POST',
      url: isEdited && id ? `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${id}/registration-update` : `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
    })
      .then(response => {
        if (response && response.data && response.data.result) {
          this.showResultModal(this.props.t("Successful"), this.props.t("RequestSent"), true)
          this.setDisabledSubmitButton(false)
        }
      })
      .catch(response => {
        this.showResultModal(this.props.t("Notification"), this.props.t("Error"), false)
        this.setDisabledSubmitButton(false)
      })
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger validation-message">{this.state.errors[name + index]}</div> : null
  }

  errorWithoutItem(name) {
    return this.state.errors[name] ? <div className="text-danger">{this.state.errors[name]}</div> : null
  }

  setStartDate(startDate) {
    this.setState({
      startDate: moment(startDate).isValid() ? moment(startDate).format(DATE_FORMAT) : null,
      endDate: this.state.endDate === undefined || startDate > this.state.endDate ? moment(startDate).isValid() && moment(startDate).format(DATE_FORMAT) : this.state.endDate
    })
  }

  setEndDate(endDate) {
    this.setState({
      endDate: moment(endDate).isValid() ? moment(endDate).format(DATE_FORMAT) : null
    })
  }

  updateTime(index, name, value) {
    let timesheets = this.state.timesheets
    timesheets[index][name] = value
    this.setState({
      timesheets: [...timesheets]
    }, () => { this.verifyInput() })
  }

  updateNote(index, e) {
    let timesheets = this.state.timesheets
    timesheets[index].note = e.currentTarget.value
    this.setState({
      timesheets: [...timesheets]
    }, () => { this.verifyInput() })
  }

  updateSubstitution(index, item) {
    if (item.value === BROKEN_SHIFT_OPTION_VALUE) {
      this.setState({ isShowStartBreakTimeAndEndBreakTime: true })
    } else {
      this.setState({ isShowStartBreakTimeAndEndBreakTime: false })
    }
    let timesheets = this.state.timesheets
    timesheets[index].substitutionType = item
    this.setState({
      timesheets: [...timesheets]
    }, () => { this.verifyInput() })
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
      errors.appraiser = this.props.t("InvalidAppraiser")
    } else {
      errors.appraiser = null
    }
    this.setState({ errors: errors })
  }

  updateEditMode(index, isCancel) {
    const timesheets = [...this.state.timesheets]
    const dateEdit = moment(timesheets[index].date, 'DD-MM-YYYY').format('YYYYMMDD')

    if (isCancel) {
      timesheets[index].applyFrom = dateEdit
      timesheets[index].applyTo = dateEdit
      timesheets[index].isEdited = !timesheets[index].isEdited
      this.setState({
        timesheets: [...timesheets]
      }, () => {
        this.verifyInput()
      })
      return
    }

    const isInValid = this.isInValidApplyTimeByDate(dateEdit)

    if (isInValid) {
      const statusModal = {...this.state.statusModal}
      statusModal.isShow = true
      statusModal.isSuccess = false
      statusModal.content = this.props.t("ShiftChangeInformationAlreadyExists")
      this.setState({statusModal: statusModal})
      return
    }

    timesheets[index].applyFrom = dateEdit
    timesheets[index].applyTo = dateEdit
    timesheets[index].isEdited = !timesheets[index].isEdited
    this.setState({
      timesheets: [...timesheets]
    }, () => {
      this.verifyInput()
    })
  }

  isInValidApplyTimeByDate = (date) => {
    const timesheets = [...this.state.timesheets]
    const isInValid = timesheets.filter(item => item.isEdited).some(item => date >= item.applyFrom && date <= item.applyTo)
    return isInValid
  }

  // isValidApplyTimeByDate = date => {
  //   const timesheets = [...this.state.timesheets]
  //   let timeSheetsEdited = timesheets.filter(item => item.isEdited)
  //   // const dateToCompare = date && moment(date, 'YYYYMMDD').isValid() ? moment(date, 'YYYYMMDD') : null
  //   timeSheetsEdited = timeSheetsEdited.sort((pre, next)=> (pre.applyFrom > next.applyFrom ? 1 : -1))

  //   console.log("*********************************")
  //   console.log(timeSheetsEdited)

  //   for (let i = 0; i < timeSheetsEdited.length; i++) {
  //     debugger
  //     let elementParent = timeSheetsEdited[i]
  //     for (let j = 0; j < timeSheetsEdited.length; j++) {
  //       let elementChild = timeSheetsEdited[j]
  //       if (i === j) {
  //         continue
  //       }

  //       if ((elementParent.applyFrom >= elementChild.applyFrom && elementParent.applyFrom <= elementChild.applyTo) 
  //         || (elementParent.applyTo >= elementChild.applyFrom && elementParent.applyTo <= elementChild.applyTo)) {
  //         return false
  //       }
        
  //     }
  //   }

  //   return true

  //   // const isValid = timeSheetsEdited.every((item, index, timeSheetsEdited) => {
  //   //   // let applyFromToCompare = item.applyFrom && moment(item.applyFrom, 'YYYYMMDD').isValid() ? moment(item.applyFrom, 'YYYYMMDD') : null
  //   //   // let applyToToCompare = item.applyTo && moment(item.applyTo, 'YYYYMMDD').isValid() ? moment(item.applyTo, 'YYYYMMDD') : null
  //   //   return !moment(date).isBetween(item.applyFrom, item.applyTo, undefined, '[]')
  //   // })

  //   // return isValid
  // }

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
      timesheets[index].note = null
      timesheets[index].substitutionType = null
      timesheets[index].applyFrom = moment(timesheets[index].date, 'DD-MM-YYYY').format('YYYYMMDD')
      timesheets[index].applyTo = moment(timesheets[index].date, 'DD-MM-YYYY').format('YYYYMMDD')

      this.setState({
        timesheets: [...timesheets],
        errors: {},
        isShowStartBreakTimeAndEndBreakTime: false
      }, () => { this.verifyInput() })
    }
  }

  updateShift(index, shift) {
    let timesheets = this.state.timesheets
    timesheets[index].shiftId = shift.shift_id
    timesheets[index].shiftHours = shift.hours.trim()
    timesheets[index].startTime = shift.from_time.replace("#", "") ? moment(shift.from_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null
    timesheets[index].endTime = shift.to_time.replace("#", "") ? moment(shift.to_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null
    this.setState({
      timesheets: [...timesheets]
    }, () => { this.verifyInput() })
  }

  updateTotalHours(index, totalHours) {
    const timesheets = [...this.state.timesheets]
    timesheets[index].shiftHours = moment.duration(totalHours).asHours()

    this.setState({ totalHours: totalHours, timesheets: timesheets }, () => { this.verifyInput() })
  }

  showResultModal = (title, message, isSuccess = false) => {
    this.setState({ isShowResultModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
  }

  hideResultModal = () => {
    this.setState({ isShowResultModal: false });
    window.location.href = `${map.Registration}?tab=SubstitutionRegistration`
  }

  hideStatusModal = () => {
    const statusModal = {...this.state.statusModal}
    statusModal.isShow = false
    this.setState({statusModal: statusModal})
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({ isUpdateFiles: status })
  }

  updateTimeFilter = (index, timeInput, type) => {
    const time = moment(timeInput).isValid() && moment(timeInput).format(TIME_FORMAT)
    const timesheets = [...this.state.timesheets].map((item, i) =>
      i == index ? { ...item, [type]: time } : item
    );

    this.setState({ timesheets: timesheets }, () => { this.verifyInput() })
  }

  onChangeShiftCodeFilter = (index, e) => {
    const timesheets = [...this.state.timesheets].map((item, i) =>
      i == index ? { ...item, "shiftCodeFilter": e.target.value ? e.target.value : "" } : item
    );
    this.setState({ timesheets: timesheets }, () => { this.verifyInput() })
  }

  search() {
    const { startDate, endDate } = this.state
    const start = moment(startDate, DATE_FORMAT).format('YYYYMMDD').toString()
    const end = moment(endDate, DATE_FORMAT).format('YYYYMMDD').toString()

    const config = getMuleSoftHeaderConfigurations()
    config['params'] = {
      from_date: start,
      to_date: end
    }

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/timeoverview`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let dataSorted = res.data.data.sort((a, b) => moment(a.date, "DD-MM-YYYY").format("YYYYMMDD") < moment(b.date, "DD-MM-YYYY").format("YYYYMMDD") ? 1 : -1)
          const timesheets = dataSorted.flatMap(timesheet => {
            return  {
              date: timesheet.date,
              fromTime: timesheet[`from_time1`],
              toTime: timesheet[`to_time1`],
              fromTime2: timesheet[`from_time2`],
              toTime2: timesheet[`to_time2`],
              isEdited: false,
              note: null,
              error: {},
              startTime: null,
              endTime: null,
              startBreakTime: null,
              endBreakTime: null,
              shiftType: Constants.SUBSTITUTION_SHIFT_CODE,
              shiftId: null,
              shiftHours: null,
              substitutionType: null,
              shifts: this.state.shifts,
              applyFrom: null,
              applyTo: null
            }
          }).filter(t => t !== undefined)
          this.setState({ timesheets: timesheets })
        }
      }).catch(error => { })
  }

  filterShiftListByTimesAndShiftCode = (index, startTime, endTime, shiftCode) => {
    const shifts = [...this.state.shifts]
    const timesheets = [...this.state.timesheets]
    const timesheetsToUpdate = (timesheets || []).map((item, i) => {
      let shiftsToUpdate = shifts.filter(item => {
        return (startTime ? item.from_time?.trim() === startTime?.toString().trim() : true) 
          && (endTime ? item.to_time?.trim() === endTime?.toString().trim() : true) 
          && (shiftCode ? item.shift_id?.trim().toUpperCase() === shiftCode?.trim().toUpperCase() : true)
      })
      return (i == index && (shiftCode !== undefined || startTime || endTime)) ? {...item, shifts: shiftsToUpdate} : item
    })

    this.setState({ timesheets: timesheetsToUpdate })
  }

  resetValidation = (index) => {
    const timesheets = [...this.state.timesheets].filter((item, i) => i == index && item.isEdited);
    const errors = { ...this.state.errors }

    const startTime = moment(timesheets[0].startTime, "HH:mm:ss").isValid() ? moment(timesheets[0].startTime, "HH:mm:ss") : null
    const endTime = moment(timesheets[0].endTime, "HH:mm:ss").isValid() ? moment(timesheets[0].endTime, "HH:mm:ss") : null
    const startBreakTime = moment(timesheets[0].startBreakTime, "HH:mm:ss").isValid() ? moment(timesheets[0].startBreakTime, "HH:mm:ss") : null
    const endBreakTime = moment(timesheets[0].endBreakTime, "HH:mm:ss").isValid() ? moment(timesheets[0].endBreakTime, "HH:mm:ss") : null

    if (startTime && endTime && startTime > endTime) {
      errors['startTime' + index] = this.props.t("WarningStartTimeEndTime1")
    } else {
      errors['startTime' + index] = null
    }

    if (startBreakTime) {
      if (startBreakTime < startTime || startBreakTime > endTime) {
        errors['startBreakTime' + index] = this.props.t("ErrorBreakTime")
      } else if (endBreakTime && startBreakTime > endBreakTime) {
        errors['startBreakTime' + index] = this.props.t("WarningBreakStartTimeEndTime")
      } else {
        errors['startBreakTime' + index] = null
      }
    }

    if (endBreakTime) {
      if (endBreakTime < startTime || endBreakTime > endTime) {
        errors['endBreakTime' + index] = this.props.t("WarningBreakEndTime");
      } else if (startBreakTime && startBreakTime > endBreakTime) {
        errors['endBreakTime' + index] = this.props.t("WarningBreakStartTimeEndTime")
      } else {
        errors['endBreakTime' + index] = null
      }
    }
    this.setState({ errors: errors })
  }

  getDayName = (date) => {
    const days = [this.props.t("Sun"), this.props.t("Mon"), this.props.t("Tue"), this.props.t("Wed"), this.props.t("Thu"), this.props.t("Fri"), this.props.t("Sat")];
    const dayStr = moment(date, "DD-MM-YYYY").format("MM/DD/YYYY").toString()
    const d = new Date(dayStr);
    const dayName = days[d.getDay()];
    return dayName
  }

  handleDatePickerInputChange = (index, value, stateName) => {
    const timeSheets = [...this.state.timesheets]
    if (stateName === 'applyTo') {
      const isInValid = this.validateOverlapDate(index, value)
      if (isInValid) {
        const statusModal = {...this.state.statusModal}
        statusModal.isShow = true
        statusModal.isSuccess = false
        statusModal.content = this.props.t("ShiftChangeInformationAlreadyExists")
        timeSheets[index].isEdited = false
        this.setState({statusModal: statusModal, timesheets: timeSheets})
        return
      }
    }
    const date = value && moment(value).isValid() ?  moment(value).format("YYYYMMDD") : null
    timeSheets[index][stateName] = date
    this.setState({timesheets: timeSheets}, () => { this.verifyInput() })
  }

  validateOverlapDate = (index, date) => {
    const timeSheets = [...this.state.timesheets]
    const currentTimeSheet = timeSheets.find((item, i) => i === index)
    const timeSheetEdited = timeSheets.filter((item, i) => item.isEdited && i !== index)
    const currentTimeSheetApplyFrom = currentTimeSheet && currentTimeSheet.applyFrom
    const timeSheetEditedValid = timeSheetEdited.filter(item => item.applyFrom >= currentTimeSheetApplyFrom && moment(date).format('YYYYMMDD') >= item.applyFrom)
    return timeSheetEditedValid && timeSheetEditedValid.length > 0 ? true : false
  }

  render() {
    const { t, substitution } = this.props;
    const {startDate, endDate, isShowResultModal, titleModal, messageModal, isSuccess, timesheets, errors, isShowStartBreakTimeAndEndBreakTime, 
      files, disabledSubmitButton, shifts, statusModal} = this.state
    const substitutionTypes = [
      { value: '01', label: t("Shiftchange") },
      { value: '02', label: t("IntermittenShift") },
      { value: '03', label: t("CoastShoreShiftChange") }
    ]
    const lang = localStorage.getItem("locale")
    const currentUserCompanyVCode = localStorage.getItem("companyCode")
    const customStyles = {
      control: base => ({
        ...base,
        height: 35,
        minHeight: 35
      })
    };

    const maxDateForApplyTo = (applyFrom) => {
      if (!applyFrom) {
        return null
      }
      const maxDayForApplyTo = 30
      return moment(applyFrom, "YYYYMMDD").isValid() ? moment(applyFrom, "YYYYMMDD").add(maxDayForApplyTo, 'days').toDate() : null
    }

    return (
      <div className="shift-work">
        <ResultModal show={isShowResultModal} title={titleModal} message={messageModal} isSuccess={isSuccess} onHide={this.hideResultModal} />
        <StatusModal show={statusModal.isShow} isSuccess={statusModal.isSuccess} content={statusModal.content} onHide={this.hideStatusModal} />
        <div className="box shadow">
          <div className="row">
            <div className="col">
              {
                currentUserCompanyVCode === Constants.pnlVCode.VinPearl ? <div className="text-danger guide-message"><i className="fa fa-info-circle"></i> {t("NotApplicable")}</div> : null
              }
              {
                currentUserCompanyVCode === Constants.pnlVCode.VinMec ? <div className="text-danger guide-message"><i className="fa fa-info-circle"></i> {t("ShiftChangeApplied")}</div> : null
              }
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <p className="title">{t('From')}</p>
              <div className="content input-container">
                <label>
                  <DatePicker
                    name="startDate"
                    selectsStart
                    autoComplete="off"
                    selected={startDate ? moment(startDate, DATE_FORMAT).toDate() : null}
                    startDate={startDate ? moment(startDate, DATE_FORMAT).toDate() : null}
                    endDate={endDate ? moment(endDate, DATE_FORMAT).toDate() : null}
                    minDate={[Constants.pnlVCode.VinPearl].includes(currentUserCompanyVCode) ? moment(new Date().getDate() - 1, DATE_FORMAT).toDate() : null}
                    onChange={this.setStartDate.bind(this)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("Select")}
                    locale="vi"
                    className="form-control input" />
                  <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                </label>
              </div>
              {this.errorWithoutItem('startDate')}
            </div>

            <div className="col-4">
              <p className="title">{t('To')}</p>
              <div className="content input-container">
                <label>
                  <DatePicker
                    name="endDate"
                    selectsEnd
                    autoComplete="off"
                    selected={endDate ? moment(endDate, DATE_FORMAT).toDate() : null}
                    startDate={startDate ? moment(startDate, DATE_FORMAT).toDate() : null}
                    endDate={endDate ? moment(endDate, DATE_FORMAT).toDate() : null}
                    minDate={startDate ? moment(startDate, DATE_FORMAT).toDate() : ([Constants.pnlVCode.VinPearl].includes(currentUserCompanyVCode) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null)}
                    onChange={this.setEndDate.bind(this)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={t("Select")}
                    locale="vi"
                    className="form-control input" />
                  <span className="input-group-addon input-img text-info"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
              {this.errorWithoutItem('endDate')}
            </div>

            <div className="col-4">
              <p className="title">&nbsp;</p>
              <button type="button" className="btn btn-warning btn-search w-100" onClick={this.search.bind(this)}>{t("Search")}</button>
            </div>
          </div>
        </div>

        {timesheets.map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="row">
              <div className="col-2"><p><i className="fa fa-clock-o"></i> <b>{this.getDayName(timesheet.date)} {lang === "vi-VN" && "Ngày"} {timesheet.date.replace(/-/g, '/')}</b></p></div>
              <div className="col-8">
                <p className="text-uppercase"><b>{t("ScheduledTime")}</b></p>
                <p>{t("Start")} 1: <b>{!this.isNullCustomize(timesheet.fromTime) ? moment(timesheet.fromTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT):''}</b> | {t("End")} 1: <b>{ !this.isNullCustomize(timesheet.toTime)? moment(timesheet.toTime, TIME_OF_SAP_FORMAT).format(TIME_FORMAT):''}</b></p>
                {!this.isNullCustomize(timesheet.fromTime2) ? <p>{t("Start")} 2: <b>{moment(timesheet.fromTime2, TIME_OF_SAP_FORMAT).format(TIME_FORMAT)}</b> | {t("End")} 2: <b>{!this.isNullCustomize(timesheet.fromTime2) ? moment(timesheet.toTime2, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : ''}</b></p> : ''}
              </div>
              <div className="col-2 ">
                {!timesheet.isEdited
                  ? <p className="edit text-right" onClick={this.updateEditMode.bind(this, index, false)}><Image src={EditIcon} alt="Edit" className="ic-edit" />{t("Modify")}</p>
                  : <p className="edit text-danger" onClick={this.updateEditMode.bind(this, index, true)}><i className="fas fa-times-circle"></i>{t("Cancel")}</p>}
              </div>
            </div>

            {timesheet.isEdited ? <hr /> : null}

            {timesheet.isEdited ?
              <div>
                <p className="text-uppercase"><b>{t("SelectShiftType")}</b></p>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label onClick={this.updateShiftType.bind(this, Constants.SUBSTITUTION_SHIFT_CODE, index)} className={timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ? 'btn btn-outline-info shift-change-type active' : 'btn btn-outline-info shift-change-type'}>
                    {t("SelectShiftCode")}
                  </label>
                  <label onClick={this.updateShiftType.bind(this, Constants.SUBSTITUTION_SHIFT_UPDATE, index)} className={timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE ? 'btn btn-outline-info shift-change-type active' : 'btn btn-outline-info shift-change-type'}>
                    {t("EndNewTime")}
                  </label>
                </div>
                <div className="row shift-change-type-field">
                  <div className="col-2">
                    <p className="title">{t("ShiftChangeFrom")}<span className="text-danger required">(*)</span></p>
                    <div>
                      <DatePicker
                        selected={timesheet && timesheet.applyFrom ? moment(timesheet.applyFrom, 'YYYYMMDD').toDate() : null}
                        onChange={applyFrom => this.handleDatePickerInputChange(index, applyFrom, "applyFrom")}
                        dateFormat="dd/MM/yyyy"
                        locale="vi"
                        minDate={[Constants.pnlVCode.VinPearl].includes(currentUserCompanyVCode) ? moment(new Date().getDate() - 1, DATE_FORMAT).toDate() : null}
                        showMonthDropdown={true}
                        showYearDropdown={true}
                        autoComplete='off'
                        popperPlacement="bottom-start"
                        className="form-control input"
                        disabled />
                    </div>
                    {this.error(index, 'applyFrom')}
                  </div>
                  <div className="col-2">
                    <p className="title">{t("ShiftChangeTo")}<span className="text-danger required">(*)</span></p>
                    <div>
                      <DatePicker
                          selected={timesheet && timesheet.applyTo ? moment(timesheet.applyTo, 'YYYYMMDD').toDate() : null}
                          onChange={applyTo => this.handleDatePickerInputChange(index, applyTo, "applyTo")}
                          dateFormat="dd/MM/yyyy"
                          locale="vi"
                          minDate={timesheet && timesheet.applyFrom ? moment(timesheet.applyFrom, 'YYYYMMDD').toDate() : null}
                          maxDate={maxDateForApplyTo(timesheet.applyFrom)}
                          showMonthDropdown={true}
                          showYearDropdown={true}
                          autoComplete='off'
                          popperPlacement="bottom-end"
                          className="form-control input" />
                    </div>
                    {this.error(index, 'applyTo')}
                  </div>
                  <div className="col-4">
                    <p className="title">{t("ShiftCategory")}<span className="text-danger required">(*)</span></p>
                    <div>
                      <Select 
                        name="substitutionType" 
                        value={timesheet.substitutionType} 
                        onChange={substitutionType => this.updateSubstitution(index, substitutionType)} 
                        placeholder={t("Select")} 
                        key="substitutionType" 
                        options={substitutionTypes} 
                        styles={customStyles} />
                    </div>
                    {this.error(index, 'substitutionType')}
                  </div>
                </div>
              </div> 
              : null
            }

            {timesheet.isEdited && timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_CODE ?
              <>
                <ShiftTable shifts={timesheet.shifts} timesheet={{ index: index, shiftId: timesheet.shiftId }} filterShiftListByTimesAndShiftCode={this.filterShiftListByTimesAndShiftCode} updateShift={this.updateShift.bind(this)} />
                {this.error(index, 'shiftId')}
              </>
              : null
            }
            {timesheet.isEdited && timesheet.shiftType === Constants.SUBSTITUTION_SHIFT_UPDATE
              ? <ShiftForm updateTime={this.updateTime.bind(this)} errors={errors} isShowStartBreakTimeAndEndBreakTime={isShowStartBreakTimeAndEndBreakTime}
                updateTotalHours={this.updateTotalHours.bind(this)} resetValidation={this.resetValidation.bind(this)}
                timesheet={{ index: index, startTime: timesheet.startTime, endTime: timesheet.endTime, startBreakTime: timesheet.startBreakTime, endBreakTime: timesheet.endBreakTime, note: timesheet.note, substitutionType: timesheet.substitutionType }} />
              : null
            }

            {timesheet.isEdited ? 
              <div>
                <p>{t("ShiftChangeReason")}</p>
                <textarea placeholder={t("EnterReason")} value={timesheet.note || ""} onChange={this.updateNote.bind(this, index)} className="form-control mt-3 note" name="note" rows="4" />
                {this.error(index, 'note')}
              </div> 
              : null
            }
          </div>
        })}

        {timesheets.filter(t => t.isEdited).length > 0 ?
          <>
            <AssesserComponent isEdit={t.isEdited} errors={errors} approver={substitution ? substitution.userProfileInfo.approver : null} appraiser={substitution ? substitution.userProfileInfo.appraiser : null} updateAppraiser={this.updateAppraiser.bind(this)} />
            <ApproverComponent errors={errors} updateApprover={this.updateApprover.bind(this)} approver={substitution ? substitution.userProfileInfo.approver : null} />
          </>
          : null
        }

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

        {this.errorWithoutItem("files")}

        {timesheets.filter(t => t.isEdited).length > 0 ? <ButtonComponent files={files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} disabledSubmitButton={disabledSubmitButton} /> : null}
      </div >
    )
  }
}

export default withTranslation()(SubstitutionComponent)
