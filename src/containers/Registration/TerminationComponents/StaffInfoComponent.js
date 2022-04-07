import React from 'react'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import moment from 'moment'

class StaffInfoComponent extends React.PureComponent {
    constructor(props) {
        super()
    }

    render() {
        const { t, userInfos } = this.props
        const dateStartWork = userInfos && userInfos.dateStartWork ? moment(userInfos.dateStartWork, "YYYY-MM-DD").format("DD/MM/YYYY") : ""

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
                                <p className="title">{t('Title')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.jobTitle || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('DepartmentManage')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.department || ""} readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('DaysOnWorking')}</p>
                                <div>
                                    <input type="text" className="form-control" value={dateStartWork} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractType')}</p>
                                <div>
                                    <input type="text" className="form-control" value={userInfos?.contractName || ""} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(StaffInfoComponent)
