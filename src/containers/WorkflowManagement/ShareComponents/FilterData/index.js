import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { withTranslation } from "react-i18next";
// import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import vi from "date-fns/locale/vi";
import axios from "axios";
import { InputGroup, FormControl } from 'react-bootstrap'
import { trimString } from "../../../Utils/StringHelpers"
registerLocale("vi", vi);

const MemberOption = (props, onChange) => {
  const { innerProps, innerRef } = props.data;
  // const [checkedAll, setCheckedAll] = useState(false);
  const [members, setMembers] = useState(props.data);
  const [memberDefault] = useState(props.data);

  const handleAllChecked  = event => {
    const newMembers = [...members];
    newMembers.forEach(member => member.checked = event.target.checked) 
    setMembers(newMembers);
  }

  const handleChange = event => {
    const newMembers = [...members];
    newMembers.forEach(member => {
      if (props.type === 'singleChoice') {
        member.checked = false;
      }
       if (member.uid === parseInt(event.target.value))
       member.checked =  event.target.checked
    })
    setMembers(newMembers);
  };

  const onSearch = event => {
    console.log(event.target.value);
    const  newMembers = [...memberDefault];
    const filtered  = event.target.value ? newMembers.filter(member => {return member.fullname.toLowerCase().includes(event.target.value.toLowerCase())}) : [...memberDefault];
    setMembers(filtered);
  }

  const confirmSelectedMember = () => {
    props.saveSelectedMember(members)
  }
  return (
    <>
    <div className="member-list">
      <div className="action bg-light d-flex justify-content-center p-2">
        <button type="button" className="btn btn-secondary btn-sm mr-2" onClick={props.hideMembers}>Đóng</button>
        <button type="button" className="btn btn-primary btn-sm"  onClick={confirmSelectedMember}>Áp dụng</button>
      </div>
      <div className="mt-2 p-2">
          {/* <input type="text" className="fomr-control" onChange={onSearch}/> */}
          <InputGroup className="">
            <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder='Tìm kiếm'
              aria-label="SearchRequester"
              aria-describedby="basic-addon2"
              onChange={onSearch}/> 
          </InputGroup>
        </div>
      <div className="show-list p-1"> 
        <div>
          {
            props.type !== 'singleChoice' ? 
            <div className="d-flex border-bottom text-dark btn ">
            <input type="checkbox" className="mtmr5"  value="checkedall" onChange={handleAllChecked} checked={members.filter(m => m.checked).length === members.length}/>
            <div className="float-left text-left text-wrap w-75">
              <div className="">Tất cả</div>
            </div>
          </div> : null
          }
        </div>
        
        {members.map((item, index) => {
          return (
            <div key={item.uid} ref={innerRef} {...innerProps}>
              <div className="d-flex border-bottom text-dark btn ">
                {
                  props.type !== 'singleChoice' ?
                  <input type="checkbox" className="mtmr5" value={item.uid} name={item.uid} checked={item.checked}
                  onChange={handleChange}/> : 
                  <input type="radio" className="mtmr5" id={item.uid} value={item.uid} name="flexRadioDefault" checked={item.checked} onChange={handleChange}/>
                }
               
                <div className="float-left text-left text-wrap w-75">
                    <div className="">{item.fullname}</div>
                  <div className="text-xs">
                    <span>{item.job_name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
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
      checkedMemberIds: [],
      selectedMembers: [],
      showMemberOption: false,
    };

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.onShowMembers = this.onShowMembers.bind(this);
    this.onHideMembers = this.onHideMembers.bind(this);
    this.getSelecteMembers = this.getSelecteMembers.bind(this);
    this.search = this.search.bind(this);
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
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/subordinate`,
        config
      )
      .then((res) => {
        if (res && res.data && res.data.data) {
          const users = res.data.data || [];
          this.setState({ users: users });
        }
      })
      .catch((error) => {});
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
    this.props.clickSearch(this.state.startDate, this.state.endDate, this.state.checkedMemberIds);
  }

  getSelecteMembers (data) {
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

  addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
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
          // userid: profile.company_email.includes("@") ? profile.company_email.split("@")[0] : profile.company_email,
          checked: profile.checked || false 
        };
      });
    }

    return (
      <>
        <div className="timesheet-box shadow">
          {this.state.showMemberOption ? (
            <MemberOption data={hrProfileDisplay} hideMembers={this.onHideMembers} saveSelectedMember={this.getSelecteMembers} type={this.props.type}/>
          ) : null}

          <div className="row">
            <div className="col-lg-3">
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
            <div className="col-lg-3">
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
            <div className="col-lg-3">
              <div className="title">{t("Lựa chọn nhân viên")}</div>
              <div className="content input-container d-flex" onClick={this.onShowMembers}>
                <div className="box-input d-flex justify-content-between" data-toggle="tooltip" data-placement="top" title={this.state.selectedMembers.map(u=>u.fullname).toString()}>
                  {this.state.selectedMembers ? trimString(this.state.selectedMembers.map(u=>u.fullname).toString(),18,'...') : ''}
                </div>
                <div className="box-icon">
                  {
                    this.state.selectedMembers.length > 1 ?
                    <div className="number-selected">{this.state.selectedMembers.length }</div> 
                    : <i className="fa fa-sort-down"></i>
                  }
                  </div> 
              </div>
            </div>
            <div className="col-lg-3">
              <div className="title">&nbsp;</div>
              <div className="content">
                <button
                  type="button"
                  className="btn btn-warning btnSearch"
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
