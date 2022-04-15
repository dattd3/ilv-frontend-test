import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import Constants from '../.../../../../commons/Constants'

class RegistrationEmploymentTermination extends React.Component {
  constructor(props) {
    super()
    this.state = {
        reasonTypes: [],
        userInfos: [],
        infos: {},
        staffTerminationDetail: {},
        directManager: null,
        seniorExecutive: null,
        files: [],
        isUpdateFiles: false,
        isEdit: false,
        dateStartWork: ''
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key)
    this.setState({ tab: key })
  }

  render() {
    const { t, resignInfo } = this.props
    const {
        isEdit,
        titleModal,
        messageModal,
        disabledSubmitButton,
        isShowStatusModal,
        isSuccess,
        reasonTypes,
        infos,
        directManager,
        seniorExecutive,
        dateStartWork
    } = this.state

    if (!resignInfo.requestInfo) {
        return null;
    }

    const requestInfo = resignInfo.requestInfo
    const requestTypeId = resignInfo.requestTypeId
    const qlttInfo = resignInfo.user
    const userInfos = resignInfo.requestInfo.terminationUserInfo
    const approvalInfo = resignInfo.approver || {};
    const files = (resignInfo?.requestDocuments || []).map(item => {
        return {
            name: item.fileName,
            fileUrl: item.fileUrl || ""
        }
    })

    return (
      <div className="registration-section registration-employment-termination proposed-registration-employment-termination justify-content-between">
         <div className="block staff-information-block">
            <h6 className="block-title">I. {t('StaffInformation')}</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={qlttInfo?.fullName || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Title')}</p>
                        <div>
                            <input type="text" className="form-control" value={qlttInfo?.jobTitle || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={qlttInfo?.department || ""} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="block staff-information-proposed-resignation-block">
            <h6 className="block-title">II. Thông tin nhân viên đề xuất cho nghỉ</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-12">
                        <table className="list-staff">
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Mã nhân viên</th>
                                    <th>Chức danh</th>
                                    <th>Khối/Phòng/Bộ phận</th>
                                    <th>Loại hợp đồng</th>
                                    <th>Ngày vào làm việc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (userInfos || []).map((item, index) => {
                                        const dateStartWork = item && item.dateStartWork ? moment(item.dateStartWork, "YYYY-MM-DD").format("DD/MM/YYYY") : ""

                                        return <tr key={index}>
                                                    <td className="full-name">
                                                        <div className="data full-name">
                                                            <span>{item?.fullName || ""}</span>
                                                        </div>
                                                    </td>
                                                    <td className="employee-code"><div className="data employee-code">{item?.employeeNo || ""}</div></td>
                                                    <td className="job-title"><div className="data job-title">{item?.jobTitle || ""}</div></td>
                                                    <td className="block-department-part"><div className="data block-department-part">{item?.department || ""}</div></td>
                                                    <td className="contract-type"><div className="data contract-type">{item?.contractName || ""}</div></td>
                                                    <td className="day-working"><div className="data day-working">{dateStartWork}</div></td>
                                                </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div className="block staff-information-block">
            <h6 className="block-title">III. LÝ DO CBLĐ TT ĐỀ XUẤT CHO NGHỈ</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('LastWorkingDay')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.lastWorkingDay ? moment(requestInfo.lastWorkingDay, "YYYY-MM-DD").format('DD/MM/YYYY') : ''} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ContractTerminationDate')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.dateTermination ? moment(requestInfo.dateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ReasonForContractTermination')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.absenceType ? requestInfo.absenceType.label : ''} readOnly />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="title">Lý do chi tiết chấm dứt hợp đồng</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.reasonDetailed || ""} readOnly />
                        </div>
                    </div>
                </div>
                {
                    requestInfo?.processStatusId == Constants.STATUS_REVOCATION && requestInfo?.commentExtend != null && requestInfo?.commentExtend != "" && requestInfo?.commentExtend != undefined ?
                    <div className="row">
                        <div className="col-12">
                            <p className="title">Lý do hủy yêu cầu</p>
                            <div>
                                <input type="text" className="form-control" value={requestInfo?.commentExtend || ""} readOnly />
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        </div>

        <div className="block senior-executive">
            <div className="box shadow">
                <h6 className="block-title has-border-bottom">{t('SeniorExecutive')}</h6>
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.fullName || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Position')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.jobTitle || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.department || ""} readOnly />
                        </div>
                    </div>
                </div>
                {
                    requestInfo?.approverComment != null && requestInfo?.approverComment != undefined && requestInfo?.approverComment != "" ?
                    <div className="row">
                        <div className="col-12">
                            <p className="title">Lý do từ chối</p>
                            <div>
                                <input type="text" className="form-control" value={requestInfo?.approverComment || ""} readOnly />
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        </div>

        <AttachmentComponent files={files} updateFiles={this.updateFiles} />

        <div className="block-status">
          <span className={`status ${Constants.mappingStatusRequest[requestInfo.processStatusId].className}`}>{(this.props.action == "consent" && requestInfo.processStatusId == 5 && resignInfo.appraiser) ? t(Constants.mappingStatusRequest[6].label) : t(Constants.mappingStatusRequest[requestInfo.processStatusId].label)}</span>
        </div>
        {(requestInfo.processStatusId === 8 || (this.props.action != "consent" && requestInfo.processStatusId === 5) || requestInfo.processStatusId === 2) ? 
        <DetailButtonComponent 
          dataToSap={[{
            "id": resignInfo.id,
            "requestTypeId": Constants.RESIGN_SELF,
            "sub": [
              {
                "id": requestInfo.id,
              }
            ]
          }]}
          isShowRevocationOfApproval={false}
          //isShowRevocationOfApproval={requestInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")
          isShowApproval={requestInfo.processStatusId === Constants.STATUS_WAITING}
          isShowConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {requestInfo.processStatusId === Constants.STATUS_WAITING && resignInfo.appraiser}
          id={resignInfo.id}
          urlName={'requestattendance'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}

      </div>
    )
  }
}

export default withTranslation()(RegistrationEmploymentTermination)
