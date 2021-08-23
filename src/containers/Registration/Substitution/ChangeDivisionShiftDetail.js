import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import DetailButtonComponent from '../DetailButtonComponent'
import ApproverDetailComponent from '../ApproverDetailComponent'
import StatusModal from '../../../components/Common/StatusModal'
import Constants from '../.../../../../commons/Constants'
import TableUtil from '../../../components/Common/table'
import CustomPaging from '../../../components/Common/CustomPaging'

const TIME_FORMAT = 'HH:mm:00'
const TIME_OF_SAP_FORMAT = 'HHmm00'
const DATE_FORMAT = 'DD-MM-YYYY'
const DATE_OF_SAP_FORMAT = 'YYYYMMDD'

class ChangeDivisionShiftDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isShowStatusModal: false,
      pageNumber: 1
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

  calTime(start, end) {
    if (start == null || end == null) {
      return ""
    }
    const differenceInMs = moment(end, TIME_FORMAT).diff(moment(start, TIME_FORMAT))
    return moment.duration(differenceInMs).asHours()
  }

  onChangePage (index) {
    this.setState({pageNumber: index})
  }
  render() {
    const { t } = this.props
    const requestTypeId = this.props.substitution.requestTypeId
    const listChangeShift = TableUtil.updateData(this.props.substitution.requestInfo, this.state.pageNumber - 1, 10)
    return (
      <div className="leave-of-absence">
        <h5>{t("EmployeeInfomation")}</h5>
        <div className="box shadow cbnv">
          <div className="row group">
            <div className="col-xl-3">
             {t("FullName")}
              <div className="detail auto-height">{this.props.substitution.user.fullName}</div>
            </div>
            <div className="col-xl-3">
              {t("EmployeeNo")}
              <div className="detail auto-height">{this.props.substitution.user.employeeNo}</div>
            </div>
            <div className="col-xl-3 auto-height">
              {t("Title")}
              <div className="detail auto-height">{this.props.substitution.user.jobTitle}</div>
            </div>
            <div className="col-xl-3">
              {t("DepartmentManage")}
              <div className="detail auto-height">{this.props.substitution.user.department}</div>
            </div>
          </div>
        </div>
        <StatusModal show={this.state.isShowStatusModal} content={this.state.content} isSuccess={this.state.isSuccess} onHide={this.hideStatusModal} />
        <h5>Thông tin đăng ký thay đổi phân ca bộ phận</h5>
        <div className="box shadow">
        <div className="change-shift">
            <table className="table">
              <thead>
                <tr>
                  <th className="sticky-col number-order sms-width text-center"> STT </th>
                  <th className="sticky-col uid sm-width text-center"> Mã <br/>nhân viên </th>
                  <th className="sticky-col full-name mid-width"> Họ tên </th>
                  <th className="sticky-col department xl-width"> Phòng/Bộ phận/Nhóm </th>
                  <th className="sm-width text-center"> Loại <br/>phân ca </th>
                  <th className="mid-width text-center"> Ngày bắt đầu </th>
                  <th className="mid-width text-center"> Ngày kết thúc </th>
                  <th className="sm-width text-center"> Mã ca </th>
                  <th className="sm-width text-center"> Giờ bắt đầu </th>
                  <th className="sm-width text-center"> Giờ kết thúc </th>
                  <th className="mid-width text-center"> Giờ bắt đầu nghỉ </th>
                  <th className="mid-width text-center"> Giờ kết thúc nghỉ </th>
                  <th className="xl-width text-center"> Số giờ nghỉ ca <br/> (Có hưởng lương) </th>
                  <th className="xl-width text-center"> Số giờ nghỉ ca <br/> (không hưởng lương) </th>
                  <th className="xl-width text-center"> Daily WS class <br/> (Hệ số ca làm việc) </th>
                  <th className="mid-width"> Lý do </th>
                </tr>
              </thead>
              <tbody>
              { listChangeShift.map((member, index) => {
                 return (
                  <tr key={index}>
                    <td className="sticky-col number-order sms-width text-center">{index+1}</td>
                    <td className="sticky-col uid sm-width text-center">{member.userID}</td>
                    <td className="sticky-col full-name mid-width">{member.fullName}</td>
                    <td className="sticky-col department xl-width">{member.department}</td>
                    <td className="sm-width text-center">{member.substitutionType}</td>
                    <td className="mid-width text-center">{member.startDate}</td>
                    <td className="mid-width text-center">{member.endDate}</td>
                    <td className="sm-width text-center">{member.dailyWorkScheduleID}</td>
                    <td className="sm-width text-center">{member.startTime}</td>
                    <td className="sm-width text-center">{member.endTime}</td>
                    <td className="mid-width text-center">{member.breakStart}</td>
                    <td className="mid-width text-center">{member.breakEnd}</td>
                    <td className="xl-width text-center">{member.numberHoursPaid}</td>
                    <td className="xl-width text-center">{member.unpaidHours}</td>
                    <td className="xl-width text-center">{member.dailyWSClass}</td>
                    <td className="mid-width">{member.course}</td>
                  </tr>
                 )
              })}
              </tbody>
            </table>
          </div>
          {
                listChangeShift.length > 0 
                ?   <div className="row paging mt-2">
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                        <div className="col-sm">
                            <CustomPaging pageSize={10} onChangePage={this.onChangePage.bind(this)} totalRecords={this.props.substitution.requestInfo.length} />
                        </div>
                        <div className="col-sm"></div>
                        <div className="col-sm text-right">{t("Total")}: {this.props.substitution.requestInfo.length}</div>
                    </div>
                : null
            }
        </div>
        
        <h5>{t("ConsenterInformation")}</h5>
        <ApproverDetailComponent title={t("Consenter")} approver={this.props.substitution.appraiser} status={this.props.substitution.requestInfo ? this.props.substitution.processStatusId : ""} hrComment={this.props.substitution.appraiserComment} />
        {
          this.props.substitution && (Constants.STATUS_TO_SHOW_APPROVER.includes(this.props.substitution.processStatusId )) ?
          <>
            <h5>{t("ApproverInformation")}</h5>
            <ApproverDetailComponent title={t("Approver")} approver={this.props.substitution.approver} status={this.props.substitution.processStatusId} hrComment={this.props.substitution.approverComment} />
          </> : null
        }

        {
          this.props.substitution.requestDocuments.length > 0 ?
          <>
          <h5>{t("Evidence")}</h5>
          <ul className="list-inline">
            {this.props.substitution.requestDocuments.map((file, index) => {
              return <li className="list-inline-item" key={index}>
                <a className="file-name" href={file.fileUrl} title={file.fileName} target="_blank" download={file.fileName}>{file.fileName}</a>
              </li>
            })}
          </ul>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[this.props.substitution.processStatusId].className}`}>{(this.props.action == "consent" && this.props.substitution.processStatusId == 5 && this.props.substitution.appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[this.props.substitution.processStatusId].label)}</span>
        </div>
        { this.props.substitution && (this.props.substitution.processStatusId === 8 || (this.props.action != "consent" && this.props.substitution.processStatusId === 5) || this.props.substitution.processStatusId === 2 ) ? <DetailButtonComponent 
          dataToSap={
            [
              {
                "id": this.props.substitution.id,
                "requestTypeId": Constants.CHNAGE_DIVISON_SHIFT,
                "sub": [
                  {
                    "id": this.props.substitution.id,
                  }
                ]
              }
            ]
          } //this.getData()
          id={this.props.substitution.id}
          isShowApproval={this.props.substitution.processStatusId === Constants.STATUS_WAITING}
          isShowRevocationOfApproval={this.props.substitution.processStatusId === Constants.STATUS_APPROVED}
          isShowConsent = {this.props.substitution.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {this.props.substitution.processStatusId === Constants.STATUS_WAITING && this.props.substitution.appraiser}
          urlName={'requestsubstitution'}
          requestTypeId={requestTypeId}
          hiddenRevocationOfApprovalButton={1}
          action={this.props.action}
        /> : null}
      </div>
    )
  }
}
export default withTranslation()(ChangeDivisionShiftDetail)