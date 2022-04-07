import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import DatePicker, { registerLocale } from 'react-datepicker'
import moment from 'moment'
import _, { debounce } from 'lodash'
import { withTranslation } from "react-i18next";
import Constants from "../../../commons/Constants"

class StaffTerminationDetailComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            appraiser: null,
            users: [],
            typingTimeout: 0,
            appraiserTyping: ""
        }
        this.onInputChange = debounce(this.getAppraiser, 600);
    }

    componentDidMount() {
        let appraiserModel = {
            label: "",
            value: "",
            fullName: "",
            avatar: "",
            employeeLevel: "",
            pnl: "",
            orglv2Id: "",
            account: "",
            current_position: "",
            department: ""
        }
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        const companiesUsing = ['V070', 'V077', 'V060']
        if (companiesUsing.includes(localStorage.getItem("companyCode"))) {
            axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/immediatesupervise`, config)
                .then(res => {
                    if (res && res.data && res.data.data && res.data.data.length > 0) {
                        let manager = res.data.data[0]
                        let managerApproval = {
                            ...appraiserModel,
                            label: manager.fullName,
                            value: manager.userid.toLowerCase(),
                            fullName: manager.fullName,
                            account: manager.userid.toLowerCase(),
                            current_position: manager.title,
                            department: manager.department
                        }
                        this.setState({ appraiser: managerApproval })
                        this.props.updateAppraiser(managerApproval, true)
                    }
                }).catch(error => {

                });
        }

        const { appraiser } = this.props
        if (appraiser) {
            this.setState({
              appraiser: {
                ...appraiser,
                label: appraiser.fullName,
                value: appraiser.account,
              }
            })
          }
    }

    handleSelectChange(name, value) {
        if (value) {
            const currentUserLevel = localStorage.getItem('employeeLevel')
            this.setState({ [name]: value })
            const isAppraiser = this.isAppraiser(value.employeeLevel, value.orglv2Id, currentUserLevel, value.account)
            console.log(value);
            this.props.updateAppraiser(value, isAppraiser)
        } else {
            this.setState({ [name]: value, users: [] })
            this.props.updateAppraiser(value, true)
        }
    }

    isAppraiser = (levelAppraiserFilter, orglv2Id, currentUserLevel, account) => {
        const orglv2IdCurrentUser = localStorage.getItem('organizationLv2')
        let indexCurrentUserLevel = _.findIndex(Constants.CONSENTER_LIST_LEVEL, function (item) { return item == currentUserLevel });
        
        let indexAppraiserFilterLevel = _.findIndex(Constants.CONSENTER_LIST_LEVEL, function (item) { return item == levelAppraiserFilter },0);

        if (indexAppraiserFilterLevel == -1 || indexCurrentUserLevel > indexAppraiserFilterLevel) {
            return false
        }
        if (account.toLowerCase() === localStorage.getItem("email").split("@")[0]) {
            return false
        }

        // if (Constants.CONSENTER_LIST_LEVEL.includes(levelAppraiserFilter) && orglv2IdCurrentUser === orglv2Id) {
        //     return true
        // }
        if (Constants.CONSENTER_LIST_LEVEL.includes(levelAppraiserFilter)) {
            return true
        }

        return false
    }

    getAppraiser = (value) => {
        const { approver } = this.props
        if (value !== "") {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                    'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
                }
            }

            axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/search/appraiser`, { account: value, should_check_superviser: true }, config)
                .then(res => {
                    if (res && res.data && res.data.data) {
                        const data = res.data.data || []
                        const users = data.map(res => {
                            return {
                                label: res.fullName,
                                value: res.user_account,
                                fullName: res.fullName,
                                avatar: res.avatar,
                                employeeLevel: res.employee_level,
                                pnl: res.pnl,
                                orglv2Id: res.orglv2_id,
                                account: res.user_account,
                                current_position: res.title,
                                department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
                            }
                        })
                        this.setState({ users: approver ? users.filter(user => user.account !== approver.account) : users })
                    }
                }).catch(error => { })
        }
    }

    onInputChange = value => {
        this.setState({ appraiserTyping: value }, () => {
            this.onInputChange(value)
        })
    }

    render() {
        const customStyles = {
            option: (styles, state) => ({
                ...styles,
                cursor: 'pointer',
            }),
            control: (styles) => ({
                ...styles,
                cursor: 'pointer',
            })
        }
        const { t, isEdit } = this.props;
        const reqDetail = {}

        return <div className="block staff-information-block">
                    <h6 className="block-title">II. {t('StaffInformationProposedToTerminateContract')}</h6>
                    <div className="box shadow">
                        <div className="row">
                            <div className="col-4">
                                <p className="title">{t('LastWorkingDay')}</p>
                                <div className="content input-container">
                                    <label>
                                        <DatePicker
                                            selectsStart
                                            autoComplete="off"
                                            selected={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                            startDate={reqDetail.startDate ? moment(reqDetail.startDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                            endDate={reqDetail.endDate ? moment(reqDetail.endDate, Constants.LEAVE_DATE_FORMAT).toDate() : null}
                                            minDate={moment(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24), Constants.LEAVE_DATE_FORMAT).toDate()}
                                            onChange={date => this.setStartDate(date, reqDetail.groupId, reqDetail.groupItem)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText={t('Select')}
                                            locale={t("locale")}
                                            className="form-control input" />
                                        <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ContractTerminationDate')}</p>
                                <div>
                                    <input type="text" className="form-control" value={this.state.appraiser?.current_position || ""} readOnly />
                                </div>
                            </div>
                            <div className="col-4">
                                <p className="title">{t('ReasonForContractTermination')}</p>
                                <div>
                                    <input type="text" className="form-control" value={this.state.appraiser?.current_position || ""} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p className="title">{t('DetailedReason')}</p>
                                <div>
                                    <input type="text" className="form-control" value={this.state.appraiser?.current_position || ""} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default withTranslation()(StaffTerminationDetailComponent)
