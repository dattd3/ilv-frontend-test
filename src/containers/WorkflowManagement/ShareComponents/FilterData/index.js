import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
// import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import MemberOption from "../MemberOption"
import SelectTab from "../SelectTab"
registerLocale("vi", vi);

class FilterData extends React.Component {
  constructor() {
    super();
    this.state = {
      startDate: moment(
        this.getClosingSalaryDatePreMonth(),
        "DD/MM/YYYY"
      ).toDate(),
      endDate: new Date(),
      users: [],
      loading: true,
      checkedMemberIds: [],
      selectedMembers: [],
      showMemberOption: false,
    };

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.onShowMembers = this.onShowMembers.bind(this);
    this.onHideMembers = this.onHideMembers.bind(this);
    this.getSelecteMembers = this.getSelecteMembers.bind(this);
    this.resetSelectedMember = this.resetSelectedMember.bind(this);
    this.search = this.search.bind(this);
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
          this.getSelecteMembers(users);
          this.props.updateEmployees(users, 'employeesForFilter')
        }
      })
      .catch((error) => {this.setState({loading: false }); });
  };

  setStartDate(startDate) {
    this.setState({
      startDate: startDate,
      endDate: startDate > this.state.endDate ? startDate : this.state.endDate,
    });
  }

  setEndDate(endDate) {
    this.setState({
      endDate: endDate,
    });
  }

  search() {
    const {selectedMembers} = this.state
    const checkedMemberUsernames = (selectedMembers || []).map(item => item.username);
    this.props.clickSearch(this.state.startDate, this.state.endDate, this.state.checkedMemberIds, checkedMemberUsernames);
    this.props.updateEmployees(selectedMembers, 'employeeSelectedFilter')
  }

  getSelecteMembers(data) {
    this.setState(
      {
        users: data,
        showMemberOption: false,
        selectedMembers: (data.filter(a => a.checked)),
        checkedMemberIds: (data.filter(a => a.checked).map(m => m.uid))
      });
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
  }
  onCloseAllEvent() {
    this.resetSelectedMember();
  }

  render() {
    const { t } = this.props;
    let hrProfileDisplay = [];
    if (this.state.users && this.state.users.length > 0) {
      hrProfileDisplay = this.state.users.map((profile) => {
        return {
          uid: profile.uid,
          fullname: profile.fullname,
          job_name: profile.job_name,
          part: profile.part || "",
          division: profile.division || "",
          department: profile.department || "",
          unit: profile.unit || "",
          companyCode: profile.organization_lv2,
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
      <>
        <div className="timesheet-box shadow">
          <div className="row">
            {

              this.props.useDateFilter === false ? null :
                <>
                  <div className="col-lg-3">
                    <div className="title">{t("From")}</div>
                    <div className="content input-container">
                        <DatePicker
                          name="startDate"
                          selectsStart
                          selected={this.state.startDate}
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          onChange={this.setStartDate}
                          dateFormat="dd/MM/yyyy"
                          locale="vi"
                          className="form-control"
                        />
                        <span className="ic-calendar">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="title">{t("To")}</div>
                    <div className="content input-container">
                        <DatePicker
                          name="endDate"
                          selectsEnd
                          selected={this.state.endDate}
                          minDate={this.state.startDate}
                          startDate={this.state.startDate}
                          endDate={this.state.endDate}
                          maxDate={this.addDays(this.state.startDate, 31)}
                          onChange={this.setEndDate}
                          dateFormat="dd/MM/yyyy"
                          locale="vi"
                          className="form-control"
                        />
                        <span className="ic-calendar">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                    </div>
                  </div>
                </>
            }
            <div className="col-lg-3">
              <div className="title">{t("staff_selection_label")}</div>
              <SelectTab className="content input-container" selectedMembers={this.state.selectedMembers} onClick={this.onClickSelectTab}
                onCloseTab={this.onCloseTabEvent} onCloseAll={this.onCloseAllEvent} />
              {this.state.showMemberOption ? (
                //employeeGrTree
                <MemberOption loading={this.state.loading} data={hrProfileDisplay} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={this.props.type} />
              ) : null}
            </div>
            <div className="col-lg-3">
              <div className="title">&nbsp;</div>
              <div className="content">
                <button
                  type="button"
                  className="btn btn-warning btn-search"
                  onClick={this.search}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withTranslation()(FilterData);
