import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';

class MyComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userProfile: {},
      userDetail: {},
      userEducation: {},
      userFamily: {},
      userHealth: {}
    };
  }

  componentDidMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/profile`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userProfile = res.data.data[0];
          this.setState({ userProfile: userProfile });
        }
      }).catch(error => {
        localStorage.clear();
        window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/personalinfo`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userDetail = res.data.data[0];
          this.setState({ userDetail: userDetail });
        }
      }).catch(error => {
        localStorage.clear();
        window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userEducation = res.data.data[0];
          this.setState({ userEducation: userEducation });
        }
      }).catch(error => {
        localStorage.clear();
        window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/family`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userFamily = res.data.data[0];
          this.setState({ userFamily: userFamily });
        }
      }).catch(error => {
        localStorage.clear();
        window.location.href = map.Login;
      });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/health`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userHealth = res.data.data[0]; console.log(userHealth.length);
          this.setState({ userHealth: userHealth });
        }
      }).catch(error => {
        localStorage.clear();
        window.location.href = map.Login;
      });
  }

  render() {

    function SummaryAddress(obj) {
      let result = '';
      if (typeof (obj) == 'object' && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          const element = obj[i];
          if (isNotNull(element) !== '') {
            result += element + ', '
          }
        }
      }
      result = result.trim();
      if (result.length > 0) { result = result.substring(0, result.length - 1); }
      return result;
    }

    function isNotNull(input) {
      if (input !== undefined && input !== null && input !== 'null' && input !== '' && input !== '#') {
        return input;
      }
      return '';
    }

    const { t } = this.props;
    
    return (
      <div className="personal-info">
        <h1 className="h3 text-uppercase text-gray-800">{t("PersonalInformation")}</h1>
        <Tabs defaultActiveKey="PersonalInformation" id="uncontrolled-tab-example">
          <Tab eventKey="PersonalInformation" title={t("PersonalInformation")}>
            <Row >
              <Col xs={12} md={12} lg={6}>
                <h4>{t("PersonalInformation")}</h4>
                <div className="info-tab-content">
                  <table>
                    <tbody>
                      <tr>
                        <td className="info-label">{t("FirstAndLastName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.fullname}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("EmployeeCode")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.uid}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("SocialInsuranceNumber")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("TaxCode")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
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
                        <td className="info-label">{t("Sex")}</td>
                        <td className="info-value"><p>&nbsp;{(this.state.userDetail.gender !== undefined && this.state.userDetail.gender !== '2') ? t("Male") : t("Female")}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Nationality")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.nationality}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Ethnic")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.ethinic}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Religion")}</td>
                        <td className="info-value"><p>&nbsp;{isNotNull(this.state.userDetail.religion) ? t("None") : this.state.userDetail.religion}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("IdentityPasportNo")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.passport_no}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("DateIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.date_of_issue}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PlaceIssue")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.place_of_issue}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkPermitNo")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkPermitExpireDate")}</td>
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
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.marital_status_code === "1" ? t("MaritalMarried") : t("MaritalSingle")}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PersonalEmail")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.personal_email}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("MobilePhone")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userDetail.cell_phone_no}</p></td>
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
                <div className="info-tab-content">
                  <table>
                    <tbody>
                      <tr>
                        <td className="info-label">{t("GroupJoinedDate")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyJoinedDate")}</td>
                        <td className="info-value"><p>&nbsp;</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyEmail")}</td>
                        <td className="info-value" style={{ textTransform: "lowercase" }}><p>&nbsp;{this.state.userProfile.company_email}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CurrentTitle")}</td>
                        <td className="info-value"><p>&nbsp; {this.state.userProfile.job_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("LevelByTitle")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.group_title_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("ActualLevel")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.rank_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BenefitLevel")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.benefit_level}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("DepartmentName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.unit}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("RegionName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.division}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PropertyName")}</td>
                        <td className="info-value"><p>&nbsp;{this.state.userProfile.department}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkingAddress")}</td>
                        <td className="info-value"><p>&nbsp;{SummaryAddress([this.state.userProfile.wards, this.state.userProfile.district, this.state.userProfile.province])}</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {
                  (this.state.userHealth !== undefined && this.state.userHealth !== null) ?
                    <>
                      <h4>{t("HealthCheckInfo")}</h4>
                      <div className="info-tab-content">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("HealthCheckDate")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.EXAMINED_DATE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfHealthCheck")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.HEALTH_TYPE}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("OccupationalDisease")}</h4>
                      <div className="info-tab-content">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateofOccupationalDiseaseDiagnosis")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.FOUND_DATE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.DISEASED_TYPE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.REASON}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("AccidentsAtWork")}</h4>
                      <div className="info-tab-content">
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.ACCIDENT_DATE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("LocationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.PLACE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.ACCIDENT_TYPE}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{this.state.userHealth.CAUSE_ACCIDENT}</p></td>
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
          <Tab eventKey="Diploma" title={t("Diploma") + `/` + t("Certificate")}>
            <Container fluid className="info-tab-content">
              {
                (this.state.userEducation !== undefined && this.state.userEducation.length > 0) ?
                  <><h4>{t("Diploma")}</h4>
                    {this.state.userDetail.education.map((item, i) => {
                      return <div key={i}>
                        <Row className="info-label">
                          <Col xs={12} md={6} lg={3}>
                            {t("SchoolName")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("DiplomaType")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("Specialty")}
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            {t("LearningTime")}
                          </Col>
                        </Row>
                        <Row className="info-value">
                          <Col xs={12} md={6} lg={3}>
                            <p>{isNotNull(item.university_name) ? item.university_name : item.other_uni_name}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>{item.academic_level}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>{item.major}</p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>{item.from_time} - {item.to_time}</p>
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
          <Tab eventKey="PersonalRelations" title={t("PersonalRelations")}>
            <Container fluid className="info-tab-content">
              {(this.state.userFamily !== undefined && this.state.userFamily.length > 0) ?
                this.state.userFamily.map((item, i) => {
                  return <div key={i}>
                    <Row className="info-label">
                      <Col xs={12} md={6} lg={3}>
                        {t("FirstAndLastName")}
                      </Col>
                      <Col xs={12} md={6} lg={1}>
                        {t("Relationship")}
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        {t("DateOfBirth")}
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        {t("AllowancesTaxNo")}
                      </Col>
                      <Col xs={12} md={6} lg={1}>
                        {t("FamilyAllowances")}
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        {t("AllowancesDate")}
                      </Col>
                    </Row>
                    <Row className="info-value">
                      <Col xs={12} md={6} lg={3}>
                        <p>{item.full_name}</p>
                      </Col>
                      <Col xs={12} md={6} lg={1}>
                        <p>{item.relation}</p>
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        <p>{item.dob}</p>
                      </Col>
                      <Col xs={12} md={6} lg={2}>
                        <p>{item.tax_number}</p>
                      </Col>
                      <Col xs={12} md={6} lg={1}>
                        <p>{item.is_reduceed}</p>
                      </Col>
                      <Col xs={12} md={6} lg={3}>
                        <p>{item.from_date} - {item.to_date}</p>
                      </Col>
                    </Row>
                  </div>;
                }) : t("NoDataFound")
              }
            </Container>
          </Tab>
        </Tabs>
      </div >
    )
  }
}

const PersonInfo = withTranslation()(MyComponent)

export default function App() {
  return (
    <PersonInfo />
  );
}

