import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent';
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
    const { t } = this.props
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
    const terminationInfo = this.props.resignInfo
    if( !terminationInfo.requestInfo) {
        return null;
    }
    const requestInfo = this.props.resignInfo.requestInfo
    const requestTypeId = this.props.resignInfo.requestTypeId
    const qlttInfo = terminationInfo.user;
    
    const userInfos = JSON.parse(terminationInfo.requestInfo.UserInfo);
    const approvalInfo = requestInfo && requestInfo.ApproverInfo ? JSON.parse(requestInfo.ApproverInfo) : {};
    const files = requestInfo?.AttachedFiles || [];

    return (
      <div className="registration-section registration-employment-termination proposed-registration-employment-termination justify-content-between">
         <div className="block staff-information-block">
            <h6 className="block-title">I. {t('StaffInformation')}</h6>
            <div className="box shadow">
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={qlttInfo?.fullname || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Title')}</p>
                        <div>
                            <input type="text" className="form-control" value={qlttInfo?.current_position || ""} readOnly />
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
                            <input type="text" className="form-control" value={requestInfo.LastWorkingDay ? moment(requestInfo.LastWorkingDay, "YYYY-MM-DD").format('DD/MM/YYYY') : ''} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ContractTerminationDate')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.DateTermination ? moment(requestInfo.DateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('ReasonForContractTermination')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.Reason ? JSON.parse(requestInfo.Reason).label : ''} readOnly />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <p className="title">{t('DetailedReason')}</p>
                        <div>
                            <input type="text" className="form-control" value={requestInfo.ReasonDetailed || ""} readOnly />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="block senior-executive">
            <div className="box shadow">
                <h6 className="block-title has-border-bottom">{t('SeniorExecutive')}</h6>
                <div className="row">
                    <div className="col-4">
                        <p className="title">{t('FullName')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.fullname || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('Position')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.current_position || ""} readOnly />
                        </div>
                    </div>
                    <div className="col-4">
                        <p className="title">{t('DepartmentManage')}</p>
                        <div>
                            <input type="text" className="form-control" value={approvalInfo?.department || ""} readOnly />
                        </div>
                    </div>
                    {
                        terminationInfo.processStatusId == Constants.STATUS_NOT_APPROVED ||terminationInfo.processStatusId == Constants.STATUS_NO_CONSENTED || terminationInfo.processStatusId == Constants.STATUS_EVICTION ?
                        <div className="col-4">
                            <p className="title">Lý do không duyệt</p>
                            <div>
                                <input type="text" className="form-control" value={terminationInfo.approverComment || ""} readOnly />
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
        <ul className="list-inline">
            {(files || []).map((file, index) => {
                return <li className="list-inline-item" key={index}>
                    <span className="file-name">
                        <a title={file.name} href={file.fileUrl} download={file.name} target="_blank">{file.name}</a>
                    </span>
                </li>
            })}
        </ul>

        <div className="block-status">
          <span className={`status ${Constants.mappingStatus[terminationInfo.processStatusId].className}`}>{(this.props.action == "consent" && terminationInfo.processStatusId == 5 && terminationInfo.appraiser) ? t(Constants.mappingStatus[6].label) : t(Constants.mappingStatus[terminationInfo.processStatusId].label)}</span>
        </div>
        {(terminationInfo.processStatusId === 8 || (this.props.action != "consent" && terminationInfo.processStatusId === 5) || terminationInfo.processStatusId === 2) ? 
        <DetailButtonComponent 
          dataToSap={[{
            "id": terminationInfo.id,
            "requestTypeId": Constants.RESIGN_SELF,
            "sub": [
              {
                "id": requestInfo.id,
              }
            ]
          }]}
          isShowRevocationOfApproval={terminationInfo.processStatusId === Constants.STATUS_APPROVED && (requestInfo.actionType == "INS" || requestInfo.actionType == "MOD")}
          isShowApproval={terminationInfo.processStatusId === Constants.STATUS_WAITING}
          isShowConsent = {terminationInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
          isShowRevocationOfConsent = {terminationInfo.processStatusId === Constants.STATUS_WAITING && terminationInfo.appraiser}
          id={terminationInfo.id}
          urlName={'requestattendance'}
          requestTypeId={requestTypeId}
          action={this.props.action}
        /> : null}

      </div>
    )
  }
}

export default withTranslation()(RegistrationEmploymentTermination)
