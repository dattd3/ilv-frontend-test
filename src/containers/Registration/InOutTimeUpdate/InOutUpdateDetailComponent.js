import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import Constants from '../.../../../../commons/Constants'
import { getRequestTypeIdsAllowedToReApproval } from "../../../commons/Utils"

const TIME_FORMAT = 'HH:mm:ss'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'
const TIME_OF_SAP_FORMAT = 'HHmm00'

class InOutUpdateDetailComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
    }
  }

  getTypeDetail = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  dataToSap() {
    let dataToSAP = []
    this.props.inOutTimeUpdate.requestInfo.timesheet.filter(t => t.isEdit).forEach((timesheet, index) => {
      ['1', '2'].forEach(n => {
        const startTimeName = `start_time${n}_fact_update`
        const endTimeName = `end_time${n}_fact_update`
        const startTimeNameOld = `start_time${n}_fact`
        const endTimeNameOld = `end_time${n}_fact`
        const startPlanTimeName = `from_time${n}`
        const endPlanTimeName = `to_time${n}`
        if (!timesheet[startTimeName] && !timesheet[endTimeName]) return
        if (true) {
          let startTime = timesheet[startTimeName] ? moment(timesheet[startTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[startTimeNameOld]) ? moment(timesheet[startTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
          if (startTime) {
            dataToSAP.push({
              MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
              PERNR: this.props.inOutTimeUpdate.user.employeeNo,
              LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
              SATZA: 'P10',
              LTIME: startTime,
              DALLF: '+',
              ACTIO: 'INS'
            })
          }
        }

        if (true) {
          let endTime = timesheet[endTimeName] ? moment(timesheet[endTimeName], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : (!this.isNullCustomize(timesheet[endTimeNameOld]) ? moment(timesheet[endTimeNameOld], TIME_FORMAT).format(TIME_OF_SAP_FORMAT) : null)
          if (endTime) {
            dataToSAP.push({
              MYVP_ID: 'TEV' + '0'.repeat(7 - this.props.inOutTimeUpdate.id.toString().length) + this.props.inOutTimeUpdate.id + `${index}${n}`,
              PERNR: this.props.inOutTimeUpdate.user.employeeNo,
              LDATE: moment(timesheet.date, DATE_FORMAT).format(DATE_OF_SAP_FORMAT),
              SATZA: 'P20',
              LTIME: endTime,
              DALLF: endTime > timesheet[startPlanTimeName] ? '+' : '-',
              ACTIO: 'INS'
            })
          }
        }
      })
    })
    return dataToSAP
  }

  isNullCustomize = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? true : false
  }

  formatData = value => {
    return (value == null || value == "null" || value == "" || value == undefined || value == 0 || value == "#") ? "" : value
  }

  printTimeFormat = value => {
    return !this.isNullCustomize(value) && moment(this.formatData(value), "hhmmss").isValid() ? moment(this.formatData(value), "HHmmss").format("HH:mm:ss") : "" // pending by CuongNV56
  }

  showStatus = (status, appraiser) => {
    if (this.getTypeDetail() == 'request' && this.props.action == undefined) {
      return Constants.mappingStatusRequest[status].label;
    } 
    return (this.props.action == "consent" && status == 5 && appraiser) ? Constants.mappingStatusRequest[20].label : Constants.mappingStatusRequest[status].label
  }

  render() {
    const { t, action, inOutTimeUpdate } = this.props
    const requestTypeIdsAllowedToReApproval = getRequestTypeIdsAllowedToReApproval()
    const isShowApproval = (inOutTimeUpdate.processStatusId === Constants.STATUS_WAITING) || (action === "approval" && inOutTimeUpdate.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(inOutTimeUpdate.requestTypeId))
  
    let messageSAP = null;
    if (inOutTimeUpdate.processStatusId === Constants.STATUS_PARTIALLY_SUCCESSFUL)
    {
      if (inOutTimeUpdate.responseDataFromSAP && Array.isArray(inOutTimeUpdate.responseDataFromSAP)) {
        const data = inOutTimeUpdate.responseDataFromSAP.filter(val => val.STATUS === 'E');
        if (data) {
          const temp = data.map(val => val?.MESSAGE);
          messageSAP = temp.filter(function(item, pos) {
            return temp.indexOf(item) === pos;
          })
        }
      }
    }

    let isShowAppraisalInfo = false
    if (inOutTimeUpdate && inOutTimeUpdate.appraiser && Object.values(inOutTimeUpdate.appraiser).some(item => item !== null && item !== '')) {
      isShowAppraisalInfo = true
    }
    
    return (
      <div className="leave-of-absence">
        <h5>{t("EmployeeInfomation")}</h5>
        <div className="box shadow cbnv">
          <div className="row group">
            <div className="col-xl-3">
             {t("FullName")}
              <div className="detail auto-height">{inOutTimeUpdate.user.fullName}</div>
            </div>
            <div className="col-xl-3">
              {t("EmployeeNo")}
              <div className="detail auto-height">{inOutTimeUpdate.user.employeeNo}</div>
            </div>
            <div className="col-xl-3">
              {t("Title")}
              <div className="detail auto-height">{inOutTimeUpdate.user.jobTitle}</div>
            </div>
            <div className="col-xl-3">
              {t("DepartmentManage")}
              <div className="detail auto-height">{inOutTimeUpdate.user.department}</div>
            </div>
          </div>
        </div>
        <h5>{t("InOutChangeRequestInfo")}</h5>
        {inOutTimeUpdate.requestInfo.filter(t => t.isEdited).map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="col"><p><i className="fa fa-clock-o text-capitalize"></i> <b>{t("Day")} {moment(timesheet.date).format("DD/MM/YYYY")}</b></p></div>
            <div className="row">
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t('ActualTime')}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact)}</b>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="box-time">
                  <p className="text-center">{t("ChangedTime")}</p>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 1: <b>{this.printTimeFormat(timesheet.start_time1_fact_update)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 1: <b>{this.printTimeFormat(timesheet.end_time1_fact_update)}</b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      {t("Start")} 2: <b>{this.printTimeFormat(timesheet.start_time2_fact_update)}</b>
                    </div>
                    <div className="col-6 text-right">
                      {t("End")} 2: <b>{this.printTimeFormat(timesheet.end_time2_fact_update)}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p>{t('ReasonModifyInOut')}</p>
            <div className="row">
              <div className="col">
                <div className="detail">{timesheet.note || ""}</div>
              </div>
            </div>
          </div>
        })}
        {
          isShowAppraisalInfo &&
          <>
            <h5>{t("ConsenterInformation")}</h5>
            <ApproverDetailComponent title={t("Consenter")} approver={inOutTimeUpdate.appraiser} status={inOutTimeUpdate.requestInfo ? inOutTimeUpdate.processStatusId : ""} hrComment={inOutTimeUpdate.appraiserComment} />
          </>
        }
        
        {
          inOutTimeUpdate && (Constants.STATUS_TO_SHOW_APPROVER.includes(inOutTimeUpdate.processStatusId )) ?
            <>
              <h5>{t("ApproverInformation")}</h5>
              <ApproverDetailComponent title={t("Approver")} approver={inOutTimeUpdate.approver} status={inOutTimeUpdate.processStatusId} hrComment={inOutTimeUpdate.approverComment} />
            </> : null
            // <div className="block-status">
            //   <span className={`status ${Constants.mappingStatusRequest[this.props.inOutTimeUpdate.processStatusId].className}`}>{t(Constants.mappingStatusRequest[this.props.inOutTimeUpdate.processStatusId].label)}</span>
            //   {
            //     this.props.inOutTimeUpdate.requestInfo.processStatusId == Constants.STATUS_NOT_APPROVED ?
            //       <span className="hr-comments-block">Lý do không duyệt: <span className="hr-comments">{this.props.inOutTimeUpdate.hrComment || ""}</span></span> : null
            //   }
            // </div>
        }

        {
          inOutTimeUpdate.requestDocuments.length > 0 ?
            <>
              <h5>{t("Evidence")}</h5>
              <ul className="list-inline">
                {inOutTimeUpdate.requestDocuments.map((file, index) => {
                  return <li className="list-inline-item" key={index}>
                    <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
                  </li>
                })}
              </ul>
            </>
            : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[inOutTimeUpdate.processStatusId].className}`}>{t(this.showStatus(inOutTimeUpdate.processStatusId, inOutTimeUpdate.appraiser))}</span>
          {messageSAP && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>
                {messageSAP.map((msg, index) => {
                  return <div key={index}>{msg}</div>
                })}
              </div>
            </div>}
        </div>
        {
          inOutTimeUpdate 
          && (inOutTimeUpdate.processStatusId === 8 || (action != "consent" && inOutTimeUpdate.processStatusId === 5) || inOutTimeUpdate.processStatusId === 2 
              || (action === "approval" && inOutTimeUpdate.processStatusId == Constants.STATUS_PARTIALLY_SUCCESSFUL && requestTypeIdsAllowedToReApproval.includes(inOutTimeUpdate.requestTypeId))) 
          ? 
          <DetailButtonComponent
            dataToSap={
              [
                {
                  "id": inOutTimeUpdate.id,
                  "requestTypeId": Constants.IN_OUT_TIME_UPDATE,
                  "sub": [
                    {
                      "id": inOutTimeUpdate.id,
                    }
                  ]
                }
              ]
            } //this.dataToSap()
            id={inOutTimeUpdate.id}
            isShowApproval={isShowApproval}
            isShowRevocationOfApproval={inOutTimeUpdate.processStatusId === Constants.STATUS_APPROVED}
            isShowConsent = {inOutTimeUpdate.processStatusId === Constants.STATUS_WAITING_CONSENTED}
            isShowRevocationOfConsent = {inOutTimeUpdate.processStatusId === Constants.STATUS_WAITING && inOutTimeUpdate.appraiser}
            urlName={'requesttimekeeping'}
            requestTypeId={inOutTimeUpdate.requestTypeId}
            action={action}
          />
          : null
        }
      </div>
    )
  }
}

export default withTranslation()(InOutUpdateDetailComponent)
