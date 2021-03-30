import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import Constants from '../.../../../../commons/Constants'

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

  render() {
    const requestTypeId = this.props.inOutTimeUpdate.requestTypeId
    const { t } = this.props
  
    return (
      <div className="leave-of-absence">
        <h5>Thông tin CBNV đăng ký</h5>
        <div className="box shadow cbnv">
          <div className="row">
            <div className="col-3">
             {t("FullName")}
              <div className="detail">{this.props.inOutTimeUpdate.user.fullName}</div>
            </div>
            <div className="col-3">
              {t("EmployeeNo")}
              <div className="detail">{this.props.inOutTimeUpdate.user.employeeNo}</div>
            </div>
            <div className="col-3">
              {t("Title")}
              <div className="detail">{this.props.inOutTimeUpdate.user.jobTitle}</div>
            </div>
            <div className="col-3">
              {t("DepartmentManage")}
              <div className="detail">{this.props.inOutTimeUpdate.user.department}</div>
            </div>
          </div>
        </div>
        <h5>Thông tin sửa giờ vào - ra</h5>
        {this.props.inOutTimeUpdate.requestInfo.timesheet.filter(t => t.isEdit).map((timesheet, index) => {
          return <div className="box shadow" key={index}>
            <div className="col"><p><i className="fa fa-clock-o text-capitalize"></i> <b>{t("Day")} {timesheet.date.replace(/-/g, '/')}</b></p></div>
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
                  <p className="text-center">Giờ chỉnh sửa</p>
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
          this.getTypeDetail() === "request" ?
            <>
              <h5>Thông tin phê duyệt</h5>
              <ApproverDetailComponent approver={this.props.inOutTimeUpdate.approver} status={this.props.inOutTimeUpdate.status} hrComment={this.props.inOutTimeUpdate.hrComment} />
            </> :
            <div className="block-status">
              <span className={`status ${Constants.mappingStatus[this.props.inOutTimeUpdate.requestInfo.processStatusId].className}`}>{t(Constants.mappingStatus[this.props.inOutTimeUpdate.requestInfo.processStatusId].label)}</span>
              {
                this.props.inOutTimeUpdate.requestInfo.processStatusId == Constants.STATUS_NOT_APPROVED ?
                  <span className="hr-comments-block">Lý do không duyệt: <span className="hr-comments">{this.props.inOutTimeUpdate.hrComment || ""}</span></span> : null
              }
            </div>
        }

        {
          this.props.inOutTimeUpdate.requestDocuments.length > 0 ?
            <>
              <h5>Tài liệu chứng minh</h5>
              <ul className="list-inline">
                {this.props.inOutTimeUpdate.requestDocuments.map((file, index) => {
                  return <li className="list-inline-item" key={index}>
                    <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
                  </li>
                })}
              </ul>
            </>
            : null
        }

        { this.props.inOutTimeUpdate.requestInfo.processStatusId === 8 || this.props.inOutTimeUpdate.requestInfo.processStatusId === 5 || this.props.inOutTimeUpdate.requestInfo.processStatusId === 2 ? <DetailButtonComponent
          dataToSap={this.dataToSap()}
          id={this.props.inOutTimeUpdate.id}
          isShowRevocationOfApproval={this.props.inOutTimeUpdate.requestInfo.processStatusId === 2}
          isShowRevocationOfConsent = {this.props.inOutTimeUpdate.requestInfo.processStatusId === 6}
          urlName={'requesttimekeeping'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}
      </div>
    )
  }
}

export default withTranslation()(InOutUpdateDetailComponent)
