import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { Redirect, withRouter } from 'react-router-dom';
import map from '../map.config';
import Constants from "../../commons/Constants"
import { isEnableFunctionByFunctionName, getMuleSoftHeaderConfigurations, getRequestConfigurations } from "../../commons/Utils"
import { checkIsExactPnL } from '../../commons/commonFunctions';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      userDetail: {},
      userEducation: {},
      userFamily: {},
      userHealth: {},
      userDocument: {}
    };
  }

  componentDidMount() {
    const config = getRequestConfigurations()
    const muleSoftConfig = getMuleSoftHeaderConfigurations()

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userProfile = res.data.data[0];
          this.setState({ userProfile: userProfile });
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/personalinfo`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userDetail = res.data.data[0];
          this.setState({ userDetail: userDetail });
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/education`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userEducation = res.data.data;
          this.setState({ userEducation: userEducation });
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/family`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userFamily = res.data.data;
          this.setState({ userFamily: userFamily });
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/health`, muleSoftConfig)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userHealth = res.data.data[0];
          this.setState({ userHealth: userHealth });
        }
      }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_HRDX_URL}api/onboarding/staffdocument?EmployeeCode=${localStorage.getItem('employeeNo')}`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          this.prepareUserDocumentData(res.data.data);
        }
      })
  }

  prepareUserDocumentData = (data) => {
    const result = { status: data.status, documents: [] };
    let count = 0;
    const mapping = {};
    if (!data.staffDocumentTypeList)
      return;
    data.staffDocumentTypeList.forEach((item, index) => {
      let timeExpire = item.note;
      if (mapping[timeExpire] == undefined) {
        mapping[timeExpire] = count;
        count++;
        result.documents.push({ timExpire: item.note, documentList: [] });
      }
      const subItem = result.documents[mapping[timeExpire]];
      subItem.documentList.push({
        index: index + 1,
        name: item.description,
        number: '0' + item.quantity,
        timExpire: item.note,
        status: item.haveProfile
      });
      result.documents[mapping[timeExpire]] = subItem;
    });
    this.setState({ userDocument: result });
  }

  render() {
    const { t } = this.props
    const { userFamily } = this.state
    const isEnableEditProfile = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.editProfile)

    let defaultTab = new URLSearchParams(this.props.location.search).get("tab");
    defaultTab = defaultTab && defaultTab == 'document' ? 'PersonalDocument' : 'PersonalInformation';
    const documents = this.state.userDocument.documents;
    const checkVinfast = checkIsExactPnL(Constants.PnLCODE.VinFast, Constants.PnLCODE.VinFastPB, Constants.PnLCODE.VinFastTrading);

    function SummaryAddress(obj) {
      let result = '';
      if (typeof (obj) == 'object' && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          const element = obj[i];
          if (isNotNull(element)) {
            result += element + ', '
          }
        }
      }
      result = result.trim();
      if (result.length > 0) { result = result.substring(0, result.length - 1); }
      return result;
    }

    function isNotNull(input) {
      if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
        return true;
      }
      return false;
    }

    return (
      <div className="personal-info">
        <h1 className="content-page-header">{t("PersonalInformation")}</h1>
        <Tabs defaultActiveKey={defaultTab} id="uncontrolled-tab-example">
          <Tab eventKey="PersonalInformation" title={t("PersonalInformation")}>
            <div className="clearfix edit-button">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditProfile ? <a href="/personal-info/edit" className="btn btn-primary float-right shadow"><i className="fas fa-user-edit"></i> {t("Edit")}</a> : null
              }
            </div>
            <Row >
              <Col xs={12} md={12} lg={6}>
                <h4>{t("PersonalInformation")}</h4>
                <div className="info-tab-content shadow">
                  <table>
                    <tbody>
                      <tr>
                        <td className="info-label">{t("FullName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.fullname}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("EmployeeNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.uid}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("SocialInsuranceNumber")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.insurance_number}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("VinID")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.vinid}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PitNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.tax_number}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("DateOfBirth")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.birthday}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PlaceOfBirth")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.birth_province}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Gender")}</td>
                        <td className="info-value"><p>&nbsp;{(this.state.userDetail.gender !== undefined && this.state.userDetail.gender !== '2') ? t("Male") : t("Female")}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Country")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.nationality}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Ethnic")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.ethinic}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Religion")}</td>
                        <td className="info-value"><p>&nbsp;{isNotNull(this.state.userDetail.religion) ? this.state.userDetail.religion : t("None")}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("IdNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.personal_id_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("IdDateOfIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.pid_date_of_issue}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("IdPlaceOfIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.pid_place_of_issue}</p></td>
                      </tr>

                      <tr>
                        <td className="info-label">{t("PassportNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.passport_id_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PassportDateOfIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.passport_date_of_issue}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PassportPlaceOfIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.passport_place_of_issue}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkPermitNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.work_permit_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("ExpiryDate")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PermanentAddress")}</td>
                        <td className="info-value"><p>&nbsp;{SummaryAddress([this.state.userDetail.street_name, this.state.userDetail.wards, this.state.userDetail.district, this.state.userDetail.province])}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("TemporaryAddress")}</td>
                        <td className="info-value"><p>&nbsp;{SummaryAddress([this.state.userDetail.tmp_street_name, this.state.userDetail.tmp_wards, this.state.userDetail.tmp_district, this.state.userDetail.tmp_province])}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("MaritalStatus")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.marital_status_code === "1" ? t("MaritalMarried") : (this.state.userDetail.marital_status_code === "2" ? "Ly hôn" : t("MaritalSingle"))}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PersonalEmail")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.personal_email}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("MobileNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.cell_phone_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("EmergencyPhoneNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.urgent_contact_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BankAccountNumber")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.bank_number}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BankName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.bank_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BankBranch")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.bank_branch}</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6}>
                <h4>{t("WorkingInformation")}</h4>
                <div className="info-tab-content shadow">
                  <table>
                    <tbody>
                      <tr>
                        <td className="info-label">{t("VingroupOnboardDate")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.starting_date_inc}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PAndLOnboardDate")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.starting_date_co}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyEmail")}</td>
                        <td className="info-value" style={{ textTransform: "lowercase" }}><p>&nbsp;{this.state.userProfile.company_email}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CurrentTitle")}</td>
                        <td className="info-value"><p>&nbsp; {this.state.userProfile.current_position}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("GradeByTitle")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.rank_name_title}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("ActualGrade")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.rank_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BenefitLevel")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.benefit_level}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("DivisionName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.division}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PropertyName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.unit}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Team")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.part}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("RegionName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.department}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyPhone")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.fix_phone}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyPhoneExtension")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.extension_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkingAddress")}</td>
                        <td className="info-value"><p>&nbsp;{SummaryAddress([this.state.userProfile.building, this.state.userProfile.street_name, this.state.userProfile.wards, this.state.userProfile.district, this.state.userProfile.province])}</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {
                  (this.state.userHealth !== undefined && this.state.userHealth !== null) ?
                    <>
                      <h4>{t("HealthCheckInfo")}</h4>
                      <div className="info-tab-content shadow">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("HealthInsuranceNumber")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userProfile.health_insurance_number}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("RegisteredHospital")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userProfile.hospital_name}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("HealthCheckDate")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.examined_date}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfHealthCheck")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.health_type}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("OccupationalDisease")}</h4>
                      <div className="info-tab-content shadow">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateofOccupationalDiseaseDiagnosis")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.found_date}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.diseased_type}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.reason}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("AccidentsAtWork")}</h4>
                      <div className="info-tab-content shadow">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.accident_date}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("LocationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.place}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.accident_type}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.cause_accident}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                    : null
                }
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="Degree" title={t("Degree") + `/` + t("Certificate")}>
            <div className="clearfix edit-button">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditProfile ? <a href="/personal-info/edit" className="btn btn-primary float-right shadow"><i className="fas fa-user-edit"></i> {t("Edit")}</a> : null
              }
            </div>
            <Container fluid className="info-tab-content shadow">
              {
                (this.state.userEducation !== undefined && this.state.userEducation.length > 0) ?
                  <><h4>{t("Degree")}</h4>
                    {this.state.userEducation.map((item, i) => {
                      return <div key={i}>
                        <Row className="info-label">
                          <Col xs={12} md={6} lg={3}>
                            {t("SchoolName")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("TypeOfDegree")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("Major")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("Cohort")}
                          </Col>
                        </Row>
                        <Row className="info-value">
                          <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{isNotNull(item.university_name) ? item.university_name : item.other_uni_name}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.academic_level}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.major_id === 0 ? item.other_major : item.major}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>&nbsp;{item.from_time} - {item.to_time}</p>
                          </Col>
                        </Row>
                      </div>;
                    })}
                    {/* <h4>{t("Certificate")}</h4>
                    <Row>
                      <Col xs={12} md={6} lg={3}>
                          {t("CertificateName")}
                          
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                          {t("CertificateIssuesBy")}
                          
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                          {t("CertificateIssuesDate")}
                          
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                          {t("CertificateExpireDate")}
                          
                      </Col>
                    </Row> */}
                  </>
                  : t("NoDataFound")
              }
            </Container>
          </Tab>
          <Tab eventKey="PersonalRelations" title={t("Family")}>
            <div className="clearfix edit-button">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditProfile ? <a href="/personal-info/edit" className="btn btn-primary float-right shadow"><i className="fas fa-user-edit"></i> {t("Edit")}</a> : null
              }
            </div>
            <Container fluid className="info-tab-content shadow relationship">
              {(userFamily !== undefined && userFamily.length > 0) ?
                (userFamily || []).map((item, i) => {
                  return <div key={i} className="relationship-item">
                    <div className="info-label">
                      <div className="full-name">{t("FullName")}</div>
                      <div className="full-name">{t("Relationship")}</div>
                      <div className="full-name">{t("DateOfBirth")}</div>
                      <div className="full-name">{t("AllowancesTaxNo")}</div>
                      <div className="full-name">{t("FamilyAllowances")}</div>
                      <div className="full-name">{t("AllowancesDate")}</div>
                    </div>
                    <div className="info-value">
                      <div className="full-name"><input type="text" value={item.full_name || ""} disabled={true} /></div>
                      <div className="full-name"><input type="text" value={item.relation || ""} disabled={true} /></div>
                      <div className="full-name"><input type="text" value={item.dob || ""} disabled={true} /></div>
                      <div className="full-name"><input type="text" value={item.tax_number || ""} disabled={true} /></div>
                      <div className="full-name">{t("FamilyAllowances")}</div>
                      <div className="full-name">{t("AllowancesDate")}</div>
                    </div>

                    <Row className="info-value">
                      <Col xs={12} md={6} lg={2}>
                        <p>&nbsp;{item.full_name}</p>
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        <p>&nbsp;{item.relation}</p>
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        <p>&nbsp;{item.dob}</p>
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        <p>&nbsp;{isNotNull(item.tax_number) ? item.tax_number : ""}</p>
                      </Col>
                      <Col xs={12} md={6} lg={1}>
                        <p style={{ background: "none" }}>&nbsp;{isNotNull(item.is_reduced) ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <p>&nbsp;{isNotNull(item.is_reduced) ? (item.from_date + ` - ` + item.to_date) : ""}</p>
                      </Col>
                    </Row>
                  </div>;
                }) : t("NoDataFound")
              }
            </Container>
          </Tab>
          {
           /*  checkIsExactPnL(Constants.PnLCODE.Vinpearl) || checkVinfast  ?  */
            checkIsExactPnL(Constants.PnLCODE.Vinpearl) ? // open for golive1106
              <Tab eventKey="PersonalDocument" title={t("PersonalDocuments")}>
                <Row >
                  {documents && documents.length > 0 ? <>
                    <Col xs={12} md={12} lg={12}>
                      <p className="status">Tình trạng: {this.state.userDocument.status ? <span className="color-success">Đủ</span> : <span className="color-fail">Thiếu</span>}</p>
                      <div className="document-content shadow">
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: '2%' }}>STT</th>
                              <th style={{ width: '66%' }}>Danh mục hồ sơ CBNV</th>
                              <th style={{ width: '2%' }}>SL</th>
                              {!checkVinfast && <th style={{ width: '11%' }}>Thời hạn nộp</th>}
                              <th style={{ width: '8%' }}>Tình trạng</th>
                            </tr>
                          </thead>
                          <tbody>

                            {
                              (documents || []).map((obj) => {
                                if (!obj || !obj.documentList || obj.documentList.length === 0)
                                  return null;

                                return obj.documentList.map((item, index) => {
                                  if (index === 0) {
                                    return <tr key={index}>
                                      <td >{item.index}</td>
                                      <td className="name">{item.name}</td>
                                      <td >{item.number}</td>
                                      {!checkVinfast && <td rowSpan={obj.documentList.length}>{item.timExpire}</td>}
                                      <td> <input type="checkbox" checked={item.status} readOnly /> </td>
                                    </tr>
                                  } else {
                                    return <tr key={index}>
                                      <td >{item.index}</td>
                                      <td className="name">{item.name}</td>
                                      <td >{item.number}</td>

                                      <td> <input type="checkbox" checked={item.status} readOnly /> </td>
                                    </tr>
                                  }
                                })
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </> :
                    <Container fluid className="info-tab-content shadow">
                      {t("NoDataFound")}
                    </Container>
                  }
                </Row>
              </Tab>
              : null
          }

        </Tabs>
      </div >
    )
  }
}

const PersonInfo = withTranslation()(withRouter(MyComponent))

export default function App() {
  return (
    <PersonInfo />
  );
}

