import React from "react"
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import moment from "moment"
import Constants from "commons/Constants"
import { formatStringByMuleValue, marriageConfig } from "commons/Utils"

function MainInfoList(props) {
    const { t } = useTranslation()
    const { userDetail, userHealth, userProfile } = props

    const summaryAddress = (lstLocation = []) => {
      const address = lstLocation.filter(item => item).join(', ')
      return address || ''
    }

    const marriageMapping = marriageConfig()
    const marriageStatus = {
        [Constants.MARRIAGE_STATUS.SINGLE]: marriageMapping.single,
        [Constants.MARRIAGE_STATUS.MARRIED]: marriageMapping.married,
        [Constants.MARRIAGE_STATUS.DIVORCED]: marriageMapping.divorced,
    }

    return (
        <Row >
            <Col xs={12} md={12} lg={6}>
                <div className="info-tab-content" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="info-label">{t("FullName")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.fullname}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("EmployeeNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.uid}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("SocialInsuranceNumber")}</td>
                                <td className="info-value"><p>&nbsp;{userProfile.insurance_number}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("VinID")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.vinid}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PitNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.tax_number}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("DateOfBirth")}</td>
                                <td className="info-value"><p>&nbsp;{moment(userDetail.birthday, 'DD-MM-YYYY').isValid() ? moment(userDetail.birthday, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PlaceOfBirth")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.birth_province}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("Gender")}</td>
                                <td className="info-value"><p>&nbsp;{(userDetail.gender !== undefined && userDetail.gender !== '2') ? t("Male") : t("Female")}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("Country")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.nationality}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("Ethnic")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.ethinic}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("Religion")}</td>
                                <td className="info-value"><p>&nbsp;{formatStringByMuleValue(userDetail.religion) ? userDetail.religion : t("None")}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("IdNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.personal_id_no}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("IdDateOfIssue")}</td>
                                <td className="info-value"><p>&nbsp;{moment(userDetail.pid_date_of_issue, 'DD-MM-YYYY').isValid() ? moment(userDetail.pid_date_of_issue, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("IdPlaceOfIssue")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.pid_place_of_issue}</p></td>
                            </tr>

                            <tr>
                                <td className="info-label">{t("PassportNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.passport_id_no}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PassportDateOfIssue")}</td>
                                <td className="info-value"><p>&nbsp;{moment(userDetail.passport_date_of_issue, 'DD-MM-YYYY').isValid() ? moment(userDetail.passport_date_of_issue, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PassportPlaceOfIssue")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.passport_place_of_issue}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("WorkPermitNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.work_permit_no}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("ExpiryDate")}</td>
                                <td className="info-value"><p>&nbsp;</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PermanentAddress")}</td>
                                <td className="info-value"><p>&nbsp;{summaryAddress([formatStringByMuleValue(userDetail?.street_name), formatStringByMuleValue(userDetail?.wards), formatStringByMuleValue(userDetail?.district), formatStringByMuleValue(userDetail?.province), formatStringByMuleValue(userDetail?.nation)])}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("TemporaryAddress")}</td>
                                <td className="info-value"><p>&nbsp;{summaryAddress([formatStringByMuleValue(userDetail?.tmp_street_name), formatStringByMuleValue(userDetail?.tmp_wards), formatStringByMuleValue(userDetail?.tmp_district), formatStringByMuleValue(userDetail?.tmp_province), formatStringByMuleValue(userDetail?.tmp_nation)])}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("MaritalStatus")}</td>
                                <td className="info-value"><p>&nbsp;{marriageStatus[userDetail?.marital_status_code]}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("PersonalEmail")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.personal_email}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("MobileNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.cell_phone_no}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("EmergencyPhoneNo")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.urgent_contact_no}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("BankAccountNumber")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.bank_number}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("BankName")}</td>
                                <td className="info-value"><p>&nbsp;{userDetail.bank_name}</p></td>
                            </tr>
                            <tr>
                                <td className="info-label">{t("BankBranch")}</td>
                                <td className="info-value"><p>&nbsp;{formatStringByMuleValue(userDetail.bank_branch)}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6}>
                <h4>{t("WorkingInformation")}</h4>
                <div className="info-tab-content" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                  <table>
                    <tbody>
                      <tr>
                        <td className="info-label">{t("MasterCode")}</td>
                        <td className="info-value"><p>&nbsp;{formatStringByMuleValue(userProfile?.master_code)}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("VingroupOnboardDate")}</td>
                        <td className="info-value"><p>&nbsp;{moment(userProfile.starting_date_inc, 'DD-MM-YYYY').isValid() ? moment(userProfile.starting_date_inc, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PAndLOnboardDate")}</td>
                        <td className="info-value"><p>&nbsp;{moment(userProfile.starting_date_co, 'DD-MM-YYYY').isValid() ? moment(userProfile.starting_date_co, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyEmail")}</td>
                        <td className="info-value" style={{ textTransform: "lowercase" }}><p>&nbsp;{userProfile.company_email}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CurrentTitle")}</td>
                        <td className="info-value"><p>&nbsp; {userProfile.current_position}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("GradeByTitle")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.rank_name_title}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("ActualGrade")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.rank_name}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("BenefitLevel")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.benefit_level}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("DivisionName")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.division}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("PropertyName")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.unit}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("Team")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.part}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("RegionName")}</td>
                        <td className="info-value"><p>&nbsp;{userProfile.department}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyPhone")}</td>
                        <td className="info-value"><p>&nbsp;{formatStringByMuleValue(userProfile.fix_phone)}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("CompanyPhoneExtension")}</td>
                        <td className="info-value"><p>&nbsp;{formatStringByMuleValue(userProfile.extension_no)}</p></td>
                      </tr>
                      <tr>
                        <td className="info-label">{t("WorkingAddress")}</td>
                        <td className="info-value"><p>&nbsp;{summaryAddress([formatStringByMuleValue(userProfile?.building), formatStringByMuleValue(userProfile?.street_name), formatStringByMuleValue(userProfile?.wards), formatStringByMuleValue(userProfile?.district), formatStringByMuleValue(userProfile?.province)])}</p></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {
                  (userHealth !== undefined && userHealth !== null) ?
                    <>
                      <h4>{t("HealthCheckInfo")}</h4>
                      <div className="info-tab-content" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("HealthInsuranceNumber")}</td>
                              <td className="info-value"><p>&nbsp;{userProfile.health_insurance_number}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("RegisteredHospital")}</td>
                              <td className="info-value"><p>&nbsp;{userProfile.hospital_name}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("HealthCheckDate")}</td>
                              <td className="info-value"><p>&nbsp;{moment(userHealth.examined_date, 'DD-MM-YYYY').isValid() ? moment(userHealth.examined_date, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfHealthCheck")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.health_type}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("OccupationalDisease")}</h4>
                      <div className="info-tab-content" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateofOccupationalDiseaseDiagnosis")}</td>
                              <td className="info-value"><p>&nbsp;{moment(userHealth.found_date, 'DD-MM-YYYY').isValid() ? moment(userHealth.found_date, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.diseased_type}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfOccupationalDisease")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.reason}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <h4>{t("AccidentsAtWork")}</h4>
                      <div className="info-tab-content" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
                        <table>
                          <tbody>
                            <tr>
                              <td className="info-label">{t("DateOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{moment(userHealth.accident_date, 'DD-MM-YYYY').isValid() ? moment(userHealth.accident_date, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("LocationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.place}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ClassificationOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.accident_type}</p></td>
                            </tr>
                            <tr>
                              <td className="info-label">{t("ReasonsOfAccidentsIncurred")}</td>
                              <td className="info-value"><p>&nbsp;{userHealth.cause_accident}</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                    : null
                }
            </Col>
        </Row>
    )
}

export default MainInfoList
