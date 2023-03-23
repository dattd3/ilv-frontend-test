import React from 'react'
import moment from 'moment'
import { withTranslation } from "react-i18next"

class StaffInfoForContractTerminationInterviewComponent extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { t, userInfos } = this.props
        const dateTermination = userInfos && userInfos.dateTermination ? moment(userInfos.dateTermination, "YYYY-MM-DD").format("DD/MM/YYYY") : ""

        return <div className="block staff-information-block">
                    <h6 className="block-title">I. {t('StaffInformation')}</h6>
                    <div className="box">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('FullName')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={userInfos?.fullName || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('employee_number')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={userInfos?.employeeNo || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Title')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={userInfos?.jobTitle || ""} readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={userInfos?.department || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractType')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={userInfos?.contractName || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ngay_cham_dut_hdld')}</p>
                                <div>
                                    <input type="text" className="form-control" style={{backgroundColor: '#F2F2F2'}} value={dateTermination} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(StaffInfoForContractTerminationInterviewComponent)
