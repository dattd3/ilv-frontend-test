import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import moment from 'moment'
import DetailButtonComponent from '../DetailButtonComponent'
import AttachmentComponent from '../TerminationComponents/AttachmentComponent'
import Constants from '../.../../../../commons/Constants'
import { getResignResonsMasterData, formatProcessTime } from 'commons/Utils'

class RegistrationEmploymentTermination extends React.Component {
    updateTabLink = key => {
        this.props.history.push('?tab=' + key)
        this.setState({ tab: key })
    }

    render() {
        const { t, resignInfo } = this.props

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
        const reasonMasterData = getResignResonsMasterData();

        return (
            <div className="registration-section registration-employment-termination proposed-registration-employment-termination justify-content-between">
                <div className="block staff-information-block">
                    <h6 className="block-title">I. {t('StaffInformation')}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('FullName')}</p>
                                <div>
                                    <div className="detail">{qlttInfo?.fullName || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Title')}</p>
                                <div>
                                    <div className="detail">{qlttInfo?.jobTitle || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <div className="detail">{qlttInfo?.department || ""}</div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block staff-information-proposed-resignation-block">
                    <h6 className="block-title">{`${t('proposed_employee_info')} ${t('cho_nghi')}`}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-12">
                                <table className="list-staff">
                                    <thead>
                                        <tr>
                                            <th>{t('FullName')}</th>
                                            <th>{t('EmployeeNo')}</th>
                                            <th>{t('Title')}</th>
                                            <th>{t('DepartmentManage')}</th>
                                            <th>{t('ContractType')}</th>
                                            <th>{t('ContractSignDate')}</th>
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
                    <h6 className="block-title">III. {t('ly_do_cbld_tt_de_xuat_cho_nghi')}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('LastWorkingDay')}</p>
                                <div>
                                    <div className="detail">{requestInfo.lastWorkingDay ? moment(requestInfo.lastWorkingDay, "YYYY-MM-DD").format('DD/MM/YYYY') : ''}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractTerminationDate')}</p>
                                <div>
                                    <div className="detail">{requestInfo.dateTermination ? moment(requestInfo.dateTermination, "YYYY-MM-DD").format('DD/MM/YYYY') : ""}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ReasonForContractTermination')}</p>
                                <div>
                                    <div className="detail">{requestInfo.absenceType ? reasonMasterData[requestInfo.absenceType.value] : ''}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="title">{t('DetailedReason')}</p>
                                <div>
                                    <div className="detail">{requestInfo.reasonDetailed || ""}</div>
                                </div>
                            </div>
                        </div>
                        {
                            resignInfo?.processStatusId == Constants.STATUS_REVOCATION && requestInfo?.commentExtend != null && requestInfo?.commentExtend != "" && requestInfo?.commentExtend != undefined ?
                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">{t('reason_cancel')}</p>
                                        <div>
                                            <div className="detail">{requestInfo?.commentExtend || ""}</div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>

                <div className="block senior-executive">
                    <div className="box shadow">
                        <h6 className="block-title has-border-bottom">{t('SeniorExecutive')}11</h6>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('FullName')}</p>
                                <div>
                                    <div className="detail">{approvalInfo?.fullName || ""}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Position')}</p>
                                <div>
                                    <div className="detail">{approvalInfo?.jobTitle || ""}</div>

                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <div className="detail">{approvalInfo?.department || ""}</div>

                                </div>
                            </div>
                        </div>
                        {
                            requestInfo?.approverComment != null && requestInfo?.approverComment != undefined && requestInfo?.approverComment != "" ?
                                <div className="row">
                                    <div className="col-12">
                                        <p className="title">{t('reason_reject')}</p>
                                        <div>
                                            <div className="detail">{requestInfo?.approverComment || ""}</div>
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>

                <div className="block senior-executive">
                    <div className="box shadow">
                        <h6 className="block-title has-border-bottom">{t('RequestHistory')}</h6>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('TimeToSendRequest')}</p>
                                <div>
                                    <div className="detail">{formatProcessTime(resignInfo?.createDate)}</div>
                                </div>
                            </div>
                            {/* <div className="col-4">
                                <p className="title">{t('ConsentDate')}</p>
                                <div>
                                    <div className="detail">{formatProcessTime(resignInfo?.assessedDate)}</div>
                                </div>
                            </div> */}
                            <div className="col-4">
                                <p className="title">{t('ApprovalDate')}</p>
                                <div>
                                    <div className="detail">{formatProcessTime(resignInfo?.approvedDate)}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('CancelDate')}</p>
                                <div>
                                    <div className="detail">{formatProcessTime(resignInfo?.deletedDate)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AttachmentComponent files={files} updateFiles={this.updateFiles} />

                <div className="block-status">
                    <span className={`status ${Constants.mappingStatusRequest[resignInfo.processStatusId].className}`}>{(this.props.action == "consent" && resignInfo.processStatusId == 5 && resignInfo.appraiser) ? t(Constants.mappingStatusRequest[20].label) : t(Constants.mappingStatusRequest[resignInfo.processStatusId].label)}</span>
                </div>
                {(requestInfo.processStatusId === 8 || (this.props.action != "consent" && resignInfo.processStatusId === 5) || resignInfo.processStatusId === 2) ?
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
                        isShowApproval={resignInfo.processStatusId === Constants.STATUS_WAITING}
                        isShowConsent={resignInfo.processStatusId === Constants.STATUS_WAITING_CONSENTED}
                        isShowRevocationOfConsent={resignInfo.processStatusId === Constants.STATUS_WAITING && resignInfo.appraiser}
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
