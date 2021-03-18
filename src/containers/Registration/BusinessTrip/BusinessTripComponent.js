import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
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
      startDate: null,
      startTime: null,
      endTime: null,
      endDate: null,
      totalTime: null,
      attendanceQuotaType: null,
      leaveType: FULL_DAY,
      vehicle: null,
      place: null,
      note: null,
      approver: null,
      files: [],
      isUpdateFiles: false,
      errors: {},
      titleModal: "",
      messageModal: "",
      isShowAddressAndVehicle: true,
      disabledSubmitButton : false
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

  setStartDate(startDate) {
    const start = moment(startDate).isValid() ? moment(startDate).format(DATE_FORMAT) : null
    const end = this.state.endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(DATE_FORMAT) > this.state.endDate)
      || this.state.leaveType === DURING_THE_DAY ? moment(startDate).isValid() && moment(startDate).format(DATE_FORMAT) : this.state.endDate
    this.setState({
      startDate: start,
      endDate: end
    })
    this.calculateTotalTime(start, end)
  }

  setStartTime(startTime) {
    const start = moment(startTime).isValid() ? moment(startTime).format(TIME_FORMAT) : null
    const end = this.state.endTime === undefined || (moment(startTime).isValid() && moment(startTime).format(TIME_FORMAT) > this.state.endTime) ? moment(startTime).isValid() && moment(startTime).format(TIME_FORMAT) : this.state.endTime
    this.setState({
      startTime: start,
      endTime: end
    })
    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
  }

  setEndTime(endTime) {
    const start = this.state.startTime === undefined || (moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT) < this.state.startTime) ? moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT) : this.state.startTime
    const end = moment(endTime).isValid() && moment(endTime).format(TIME_FORMAT)
    this.setState({
      startTime: start,
      endTime: end
    })
    this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
  }

  setEndDate(endDate) {
    const start = this.state.leaveType === DURING_THE_DAY ? moment(endDate).isValid() && moment(endDate).format(DATE_FORMAT) : this.state.startDate
    const end = moment(endDate).isValid() && moment(endDate).format(DATE_FORMAT)
    this.setState({
      startDate: start,
      endDate: end
    })
    this.calculateTotalTime(start, end)
  }

  calculateTotalTime(startDateInput, endDateInput, startTimeInput = null, endTimeInput = null) {
    if ((this.state.leaveType === FULL_DAY && (!startDateInput || !endDateInput))
      || (this.state.leaveType === DURING_THE_DAY && (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput))) {
      return false
    }

    const start = moment(startDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
    const end = moment(endDateInput, DATE_FORMAT).format('YYYYMMDD').toString()
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }

    this.validationFromDB(start, end, startTimeInput, endTimeInput)

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user/leave`, {
      perno: localStorage.getItem('employeeNo'),
      from_date: start,
      from_time: this.state.leaveType === FULL_DAY ? "" : moment(startTimeInput, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      to_date: end,
      to_time: this.state.leaveType === FULL_DAY ? "" : moment(endTimeInput, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
      leaveType: ""
    }, config)
      .then(res => {
        if (res && res.data) {
          const data = res.data
          const result = data.result
          if (data.data && result && result.code != Constants.API_ERROR_CODE) {
            this.setState({ totalTime: this.state.leaveType === FULL_DAY ? data.data.days : data.data.hours })
          } else {
            const errors = { ...this.state.errors }
            if (!_.isNull(result) && result.code == Constants.API_ERROR_CODE) {
              errors.startTimeAndEndTime = result.message
            } else {
              errors.startTimeAndEndTime = null
            }
            this.setState({ errors, errors })
          }
        }
      }).catch(error => {

      })
  }

  validationFromDB = (startDate, endDate, startTime = null, endTime = null) => {
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
          const errors = { ...this.state.errors }
          if (!_.isNull(data.result) && data.result.code == Constants.API_ERROR_CODE) {
            errors.startTimeAndEndTime = data.result.message
          } else {
            errors.startTimeAndEndTime = null
          }
          this.setState({ errors, errors })
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

  handleInputChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSelectChange(name, value) {
    if (name === "attendanceQuotaType" && value.value === TRAINING_OPTION_VALUE) {
      this.setState({ isShowAddressAndVehicle: false })
    } else {
      this.setState({ isShowAddressAndVehicle: true })
    }
    this.setState({ [name]: value })
  }

  verifyInput() {
    let errors = { ...this.state.errors }
    let requiredFields = ['note', 'startDate', 'endDate', 'attendanceQuotaType', 'approver', 'place', 'vehicle']
    if ((this.state.attendanceQuotaType && this.state.attendanceQuotaType.value === TRAINING_OPTION_VALUE) || ['V073'].includes(localStorage.getItem("companyCode"))) {
      requiredFields = ['note', 'startDate', 'endDate', 'attendanceQuotaType', 'approver']
    }
    requiredFields.forEach(name => {
      if (_.isNull(this.state[name]) || !this.state[name]) {
        errors[name] = this.props.t('Required')
      } else {
        if (name !== "approver") {
          errors[name] = null
        }
      }
    })
    errors['startTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['startTime'])) ? this.props.t('Required') : null
    errors['endTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['endTime'])) ? this.props.t('Required') : null
    this.setState({ errors: errors })
    return errors
  }

  setDisabledSubmitButton(status)
  {
    this.setState({disabledSubmitButton: status})
  }

  submit() {
    const { t } = this.props 
    this.setDisabledSubmitButton(true)
    const errors = this.verifyInput()
    const hasErrors = !Object.values(errors).every(item => item === null)
    if (hasErrors) {
      this.setDisabledSubmitButton(false)
      return
    }
    const approver = { ...this.state.approver }
    delete approver.avatar
    const data = {
      startDate: this.state.startDate,
      startTime: this.state.startTime,
      endDate: this.state.endDate,
      endTime: this.state.endTime,
      attendanceQuotaType: this.state.attendanceQuotaType,
      approver: approver,
      totalTime: this.state.totalTime,
      vehicle: this.state.vehicle,
      place: this.state.place,
      leaveType: this.state.leaveType,
      user: {
        fullname: localStorage.getItem('fullName'),
        jobTitle: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
        employeeNo: localStorage.getItem('employeeNo')
      }
    }

    let bodyFormData = new FormData();
    bodyFormData.append('Name', t("BizTrip_TrainingRequest"))
    bodyFormData.append('RequestTypeId', Constants.BUSINESS_TRIP)
    bodyFormData.append('Comment', this.state.note)
    bodyFormData.append('UserProfileInfo', JSON.stringify(data))
    bodyFormData.append('UpdateField', JSON.stringify({}))
    bodyFormData.append('Region', localStorage.getItem('region'))
    bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
    bodyFormData.append('UserProfileInfoToSap', JSON.stringify({}))
    bodyFormData.append('UserManagerId', approver ? approver.userAccount : "")
    bodyFormData.append('companyCode', localStorage.getItem("companyCode"))
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
          this.showStatusModal(this.props.t("Successful"), this.props.t("RequestSent"), true)
          this.setDisabledSubmitButton(false)
        }
      })
      .catch(response => {
        this.showStatusModal(this.props.t("Notification"), "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        this.setDisabledSubmitButton(false)
      })
  }

  error(name) {
    return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
  }

  showStatusModal = (title, message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
  };

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
    window.location.reload();
  }

  updateLeaveType(leaveType) {
    if (leaveType == this.state.leaveType) {
      return
    }
    this.setState({ leaveType: leaveType, startTime: null, endTime: null, startDate: null, endDate: null, totalTime: null })
  }

  removeFile(index) {
    this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
  }

  getIsUpdateStatus = (status) => {
    this.setState({ isUpdateFiles: status })
  }

  showTotalTime = () => {
    if (this.state.totalTime) {
      if (this.state.leaveType == FULL_DAY) {
        return this.state.totalTime + ' ' + this.props.t("Day")
      }
      return this.state.totalTime + ' ' + this.props.t("Hour")
    }
    return ""
  }

  render() {
    const {t} = this.props;
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
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-7">
                <p className="text-uppercase"><b>{t('BizTrip_TrainingTime')}</b></p>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label onClick={this.updateLeaveType.bind(this, FULL_DAY)} className={this.state.leaveType === FULL_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Cả ngày
                  </label>
                  <label onClick={this.updateLeaveType.bind(this, DURING_THE_DAY)} className={this.state.leaveType === DURING_THE_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                    Theo giờ
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <p className="title">{t('StartDateTime')}</p>
                <div className="row">
                  <div className="col-8">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          name="startDate"
                          selectsStart
                          autoComplete="off"
                          selected={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                          minDate = {['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, DATE_FORMAT).toDate() : null}
                          onChange={this.setStartDate.bind(this)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText= {t('Select')}
                          locale="vi"
                          className="form-control input" />
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                    {this.error('startDate')}
                  </div>
                  <div className="col-4">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          selected={this.state.startTime ? moment(this.state.startTime, TIME_FORMAT).toDate() : null}
                          onChange={this.setStartTime.bind(this)}
                          autoComplete="off"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          placeholderText={t('Select')}
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false} />
                      </label>
                    </div>
                    {this.error('startTime')}
                  </div>
                </div>
              </div>

              <div className="col-5">
                <p className="title">{t('EndDateTime')}</p>
                <div className="row">
                  <div className="col-8">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          name="endDate"
                          selectsEnd
                          autoComplete="off"
                          selected={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                          startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                          endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                          minDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : (['V030'].includes(localStorage.getItem('companyCode')) ? moment(new Date().getDate() - 1, Constants.LEAVE_DATE_FORMAT).toDate() : null)}
                          onChange={this.setEndDate.bind(this)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t('Select')}
                          locale="vi"
                          className="form-control input" />
                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                      </label>
                    </div>
                    {this.error('endDate')}
                  </div>
                  <div className="col-4">
                    <div className="content input-container">
                      <label>
                        <DatePicker
                          selected={this.state.endTime ? moment(this.state.endTime, TIME_FORMAT).toDate() : null}
                          onChange={this.setEndTime.bind(this)}
                          autoComplete="off"
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Giờ"
                          dateFormat="HH:mm"
                          timeFormat="HH:mm"
                          placeholderText={t('Select')}
                          className="form-control input"
                          disabled={this.state.leaveType == FULL_DAY ? true : false} />
                      </label>
                    </div>
                    {this.error('endTime')}
                  </div>
                </div>
              </div>

              <div className="col-2">
                <p className="title">Tổng thời gian</p>
                <div>
                  <input type="text" className="form-control" value={this.showTotalTime()} readOnly />
                </div>
              </div>
              <div className="col-12">{this.error('startTimeAndEndTime')}</div>
            </div>

            <div className="row">
              <div className="col-5">
                <p className="title">{t('TypeOfBizTripAndTraining')}</p>
                <div>
                  <Select name="attendanceQuotaType" value={this.state.attendanceQuotaType} onChange={attendanceQuotaType => this.handleSelectChange('attendanceQuotaType', attendanceQuotaType)} placeholder={t('Select')} key="attendanceQuotaType" options={attendanceQuotaTypes} />
                </div>

                {this.error('attendanceQuotaType')}
              </div>
              {
                this.state.isShowAddressAndVehicle && !['V073'].includes(localStorage.getItem("companyCode")) ?
                  <>
                    <div className="col-5">
                      <p className="title">{t('Location')}</p>
                      <div>
                        <Select name="place" value={this.state.place} onChange={place => this.handleSelectChange('place', place)} placeholder={t('Select')} key="place" options={places} />
                      </div>
                      {this.error('place')}
                    </div>
                    <div className="col-2">
                      <p className="title">{t('MeansOfTransportation')}</p>
                      <div>
                        <Select name="vehicle" value={this.state.vehicle} onChange={vehicle => this.handleSelectChange('vehicle', vehicle)} placeholder={t('Select')} key="vehicle" options={vehicles} />
                      </div>
                      {this.error('vehicle')}
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
                {this.error('note')}
              </div>
            </div>
          </div>
        </div>

        <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.businessTrip ? this.props.businessTrip.userProfileInfo.approver : null} />
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