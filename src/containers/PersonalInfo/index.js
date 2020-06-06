import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';

class MyComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userProfile: {},
      userDetail: {}
    };
  }

  componentDidMount() {
    let config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }

    axios.get(process.env.REACT_APP_MULE_HOST + 'user/profile', config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userProfile = res.data.data[0];
          this.setState({ userProfile: userProfile });
        }
      }).catch(error => console.log("Call API error:", error));


    axios.get(process.env.REACT_APP_MULE_HOST + 'user/profile/details', config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let userDetail = res.data.data[0];
          this.setState({ userDetail: userDetail });
        }
      }).catch(error => {
        console.log("Call API error:", error);

      });
  }

  render() {

    const { t } = this.props;

    return (
      <div className="personal-info">
        <h1 className="h3 mb-3 text-uppercase text-gray-800">{t("PersonalInformation")}</h1>
        <Tabs defaultActiveKey="PersonalInformation" id="uncontrolled-tab-example">
          <Tab eventKey="PersonalInformation" title={t("PersonalInformation")}>
            <Container fluid className="info-tab-content">
              <Row>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("FirstAndLastName")}</label>
                    <p className="info-value">{this.state.userDetail.fullname}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("EmployeeCode")}</label>
                    <p className="info-value">{this.state.userDetail.uid}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("SocialInsuranceNumber")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("TaxCode")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("DateOfBirth")}</label>
                    <p className="info-value">{this.state.userDetail.birthday}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("PlaceOfBirth")}</label>
                    <p className="info-value">{this.state.userDetail.birth_province}</p>
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("Sex")}</label>
                    <p className="info-value">{(this.state.userDetail.gender !== undefined && this.state.userDetail.gender !== '2') ? t("Male") : t("Female")}</p>
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("Nationality")}</label>
                    <p className="info-value">{this.state.userDetail.nationality}</p>
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("Ethnic")}</label>
                    <p className="info-value">{this.state.userDetail.ethinic}</p>
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("Religion")}</label>
                    <p className="info-value">{(this.state.userDetail.religion === undefined || this.state.userDetail.religion === null) ? t("None") : this.state.userDetail.religion}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("IdentityPasportNo")}</label>
                    <p className="info-value">{this.state.userDetail.passport_no}</p>
                  </Form.Group>
                </Col>
                <Col sm className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("DateIssue")}</label>
                    <p className="info-value">{this.state.userDetail.date_of_issue}</p>
                  </Form.Group>
                </Col>
                <Col sm className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("PlaceIssue")}</label>
                    <p className="info-value">{this.state.userDetail.place_of_issue}</p>
                  </Form.Group>
                </Col>
                <Col sm className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("WorkPermitNo")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col sm className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("WorkPermitExpireDate")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={5} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("PermanentAddress")}</label>
                    <p className="info-value">{this.state.userDetail.wards}, {this.state.userDetail.district}, {this.state.userDetail.province}, {this.state.userDetail.nation}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={5} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("TemporaryAddress")}</label>
                    <p className="info-value">{this.state.userDetail.tmp_wards}, {this.state.userDetail.tmp_district}, {this.state.userDetail.tmp_province}, {this.state.userDetail.tmp_nation}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("MaritalStatus")}</label>
                    <p className="info-value">{this.state.userDetail.marital_status}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("GroupJoinedDate")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("CompanyJoinedDate")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("CompanyEmail")}</label>
                    <p className="info-value">{this.state.userProfile.company_email}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("MobilePhone")}</label>
                    <p className="info-value">{this.state.userDetail.cell_phone_no}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("CurrentTitle")}</label>
                    <p className="info-value">{this.state.userProfile.job_name}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("LevelByTitle")}</label>
                    <p className="info-value">{this.state.userProfile.rank_name}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("ActualLevel")}</label>
                    <p className="info-value">{this.state.userProfile.rank_name}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("BenefitLevel")}</label>
                    <p className="info-value">{this.state.userProfile.benefit_level}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("DepartmentName")}</label>
                    <p className="info-value">{this.state.userProfile.unit}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("RegionName")}</label>
                    <p className="info-value">{this.state.userProfile.division}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("PropertyName")}</label>
                    <p className="info-value">{this.state.userProfile.department}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={5} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("WorkingAddress")}</label>
                    <p className="info-value">{this.state.userProfile.wards}, {this.state.userProfile.district}, {this.state.userProfile.province}, {this.state.userProfile.nation}</p>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={4} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("BankAccountNumber")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>

                <Col xs={12} md={6} lg={4} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("BankName")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("BankBranch")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="Diploma" title={t("Diploma") + `/` + t("Certificate")}>
            <Container fluid className="info-tab-content">
              {
                (this.state.userDetail.education !== undefined && this.state.userDetail.education.length > 0) ?
                  <><h4>{t("Diploma")}</h4>
                    {this.state.userDetail.education.map((item, i) => {
                      return <Row>
                        <Col xs={12} md={6} lg={3} className="info-item mb-3">
                          <Form.Group as={Col}>
                            <label>{t("SchoolName")}</label>
                            <p className="info-value">{item.university_name}</p>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6} lg={3} className="info-item mb-3">
                          <Form.Group as={Col}>
                            <label>{t("DiplomaType")}</label>
                            <p className="info-value">{item.academic_level}</p>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6} lg={3} className="info-item mb-3">
                          <Form.Group as={Col}>
                            <label>{t("Specialty")}</label>
                            <p className="info-value">{item.major}</p>
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6} lg={3} className="info-item mb-3">
                          <Form.Group as={Col}>
                            <label>{t("LearningTime")}</label>
                            <p className="info-value"></p>
                          </Form.Group>
                        </Col>
                      </Row>;
                    })}
                    {/* <h4>{t("Certificate")}</h4>
                    <Row>
                      <Col xs={12} md={6} lg={3} className="info-item mb-3">
                        <Form.Group as={Col}>
                          <label>{t("CertificateName")}</label>
                          <p className="info-value"></p>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} lg={3} className="info-item mb-3">
                        <Form.Group as={Col}>
                          <label>{t("CertificateIssuesBy")}</label>
                          <p className="info-value"></p>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} lg={3} className="info-item mb-3">
                        <Form.Group as={Col}>
                          <label>{t("CertificateIssuesDate")}</label>
                          <p className="info-value"></p>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} lg={3} className="info-item mb-3">
                        <Form.Group as={Col}>
                          <label>{t("CertificateExpireDate")}</label>
                          <p className="info-value"></p>
                        </Form.Group>
                      </Col>
                    </Row> */}
                  </>
                  : t("NoDataFound")
              }
            </Container>
          </Tab>
          <Tab eventKey="PersonalRelations" title={t("PersonalRelations")}>
            <Container fluid className="info-tab-content">
              <Row>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("FirstAndLastName")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={1} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("Relationship")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("DateOfBirth")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={2} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("AllowancesTaxNo")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={1} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("FamilyAllowances")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={3} className="info-item mb-3">
                  <Form.Group as={Col}>
                    <label>{t("AllowancesDate")}</label>
                    <p className="info-value">{/* asd */}</p>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Tab>
        </Tabs>
      </div>
    )
  }
}


const PersonInfo = withTranslation()(MyComponent)

export default function App() {
  return (
    <PersonInfo />
  );
}

