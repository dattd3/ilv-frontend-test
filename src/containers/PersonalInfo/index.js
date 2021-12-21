import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import Constants from "../../commons/Constants"
import { isEnableFunctionByFunctionName, getMuleSoftHeaderConfigurations, getRequestConfigurations, formatStringByMuleValue } from "../../commons/Utils"
import { checkIsExactPnL } from '../../commons/commonFunctions';
import RelationshipList from "./RelationshipList"
import MainInfoList from "./MainInfoList"
import EducationList from "./EducationList"
import RelationshipListEdit from "./RelationshipListEdit"
import ActionButtons from "./ActionButtons"
import ResultModal from './edit/ResultModal'
import ConfirmationModal from './edit/ConfirmationModal'
import PersonalInfoEdit from "../PersonalInfo/edit/PersonalInfoEdit"
import map from '../../containers/map.config'

const actionType = {
  disApproval: 1,
  approval: 2,
  eviction: 3,
  createRequests: 4
}

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      userDetail: {},
      userEducation: {},
      userFamily: {},
      userHealth: {},
      userDocument: {},
      relationshipInformation: {
        isEditing: false,
        relationships: [],
        relationshipDataToUpdate : [],
        relationshipDataToCreate : [],
        files: []
      },
      educationInformation: {
        isEditing: false
      },
      mainInformation: {
        isEditing: false,
      },
      resultModal: {
        isShow: false,
        title: this.props.t("Notification"),
        message: "",
        isSuccess: true
      },
      confirmationModal: {
        isShow: false,
        title: "",
        message: "",
        actionType: actionType.createRequests
      },
      errors: null
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

  handleEditInfo = stateName => {
    const info = {...this.state[[stateName]]}
    info.isEditing = true
    this.setState({[stateName]: info})
  }

  handleAddNewRelationships = () => {
    const relationshipInformation = {...this.state.relationshipInformation}
    const currentUserEmail = localStorage.getItem('email')
    const employeeNo = localStorage.getItem('employeeNo')
    const newRelationship = [
      {
        username: currentUserEmail?.split('@')[0],
        approval_date: "",
        uid: employeeNo,
        pre_relation: "",
        pre_dob: "",
        pre_fullname: "",
        new_relation: "",
        new_dob: "",
        new_fullname: "",
        new_lastname: "",
        new_firstname: "",
        gender: "",
        tax_number: "",
        family_deduction: "",
        deduction_from: "",
        deduction_to: ""
      }
    ]
    relationshipInformation.relationshipDataToCreate = relationshipInformation.relationshipDataToCreate.concat(newRelationship)
    this.setState({relationshipInformation: relationshipInformation})
  }

  verifyInputs = () => {
    const { t } = this.props
    const { relationshipInformation } = this.state
    const errors = {}
    const requiredFields = ['new_lastname', 'new_firstname', 'new_relation', 'new_gender', 'new_dob']
    const dataCreate = relationshipInformation.relationshipDataToCreate
    const dataUpdate = relationshipInformation.relationshipDataToUpdate

    if ((!dataCreate || dataCreate.length === 0) && (!dataUpdate || dataUpdate.length === 0)) {
      errors['other'] = t("PersonalInfoNoChange")
    } else {
      requiredFields.forEach(name => {
        dataCreate?.length > 0 && dataCreate.forEach((item, index) => {
          let errorName = `create_${name}_${index}`
          errors[[errorName]] = null
          if (!item[[name]]) {
            errors[[errorName]] =  t("Required")
          }
        })
        dataUpdate?.length > 0 && dataUpdate.forEach((item, index) => {
          let errorName = `update_${name}_${index}`
          errors[[errorName]] = null
          if (!item[[name]]) {
            errors[[errorName]] =  t("Required")
          }
        })
      })

      if (!relationshipInformation.files || relationshipInformation.files?.length === 0) {
        errors['other'] = t("AttachmentRequired")
      }
    }

    this.setState({errors: errors})
    return errors
  }

  isValidData = () => {
    const errors = this.verifyInputs()
    const hasErrors = !Object.values(errors).every(item => item === null || item === undefined)
    return hasErrors ? false : true
  }

  handleSendRequests = () => {
    const isValid = this.isValidData()
    if (!isValid) {
      return
    }
    
    const { t } = this.props
    const confirmationModal = {...this.state.confirmationModal}
    confirmationModal.isShow = true
    confirmationModal.title = t("ConfirmSend")
    confirmationModal.message = t("ReasonModify")
    confirmationModal.actionType = actionType.createRequests
    this.setState({confirmationModal: confirmationModal})
  }

  sendRequests = async (message) => {
    const { t } = this.props
    const { relationshipInformation, resultModal } = this.state
    try {
      const config = getRequestConfigurations()
      const userInfo = JSON.stringify({
        employeeNo: formatStringByMuleValue(localStorage.getItem('employeeNo')),
        fullName: formatStringByMuleValue(localStorage.getItem('fullName')),
        jobTitle: formatStringByMuleValue(localStorage.getItem('jobTitle')),
        department: formatStringByMuleValue(localStorage.getItem('department'))
      })
      const userProfileInfoUpdateToSap = this.prepareUserProfileInfoUpdateToSap(relationshipInformation.relationshipDataToUpdate)
      const userProfileInfoCreateToSap = this.prepareUserProfileInfoCreateToSap(relationshipInformation.relationshipDataToCreate)
      let userProfileInfo = this.prepareUserProfileInfo(relationshipInformation)
      userProfileInfo = JSON.stringify(userProfileInfo)
      const userProfileInfoToSap = JSON.stringify([...userProfileInfoUpdateToSap, ...userProfileInfoCreateToSap])

      let bodyFormData = new FormData()
      bodyFormData.append('Name', "Quan hệ nhân thân")
      bodyFormData.append('Comment', message || "")
      bodyFormData.append('UserProfileInfo', userProfileInfo) 
      bodyFormData.append('UpdateField', JSON.stringify({UpdateField: ["FamilyInfo"]}))
      bodyFormData.append('RequestTypeId', Constants.UPDATE_PROFILE)
      bodyFormData.append('CompanyCode', formatStringByMuleValue(localStorage.getItem('companyCode')))
      bodyFormData.append('UserProfileInfoToSap', userProfileInfoToSap)
      bodyFormData.append('User', userInfo)
      bodyFormData.append('OrgLv2Id', formatStringByMuleValue(localStorage.getItem('organizationLv2')))
      bodyFormData.append('OrgLv2Text', formatStringByMuleValue(localStorage.getItem('company')))
      bodyFormData.append('DivisionId', formatStringByMuleValue(localStorage.getItem('divisionId')))
      bodyFormData.append('Division', formatStringByMuleValue(localStorage.getItem('division')))
      bodyFormData.append('RegionId', formatStringByMuleValue(localStorage.getItem('regionId')))
      bodyFormData.append('Region', formatStringByMuleValue(localStorage.getItem('region')))
      bodyFormData.append('UnitId', formatStringByMuleValue(localStorage.getItem('unitId')))
      bodyFormData.append('Unit', formatStringByMuleValue(localStorage.getItem('unit')))
      bodyFormData.append('PartId', formatStringByMuleValue(localStorage.getItem('partId')))
      bodyFormData.append('Part', formatStringByMuleValue(localStorage.getItem('part')))

      const fileSelected = relationshipInformation.files
      for (let key in fileSelected) {
        bodyFormData.append('Files', fileSelected[key])
      }

      const responses = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/family`, bodyFormData, config)
      resultModal.isShow = true
      if (responses && responses.data) {
        const result = responses.data.result
        if (result && result.code == Constants.API_SUCCESS_CODE) {
          resultModal.isSuccess = true
          resultModal.message = t("RequestSent")
        } else {
          resultModal.isSuccess = false
          resultModal.message = result.message
        }
      } else {
        resultModal.isSuccess = false
        resultModal.message = t("AnErrorOccurred")
      }
      this.setState({resultModal: resultModal})
    } catch (e) {
      resultModal.isShow = true
      resultModal.isSuccess = false
      resultModal.message = t("AnErrorOccurred")
      this.setState({resultModal: resultModal})
    }
  }

  prepareUserProfileInfoUpdateToSap = (relationshipDataToUpdate) => {
    const currentUserEmail = localStorage.getItem('email')
    const employeeNo = localStorage.getItem('employeeNo')
    const dataToUpdate = relationshipDataToUpdate.filter(item => 
      (item.firstname != item.new_firstname || item.lastname != item.new_lastname || item.relation_code != item.new_relation.value 
        || item.gender_code != item.new_gender.value || item.dob != item.new_dob)
    )
    .map(item => {
      return {
        username: currentUserEmail?.split('@')[0],
        approval_date: "",
        uid: employeeNo,
        pre_relation: item.relation_code,
        pre_dob: moment(item.dob, 'DD-MM-YYYY').format('YYYYMMDD'),
        pre_fullname: item.full_name,
        new_relation: item.new_relation.value,
        new_dob: moment(item.new_dob, 'DD-MM-YYYY').format('YYYYMMDD'),
        new_fullname: `${item.new_lastname} ${item.new_firstname}`,
        new_lastname: item.new_lastname,
        new_firstname: item.new_firstname,
        gender: item.new_gender.value,
        tax_number: "",
        family_deduction: "",
        deduction_from: "",
        deduction_to: ""
      }
    })

    return dataToUpdate
  }

  prepareUserProfileInfoCreateToSap = (relationshipDataToCreate) => {
    const currentUserEmail = localStorage.getItem('email')
    const employeeNo = localStorage.getItem('employeeNo')
    const dataToCreate = relationshipDataToCreate.map(item => {
      return {
        username: currentUserEmail?.split('@')[0],
        approval_date: "",
        uid: employeeNo,
        pre_relation: "",
        pre_dob: "",
        pre_fullname: "",
        new_relation: item.new_relation.value,
        new_dob: moment(item.new_dob, 'DD-MM-YYYY').format('YYYYMMDD'),
        new_fullname: `${item.new_lastname} ${item.new_firstname}`,
        new_lastname: item.new_lastname,
        new_firstname: item.new_firstname,
        gender: item.new_gender.value,
        tax_number: "",
        family_deduction: "",
        deduction_from: "",
        deduction_to: ""
      }
    })
    return dataToCreate
  }

  prepareUserProfileInfo = relationshipInformation => {
    const dataToUpdate = relationshipInformation.relationshipDataToUpdate.filter(item => 
      (item.firstname != item.new_firstname || item.lastname != item.new_lastname || item.relation_code != item.new_relation.value 
        || item.gender_code != item.new_gender.value || item.dob != item.new_dob)
    )
    const dataToCreate = relationshipInformation.relationshipDataToCreate
    return {
      staff: {
        code: localStorage.getItem('employeeNo'),
        fullName: localStorage.getItem('fullName'),
        title: localStorage.getItem('jobTitle'),
        department: localStorage.getItem('department'),
      },
      manager: {},
      update: {
        userProfileHistoryMainInfo: {
          OldMainInfo: {},
          NewMainInfo: {}
        },
        userProfileHistoryEducation: [],
        userProfileHistoryFamily: (dataToUpdate || []).map(item => {
          return {
            OldFamily: {
              firstName: item.firstname || "",
              lastName: item.lastname || "",
              relationshipCode: item.relation_code || "",
              relationshipText: item.relation || "",
              genderCode: item.gender_code || "",
              genderText: item.gender || "",
              birthday: moment(item.dob, "DD-MM-YYYY").format("YYYY-MM-DD")
            },
            NewFamily: {
              firstName: item.new_firstname || "",
              lastName: item.new_lastname || "",
              relationshipCode: item.new_relation?.value || "",
              relationshipText: item.new_relation?.label || "",
              genderCode: item.new_gender.value || "",
              genderText: item.new_gender.label || "",
              birthday: moment(item.new_dob, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
          }
        })
      },
      create: {
        families: dataToCreate.map(item => {
          return {
            firstName: item.new_firstname || "",
            lastName: item.new_lastname || "",
            relationshipCode: item.new_relation?.value || "",
            relationshipText: item.new_relation?.label || "",
            genderCode: item.new_gender.value || "",
            genderText: item.new_gender.label || "",
            birthday: moment(item.new_dob, "DD-MM-YYYY").format("YYYY-MM-DD")
          }
        })
      }
    }
  }

  updateDataToParent = relationships => {
    const relationshipInformation = {...this.state.relationshipInformation}
    relationshipInformation.relationshipDataToUpdate = relationships.update
    relationshipInformation.relationshipDataToCreate = relationships.create
    this.setState({relationshipInformation: relationshipInformation})
  }

  updateFilesToParent = filesToUpdate => {
    const relationshipInformation = {...this.state.relationshipInformation}
    relationshipInformation.files = filesToUpdate
    this.setState({relationshipInformation: relationshipInformation})
  }

  onHideResultModal = () => {
    const resultModal = {...this.state.resultModal}
    resultModal.isShow = false
    this.setState({resultModal: resultModal})
    window.location.href = map.PersonalInfo
  }

  onHideModalConfirm = () => {
    const confirmationModal = {...this.state.confirmationModal}
    confirmationModal.isShow = false
    this.setState({confirmationModal: confirmationModal})
  }

  updateMessageFromModal = async message => {
    await this.sendRequests(message)
  }

  render() {   
    const { t } = this.props
    const { userFamily, userDetail, userHealth, userProfile, userEducation, relationshipInformation, mainInformation, educationInformation, resultModal, confirmationModal, errors } = this.state
    const isEnableEditProfiles = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.editProfile)
    const isEnableEditEducations = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.editEducation)
    const isEnableEditRelationships = isEnableFunctionByFunctionName(Constants.listFunctionsForPnLACL.editRelationship)

    let defaultTab = new URLSearchParams(this.props.location.search).get("tab");
    defaultTab = defaultTab && defaultTab == 'document' ? 'PersonalDocument' : 'PersonalInformation';
    const documents = this.state.userDocument.documents;
    const checkVinfast = checkIsExactPnL(Constants.PnLCODE.VinFast, Constants.PnLCODE.VinFastPB, Constants.PnLCODE.VinFastTrading);

    return (
      <>
      <ConfirmationModal show={confirmationModal.isShow} title={confirmationModal.title} type={confirmationModal.actionType} message={confirmationModal.message} 
        sendData={this.updateMessageFromModal} onHide={this.onHideModalConfirm} />
      <ResultModal show={resultModal.isShow} title={resultModal.title} message={resultModal.message} isSuccess={resultModal.isSuccess} onHide={this.onHideResultModal} />
      <div className="personal-info">
        <h1 className="content-page-header">{t("PersonalInformation")}</h1>
        <Tabs defaultActiveKey={defaultTab} id="uncontrolled-tab-example">
          <Tab eventKey="PersonalInformation" title={t("PersonalInformation")} className="tab-main-info">
            <div className="top-button-actions">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditProfiles ? <span className="btn btn-primary shadow ml-3" onClick={() => this.handleEditInfo("mainInformation")}><i className="fas fa-user-edit"></i>{t("Edit")}</span> : null
              }
            </div>
            <h5 className="content-page-header">{t("PersonalInformation")}</h5>
            <Container fluid className="info-tab-content shadow main-info">
              {
                mainInformation.isEditing ?
                <PersonalInfoEdit isEnableEditEducation={false} isEnableEditMainInfo={true} />
                :
                <MainInfoList userDetail={userDetail} userHealth={userHealth} userProfile={userProfile} />
              }
            </Container>
          </Tab>
          <Tab eventKey="Degree" title={t("Degree") + `/` + t("Certificate")} className="tab-education">
            <div className="top-button-actions">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditEducations ? <span className="btn btn-primary shadow ml-3" onClick={() => this.handleEditInfo("educationInformation")}><i className="fas fa-user-edit"></i>{t("Edit")}</span> : null
              }
            </div>
            <h5 className="content-page-header">{t("Certification")}</h5>
            <Container fluid className="info-tab-content shadow education">
              {
                educationInformation.isEditing ?
                <PersonalInfoEdit isEnableEditEducation={true} isEnableEditMainInfo={false} />
                :
                <EducationList educations={userEducation} />
              }
            </Container>
          </Tab>
          <Tab eventKey="PersonalRelations" title={t("Family")} className="tab-relationship">
            <div className="top-button-actions">
              <a href="/tasks" className="btn btn-info shadow"><i className="far fa-address-card"></i> {t("History")}</a>
              {
                isEnableEditRelationships ? <span className="btn btn-primary shadow ml-3" onClick={() => this.handleEditInfo("relationshipInformation")}><i className="fas fa-user-edit"></i>{t("Edit")}</span> : null
              }
            </div>
            <h5 className="content-page-header">{t("PersonalRelations")}</h5>
            <Container fluid className="info-tab-content shadow relationship">
            {
              relationshipInformation.isEditing ? 
              <>
              <RelationshipListEdit relationships={userFamily} propsRelationshipDataToCreate={relationshipInformation.relationshipDataToCreate} updateDataToParent={this.updateDataToParent} errors={errors} />
              <div className="block-button-add">
                <button type="button" className="btn btn-primary add" onClick={this.handleAddNewRelationships}><i className="fas fa-plus"></i>{t("Add")}</button>
              </div>
              </>
              : <RelationshipList relationships={userFamily} />
            }
            </Container>
            { relationshipInformation.isEditing && <ActionButtons errors={errors} sendRequests={this.handleSendRequests} updateFilesToParent={this.updateFilesToParent} /> }
          </Tab>

          {
           /*  checkIsExactPnL(Constants.PnLCODE.Vinpearl) || checkVinfast  ?  */
            // checkIsExactPnL(Constants.PnLCODE.Vinpearl) ? // open for golive1106
            true ? //golive 2312
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
                                      <td>{item.index}</td>
                                      <td className="name">{item.name}</td>
                                      <td>{item.number}</td>
                                      {!checkVinfast && <td rowSpan={obj.documentList.length}>{item.timExpire}</td>}
                                      <td><input type="checkbox" checked={item.status} readOnly /></td>
                                    </tr>
                                  } else {
                                    return <tr key={index}>
                                      <td>{item.index}</td>
                                      <td className="name">{item.name}</td>
                                      <td>{item.number}</td>
                                      <td><input type="checkbox" checked={item.status} readOnly /></td>
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
      </div>
      </>
    )
  }
}

const PersonInfo = withTranslation()(withRouter(MyComponent))

export default function App() {
  return (
    <PersonInfo />
  );
}

