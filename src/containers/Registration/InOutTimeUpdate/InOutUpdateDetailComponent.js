import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'

class InOutUpdateDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
              Họ và tên
              <div className="detail">{this.props.inOutTimeUpdate.userProfileInfo.user.fullname}</div>
            </div>
            <div className="col-3">
              Mã nhân viên
              <div className="detail">{this.props.inOutTimeUpdate.userProfileInfo.user.employeeNo}</div>
            </div>
            <div className="col-3">
              Chức danh
              <div className="detail">{this.props.inOutTimeUpdate.userProfileInfo.user.jobTitle}</div>
            </div>
            <div className="col-3">
              Khối/Phòng/Bộ phận
              <div className="detail">{this.props.inOutTimeUpdate.userProfileInfo.user.department}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin đăng ký nghỉ phép</h5>
        {this.props.inOutTimeUpdate.userProfileInfo.timesheets.filter(t => t.isEdit).map((timesheet, index) => {
          return <div className="box shadow">
            <div className="col"><p><i className="fa fa-clock-o"></i> <b>Ngày {timesheet.date.replace(/-/g, '/')}</b></p></div>

            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ thực tế</p>
                  {timesheet.start_time1_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time1_fact ? timesheet.start_time1_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time1_fact ? timesheet.end_time1_fact : null}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time2_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time2_fact ? timesheet.start_time2_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time2_fact ? timesheet.end_time2_fact : null}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time3_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.start_time3_fact ? timesheet.start_time3_fact : null}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.end_time3_fact ? timesheet.end_time3_fact : null}</b>
                    </div>
                  </div> : null}
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">Giờ chỉnh sửa</p>
                  {timesheet.start_time1_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.startTime1Fact }</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.endTime1Fact}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time2_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.startTime2Fact}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.endTime2Fact}</b>
                    </div>
                  </div> : null}
                  {timesheet.start_time3_plan ? <div className="row">
                    <div className="col-6">
                      Bắt đầu: <b>{timesheet.startTime3Fact}</b>
                    </div>
                    <div className="col-6 text-right">
                      Kết thúc: <b>{timesheet.endTime3Fact}</b>
                    </div>
                  </div> : null}
                </div>
              </div>
            </div>

            <p>Lý do sửa giờ vào - ra</p>
            <div className="row">
              <div className="col">
                <div className="detail">{timesheet.note}</div>
              </div>
            </div>
          </div>
        })}

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.inOutTimeUpdate.userProfileInfo.approver} />

        <DetailButtonComponent />
      </div>
    )
  }
}
export default InOutUpdateDetailComponent