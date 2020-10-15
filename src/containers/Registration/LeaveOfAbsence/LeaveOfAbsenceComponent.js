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
import _ from 'lodash'

registerLocale("vi", vi)

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            id: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
            totalTime: 2,
            absenceType: null,
            note: null,
            approver: null,
            annualLeaveSummary: null,
            files: [],
            errors: {},
            isEdit: true
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

        const thisYear = new Date().getFullYear()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/leaveofabsence?current_year=${thisYear}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    const annualLeaveSummary = res.data.data
                    this.setState({ annualLeaveSummary: annualLeaveSummary })
                }
            }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
            })

        if (this.props.leaveOfAbsence) {
            this.setState({
                isEdit: true,
                id: this.props.leaveOfAbsence.id,
                startDate: moment(this.props.leaveOfAbsence.userProfileInfo.startDate).toDate(),
                startTime: moment(this.props.leaveOfAbsence.userProfileInfo.startTime).toDate(),
                endDate: moment(this.props.leaveOfAbsence.userProfileInfo.endDate).toDate(),
                endTime: moment(this.props.leaveOfAbsence.userProfileInfo.endTime).toDate(),
                totalTime: this.props.leaveOfAbsence.userProfileInfo.totalTime,
                absenceType: this.props.leaveOfAbsence.userProfileInfo.absenceType,
                note: this.props.leaveOfAbsence.comment,
                approver: this.props.leaveOfAbsence.userProfileInfo.approver
            })
        }
    }

    setStartDate(startDate) {
        this.setState({
            startDate: startDate,
            endDate: this.state.endDate === undefined || startDate > this.state.endDate ? startDate : this.state.endDate
        })
    }

    setStartTime(startTime) {
        this.setState({
            startTime: startTime,
            endTime: this.state.endTime === undefined || startTime > this.state.endTime ? startTime : this.state.endTime
        })
    }

    setEndTime(endTime) {
        this.setState({
            endTime: endTime
        })
    }

    setEndDate(endDate) {
        this.setState({
            endDate: endDate
        })
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
            endDate: this.state.startDate,
            endTime: this.state.endTime,
            absenceType: this.state.absenceType,
            approver: this.state.approver,
            totalTime: this.state.totalTime,
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

    render() {
        const thisYear = new Date().getFullYear()

        const unusedAnnualLeaveOfThisYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_annual_leave ? this.state.annualLeaveSummary.unused_annual_leave.find(a => a.year == thisYear) : undefined
        const unusedAnnualLeaveOfLastYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_annual_leave ? this.state.annualLeaveSummary.unused_annual_leave.find(a => a.year == (thisYear - 1)) : undefined
        const unusedCompensatoryLeaveOfThisYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_compensatory_leave ? this.state.annualLeaveSummary.unused_compensatory_leave.find(a => a.year == thisYear) : undefined
        const unusedCompensatoryLeaveOfLastYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_compensatory_leave ? this.state.annualLeaveSummary.unused_compensatory_leave.find(a => a.year == (thisYear - 1)) : undefined

        const absenceTypes = [
            { value: 'IN01', label: 'Nghỉ ốm' },
            { value: 'IN02', label: 'Nghỉ thai sản' },
            { value: 'IN03', label: 'Nghỉ dưỡng sức (ốm, TS )' },
            { value: 'PN01', label: 'Nghỉ lễ người nước ngoài' },
            { value: 'PN02', label: 'Nghỉ nuôi con dưới 1 tuổi' },
            { value: 'PN03', label: 'Nghỉ việc riêng(hiếu, hỉ)' },
            { value: 'PN04', label: 'Nghỉ tai nạn lao động/BNN' },
            { value: 'PN05', label: 'Nghỉ ngừng việc do cty' },
            { value: 'PN06', label: 'Nghỉ việc do thỏa thuận' },
            { value: 'PQ01', label: 'Nghỉ phép năm' },
            { value: 'PQ02', label: 'Nghỉ bù (Nếu có)' },
            { value: 'PQ03', label: 'Nghỉ bù tạm ứng' },
            { value: 'PQ04', label: 'Nghỉ phép năm tạm ứng' },
            { value: 'PQ05', label: 'Nghỉ bù trực MOD' },
            { value: 'UN01', label: 'Nghỉ không lương' },
            { value: 'UN02', label: 'Nghỉ không phép' },
            { value: 'UN03', label: 'Nghỉ ngừng việc do NLĐ' },
        ]
        return (
            <div className="leave-of-absence">
                <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal}/>
                <div className="row summary">
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tồn</div>
                            <div className="result text-danger">{unusedAnnualLeaveOfLastYear ? unusedAnnualLeaveOfLastYear.days : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép năm</div>
                            <div className="result text-danger">{unusedAnnualLeaveOfThisYear ? unusedAnnualLeaveOfThisYear.days : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Ngày phép tạm ứng</div>
                            <div className="result text-danger">0</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ bù tồn</div>
                            <div className="result text-danger">{unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.days * 8 : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù</div>
                            <div className="result text-danger">{unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.days * 8 : 0}</div>
                        </div>
                    </div>
                </div>

                <div className="box shadow">
                    <div className="form">
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
                                    <div className="col">
                                        <div className="content input-container">
                                            <label>
                                                <DatePicker
                                                    selected={this.state.startTime}
                                                    onChange={this.setStartTime.bind(this)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
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
                                                    selected={this.state.endDate}
                                                    startDate={this.state.startDate}
                                                    endDate={this.state.endDate}
                                                    minDate={this.state.startDate}
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
                                                    selected={this.state.endTime}
                                                    onChange={this.setEndTime.bind(this)}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Giờ"
                                                    dateFormat="h:mm aa"
                                                    placeholderText="Lựa chọn"
                                                    className="form-control input"
                                                />
                                                <span className="input-group-addon input-img text-warning"><i className="fa fa-clock-o"></i></span>
                                            </label>
                                        </div>
                                        {this.error('startTime')}
                                    </div>
                                </div>

                            </div>

                            <div className="col-2">
                                <p className="title">Tổng thời gian nghỉ</p>
                                <div>
                                    <input type="text" class="form-control" value="2 ngày" readOnly />
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

                                <p className="title">Thông tin nghỉ</p>
                                <div>
                                    <Select name="absenceType" value={this.state.absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} placeholder="Lựa chọn" key="absenceType" options={absenceTypes} />
                                </div>
                            </div>

                            <div className="col-7">
                                <p className="title">Lý do đăng ký nghỉ phép</p>
                                <div>
                                    <textarea class="form-control" value={this.state.note} name="note" placeholder="Nhập lý do" rows="5" onChange={this.handleInputChange.bind(this)}></textarea>
                                </div>
                                {this.error('note')}
                            </div>
                        </div>
                    </div>

                </div>

                <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} approver={this.props.leaveOfAbsence ? this.props.leaveOfAbsence.userProfileInfo.approver : null} />
                <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
            </div>
        )
    }
}
export default LeaveOfAbsenceComponent