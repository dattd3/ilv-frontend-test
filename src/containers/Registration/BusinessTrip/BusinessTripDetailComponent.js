import React from 'react'
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { withTranslation } from "react-i18next"

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

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
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
    const {t} = this.props
    return (
      <div className="business-trip">
        <h5>Thông tin CBNV đăng ký</h5>
        <RequesterDetailComponent user={businessTrip.user} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký Công tác/Đào tạo</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-4">
              {t("StartDateTime")}
              <div className="detail">{moment(businessTrip.requestInfo?.startDate).format('DD/MM/YYYY') + (businessTrip.requestInfo?.startTime ? ' ' + moment(businessTrip.requestInfo?.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-4">
              {t("EndDateTime")}
              <div className="detail">{moment(businessTrip.requestInfo?.endDate).format('DD/MM/YYYY') + (businessTrip.requestInfo?.endTime ? ' ' + moment(businessTrip.requestInfo?.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-4">
              {t('TotalTimeForBizTripAndTraining')}
              {/* <div className="detail">{(businessTrip && businessTrip.requestInfo?.hours) ? ((businessTrip.requestInfo.isAllDay == FULL_DAY) ? businessTrip.requestInfo?.days + ' ' + t("Day") : businessTrip.requestInfo?.days + ' ' + t("Day") +' '+businessTrip.requestInfo?.hours + ' ' + t("Hour")) : null}</div> */}
              <div className="detail">{(businessTrip && businessTrip.requestInfo?.days >=1) ? businessTrip.requestInfo?.days + ' ' + t("Day") : businessTrip.requestInfo?.hours + ' ' + t("Hour")}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              {t('TypeOfBizTripAndTraining')}
              <div className="detail">{businessTrip.requestInfo.attendanceType?.label}</div>
            </div>
            <div className="col-4">
              {t('Location')}
              <div className="detail">{businessTrip.requestInfo.location && businessTrip.requestInfo.location?.label}</div>
            </div>
            <div className="col-4">
              {t('MeansOfTransportation')}
              <div className="detail">{businessTrip.requestInfo.vehicle && businessTrip.requestInfo.vehicle.label}</div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {t('ReasonTripAndTrainning')}
              <div className="detail">{businessTrip.requestInfo.comment}</div>
            </div>
          </div>
        </div>
        {
          businessTrip.requestInfo && (Constants.STATUS_TO_SHOW_CONSENTER.includes(businessTrip.requestInfo.processStatusId)) ? 
          <>
            <h5>Thông tin CBQL thẩm định</h5>
            <ApproverDetailComponent title={t("Consenter")} approver={businessTrip.appraiser} status={businessTrip.requestInfo ? businessTrip.requestInfo.processStatusId : ""} hrComment={businessTrip.requestInfo.appraiserComment} />
          </>
          : null
        }
        {
          this.getTypeDetail() === "request" || Constants.STATUS_TO_SHOW_APPROVER.includes(businessTrip.requestInfo.processStatusId)?
          <>
          <h5>Thông tin phê duyệt</h5>
          <ApproverDetailComponent title={t("Approver")} approver={businessTrip.approver} status={businessTrip.requestInfo.processStatusId} hrComment={businessTrip.hrComment} />
          </> : null
        }

        {
          businessTrip.requestDocuments.length > 0 ?
          <>
          <h5>{t("Evidence")}</h5>
          <ul className="list-inline">
            {businessTrip.requestDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[businessTrip.requestInfo.processStatusId].className}`}>{(this.props.action == "consent" && businessTrip.requestInfo.processStatusId == 5 && businessTrip.appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[businessTrip.requestInfo.processStatusId].label)}</span>
        </div>
        {(businessTrip.requestInfo.processStatusId === 8 || (this.props.action != "consent" && businessTrip.requestInfo.processStatusId === 5) || businessTrip.requestInfo.processStatusId === 2) ? <DetailButtonComponent 
        dataToSap={[{
          // MYVP_ID: 'ATT' + '0'.repeat(9 - businessTrip.id.toString().length) + businessTrip.id,
          // PERNR: businessTrip.user.employeeNo,
          // BEGDA: moment(businessTrip.requestInfo.startDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          // ENDDA: moment(businessTrip.requestInfo.endDate, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
          // SUBTY: businessTrip.requestInfo.attendanceQuotaType.value,
          // BEGUZ: businessTrip.requestInfo.startTime ? moment(businessTrip.requestInfo.startTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          // ENDUZ: businessTrip.requestInfo.endTime ? moment(businessTrip.requestInfo.endTime, TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null,
          // ACTIO: 'INS'
          "id": businessTrip.id,
          "requestTypeId": Constants.BUSINESS_TRIP,
          "sub": [
            {
              "id": businessTrip.requestInfo.id,
            }
          ]
        }]}
        isShowRevocationOfApproval={businessTrip.requestInfo.processStatusId === 2}
        isShowRevocationOfConsent = {businessTrip.requestInfo.processStatusId === 2}
        id={businessTrip.id}
        urlName={'requestattendance'}
        requestTypeId={requestTypeId}
        action={this.props.action}
        /> : null}
      </div>
    )
  }
}

export default withTranslation()(BusinessTripDetailComponent)
