import React from 'react'
import { withTranslation } from "react-i18next"

class StaffInfoForContractTerminationInterviewComponent extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const { t, userInfos } = this.props

        return <div className="block staff-information-block">
                    <h6 className="block-title">I. {t('StaffInformation')}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('FullName')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.fullName || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">Mã số nhân viên</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.employeeNo || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('Title')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.jobTitle || ""} readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.department || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractType')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.contractName || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">Ngày chấm dứt HĐLĐ</p>
                                <div>
                                    <input type="text" className="form-control" value={"31/12/9999"} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(StaffInfoForContractTerminationInterviewComponent)
