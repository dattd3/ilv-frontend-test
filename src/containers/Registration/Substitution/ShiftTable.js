import React from 'react'
import moment from 'moment'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class ShiftTable extends React.Component {

    updateShift(shift) {
        this.props.updateShift(this.props.timesheet.index, shift)
    }

    render() {
        return (
            <div className="shift-table mt-3">
                <table className="table table-hover table-borderless table-striped">
                    <thead className="bg-primary text-white text-center">
                        <tr>
                            <th scope="col">Lựa chọn mã ca</th>
                            <th scope="col">Mã ca</th>
                            <th scope="col">Giờ làm việc</th>
                            <th scope="col">Giờ bắt đầu</th>
                            <th scope="col">Giờ kết thúc</th>
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
                                <td>{shift.from_time.replace("#",'') ? moment(shift.from_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</td>
                                <td>{shift.to_time.replace("#",'') ? moment(shift.to_time, TIME_OF_SAP_FORMAT).format(TIME_FORMAT) : null}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default ShiftTable