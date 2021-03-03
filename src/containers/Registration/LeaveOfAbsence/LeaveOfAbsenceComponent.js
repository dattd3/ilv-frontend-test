import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import ResultModal from '../ResultModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _, { startsWith } from 'lodash'
import Constants from '../../../commons/Constants'

registerLocale("vi", vi)

const FULL_DAY = 1
const DURING_THE_DAY = 2

const absenceTypesAndDaysOffMapping = {
    1: {day: 3, time: 24},
    2: {day: 1, time: 8},
    3: {day: 3, time: 24}
}

const ANNUAL_LEAVE_KEY = "PQ01"
const COMPENSATORY_LEAVE_KEY = "PQ02"
const ADVANCE_COMPENSATORY_LEAVE_KEY = "PQ03"
const ADVANCE_ABSENCE_LEAVE_KEY = "PQ04"
const MATERNITY_LEAVE_KEY = "IN02"

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            totalDays: "",
            totalTimes: "",
            absenceType: null,
            leaveType: FULL_DAY,
            note: null,
            approver: null,
            annualLeaveSummary: null,
            pn03: null,
            files: [],
            isUpdateFiles: false,
            errors: {},
            isEdit: false,
            titleModal: "",
            messageModal: ""
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

        axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/inbound/user/currentabsence`, {
            perno: localStorage.getItem('employeeNo'),
            date: moment().format('YYYYMMDD')
        }, config)
        .then(res => {
            if (res && res.data) {
                const annualLeaveSummary = res.data.data
                this.setState({ annualLeaveSummary: annualLeaveSummary })
            }
        }).catch(error => {
        })

        if (this.props.leaveOfAbsence) {
            this.setState({
                isEdit: true,
                id: this.props.leaveOfAbsence.id,
                startDate: this.props.leaveOfAbsence.userProfileInfo.startDate,
                startTime: this.props.leaveOfAbsence.userProfileInfo.startTime,
                endDate: this.props.leaveOfAbsence.userProfileInfo.endDate,
                endTime: this.props.leaveOfAbsence.userProfileInfo.endTime,
                totalTimes: this.props.leaveOfAbsence.userProfileInfo.totalTimes,
                absenceType: this.props.leaveOfAbsence.userProfileInfo.absenceType,
                leaveType: this.props.leaveOfAbsence.userProfileInfo.leaveType,
                pn03: this.props.leaveOfAbsence.userProfileInfo.pn03,
                note: this.props.leaveOfAbsence.comment,
                approver: this.props.leaveOfAbsence.userProfileInfo.approver,
                files: this.props.leaveOfAbsence.userProfileInfoDocuments.map(file => {
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
        const start = moment(startDate).isValid() ? moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : null
        const end = this.state.endDate === undefined || (moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) > this.state.endDate) 
        || this.state.leaveType === DURING_THE_DAY ? moment(startDate).isValid() && moment(startDate).format(Constants.LEAVE_DATE_FORMAT) : this.state.endDate
        this.setState({
            startDate: start,
            endDate: end
        })
        this.calculateTotalTime(start, end)
    }

    setStartTime(startTime) {
        const start = moment(startTime).isValid() ? moment(startTime).format(Constants.LEAVE_TIME_FORMAT) : null
        const endTime = this.state.endTime
        const startTimeToSave = moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
        let end = endTime

        if (end === undefined || (moment(startTime).isValid() && moment(startTimeToSave, Constants.LEAVE_TIME_FORMAT) > moment(endTime, Constants.LEAVE_TIME_FORMAT))) {
            end = moment(startTime).isValid() && moment(startTime).format(Constants.LEAVE_TIME_FORMAT)
        }

        if ((moment(startTime).isValid() && moment(startTimeToSave, "HH:mm") >= moment("16:00", Constants.LEAVE_TIME_FORMAT)) 
            && (moment(endTime, "HH:mm").isValid() && moment(endTime, "HH:mm") < moment("08:00", "HH:mm"))) {
            end = endTime
        }

        this.setState({
            startTime: start,
            endTime: end
        })
        this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
    }

    setEndTime(endTime) {
        const startTime = this.state.startTime
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
        this.setState({
            startTime: start,
            endTime: end
        })
        this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
    }

    setEndDate(endDate) {
        const start = this.state.leaveType === DURING_THE_DAY ? moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT) : this.state.startDate
        const end = moment(endDate).isValid() && moment(endDate).format(Constants.LEAVE_DATE_FORMAT)
        this.setState({
            startDate: start,
            endDate: end
        })
        this.calculateTotalTime(start, end)
    }

    calculateTotalTime(startDate, endDate, startTime = this.state.startTime, endTime = this.state.endTime) {
        if (this.state.leaveType === FULL_DAY && (!startDate || !endDate)) return
        if (this.state.leaveType === DURING_THE_DAY && (!startDate || !endDate || !startTime || !endTime)) return

        const absenceType = this.state.absenceType ? this.state.absenceType.value : ""
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        const start = moment(startDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString()
        const end = moment(endDate, Constants.LEAVE_DATE_FORMAT).format('YYYYMMDD').toString()

        axios.post(`${process.env.REACT_APP_REQUEST_URL}user/leave`, {
            perno: localStorage.getItem('employeeNo'),
            from_date: start,
            from_time: this.state.leaveType === FULL_DAY ? "" : moment(startTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
            to_date: end,
            to_time: this.state.leaveType === FULL_DAY ? "" : moment(endTime, Constants.LEAVE_TIME_FORMAT_TO_VALIDATION).format(Constants.LEAVE_TIME_FORMAT_TO_VALIDATION),
            leaveType: (absenceType === ANNUAL_LEAVE_KEY || absenceType === COMPENSATORY_LEAVE_KEY || absenceType === ADVANCE_COMPENSATORY_LEAVE_KEY || absenceType === ADVANCE_ABSENCE_LEAVE_KEY || absenceType === MATERNITY_LEAVE_KEY) ? absenceType : ""
        }, config)
        .then(res => {
            if (res && res.data) {
                const data = res.data
                if (data.data && data.result && data.result.code != Constants.API_ERROR_CODE) {
                    const errors = {...this.state.errors}
                    errors.totalDaysOff = data.data.hours === 0 ? "Tổng thời gian nghỉ phải khác 0" : null
                    this.setState({totalTimes: data.data.hours, totalDays: data.data.days, errors: errors})
                } else {
                    const errors = {...this.state.errors}
                    errors.totalDaysOff = data.result.message
                    this.setState({errors: errors, totalTimes: "", totalDays: ""})
                }
            }
        }).catch(error => {
            const errors = {...this.state.errors}
            errors.totalDaysOff = "Có lỗi xảy ra trong quá trình xác thực dữ liệu. Xin vui lòng nhập lại thông tin ngày/giờ nghỉ!"
            this.setState({errors: errors, totalTimes: "", totalDays: ""})
        })
    }

    calFullDay(timesheets) {
        const hours = timesheets.filter(timesheet => timesheet.shift_id !== 'OFF').reduce((accumulator, currentValue) => {
            return accumulator + parseFloat(currentValue.hours)
        }, 0)
        
        return hours ? (hours / 8) : 0
    }

    calDuringTheDay(timesheets, startTime, endTime) {
        if (!startTime || !endTime) return
        
        let startTimeSAP = moment(startTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT)
        let endTimeSAP = moment(endTime, Constants.LEAVE_TIME_FORMAT).format(Constants.TIME_OF_SAP_FORMAT)
        let hours = 0
  
        if ( timesheets.length > 0) {
            const timesheet = timesheets[0]
            const shiftIndex = ['1', '2']

            shiftIndex.forEach(index => {
                if (timesheet['from_time' + index] && endTimeSAP > timesheet['from_time'+ index] && startTimeSAP < timesheet['to_time'+ index]) {
                    
                    // correct time if startTime < from_time and endTime > to_time
                    startTimeSAP = startTimeSAP < timesheet['from_time'+ index] ? timesheet['from_time'+ index] : startTimeSAP
                    endTimeSAP = endTimeSAP > timesheet['to_time'+ index] ? timesheet['to_time'+ index] : endTimeSAP

                    // the startTime and the endTime are setted in the break time
                    startTimeSAP = startTimeSAP >= timesheet['break_from_time_'+ index] && startTimeSAP <= timesheet['break_to_time'+ index] ? timesheet['break_to_time'+ 1] : startTimeSAP
                    endTimeSAP = endTimeSAP >= timesheet['break_from_time_'+ index] && endTimeSAP <= timesheet['break_to_time'+ index] ? timesheet['break_from_time_'+ index] : endTimeSAP

                    // endtime < startime ex: starTime = 23:00:00 endTime = 06:00:00 
                    endTimeSAP = endTimeSAP < startTimeSAP ? moment(endTimeSAP, Constants.TIME_OF_SAP_FORMAT).add(1, 'days').format(Constants.TIME_OF_SAP_FORMAT) : endTimeSAP

                    const differenceInMs = moment(endTimeSAP, Constants.TIME_OF_SAP_FORMAT).diff(moment(startTimeSAP, Constants.TIME_OF_SAP_FORMAT))
                    hours = hours + Math.abs(moment.duration(differenceInMs).asHours())

                    if(startTimeSAP < timesheet['break_from_time_'+ index] && endTimeSAP > timesheet['break_to_time'+ index]) {
                        const differenceInMsBreakTime = moment(timesheet['break_to_time'+ index], Constants.TIME_OF_SAP_FORMAT).diff(moment(timesheet['break_from_time_'+ index], Constants.TIME_OF_SAP_FORMAT))
                        hours = hours - Math.abs(moment.duration(differenceInMsBreakTime).asHours())
                    }
                }
            })
        }
     
        return hours ? (hours / 8) : 0
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

    handleInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleSelectChange(name, value) {
        this.setState({ [name]: value }, () => {
            if (name === "absenceType") {
                this.calculateTotalTime(this.state.startDate, this.state.endDate, this.state.startTime, this.state.endTime)
            } else if (name === "pn03") {
                const errors = {...this.state.errors}
                if (this.state.pn03 && (this.state.leaveType == FULL_DAY && this.state.totalDays > absenceTypesAndDaysOffMapping[this.state.pn03.value].day)) {
                    const days = absenceTypesAndDaysOffMapping[this.state.pn03.value].day
                    errors['totalDaysOff'] = `Thời gian được đăng ký nghỉ tối đa là ${days} ngày`
                } else {
                    errors['totalDaysOff'] = null
                }
                this.setState({ errors: errors })
            }
        })
    }

    verifyInput() {
        const annualLeaveTotal = this.state.annualLeaveSummary ? this.state.annualLeaveSummary.DAY_LEA : 0
        let errors = {...this.state.errors}
        const requiredFields = ['note', 'startDate', 'endDate', 'absenceType', 'approver']
        requiredFields.forEach(name => {
            if (_.isNull(this.state[name]) || !this.state[name]) {
                errors[name] = '(Bắt buộc)'
            } else {
                if (name !== "approver") {
                    errors[name] = null
                }
            }
        })
        errors['pn03'] = (this.state.absenceType && this.state.absenceType.value === 'PN03' && _.isNull(this.state['pn03'])) ? '(Bắt buộc)' : null
        errors['startTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['startTime'])) ? '(Bắt buộc)' : null
        errors['endTime'] = (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['endTime'])) ? '(Bắt buộc)' : null

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
            startDate: this.state.startDate,
            startTime: this.state.startTime,
            endDate: this.state.endDate,
            endTime: this.state.endTime,
            absenceType: this.state.absenceType,
            leaveType: this.state.leaveType,
            approver: approver,
            totalTimes: this.state.totalTimes,
            totalDays: this.state.totalDays,
            pn03: this.state.absenceType.value === 'PN03' ? this.state.pn03 : null,
            user: {
                fullname: localStorage.getItem('fullName'),
                jobTitle: localStorage.getItem('jobTitle'),
                department: localStorage.getItem('department'),
                employeeNo: localStorage.getItem('employeeNo')
            }
        }

        let bodyFormData = new FormData();
        bodyFormData.append('Name', 'Đăng ký nghỉ')
        bodyFormData.append('RequestTypeId', '2')
        bodyFormData.append('Comment', this.state.note)
        bodyFormData.append('UserProfileInfo', JSON.stringify(data))
        bodyFormData.append('UpdateField', {})
        bodyFormData.append('Region', localStorage.getItem('region'))
        bodyFormData.append('IsUpdateFiles', this.state.isUpdateFiles)
        bodyFormData.append('UserProfileInfoToSap', {})
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
                this.showStatusModal("Thành công", "Yêu cầu của bạn đã được gửi đi!", true)
            }
        })
        .catch(response => {
            this.showStatusModal("Thông Báo", "Có lỗi xảy ra trong quá trình cập nhật thông tin!", false)
        })
    }

    error(name) {
        return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
    }

    showStatusModal = (title, message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, titleModal: title, messageModal: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false });
        window.location.reload();
    }

    updateLeaveType(leaveType) {
        if (leaveType !== this.state.leaveType) {
            this.setState({ leaveType: leaveType, startTime: null, endTime: null, startDate: null, endDate: null, totalTimes: null, totalDays: null })
        }
    }

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    getIsUpdateStatus = (status) => {
        this.setState({isUpdateFiles : status})
    }

    render() {
        let absenceTypes = [
            { value: 'IN01', label: 'Nghỉ ốm' },
            { value: MATERNITY_LEAVE_KEY, label: 'Nghỉ thai sản' },
            { value: 'IN03', label: 'Nghỉ dưỡng sức (ốm, TS )' },
            { value: 'PN01', label: 'Nghỉ lễ người nước ngoài' },
            { value: 'PN02', label: 'Nghỉ nuôi con dưới 1 tuổi' },
            { value: 'PN03', label: 'Nghỉ việc riêng(hiếu, hỉ)' },
            { value: 'PN04', label: 'Nghỉ tai nạn lao động/BNN' },
            { value: ANNUAL_LEAVE_KEY, label: 'Nghỉ phép năm' },
            { value: ADVANCE_ABSENCE_LEAVE_KEY, label: 'Nghỉ phép tạm ứng' },
            { value: COMPENSATORY_LEAVE_KEY, label: 'Nghỉ bù (Nếu có)' },
            // { value: ADVANCE_COMPENSATORY_LEAVE_KEY, label: 'Nghỉ bù tạm ứng' },
            { value: 'UN01', label: 'Nghỉ không lương' }
        ].filter(absenceType => (this.state.leaveType === FULL_DAY) || (absenceType.value !== 'IN01' && absenceType.value !== 'IN02' && absenceType.value !== 'IN03' && absenceType.value !== 'PN03'))
        const PN03List = [
            { value: '1', label: 'Bản thân Kết hôn' },
            { value: '2', label: 'Con kết hôn' },
            { value: '3', label: 'Bố đẻ, mẹ đẻ, bố vợ, mẹ vợ hoặc bố chồng, mẹ chồng mất; vợ chết hoặc chồng mất; con mất' },
        ]
        const annualLeaveSummary = this.state.annualLeaveSummary
        return (
            <div className="leave-of-absence">
                <ResultModal show={this.state.isShowStatusModal} title={this.state.titleModal} message={this.state.messageModal} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
                <div className="row summary">
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tồn</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_LEA_REMAIN, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép năm</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_LEA, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tạm ứng</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.DAY_ADV_LEA, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ bù tồn</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_TIME_OFF_REMAIN, 2) : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_COMP, 2) : 0}</div>
                        </div>
                    </div>
                    {/* <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù tạm ứng</div>
                            <div className="result text-danger">{annualLeaveSummary ? _.ceil(annualLeaveSummary.HOUR_ADV_COMP, 2) : 0}</div>
                        </div>
                    </div> */}
                </div>

                <div className="box shadow">
                    <div className="form">
                        <div className="row">
                            <div className="col-7">
                                <p className="text-uppercase"><b>Lựa chọn thời gian nghỉ</b></p>
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label onClick={this.updateLeaveType.bind(this, FULL_DAY)} className={this.state.leaveType === FULL_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                        Nghỉ cả ngày
                                    </label>
                                    <label onClick={this.updateLeaveType.bind(this, DURING_THE_DAY)} className={this.state.leaveType === DURING_THE_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                        Nghỉ theo giờ
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5">
                                <p className="title">Ngày/giờ bắt đầu</p>
                                <div className="row">
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    name="startDate"
                                                    selectsStart
                                                    autoComplete="off"
                                                    selected={this.state.startDate ? moment(this.state.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    startDate={this.state.startDate ? moment(this.state.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    endDate={this.state.endDate ? moment(this.state.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    onChange={this.setStartDate.bind(this)}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Lựa chọn"
                                                    locale="vi"
                                                    className="form-control input" />
                                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                            </label>
                                        </div>
                                        {this.state.errors.startDate ? this.error('startDate') : null}
                                    </div>
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    selected={this.state.startTime ? moment(this.state.startTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                    onChange={this.setStartTime.bind(this)}
                                                    autoComplete="off"
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="HH:mm"
                                                    timeFormat="HH:mm"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
                                                    disabled={this.state.leaveType == FULL_DAY ? true : false}
                                                />
                                            </label>
                                        </div>
                                        {this.state.errors.startTime ? this.error('startTime') : null}
                                    </div>
                                </div>
                            </div>

                            <div className="col-5">
                                <p className="title">Ngày/giờ kết thúc</p>
                                <div className="row">
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    name="endDate"
                                                    selectsEnd
                                                    autoComplete="off"
                                                    selected={this.state.endDate ? moment(this.state.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    startDate={this.state.startDate ? moment(this.state.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    endDate={this.state.endDate ? moment(this.state.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    minDate={this.state.startDate ? moment(this.state.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                                    onChange={this.setEndDate.bind(this)}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Lựa chọn"
                                                    locale="vi"
                                                    className="form-control input" />
                                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                            </label>
                                        </div>
                                        {this.state.errors.endDate ? this.error('endDate') : null}
                                    </div>
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    selected={this.state.endTime ? moment(this.state.endTime, Constants.LEAVE_TIME_FORMAT).toDate() : null}
                                                    onChange={this.setEndTime.bind(this)}
                                                    showTimeSelect
                                                    autoComplete="off"
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="HH:mm"
                                                    timeFormat="HH:mm"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
                                                    disabled={this.state.leaveType == FULL_DAY ? true : false}
                                                />
                                            </label>
                                        </div>
                                        {this.state.errors.endTime ? this.error('endTime') : null}
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <p className="title">Tổng thời gian nghỉ</p>
                                <div>
                                    <input type="text" className="form-control" value={this.state.leaveType == FULL_DAY ? (this.state.totalDays ? this.state.totalDays + ' ngày' : "") : (this.state.totalTimes != null ? this.state.totalTimes + ' giờ' : "")} readOnly />
                                </div>
                                {this.state.errors.totalDaysOff ? this.error('totalDaysOff') : null}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <p className="title">Loại nghỉ</p>
                                <div>
                                    <Select name="absenceType" value={this.state.absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} placeholder="Lựa chọn" key="absenceType" options={absenceTypes} />
                                </div>
                                {this.state.errors.absenceType ? this.error('absenceType') : null}

                                {this.state.absenceType && this.state.absenceType.value === 'PN03' ? <p className="title">Thông tin hiếu, hỉ</p> : null}
                                {this.state.absenceType && this.state.absenceType.value === 'PN03' ? <div>
                                    <Select name="PN03" value={this.state.pn03} onChange={pn03 => this.handleSelectChange('pn03', pn03)} placeholder="Lựa chọn" key="absenceType" options={PN03List} />
                                </div> : null}
                                {this.state.errors.pn03 ? this.error('pn03') : null}
                            </div>

                            <div className="col-7">
                                <p className="title">Lý do đăng ký nghỉ</p>
                                <div>
                                    <textarea className="form-control" value={this.state.note || ""} name="note" placeholder="Nhập lý do" rows="5" onChange={this.handleInputChange.bind(this)}></textarea>
                                </div>
                                {this.state.errors.note ? this.error('note') : null}
                            </div>
                        </div>
                    </div>
                </div>
                <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.leaveOfAbsence ? this.props.leaveOfAbsence.userProfileInfo.approver : null} />
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
                <ButtonComponent files={this.state.files} updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} isUpdateFiles={this.getIsUpdateStatus} />
            </div>
        )
    }
}

export default LeaveOfAbsenceComponent
