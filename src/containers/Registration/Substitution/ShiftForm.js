import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'

const TIME_FORMAT = 'HH:mm:00'

class ShiftForm extends React.Component {

    updateTime(name, value) {
        this.props.updateTime(this.props.timesheet.index, name, moment(value).format(TIME_FORMAT))
    }

    render() {
        debugger
        return (
            <div className="shift-form mt-3">
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
                    </div>
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ShiftForm