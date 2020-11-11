import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

const TIME_FORMAT = 'HH:mm:00'

class ShiftForm extends React.Component {
    constructor(props) {
        super();
        this.state = {

        }
    }

    updateTime(name, value) {
        this.props.updateTime(this.props.timesheet.index, name, moment(value).format(TIME_FORMAT))
    }

    error(index, name) {
        return this.props.errors[name + index] ? <div className="text-danger">{this.props.errors[name + index]}</div> : null
    }

    updateNote(e) {
        this.props.updateNote(this.props.timesheet.index, e.currentTarget.value)
    }

    render() {
        const substitutionTypes = [
            { value: '01', label: 'Phân ca làm việc' },
            { value: '02', label: 'Phân ca gãy' },
            { value: '03', label: 'Phân ca bờ đảo full ngày' }
        ]

        return (
            <div className="shift-form mt-3">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            <div className="col">
                                <p>Bắt đầu 1 - Thay đổi</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selected={this.props.timesheet.startTime ? moment(this.props.timesheet.startTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'startTime')}
                                            autoComplete="off"
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
                                {this.error(this.props.timesheet.index, 'startTime')}
                            </div>
                            <div className="col">
                                <p>Kết thúc 1 - Thay đổi</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selected={this.props.timesheet.endTime ? moment(this.props.timesheet.endTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'endTime')}
                                            autoComplete="off"
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
                                {this.error(this.props.timesheet.index, 'endTime')}
                            </div>
                        </div>
                        <div>
                            <p>Lý do đăng ký thay đổi phân ca</p>
                            <textarea placeholder="Nhập lý do" value={this.props.timesheet.note} onChange={this.updateNote.bind(this)} className="form-control" name="note" rows="4" />
                        </div>
                    </div>
                    <div className="col-6">
                        <div>
                            <p className="title">Loại phân ca</p>
                            <div>
                                <Select name="substitutionType" value={this.state.substitutionType} onChange={substitutionType => this.handleSelectChange(substitutionType)} placeholder="Lựa chọn" key="timeTotal" options={substitutionTypes} />
                            </div>
                            {this.error(this.props.timesheet.index, 'substitutionType')}
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>Thời gian bắt đầu nghỉ ca</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selected={this.props.timesheet.startBreakTime ? moment(this.props.timesheet.startBreakTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'startBreakTime')}
                                            autoComplete="off"
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
                                {this.error(this.props.timesheet.index, 'startBreakTime')}
                            </div>
                            <div className="col">
                                <p>Thời gian kết thúc nghỉ ca</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selected={this.props.timesheet.endBreakTime ? moment(this.props.timesheet.endBreakTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'endBreakTime')}
                                            autoComplete="off"
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
                                    {this.error(this.props.timesheet.index, 'endBreakTime')}
                                </div>
                            </div>
                        </div>
                        <div className="text-danger">
                            <p>*Chỉ nhập khi làm ca gãy, giờ nghỉ giữa ca không hưởng lương</p>
                            {this.error(this.props.timesheet.index, 'breakTime')}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShiftForm
