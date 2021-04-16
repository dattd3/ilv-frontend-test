import React from 'react'
import moment from 'moment'
import { withTranslation  } from "react-i18next"

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class ShiftTable extends React.Component {

    updateShift(shift) {
        this.props.updateShift(this.props.timesheet.index, shift)
    }

    render() {
        const {t} = this.props;
        return (
            <div className="shift-table mt-3">
                <table className="table table-hover table-borderless table-striped">
                    <thead className="bg-primary text-white text-center">
                        <tr>
                            <th scope="col">{t("SelectShiftCode")}</th>
                            <th scope="col">{t("ShiftCode")}</th>
                            <th scope="col">{t("WorkHours")}</th>
                            <th scope="col">{t("StartTime")}</th>
                            <th scope="col">{t("Endtime")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.shifts.map((shift, index) => { //.filter(s => s.shift_id !== 'OFF')
                            return <tr className="text-center" key={index}>
                                <th scope="row">
                                    <div className="d-flex justify-content-center">
                                        <input className="form-check-input position-static" checked={shift.shift_id == this.props.timesheet.shiftId} onChange={this.updateShift.bind(this, shift)} type="radio" name={'shift' + this.props.timesheet.index} value={shift.shift_id}/>
                                    </div>
                                </th>
                                <td>{shift.shift_id}</td>
                                <td>{shift.hours}</td>
                                <td>{shift.from_time.replace("#", "") ? moment(shift.from_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : ""}</td>
                                <td>{shift.to_time.replace("#", "") ? moment(shift.to_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : ""}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default withTranslation()(ShiftTable)