import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import _ from 'lodash'

const TIME_FORMAT = 'HH:mm:00'
// const BROKEN_SHIFT_OPTION_VALUE = "02"

class ShiftForm extends React.Component {
    constructor(props) {
        super();
        this.state = {
            startTime: null,
            endTime: null,
            startBreakTime: null,
            endBreakTime: null,
            totalTime: ""
        }
    }

    updateTime(name, value) {
        switch(name) {
            case "startTime":
                this.setState({startTime: value})
                break;
            case "endTime":
                this.setState({endTime: value})
                break;
            case "startBreakTime":
                this.setState({startBreakTime: value})
                break;
            case "endBreakTime":
                this.setState({endBreakTime: value})
                break;
        }
        this.props.updateTime(this.props.timesheet.index, name, moment(value).format(TIME_FORMAT))
        setTimeout(() => { this.calculateTotalTime() }, 0)
    }

    calculateTotalTime = () => {
        let totalTime = ""
        const startTime = this.state.startTime ? moment(this.state.startTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const endTime = this.state.endTime ? moment(this.state.endTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const startBreakTime = this.state.startBreakTime ? moment(this.state.startBreakTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const endBreakTime = this.state.endBreakTime ? moment(this.state.endBreakTime).format("DD/MM/YYYY HH:mm:ss") : ""

        if (startTime && endTime && moment(startTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss")) {
            if (!startBreakTime && !endBreakTime) {
                totalTime = this.getDuration(endTime, startTime)
            } else if (startBreakTime && !endBreakTime) {
                totalTime = this.getDuration(endTime, startTime)
            } else if (!startBreakTime && endBreakTime) {
                totalTime = this.getDuration(endTime, startTime)
            } else {
                if (moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") >= moment(startTime, "DD/MM/YYYY HH:mm:ss") && moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss") 
                    && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") >= moment(startTime, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss") 
                    && moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endBreakTime, "DD/MM/YYYY HH:mm:ss")) {
                    const rangeFirst = this.getDuration(startBreakTime, startTime)
                    const rangeSecond = this.getDuration(endTime, endBreakTime)
                    const duration = moment.duration(rangeFirst).add(moment.duration(rangeSecond))
                    totalTime = moment.utc(duration.as('milliseconds')).format("HH:mm")
                } else {
                    totalTime = this.getDuration(endTime, startTime)
                }
            }
        }
        this.props.updateTotalHours(totalTime)
        this.setState({totalTime: totalTime})
    }

    getDuration = (end, start) => {
        const range = moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))
        const duration = moment.duration(range);
        return Math.floor(duration.asHours()) + moment.utc(range).format(":mm");
    }

    error(index, name) {
        return this.props.errors[name + index] ? <div className="text-danger">{this.props.errors[name + index]}</div> : null
    }

    render() {
        return (
            <div className="shift-form mt-3">
                <div className="row">
                    <div className="col-5">
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
                                            locale="vi"
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
                                            locale="vi"
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
                        {/* <div>
                            <p>Lý do đăng ký thay đổi phân ca</p>
                            <textarea placeholder="Nhập lý do" value={this.props.timesheet.note || ""} onChange={this.updateNote.bind(this)} className="form-control" name="note" rows="4" />
                            {this.error(this.props.timesheet.index, 'note')}
                        </div> */}
                    </div>
                    <div className="col-7">
                        {/* <div>
                            <p className="title">Loại phân ca</p>
                            <div>
                                <Select name="substitutionType" value={substitutionTypeDefault} onChange={substitutionType => this.updateSubstitution(substitutionType)} placeholder="Lựa chọn" key="substitutionType" options={substitutionTypes} />
                            </div>
                            {this.error(this.props.timesheet.index, 'substitutionType')}
                        </div> */}

                            <div className="row">
                                <div className="col">
                                    {
                                    this.props.isShowStartBreakTimeAndEndBreakTime ?
                                    <>
                                    <p>Thời gian bắt đầu nghỉ ca</p>
                                    <div className="content input-container">
                                        <label>
                                            <DatePicker
                                                selected={this.props.timesheet.startBreakTime ? moment(this.props.timesheet.startBreakTime, TIME_FORMAT).toDate() : null}
                                                onChange={this.updateTime.bind(this, 'startBreakTime')}
                                                autoComplete="off"
                                                locale="vi"
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
                                    </>
                                    : null }
                                </div>
                                <div className="col">
                                    {
                                    this.props.isShowStartBreakTimeAndEndBreakTime ?
                                    <>
                                    <p>Thời gian kết thúc nghỉ ca</p>
                                    <div className="content input-container">
                                        <label>
                                            <DatePicker
                                                selected={this.props.timesheet.endBreakTime ? moment(this.props.timesheet.endBreakTime, TIME_FORMAT).toDate() : null}
                                                onChange={this.updateTime.bind(this, 'endBreakTime')}
                                                autoComplete="off"
                                                locale="vi"
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
                                    </>
                                    : null }
                                </div>
                                <div className="col">
                                    <p>Tổng thời gian</p>
                                    <input type="text" className="form-control" value={this.state.totalTime || ""} readOnly />
                                    {this.error(this.props.timesheet.index, 'totalHours')}
                                </div>
                            </div>
                            {
                            this.props.isShowStartBreakTimeAndEndBreakTime ?
                            <div className="text-danger">
                                <p>(*) Chỉ nhập khi làm ca gãy, giờ nghỉ giữa ca không hưởng lương</p>
                                {this.error(this.props.timesheet.index, 'breakTime')}
                            </div>
                            : null }
                    </div>
                </div>
            </div>
        )
    }
}

export default ShiftForm
