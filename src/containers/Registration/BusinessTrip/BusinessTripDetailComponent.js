import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'

const TIME_FORMAT = 'HH:mm'

class BusinessTripDetailComponent extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="business-trip">
        <h5>Thông tin CBNV đăng ký</h5>
        <RequesterDetailComponent user={this.props.businessTrip.userProfileInfo.user}/>

        <h5>Thông tin đăng ký nghỉ phép</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
              Từ ngày/giờ
              <div className="detail">{this.props.businessTrip.userProfileInfo.startDate + (this.props.businessTrip.userProfileInfo.startTime ? ' ' + moment(this.props.businessTrip.userProfileInfo.startTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Đến ngày/giờ
              <div className="detail">{this.props.businessTrip.userProfileInfo.endDate + (this.props.businessTrip.userProfileInfo.endTime ? ' ' + moment(this.props.businessTrip.userProfileInfo.endTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Tổng thời gian nghỉ
              <div className="detail">{this.props.businessTrip.userProfileInfo.totalTime ? this.props.businessTrip.userProfileInfo.totalTime + ' ngày' : null}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              Loại chuyến Công tác/Đào tạo
              <div className="detail">{this.props.businessTrip.userProfileInfo.attendanceQuotaType.label}</div>
            </div>
            <div className="col-4">
              Địa điểm
              <div className="detail">{this.props.businessTrip.userProfileInfo.place.label}</div>
            </div>
            <div className="col-4">
              Phương tiện
              <div className="detail">{this.props.businessTrip.userProfileInfo.vehicle.label}</div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              Lý do đăng ký nghỉ phép
              <div className="detail">{this.props.businessTrip.comment}</div>
            </div>
          </div>
        </div>

        <h5>Thông tin CBLĐ phê duyệt</h5>
        <ApproverDetailComponent approver={this.props.businessTrip.userProfileInfo.approver}/>

        <ul className="list-inline">
          {this.props.businessTrip.userProfileInfoDocuments.map((file, index) => {
            return <li className="list-inline-item" key={index}>
              <a className="file-name" href={file.fileUrl} title="file đính kèm" target="_blank">{file.fileName}</a>
            </li>
          })}
        </ul>

        <DetailButtonComponent />
      </div>
    )
  }
}
export default BusinessTripDetailComponent