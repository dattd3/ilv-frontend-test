import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import StatusModal from '../../../components/Common/StatusModal'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import _, { startsWith } from 'lodash'

registerLocale("vi", vi)

const FULL_DAY = 1
const DURING_THE_DAY = 2
const DATE_FORMAT = 'DD/MM/YYYY'
const TIME_FORMAT = 'HH:mm'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            totalTime: null,
            absenceType: null,
            leaveType: FULL_DAY,
            note: null,
            approver: null,
            annualLeaveSummary: null,
            pn03: null,
            files: [],
            errors: {},
            isEdit: false
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

        axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/currentabsence`, {
            perno: localStorage.getItem('employeeNo'),
            date: moment().format('YYYYMMDD')
        }, config)
            .then(res => {
                if (res && res.data && res.data.data) {
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
                totalTime: this.props.leaveOfAbsence.userProfileInfo.totalTime,
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
                        fileType: file.other,
                        fileUrl: file.Url
                    }
                }),
            })
        }
    }

    setStartDate(startDate) {
        const start = moment(startDate).format(DATE_FORMAT)
        const end = this.state.endDate === undefined || moment(startDate).format(DATE_FORMAT) > this.state.endDate || this.state.leaveType === DURING_THE_DAY ? moment(startDate).format(DATE_FORMAT) : this.state.endDate
        this.setState({
            startDate: start,
            endDate: end
        })

        this.calculateTotalTime(start, end)
    }

    setStartTime(startTime) {
        const start = moment(startTime).format(TIME_FORMAT)
        const end = this.state.endTime === undefined || moment(startTime).format(TIME_FORMAT) > this.state.endTime ? moment(startTime).format(TIME_FORMAT) : this.state.endTime
        this.setState({
            startTime: start,
            endTime: end
        })

        this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
    }

    setEndTime(endTime) {
        const start = this.state.startTime === undefined || moment(endTime).format(TIME_FORMAT) < this.state.startTime ? moment(endTime).format(TIME_FORMAT) : this.state.startTime
        const end = moment(endTime).format(TIME_FORMAT)
        this.setState({
            startTime: start,
            endTime: end
        })

        this.calculateTotalTime(this.state.startDate, this.state.endDate, start, end)
    }

    setEndDate(endDate) {
        const start = this.state.leaveType === DURING_THE_DAY ? moment(endDate).format(DATE_FORMAT) : this.state.startDate
        const end = moment(endDate).format(DATE_FORMAT)
        this.setState({
            startDate: start,
            endDate: end
        })

        this.calculateTotalTime(start, end)
    }

    calculateTotalTime(startDate, endDate, startTime = null, endTime = null) {
        if (!startDate || !endDate) return

        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        const start = moment(startDate, DATE_FORMAT).format('YYYYMMDD').toString()
        const end = moment(endDate, DATE_FORMAT).format('YYYYMMDD').toString()

        axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/user/timeoverview`, {
            perno: localStorage.getItem('employeeNo'),
            from_date: start,
            to_date: end
        } ,config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    this.setState({totalTime: this.state.leaveType === FULL_DAY ? this.calFullDay(res.data.data) : this.calDuringTheDay(res.data.data, startTime, endTime)})
                }
            }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
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
        
        let startTimeSAP = moment(startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT)
        let endTimeSAP = moment(endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT)
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

                    const differenceInMs = moment(endTimeSAP, TIME_OF_SAP_FORMAT).diff(moment(startTimeSAP, TIME_OF_SAP_FORMAT))
                    hours = hours + Math.abs(moment.duration(differenceInMs).asHours())

                    if(startTimeSAP < timesheet['break_from_time_'+ index] && endTimeSAP > timesheet['break_to_time'+ index]) {
                        const differenceInMsBreakTime = moment(timesheet['break_to_time'+ index], TIME_OF_SAP_FORMAT).diff(moment(timesheet['break_from_time_'+ index], TIME_OF_SAP_FORMAT))
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

    updateApprover(approver) {
        this.setState({ approver: approver })
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
        this.setState({ [name]: value })
    }

    verifyInput() {
        let errors = {}
        const RequiredFields = ['note', 'startDate', 'endDate', 'absenceType', 'approver']
        RequiredFields.forEach(name => {
            if (_.isNull(this.state[name])) {
                errors[name] = '(Bắt buộc)'
            }
        })

        if (this.state.absenceType && this.state.absenceType.value === 'PN03' && _.isNull(this.state['pn03'])) {
            errors['pn03'] = '(Bắt buộc)'
        }

        if (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['startTime'])) {
            errors['startTime'] = '(Bắt buộc)'
        }

        if (this.state.leaveType == DURING_THE_DAY && _.isNull(this.state['endTime'])) {
            errors['endTime'] = '(Bắt buộc)'
        }

        this.setState({ errors: errors })
        return errors
    }

    submit() {
        const errors = this.verifyInput()
        if (!_.isEmpty(errors)) {
            return
        }

        const data = {
            startDate: this.state.startDate,
            startTime: this.state.startTime,
            endDate: this.state.endDate,
            endTime: this.state.endTime,
            absenceType: this.state.absenceType,
            leaveType: this.state.leaveType,
            approver: this.state.approver,
            totalTime: this.state.totalTime,
            pn03: this.state.absenceType.value === 'PN03' ? this.state.pn03 : null,
            user: {
                fullname: localStorage.getItem('fullName'),
                jobTitle: localStorage.getItem('jobTitle'),
                department: localStorage.getItem('department'),
                employeeNo: localStorage.getItem('employeeNo')
            }
        }

        let bodyFormData = new FormData();
        bodyFormData.append('Name', 'Đăng ký nghỉ phép')
        bodyFormData.append('RequestTypeId', '2')
        bodyFormData.append('Comment', this.state.note)
        bodyFormData.append('UserProfileInfo', JSON.stringify(data))
        bodyFormData.append('UpdateField', {})
        bodyFormData.append('Region', localStorage.getItem('region'))
        bodyFormData.append('UserProfileInfoToSap', {})
        bodyFormData.append('UserManagerId', this.state.approver.userAccount)
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
                this.showStatusModal(`Cập nhập thành công!`, true)
            }
        })
        .catch(response => {
        })
    }

    error(name) {
        return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
    }

    showStatusModal = (message, isSuccess = false) => {
        this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
    }

    hideStatusModal = () => {
        this.setState({ isShowStatusModal: false });
    }

    updateLeaveType(leaveType) {
        if (leaveType !== this.state.leaveType) {
            this.setState({ leaveType: leaveType, startTime: null, endTime: null, startDate: null, endDate: null, totalTime: null })
        }
    }

    removeFile(index) {
        this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1)] })
    }

    render() {
        const absenceTypes = [
            { value: 'IN01', label: 'Nghỉ ốm' },
            { value: 'IN02', label: 'Nghỉ thai sản' },
            { value: 'IN03', label: 'Nghỉ dưỡng sức (ốm, TS )' },
            { value: 'PN01', label: 'Nghỉ lễ người nước ngoài' },
            { value: 'PN03', label: 'Nghỉ việc riêng(hiếu, hỉ)' },
            { value: 'PN04', label: 'Nghỉ tai nạn lao động/BNN' },
            { value: 'PQ01', label: 'Nghỉ phép năm' },
            { value: 'PQ02', label: 'Nghỉ bù (Nếu có)' },
            { value: 'PQ03', label: 'Nghỉ bù tạm ứng' },
            { value: 'PQ05', label: 'Nghỉ bù trực MOD' },
            { value: 'UN01', label: 'Nghỉ không lương' },
        ].filter(absenceType => (this.state.leaveType === FULL_DAY) || (absenceType.value !== 'IN01' && absenceType.value !== 'IN02' && absenceType.value !== 'IN03'))

        const PN03List = [
            { value: '1', label: 'Bản thân Kết hôn' },
            { value: '2', label: 'Con kết hôn' },
            { value: '3', label: 'Bố đẻ, mẹ đẻ, bố vợ, mẹ vợ hoặc bố chồng, mẹ chồng chết; vợ chết hoặc chồng chết; con chết' },
        ]

        return (
            <div className="leave-of-absence">
                <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
                <div className="row summary">
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tồn</div>
                            <div className="result text-danger">{this.state.annualLeaveSummary ? this.state.annualLeaveSummary.DAY_LEA_REMAIN : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép năm</div>
                            <div className="result text-danger">{this.state.annualLeaveSummary ? this.state.annualLeaveSummary.DAY_LEA : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tạm ứng</div>
                            <div className="result text-danger">{this.state.annualLeaveSummary ? this.state.annualLeaveSummary.DAY_ADV_LEA : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ bù tồn</div>
                            <div className="result text-danger">{this.state.annualLeaveSummary ? this.state.annualLeaveSummary.HOUR_TIME_OFF_REMAIN : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù</div>
                            <div className="result text-danger">{this.state.annualLeaveSummary ? this.state.annualLeaveSummary.HOUR_COMP : 0}</div>
                        </div>
                    </div>
                </div>

                <div className="box shadow">
                    <div className="form">
                        <div className="row">
                            <div className="col-7">
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label onClick={this.updateLeaveType.bind(this, FULL_DAY)} className={this.state.leaveType === FULL_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                        Nghỉ cả ngày
                                    </label>
                                    <label onClick={this.updateLeaveType.bind(this, DURING_THE_DAY)} className={this.state.leaveType === DURING_THE_DAY ? 'btn btn-outline-info active' : 'btn btn-outline-info'}>
                                        Nghỉ trong ngày
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
                                                    selected={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                                                    startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                                                    endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
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
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    selected={this.state.startTime ? moment(this.state.startTime, TIME_FORMAT).toDate() : null}
                                                    onChange={this.setStartTime.bind(this)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
                                                    disabled={this.state.leaveType == FULL_DAY ? true : false}
                                                />
                                                <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                                            </label>
                                        </div>
                                        {this.error('startTime')}
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
                                                    selected={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                                                    startDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                                                    endDate={this.state.endDate ? moment(this.state.endDate, DATE_FORMAT).toDate() : null}
                                                    minDate={this.state.startDate ? moment(this.state.startDate, DATE_FORMAT).toDate() : null}
                                                    onChange={this.setEndDate.bind(this)}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Lựa chọn"
                                                    locale="vi"
                                                    className="form-control input" />
                                                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                            </label>
                                        </div>
                                        {this.error('endDate')}
                                    </div>
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    selected={this.state.endTime ? moment(this.state.endTime, TIME_FORMAT).toDate() : null}
                                                    onChange={this.setEndTime.bind(this)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
                                                    disabled={this.state.leaveType == FULL_DAY ? true : false}
                                                />
                                                <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                                            </label>
                                        </div>
                                        {this.error('endTime')}
                                    </div>
                                </div>

                            </div>

                            <div className="col-2">
                                <p className="title">Tổng thời gian nghỉ</p>
                                <div>
                                    <input type="text" className="form-control" value={this.state.totalTime ? this.state.totalTime * 8 + ' giờ' : '0 giờ'} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-5">
                                <p className="title">Loại nghỉ</p>
                                <div>
                                    <Select name="absenceType" value={this.state.absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} placeholder="Lựa chọn" key="absenceType" options={absenceTypes} />
                                </div>
                                {this.error('absenceType')}

                                {this.state.absenceType && this.state.absenceType.value === 'PN03' ? <p className="title">Thông tin hiếu, hỉ</p> : null}
                                {this.state.absenceType && this.state.absenceType.value === 'PN03' ? <div>
                                    <Select name="PN03" value={this.state.pn03} onChange={pn03 => this.handleSelectChange('pn03', pn03)} placeholder="Lựa chọn" key="absenceType" options={PN03List} />
                                </div> : null}
                                {this.error('pn03')}
                            </div>

                            <div className="col-7">
                                <p className="title">Lý do đăng ký nghỉ phép</p>
                                <div>
                                    <textarea className="form-control" value={this.state.note} name="note" placeholder="Nhập lý do" rows="5" onChange={this.handleInputChange.bind(this)}></textarea>
                                </div>
                                {this.error('note')}
                            </div>
                        </div>
                    </div>

                </div>

                <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.leaveOfAbsence ? this.props.leaveOfAbsence.userProfileInfo.approver : null} />
                <ul className="list-inline">
                    {this.state.files.map((file, index) => {
                        return <li className="list-inline-item" key={index}>
                            <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
                        </li>
                    })}
                </ul>
                <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
            </div>
        )
    }
}
export default LeaveOfAbsenceComponent