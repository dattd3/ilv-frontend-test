import React from "react";
import { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
// import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import MemberOption from "../WorkflowManagement/ShareComponents/MemberOption"
import SelectTab from "../WorkflowManagement/ShareComponents/SelectTab"
import "./dropdown-customize.scss"
registerLocale("vi", vi);

class DropdownCustomize extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            loading: true,
            checkedMemberIds: [],
            selectedMembers: [],
            showMemberOption: false,
        };

        this.onShowMembers = this.onShowMembers.bind(this);
        this.onHideMembers = this.onHideMembers.bind(this);
        this.getSelecteMembers = this.getSelecteMembers.bind(this);
        this.resetSelectedMember = this.resetSelectedMember.bind(this);
        this.onClickSelectTab = this.onClickSelectTab.bind(this);
        this.onCloseTabEvent = this.onCloseTabEvent.bind(this);
        this.onCloseAllEvent = this.onCloseAllEvent.bind(this);
    }

    getClosingSalaryDatePreMonth = () => {
        const now = moment();
        let preMonth = now.month();
        const currentYear = preMonth === 0 ? now.year() - 1 : now.year();
        preMonth = preMonth === 0 ? 12 : preMonth;
        return `26/${preMonth}/${currentYear}`;
    };
    componentDidMount() {
        this.getApproverInfo();
    }

    getApproverInfo = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                client_id: process.env.REACT_APP_MULE_CLIENT_ID,
                client_secret: process.env.REACT_APP_MULE_CLIENT_SECRET,
            },
        };

        axios
            .get(
                `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate?depth=2`,
                config
            )
            .then((res) => {
                if (res && res.data && res.data.data) {
                    const users = res.data.data || [];
                    this.setState({ users: users, loading: false });
                }
            })
            .catch((error) => {this.setState({loading: false }); });
    };

    getSelecteMembers(data) {
        this.setState(
            {
                users: data,
                showMemberOption: false,
                selectedMembers: (data.filter(a => a.checked)),
                checkedMemberIds: (data.filter(a => a.checked).map(m => m.uid))
            });
        const dataChecks = data.filter(a => a.checked);
        const ids = dataChecks.map(itm => itm.uid);
        this.props.getSelecteMembers(ids);
    }

    onShowMembers() {
        this.setState({ showMemberOption: true });
    }

    onHideMembers() {
        this.setState({ showMemberOption: false });
    }

    resetSelectedMember() {
        const resetedMember = [...this.state.users]
        this.setState(
            {
                users: resetedMember.map(member => { return { ...member, checked: false } }),
                showMemberOption: false,
                selectedMembers: [],
                checkedMemberIds: []
            });
        this.props.resetSelectedMember([]);
    }

    addDays(date, days) {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }

    onClickSelectTab() {
        this.setState({ showMemberOption: true });
    }
    onCloseTabEvent(uid) {
        const members = this.state.users;
        const closeMember = members.find(val => val.uid === uid);
        closeMember.checked = false;
        this.getSelecteMembers(members);
        const dataChecks = members.filter(a => a.checked);
        const ids = dataChecks.map(itm => itm.uid);
        this.props.onCloseTabEvent(ids);
    }
    onCloseAllEvent() {
        this.resetSelectedMember();
        this.props.onCloseAllEvent([]);
    }

    render() {
        const { t } = this.props;
        let hrProfileDisplay = [];
        if (this.state.users && this.state.users.length > 0) {
            hrProfileDisplay = this.state.users.map((profile) => {
                return {
                    uid: profile.uid,
                    // label: profile.fullname,
                    fullname: profile.fullname,
                    job_name: profile.job_name,
                    companyCode: profile.companyCode,
                    orgLv3Text: profile.orgLv3Text,
                    username: profile.username,
                    manager: profile.manager,
                    company_email: profile.company_email.includes("@") ? profile.company_email.split("@")[0] : profile.company_email,
                    checked: profile.checked || false,
                    isExpand: profile.isExpand || false,
                };
            });
        }

        return (
            <div className="timesheet-box">
                <div className="title">{t("SelectEmployees")}</div>
                <SelectTab className="content input-container" selectedMembers={this.state.selectedMembers} onClick={this.onClickSelectTab}
                    onCloseTab={this.onCloseTabEvent} onCloseAll={this.onCloseAllEvent} />
                {this.state.showMemberOption ? (
                    //employeeGrTree
                    <MemberOption loading={this.state.loading} data={hrProfileDisplay} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={this.props.type} />
                ) : null}
            </div>
        );
    }
}
export default withTranslation()(DropdownCustomize);
