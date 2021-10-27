import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import RequesterDetailComponent from '../RequesterDetailComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval } from "../../../commons/Utils"

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

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatus[20].label : Constants.mappingStatus[status].label
  }
  render() {
    const { t, businessTrip, action } = this.props
    const requestInfo = businessTrip.requestInfo[0]
    const requestTypeId = businessTrip.requestTypeId
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = (requestInfo.processStatusId === Constants.STATUS_WAITING) || (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))

    return (
      <div className="business-trip">
        <h5>{t("EmployeeInfomation")}</h5>
        <RequesterDetailComponent user={businessTrip.user} />
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>{Constants.mappingActionType[requestInfo.actionType].TitleTripAndTrainning}</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-xl-4">
              {t("StartDateTime")}
              <div className="detail">{moment(requestInfo?.startDate).format('DD/MM/YYYY') + (requestInfo?.startTime ? ' ' + moment(requestInfo?.startTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-xl-4">
              {t("EndDateTime")}
              <div className="detail">{moment(requestInfo?.endDate).format('DD/MM/YYYY') + (requestInfo?.endTime ? ' ' + moment(requestInfo?.endTime, TIME_FORMAT).lang('en-us').format('HH:mm') : '')}</div>
            </div>
            <div className="col-xl-4">
              {t('TotalTimeForBizTripAndTraining')}
              {/* <div className="detail">{(businessTrip && requestInfo?.hours) ? ((requestInfo.isAllDay == FULL_DAY) ? requestInfo?.days + ' ' + t("Day") : requestInfo?.days + ' ' + t("Day") +' '+requestInfo?.hours + ' ' + t("Hour")) : null}</div> */}
              <div className="detail">{(businessTrip && requestInfo?.days >=1) ? requestInfo?.days + ' ' + t("Day") : requestInfo?.hours + ' ' + t("Hour")}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-4">
              {t('TypeOfBizTripAndTraining')}
              <div className="detail">{requestInfo.attendanceType?.label}</div>
            </div>
            <div className="col-xl-4">
              {t('Location')}
              <div className="detail">{requestInfo.location && requestInfo.location?.label}</div>
            </div>
            <div className="col-xl-4">
              {t('MeansOfTransportation')}
              <div className="detail">{requestInfo.vehicle && requestInfo.vehicle.label}</div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {Constants.mappingActionType[requestInfo.actionType].ReasonTripAndTrainning}
              <div className="detail">{requestInfo.comment}</div>
            </div>
          </div>
        </div>
        {
          requestInfo && (Constants.STATUS_TO_SHOW_CONSENTER.includes(requestInfo.processStatusId)) ? 
          <>
            <h5>{t("ConsenterInformation")}</h5>
            <ApproverDetailComponent title={t("Consenter")} approver={businessTrip.appraiser} status={requestInfo ? requestInfo.processStatusId : ""} hrComment={requestInfo.appraiserComment} />
          </>
          : null
        }
        {
          this.getTypeDetail() === "request" || Constants.STATUS_TO_SHOW_APPROVER.includes(requestInfo.processStatusId)?
          <>
            <h5>{t("ApproverInformation")}</h5>
            <ApproverDetailComponent title={t("Approver")} approver={businessTrip.approver} status={requestInfo.processStatusId} hrComment={requestInfo.approverComment} />
          </> : null
        }

        {
          businessTrip.requestDocuments.length > 0 ?
          <>
            <h5>{t("Evidence")}</h5>
            <ul className="list-inline">
              {
                businessTrip.requestDocuments.map((file, index) => {
                  return (
                    <li className="list-inline-item" key={index}>
                      <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
                    </li>
                  )
                })
              }
            </ul>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[requestInfo.processStatusId].className}`}>{t(this.showStatus(requestInfo.processStatusId, businessTrip.appraiser))}</span>
        </div>
        {
          requestInfo
          && (requestInfo.processStatusId === 8 || (action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2 
              || (action === "approval" && requestInfo.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(requestTypeId))) 
          ? 
          <DetailButtonComponent 
            dataToSap={[{
              "id": businessTrip.id,
              "requestTypeId": Constants.BUSINESS_TRIP,
              "sub": [
                {
                  "id": requestInfo.id,
                }
              ]
            }]}
            isShowRevocationOfApproval={requestInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
            isShowApproval={isShowApproval}
            isShowConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && businessTrip.appraiser}
            id={businessTrip.id}
            urlName={'requestattendance'}
            requestTypeId={requestTypeId}
            action={action}
          /> 
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(BusinessTripDetailComponent)
