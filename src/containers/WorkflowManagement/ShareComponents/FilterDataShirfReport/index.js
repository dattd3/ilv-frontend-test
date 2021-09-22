
import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import { trimString } from "../../../Utils/StringHelpers"
import MemberOption from "../MemberOption"
import Constants from '../../../../commons/Constants'
import { saveAs } from 'file-saver'
registerLocale("vi", vi);

class FilterDataShirfReport extends React.Component {
  constructor() {
    super();
    this.state = {
      startDate: moment(
        this.getClosingSalaryDatePreMonth(),
        "DD/MM/YYYY"
      ).toDate(),
      endDate: new Date(),
      users: [],
      checkedMemberIds: [],
      selectedMembers: [],
      showMemberOption: false,
      reportType: -1,
      errors: {}
    };

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.onShowMembers = this.onShowMembers.bind(this);
    this.onHideMembers = this.onHideMembers.bind(this);
    this.getSelecteMembers = this.getSelecteMembers.bind(this);
    this.resetSelectedMember = this.resetSelectedMember.bind(this);
    this.dowload = this.dowload.bind(this);
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
          this.setState({ users: users });
        }
      })
      .catch((error) => { });
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

  dowload() {
    const isValidData = this.isValidDataToCreate()
    if (!isValidData) {
      return;
    }
    let ids = null;
    if (this.state.checkedMemberIds !== null && this.state.checkedMemberIds !== []) ids = this.state.checkedMemberIds;
    if (this.state.reportType === 1) ids = null;
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      responseType: 'blob'
    }

    const data = {
      reportType: this.state.reportType,
      employeeCodes: ids,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}report/shift`, JSON.stringify(data), config)
      .then(responses => {
        if (responses && responses.data !== null && responses.data.size !== 123 && responses.data.size !== 147) {
          this.resetErrors();
          if (responses.status === 200) {
            const blob = new Blob([responses.data], { type: "text/plain;charset=utf-8" })
            saveAs(blob, "Báo cáo thay đổi phân ca.xlsx")
          } else {
            console.log('error');
          }
        } else {
          const err = this.state.errors;
          const errNew = {
            ...err,
            data: "Không có dữ liệu!"
          }
          this.setState({ errors: errNew });
        }

      }).catch(error => {
        console.log(error);
      })
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
    this.resetErrors();
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

  resetErrors() {
    this.setState({ errors: null })
  }

  isValidDataToCreate() {
    let isValid = true
    if (this.state.reportType === -1) {

      const err = this.state.errors;
      const errNew = {
        ...err,
        type: "Vui lòng chọn loại báo cáo!"
      }
      this.setState({ errors: errNew });
      isValid = false;
    }
    return isValid;
  }

  addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

  handleSelectChange(type) {
    this.resetErrors();
    this.setState({ reportType: type.value });
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

    const customStyles = {
      control: base => ({
        ...base,
        height: 35,
        minHeight: 35
      })
    };
    const reportTypes = [
      { value: Constants.TYPE_REPORT.DETAIL_REPORT, label: t("DetailReport") },
      { value: Constants.TYPE_REPORT.SUMARY_REPORT, label: t("SumaryReport") }
    ];

    const renderErrors = name => {
      return this.state.errors && this.state.errors[name] ? <div className="text-danger mt-3">{this.state.errors[name]}</div> : null
    }

    return (
      <>
        <div className="timesheet-box shadow">
          <div className="row">
            <div className="col-lg-3">
              <div className="title">{t("LabelTypeReport")}</div>
              <Select name="reportType"
                styles={customStyles}
                // defaultValue={this.props.filterdata[0]}
                isClearable={false}
                onChange={type => this.handleSelectChange(type)}
                placeholder={t('Select')} key="reportType" options={reportTypes} />
              {renderErrors("type")}
            </div>
            {this.state.reportType === Constants.TYPE_REPORT.DETAIL_REPORT &&
              <div className="col-lg-3">
                <div className="title">{t("staff_selection_label")}</div>
                <div className="content input-container d-flex" onClick={this.onShowMembers}>
                  <div className="box-input d-flex justify-content-between" data-toggle="tooltip" data-placement="top" title={this.state.selectedMembers.map(u => u.fullname).toString()}>
                    {this.state.selectedMembers.length > 0 ? trimString(this.state.selectedMembers.map(u => u.fullname).toString(), 18, '...') : <i className="text-secondary" style={{ fontSize: "16px" }}>{t("staff_selection_label")}</i>}
                  </div>
                  <div className="box-icon">
                    {
                      this.state.selectedMembers.length > 1 ?
                        <div className="number-selected">{this.state.selectedMembers.length}</div>
                        : <i className="fa fa-sort-down"></i>
                    }
                  </div>
                </div>
                {this.state.showMemberOption ? (
                  //employeeGrTree
                  <MemberOption data={hrProfileDisplay} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={this.props.type} />
                ) : null}
              </div>
            }

            {

              this.props.useDateFilter === false ? null :
                <>
                  <div className="col-lg-2">
                    <div className="title">{t("From")}</div>
                    <div className="content input-container">
                      <label>
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
                        <span className="input-group-addon input-img">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="title">{t("To")}</div>
                    <div className="content input-container">
                      <label>
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
                        <span className="input-group-addon input-img">
                          <i className="fas fa-calendar-alt"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                </>
            }

            <div className="col-lg-2">
              <div className="title">&nbsp;</div>
              <div className="content">
                <button
                  type="button"
                  style={{ height: "35px" }}
                  className="btn btn-primary"
                  onClick={this.dowload}
                >
                  <i className="fas fa-download mr-1"></i>
                  {t("LabelDownloadReport")}
                </button>
              </div>
            </div>
          </div>

        </div>
        {renderErrors("data")}
      </>
    );
  }
}

export default withTranslation()(FilterDataShirfReport);
