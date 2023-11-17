import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import _ from 'lodash'
import { withTranslation  } from "react-i18next";
import IconClock from 'assets/img/icon/ic_clock.svg'

const TIME_FORMAT = 'HH:mm:00'

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
        const { timesheet, updateTime, resetValidation } = this.props
        const time = value && moment(value).isValid() ? value : null
        this.setState({[name]: time}, () => {
            this.calculateTotalTime()
        })
        updateTime(timesheet.index, name, moment(time).isValid() ? moment(time).format(TIME_FORMAT) : null)
        resetValidation(timesheet.index)
    }

    calculateTotalTime = () => {
        const { updateTotalHours, timesheet } = this.props
        const { startTime, endTime, startBreakTime, endBreakTime } = this.state
        let totalTime = ""

        const startTimePrepare = startTime ? moment(startTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const endTimePrepare = endTime ? moment(endTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const startBreakTimePrepare = startBreakTime ? moment(startBreakTime).format("DD/MM/YYYY HH:mm:ss") : ""
        const endBreakTimePrepare = endBreakTime ? moment(endBreakTime).format("DD/MM/YYYY HH:mm:ss") : ""

        if (startTimePrepare && endTimePrepare && moment(startTimePrepare, "DD/MM/YYYY HH:mm:ss") <= moment(endTimePrepare, "DD/MM/YYYY HH:mm:ss")) {
            if (!startBreakTimePrepare && !endBreakTimePrepare) {
                totalTime = this.getDuration(endTimePrepare, startTimePrepare)
            } else if (startBreakTimePrepare && !endBreakTimePrepare) {
                totalTime = ""
            } else if (!startBreakTimePrepare && endBreakTimePrepare) {
                totalTime = ""
            } else {
                if (moment(startBreakTimePrepare, "DD/MM/YYYY HH:mm:ss") >= moment(startTimePrepare, "DD/MM/YYYY HH:mm:ss") && moment(startBreakTimePrepare, "DD/MM/YYYY HH:mm:ss") <= moment(endTimePrepare, "DD/MM/YYYY HH:mm:ss") 
                    && moment(endBreakTimePrepare, "DD/MM/YYYY HH:mm:ss") >= moment(startTimePrepare, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTimePrepare, "DD/MM/YYYY HH:mm:ss") <= moment(endTimePrepare, "DD/MM/YYYY HH:mm:ss") 
                    && moment(startBreakTimePrepare, "DD/MM/YYYY HH:mm:ss") <= moment(endBreakTimePrepare, "DD/MM/YYYY HH:mm:ss")) {
                    totalTime = this.getRangeTimeForDuration(startTimePrepare, startBreakTimePrepare, endBreakTimePrepare, endTimePrepare)
                } else {
                    totalTime = ""
                }
            }
        } else {
            totalTime = this.calculateTotalTimeForThroughDay(startTimePrepare, endTimePrepare, startBreakTimePrepare, endBreakTimePrepare)
        }

        updateTotalHours(timesheet.index, totalTime)
        this.setState({totalTime: totalTime})
    }

    calculateTotalTimeForThroughDay = (startTime, endTime, startBreakTime, endBreakTime) => {
        let totalTime = ""
        if (startTime && endTime && moment(startTime, "DD/MM/YYYY HH:mm:ss") > moment(endTime, "DD/MM/YYYY HH:mm:ss")) {
            const endTimeAdditional = moment(endTime, "DD/MM/YYYY HH:mm:ss").add(1, 'days').format("DD/MM/YYYY HH:mm:ss")
            totalTime = this.getDuration(endTimeAdditional, startTime)
            if (moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") >= moment(startTime, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss")) {
                totalTime = this.getRangeTimeForDuration(startTime, startBreakTime, endBreakTime, endTime)
            } else if (moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") <= moment(endTime, "DD/MM/YYYY HH:mm:ss")) {
                const startBreakTimeAdditional = moment(startBreakTime, "DD/MM/YYYY HH:mm:ss").add(1, 'days').format("DD/MM/YYYY HH:mm:ss")
                totalTime = this.getRangeTimeForDuration(startTime, startBreakTimeAdditional, endBreakTime, endTime)
            } else if (moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") >= moment(startTime, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") >= moment(startTime, "DD/MM/YYYY HH:mm:ss")) {
                totalTime = this.getRangeTimeForDuration(startTime, startBreakTime, endBreakTime, endTimeAdditional)
            } else if (moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") < moment(startTime, "DD/MM/YYYY HH:mm:ss") && moment(startBreakTime, "DD/MM/YYYY HH:mm:ss") > moment(endTime, "DD/MM/YYYY HH:mm:ss")) {
                totalTime = ""
            } else if (moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") > moment(endTime, "DD/MM/YYYY HH:mm:ss") && moment(endBreakTime, "DD/MM/YYYY HH:mm:ss") < moment(startTime, "DD/MM/YYYY HH:mm:ss")) {
                totalTime = ""
            }
        }
        return totalTime
    }

    getRangeTimeForDuration = (start1, start2, end2, end1) => {
        const rangeFirst = this.getDuration(start2, start1)
        const rangeSecond = this.getDuration(end1, end2)
        const duration = moment.duration(rangeFirst).add(moment.duration(rangeSecond))
        const totalTime = moment.utc(duration.as('milliseconds')).format("HH:mm")
        return totalTime
    }

    getDuration = (end, start) => {
        const range = moment(end, "DD/MM/YYYY HH:mm:ss").diff(moment(start, "DD/MM/YYYY HH:mm:ss"))
        const duration = moment.duration(range);
        return Math.floor(duration.asHours()) + moment.utc(range).format(":mm");
    }

    error(index, name) {
        const { errors } = this.props
        return errors[name + index] ? <div className="text-danger validation-message">{errors[name + index]}</div> : null
    }

    render() {
        const { t, timesheet, isShowStartBreakTimeAndEndBreakTime } = this.props
        const { totalTime } = this.state

        return (
            <div className="shift-form mt-3">
                <div className="row">
                    <div className="col-5">
                        <div className="row">
                            <div className="col">
                                <p>{t("StartTime")} 1 - {t("Change2")}<span className="text-danger required">(*)</span></p>
                                <div className="content input-container">
                                    <label className="wrap-time-input">
                                        <DatePicker
                                            selected={timesheet.startTime && moment(timesheet.startTime, TIME_FORMAT).isValid() ? moment(timesheet.startTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'startTime')}
                                            autoComplete="off"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            locale="vi"
                                            timeIntervals={15}
                                            timeCaption={t("Hour")}
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm"
                                            placeholderText={t('option')}
                                            className="form-control input"
                                        />
                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                    </label>
                                </div>
                                {this.error(this.props.timesheet.index, 'startTime')}
                            </div>
                            <div className="col">
                                <p>{t("EndTime")} 1 - {t("Change2")}<span className="text-danger required">(*)</span></p>
                                <div className="content input-container">
                                    <label className="wrap-time-input">
                                        <DatePicker
                                            selected={timesheet.endTime && moment(timesheet.endTime, TIME_FORMAT).isValid() ? moment(timesheet.endTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'endTime')}
                                            autoComplete="off"
                                            locale="vi"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption={t("Hour")}
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm"
                                            placeholderText={t('option')}
                                            className="form-control input"
                                        />
                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                    </label>
                                </div>
                                {this.error(timesheet.index, 'endTime')}
                            </div>
                        </div>
                    </div>
                    <div className="col-7">
                        <div className="row">
                            <div className="col">
                                <p>{t("BreakStartTime")}{isShowStartBreakTimeAndEndBreakTime && <span className="text-danger required">(*)</span>}</p>
                                <div className="content input-container">
                                    <label className="wrap-time-input">
                                        <DatePicker
                                            selected={timesheet.startBreakTime && moment(timesheet.startBreakTime, TIME_FORMAT).isValid() ? moment(timesheet.startBreakTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'startBreakTime')}
                                            autoComplete="off"
                                            locale="vi"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption={t("Hour")}
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm"
                                            placeholderText={t('option')}
                                            className="form-control input"
                                        />
                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                    </label>
                                </div>
                                {this.error(timesheet.index, 'startBreakTime')}
                            </div>
                            <div className="col">
                                <p>{t("BreakEndTime")}{isShowStartBreakTimeAndEndBreakTime && <span className="text-danger required">(*)</span>}</p>
                                <div className="content input-container">
                                    <label className="wrap-time-input">
                                        <DatePicker
                                            selected={timesheet.endBreakTime && moment(timesheet.endBreakTime, TIME_FORMAT).isValid() ? moment(timesheet.endBreakTime, TIME_FORMAT).toDate() : null}
                                            onChange={this.updateTime.bind(this, 'endBreakTime')}
                                            autoComplete="off"
                                            locale="vi"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption={t("Hour")}
                                            dateFormat="HH:mm"
                                            timeFormat="HH:mm"
                                            placeholderText={t("Select")}
                                            className="form-control input"
                                        />
                                        <span className="input-group-addon input-img"><img src={IconClock} alt="Clock" /></span>
                                    </label>
                                </div>
                                {this.error(timesheet.index, 'endBreakTime')}
                            </div>
                            <div className="col">
                                <p>{t("TotalTimes")}</p>
                                <input type="text" className="form-control" value={totalTime || ""} readOnly />
                                {this.error(timesheet.index, 'totalHours')}
                            </div>
                        </div>
                        <div className="text-danger">
                            {this.error(timesheet.index, 'breakTime')}
                            { isShowStartBreakTimeAndEndBreakTime && <div className="text-danger validation-message">{t("OnlyShiftBreakTime")}</div> }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(ShiftForm)
