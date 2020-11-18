import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'DD/MM/YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const FULL_DAY = 1

class BusinessTripDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false
    }
  }

  showStatusModal = (message, isSuccess = false) => {
    this.setState({ isShowStatusModal: true, content: message, isSuccess: isSuccess });
  }

  hideStatusModal = () => {
    this.setState({ isShowStatusModal: false });
  }

  render() {
    const businessTrip = this.props.businessTrip
    const requestTypeId = this.props.businessTrip.requestTypeId

    return (
      <div className="business-trip">
        <h5>Thông tin CBNV đăng ký</h5>
        <RequesterDetailComponent user={businessTrip.userProfileInfo.user} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký Công tác/Đào tạo</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
              Từ ngày/giờ
              <div className="detail">{businessTrip.userProfileInfo.startDate + (businessTrip.userProfileInfo.startTime ? ' ' + moment(businessTrip.userProfileInfo.startTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Đến ngày/giờ
              <div className="detail">{businessTrip.userProfileInfo.endDate + (businessTrip.userProfileInfo.endTime ? ' ' + moment(businessTrip.userProfileInfo.endTime, TIME_FORMAT).lang('en-us').format('hh:mm A') : '')}</div>
            </div>
            <div className="col-4">
              Tổng thời gian CT/ĐT
              <div className="detail">{businessTrip && businessTrip.userProfileInfo.totalTime ? this.props.leaveOfAbsence && this.props.leaveOfAbsence.userProfileInfo.leaveType == FULL_DAY ? businessTrip.userProfileInfo.totalTime + ' ngày' : businessTrip && businessTrip.userProfileInfo.totalTime* 8 + ' giờ' : null}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              Loại chuyến Công tác/Đào tạo
              <div className="detail">{businessTrip.userProfileInfo.attendanceQuotaType.label}</div>
            </div>
            <div className="col-4">
              Địa điểm
              <div className="detail">{businessTrip.userProfileInfo.place && businessTrip.userProfileInfo.place.label}</div>
            </div>
            <div className="col-4">
              Phương tiện
              <div className="detail">{businessTrip.userProfileInfo.place && businessTrip.userProfileInfo.vehicle.label}</div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              Lý do đăng ký Công tác/Đào tạo
              <div className="detail">{businessTrip.comment}</div>
            </div>
          </div>
        </div>

        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[businessTrip.status].className}`}>{Constants.mappingStatus[businessTrip.status].label}</span>
          {
            businessTrip.status == Constants.STATUS_NOT_APPROVED ?
            <span className="hr-comments-block">Lý do không duyệt: <span className="hr-comments">{businessTrip.hrComment || ""}</span></span> : null
          }
        </div>

        {
          businessTrip.userProfileInfoDocuments.length > 0 ?
          <>
          <h5>Tài liệu chứng minh</h5>
          <ul className="list-inline">
            {businessTrip.userProfileInfoDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }

        {businessTrip.status === 0 || businessTrip.status === 2 ? <DetailButtonComponent 
        dataToSap={[{
          MYVP_ID: 'ATT' + '0'.repeat(9 - businessTrip.id.toString().length) + businessTrip.id,
          PERNR: businessTrip.userProfileInfo.user.employeeNo,
          BEGDA: moment(businessTrip.userProfileInfo.startDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          ENDDA: moment(businessTrip.userProfileInfo.endDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          SUBTY: businessTrip.userProfileInfo.attendanceQuotaType.value,
          BEGUZ: businessTrip.userProfileInfo.startTime ? moment(businessTrip.userProfileInfo.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          ENDUZ: businessTrip.userProfileInfo.endTime ? moment(businessTrip.userProfileInfo.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          ACTIO: 'INS'
        }]}
        isShowRevocationOfApproval={businessTrip.status === 2}
        id={businessTrip.id}
        urlName={'requestattendance'}
        requestTypeId={requestTypeId}
        /> : null}
      </div>
    )
  }
}

export default BusinessTripDetailComponent
