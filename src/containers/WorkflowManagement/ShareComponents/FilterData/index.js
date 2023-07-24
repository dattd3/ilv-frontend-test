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
import { getMuleSoftHeaderConfigurations } from "../../../../commons/Utils"
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
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
      error: {},
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
    const config = getMuleSoftHeaderConfigurations()

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/subordinate?depth=2`, config)
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

  isValidFilter = () => {
    const errorClone = { ...this.state.error }
    const selectedMembers = this.state.selectedMembers

    errorClone.employee = ''
    if (!selectedMembers || selectedMembers?.length === 0) {
      errorClone.employee = 'Vui lòng chọn Nhân viên!'
    }

    this.setState({ error: errorClone })
    return Object.values(errorClone).every(item => !item)
  }

  search() {
    const isValid = this.isValidFilter()

    if (!isValid) {
      return
    }

    const {selectedMembers, startDate, endDate, checkedMemberIds} = this.state
    const { type, clickSearch, updateEmployees } = this.props
    const checkedMemberUsernames = (selectedMembers || []).map(item => item.username)

    if (clickSearch) {
      clickSearch(startDate, endDate, selectedMembers, checkedMemberUsernames)
    }
    
    if (updateEmployees) {
      updateEmployees(selectedMembers, 'employeeSelectedFilter')
    }
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
    const { t, isUserRequired, type, useDateFilter } = this.props;
    const { users, startDate, endDate, selectedMembers, showMemberOption, loading, error } = this.state

    let hrProfileDisplay = [];
    if (users && users.length > 0) {
      hrProfileDisplay = (users || []).map((profile) => {
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
        <div className="timesheet-box search-block">
          <div className="row">
            {
              useDateFilter === false ? null :
                <>
                  <div className="col-md-3">
                    <div className="title">{t("From")}</div>
                    <label className="wrap-date-input">
                        <DatePicker
                          name="startDate"
                          selectsStart
                          selected={startDate}
                          startDate={startDate}
                          endDate={endDate}
                          onChange={this.setStartDate}
                          dateFormat="dd/MM/yyyy"
                          locale="vi"
                          className="form-control"
                        />
                        <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                    </label>
                  </div>
                  <div className="col-md-3">
                    <div className="title">{t("To")}</div>
                    <label className="wrap-date-input">
                        <DatePicker
                          name="endDate"
                          selectsEnd
                          selected={endDate}
                          minDate={startDate}
                          startDate={startDate}
                          endDate={endDate}
                          maxDate={this.addDays(startDate, 31)}
                          onChange={this.setEndDate}
                          dateFormat="dd/MM/yyyy"
                          locale="vi"
                          className="form-control"
                        />
                        <span className="input-group-addon input-img"><img src={IconDatePicker} alt="Date" /></span>
                    </label>
                  </div>
                </>
            }
            <div className="col-md-3">
              <div className="title">{t("staff_selection_label")}{isUserRequired && <span className="required">(*)</span>}</div>
              <SelectTab className="content input-container" selectedMembers={selectedMembers} onClick={this.onClickSelectTab}
                onCloseTab={this.onCloseTabEvent} onCloseAll={this.onCloseAllEvent} />
              { showMemberOption && (
                  <MemberOption loading={loading} data={hrProfileDisplay} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={type} />
                )
              }
            </div>
            <div className="col-md-3">
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
          { (error.employee) && <div className="required" style={{ margin: '10px 0 0 0' }}>{ error.employee }</div> }
        </div>
      </>
    );
  }
}

export default withTranslation()(FilterData);
