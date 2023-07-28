
import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import SelectTab from "../SelectTab"
import MemberOption from "../MemberOption"
import Constants from '../../../../commons/Constants'
import { saveAs } from 'file-saver'
import { getMuleSoftHeaderConfigurations } from "../../../../commons/Utils"
import { IS_VINFAST } from "commons/commonFunctions";
import Spinner from 'react-bootstrap/Spinner';
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconDownload from 'assets/img/icon/ic_download.svg'

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
      loading: true,
      checkedMemberIds: [],
      selectedMembers: [],
      showMemberOption: false,
      reportType: -1,
      errors: {},
      isLoading: false
    };

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.onShowMembers = this.onShowMembers.bind(this);
    this.onHideMembers = this.onHideMembers.bind(this);
    this.getSelecteMembers = this.getSelecteMembers.bind(this);
    this.resetSelectedMember = this.resetSelectedMember.bind(this);
    this.download = this.download.bind(this);
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
        }
      })
      .catch((error) => { this.setState({ loading: false }); });
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

  download() {
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
      startDate: moment(this.state.startDate).format("YYYY-MM-DD[T]00:00:00.000"),
      endDate: moment(this.state.endDate).format("YYYY-MM-DD[T]23:59:59.999")
    }
    const { t } = this.props;
    this.setState({
      isLoading: true
    })
    axios.post(`${process.env.REACT_APP_REQUEST_URL}report/shift`, JSON.stringify(data), config)
      .then(async (responses) => {

        if (responses.status === 200 && responses.headers['content-type'] === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          this.resetErrors();
          const blob = new Blob([responses.data], { type: "text/plain;charset=utf-8" })
          let fileName = "";
          switch (this.state.reportType) {
            case 0:
              fileName = "ReportDetail"
              break;
            case 1:
              fileName = "ReportSummary"
              break;
            case 2:
              fileName = 'ReportTimesheetSummary';
              break;
            default:
              fileName = "Report"
              break;
          }
          saveAs(blob, `${fileName}_${moment(new Date(), 'MM-DD-YYYY_HHmmss').format('MM-DD-YYYY_HHmmss')}.xlsx`)
        } else {
          const err = this.state.errors;
          const errNew = {
            ...err,
            data: t("NodataExport")
          }
          this.setState({ errors: errNew });
        }
      }).catch(error => {
        console.log(error);
      }).finally(() => {
        this.setState({
          isLoading: false
        })
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
    let isValid = true;
    const { t } = this.props;
    if (this.state.reportType === -1) {

      const err = this.state.errors;
      const errNew = {
        ...err,
        type: t("SelectReportType")
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
        height: 38,
        minHeight: 38
      })
    };
    const reportTypes = [
      { value: Constants.TYPE_REPORT.DETAIL_REPORT, label: t("DetailReport") },
      { value: Constants.TYPE_REPORT.SUMARY_REPORT, label: t("SumaryReport") },
    ];
    if(IS_VINFAST) {
      reportTypes.push({ value: Constants.TYPE_REPORT.TIMESHEET_REPORT, label: t("TimesheetSumaryReport") });
    }

    const renderErrors = name => {
      return this.state.errors && this.state.errors[name] ? <div className="text-danger mt-3">{this.state.errors[name]}</div> : null
    }

    return (
      <>
        {/* <LoadingModal show={this.state.isLoading} /> */}
        <div className="timesheet-box export-form">
          <div className="row">
            <div className="col-md-3">
              <div className="title">{t("LabelTypeReport")}</div>
              <Select name="reportType"
                styles={customStyles}
                // defaultValue={this.props.filterdata[0]}
                isClearable={false}
                onChange={type => this.handleSelectChange(type)}
                placeholder={t('Select')} key="reportType" options={reportTypes} />
              {renderErrors("type")}
            </div>
            {(this.state.reportType === Constants.TYPE_REPORT.DETAIL_REPORT || this.state.reportType === Constants.TYPE_REPORT.TIMESHEET_REPORT) &&
              <div className="col-md-3">
                <div className="title">{t("staff_selection_label")}</div>
                <SelectTab className="content input-container" selectedMembers={this.state.selectedMembers} onClick={this.onClickSelectTab}
                  onCloseTab={this.onCloseTabEvent} onCloseAll={this.onCloseAllEvent} />
                {this.state.showMemberOption ? (
                  //employeeGrTree
                  <MemberOption loading={this.state.loading} data={hrProfileDisplay} hideMembers={this.onHideMembers} resetSelectedMember={this.resetSelectedMember} saveSelectedMember={this.getSelecteMembers} type={this.props.type} />
                ) : null}
              </div>
            }
            {
              this.props.useDateFilter === false ? null :
                <>
                  <div className="col-md-3">
                    <div className="title">{t("From")}</div>
                    <label className="content input-container">
                      <DatePicker
                        name="startDate"
                        selectsStart
                        selected={this.state.startDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.setStartDate}
                        dateFormat="dd/MM/yyyy"
                        locale="vi"
                        className="form-control date-input"
                      />
                      <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                    </label>
                  </div>
                  <div className="col-md-3">
                    <div className="title">{t("To")}</div>
                    <label className="content input-container">
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
                        className="form-control date-input"
                      />
                      <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                    </label>
                  </div>
                </>
            }
            <div className="col-md-3">
              <div className="title">&nbsp;</div>
              <div className="content">
                <button
                  type="button"
                  className="btn btn-primary btn-export"
                  onClick={this.download}
                  disabled={this.state.isLoading}
                >
                  {
                    this.state.isLoading ? <Spinner animation="border" size="sm" /> : <>
                      <img src={IconDownload} alt="Download" />
                      {t("LabelDownloadReport")}
                    </>
                  }
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
