import React from "react";
import { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import "../../LeaveFund/dropdown-customize.scss"
import SelectTab from "../../WorkflowManagement/ShareComponents/SelectTab";
import MemberOption from "../../WorkflowManagement/ShareComponents/MemberOption";
registerLocale("vi", vi);

class DropdownResignCustomize extends React.Component {
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
        const { users, index ,employeeSelectedFilter} = this.props
        if (index !== null && index !== undefined) {
            this.setState(
                {
                    loading: false,
                    users: users,
                    showMemberOption: false,
                    selectedMembers: (employeeSelectedFilter.filter(a => a.checked)),
                    checkedMemberIds: (employeeSelectedFilter.filter(a => a.checked).map(m => m.uid))
                }
            )
            return
        }
        //this.getApproverInfo();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.users?.length > 0 && this.state.users.length == 0) {
            this.setState({ users: nextProps.users })
        }
        // if (nextProps.loading != this.state.loading) {
        //     this.setState({ loading: nextProps.loading })
        // }
    }

    getSelecteMembers(data) {
        this.setState(
            {
                users: data,
                showMemberOption: false,
                selectedMembers: (data.filter(a => a.checked)),
                checkedMemberIds: (data.filter(a => a.checked).map(m => m.uid))
            });
        const dataChecks = data.filter(a => a.checked);
        if (this.props.index === null || this.props.index === undefined) {
            this.props.getSelecteMembers(dataChecks);
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
        const { loading,t, employeeSelectedFilter, label, type, needReset, isRequired } = this.props;
        const { users, selectedMembers, showMemberOption } = this.state
        const data = employeeSelectedFilter && employeeSelectedFilter.length > 0 ? employeeSelectedFilter : users
        return (
            <div className="timesheet-box">
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
export default withTranslation()(DropdownResignCustomize);
