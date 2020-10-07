import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'

registerLocale("vi", vi)

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            startDate: null,
            endDate: null,
            totalTime: null,
            absenceType: null,
            note: null,
            approver: null,
            annualLeaveSummary: null,
            files: [],
            errors: {}
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
        // const errors = this.verifyInput()
        // if (errors) {
        //     return
        // }

        let bodyFormData = new FormData();
        bodyFormData.append('Name', 'Đăng ký nghỉ phép')
        bodyFormData.append('RequestTypeId', '2')
        bodyFormData.append('Comment', this.state.note)
        bodyFormData.append('UserProfileInfo', {})
        bodyFormData.append('UpdateField', {})
        bodyFormData.append('Region', localStorage.getItem('region'))
        bodyFormData.append('UserProfileInfoToSap', {})
        this.state.files.forEach(file => {
            bodyFormData.append('Files', file)
        })

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories/register`,
            // data: bodyFormData,
            headers: {'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
          })
          .then(response => {
            if (response && response.data && response.data.result) {
              console.log(response.data)
            }
          })
          .catch(response => {
          })
    }

    error(name) {
        return this.state.errors[name] ? <p className="text-danger">{this.state.errors[name]}</p> : null
    }

    render() {
        const thisYear = new Date().getFullYear()
        // const usedAnnualLeaveOfThisYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.used_annual_leave ? this.state.annualLeaveSummary.used_annual_leave.find(a => a.year == thisYear) : undefined
        // const usedAnnualLeaveOfLastYear = this.state.annualLeaveSummary.used_annual_leave ? this.state.annualLeaveSummary.used_annual_leave.find(a => a.year == (thisYear - 1)) : undefined

        const unusedAnnualLeaveOfThisYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_annual_leave ? this.state.annualLeaveSummary.unused_annual_leave.find(a => a.year == thisYear) : undefined
        const unusedAnnualLeaveOfLastYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_annual_leave ? this.state.annualLeaveSummary.unused_annual_leave.find(a => a.year == (thisYear - 1)) : undefined

        // const usedCompensatoryLeaveOfThisYear = this.state.annualLeaveSummary.used_compensatory_leave ? this.state.annualLeaveSummary.used_compensatory_leave.find(a => a.year == thisYear) : undefined
        // const usedCompensatoryLeaveOfLastYear = this.state.annualLeaveSummary.used_compensatory_leave ? this.state.annualLeaveSummary.unused_annual_leave.find(a => a.year == (thisYear - 1)) : undefined

        const unusedCompensatoryLeaveOfThisYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_compensatory_leave ? this.state.annualLeaveSummary.unused_compensatory_leave.find(a => a.year == thisYear) : undefined
        const unusedCompensatoryLeaveOfLastYear = this.state.annualLeaveSummary && this.state.annualLeaveSummary.unused_compensatory_leave ? this.state.annualLeaveSummary.unused_compensatory_leave.find(a => a.year == (thisYear - 1)) : undefined
        const absenceTypes = [
            { value: 'IN01', label: 'Nghỉ ốm' },
            { value: 'IN02', label: 'Nghỉ thai sản' },
            { value: 'IN03', label: 'Nghỉ dưỡng sức (ốm, TS )' }
        ]
        return (
            <div className="leave-of-absence">
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
                            <div className="result text-danger">{unusedCompensatoryLeaveOfLastYear ? unusedCompensatoryLeaveOfLastYear.days*8 : 0}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="item">
                            <div className="title">Giờ nghỉ bù</div>
                            <div className="result text-danger">{unusedCompensatoryLeaveOfThisYear ? unusedCompensatoryLeaveOfThisYear.days*8 : 0}</div>
                        </div>
                    </div>
                </div>

                <div className="box shadow">
                    <div className="form">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">Ngày/giờ bắt đầu</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            name="startDate"
                                            selectsStart
                                            selected={this.state.startDate}
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            onChange={this.setStartDate.bind(this)}
                                            dateFormat="dd/MM/yyyy h:mm aa"
                                            placeholderText="Lựa chọn"
                                            locale="vi"
                                            showTimeSelect
                                            className="form-control input" />
                                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                    </label>
                                </div>
                                {this.error('startDate')}
                            </div>

                            <div className="col-4">
                                <p className="title">Ngày/giờ kết thúc</p>
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
                                            dateFormat="dd/MM/yyyy h:mm aa"
                                            placeholderText="Lựa chọn"
                                            locale="vi"
                                            showTimeSelect
                                            className="form-control input" />
                                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                    </label>
                                </div>
                                {this.error('endDate')}
                            </div>

                            <div className="col-4">
                                <p className="title">Tổng thời gian nghỉ</p>
                                <div>
                                    <input type="text" class="form-control" value="2 ngày" readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-4">
                                <p className="title">Loại nghỉ</p>
                                <div>
                                    <Select name="absenceType" value={this.state.absenceType} onChange={absenceType => this.handleSelectChange('absenceType', absenceType)} placeholder="Lựa chọn" key="absenceType" options={absenceTypes} />
                                </div>
                                {this.error('absenceType')}
                            </div>

                            <div className="col-8">
                                <p className="title">Lý do đăng ký nghỉ phép</p>
                                <div>
                                    <textarea class="form-control" value={this.state.note} name="note" placeholder="Nhập lý do" rows="3" onChange={this.handleInputChange.bind(this)}></textarea>
                                </div>
                                {this.error('note')}
                            </div>
                        </div>
                    </div>

                </div>

                <ApproverComponent errors={this.state.errors} updateApprover={this.updateApprover.bind(this)} />
                <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
            </div>
        )
    }
}
export default LeaveOfAbsenceComponent