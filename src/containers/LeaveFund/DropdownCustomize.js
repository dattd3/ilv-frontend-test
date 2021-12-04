import React from "react";
import { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import MemberOption from "../WorkflowManagement/ShareComponents/MemberOption"
import SelectTab from "../WorkflowManagement/ShareComponents/SelectTab"
import { getMuleSoftHeaderConfigurations } from "../../commons/Utils"
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
            showMemberOption: false
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
        const { employeeSelectedFilter, index } = this.props
        if (index !== null && index !== undefined) {
            this.setState(
                {
                    loading: false,
                    users: employeeSelectedFilter,
                    showMemberOption: false,
                    selectedMembers: (employeeSelectedFilter.filter(a => a.checked)),
                    checkedMemberIds: (employeeSelectedFilter.filter(a => a.checked).map(m => m.uid))
                }
            )
            return
        }
        this.getApproverInfo();
    }

    getApproverInfo = () => {
        const config = getMuleSoftHeaderConfigurations()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate?depth=2`, config)
            .then((res) => {
                if (res && res.data && res.data.data) {
                    let users = res.data.data || [];
                    users = users.map(item => ({...item, checked: false}))
                    this.setState({ users: users, loading: false });
                }
            })
            .catch((error) => { this.setState({ loading: false }); });
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
        if (this.props.index === null || this.props.index === undefined) {
            this.props.getSelecteMembers(ids);
        } else {
            this.props.getSelecteMembers(this.props.index, dataChecks);
        }
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
        if (this.props.index === null || this.props.index === undefined) {
            this.props.resetSelectedMember([]);
        } else {
            this.props.resetSelectedMember(this.props.index, []);
        }
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

        if (this.props.index === null || this.props.index === undefined) {
            this.props.onCloseTabEvent(ids);
        } else {
            this.props.onCloseTabEvent(this.props.index, dataChecks);
        }
    }

    onCloseAllEvent() {
        this.resetSelectedMember();
        if (this.props.index === null || this.props.index === undefined) {
            this.props.onCloseAllEvent([]);
        } else {
            this.props.onCloseAllEvent(this.props.index, []);
        }
    }

    render() {
        const { t, employeeSelectedFilter, label, type, needReset, isRequired } = this.props;
        const { users, loading, selectedMembers, showMemberOption } = this.state
        const data = employeeSelectedFilter && employeeSelectedFilter.length > 0 ? employeeSelectedFilter : users

        return (
            <div className="timesheet-box">
                <div className="title">{label ? isRequired ? <><span>{t(label)}</span><span className="text-danger required">(*)</span></> : t(label) : isRequired ? <><span>{t("SelectEmployees")}</span><span className="text-danger required">(*)</span></> : t("SelectEmployees")}</div>
                <SelectTab className="content input-container" selectedMembers={needReset ? [] : selectedMembers} onClick={this.onClickSelectTab}
                    onCloseTab={this.onCloseTabEvent} onCloseAll={this.onCloseAllEvent} />
                {
                    showMemberOption ? 
                    <MemberOption loading={loading} data={data} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={type} />
                    : null
                }
            </div>
        );
    }
}
export default withTranslation()(DropdownCustomize);
