import React from "react"
import _ from 'lodash'

class TimesheetSummary extends React.Component {
  render() {
    return <div className="summary">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">TỔNG HỢP NGÀY CÔNG</div>
        <div className="card-body">
          <div className="row">
            <div className="col">
              <div className="title text-center">Công chuẩn</div>
            </div>
            <div className="col">
              <div className="title text-center">Công thực tế</div>
            </div>
            <div className="col">
              <div className="title text-center">Nghỉ có hưởng lương</div>
            </div>
            <div className="col">
              <div className="title text-center text-sm">Đào tạo/Công tác</div>
            </div>
            <div className="col">
              <div className="title text-center">Công nghỉ ngừng việc</div>
            </div>
            <div className="col">
              <div className="title text-center">Công không hưởng lương</div>
            </div>
            <div className="col">
              <div className="title text-center">Tổng OT sau quy đổi</div>
            </div>
            <div className="col">
              <div className="title text-center">Tổng công hưởng lương</div>
            </div>
          </div>

          {this.props.timsheetSummary ?
          <div className="row">
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.working_day_plan, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.actual_working, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.paid_leave, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(parseFloat(this.props.timsheetSummary.attendance || 0) + parseFloat(this.props.timsheetSummary.trainning || 0), 2) }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.working_deal, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.unpaid_leave, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.total_overtime, 2) || 0 }</div>
            </div>
            <div className="col">
              <div className="content text-center text-danger">{ _.ceil(this.props.timsheetSummary.salary_wh, 2) || 0 }</div>
            </div>
          </div> : null}
        </div>
      </div>
    </div>
  }
}

export default TimesheetSummary
