import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import DocumentComponent from './DocumentComponent'
import RequestProcessing from 'containers/Registration/RequestProcessing'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import ConfirmationModal from '../../PersonalInfo/edit/ConfirmationModal'
import { getRequestConfigurations } from "../../../commons/Utils"
import { withTranslation } from "react-i18next"
import _ from 'lodash'
import { t } from 'i18next'
import HOCComponent from '../../../components/Common/HOCComponent'

class RequestDetail extends React.Component {
  constructor(props) {
    super();
    this.state = {
      userMainInfo: [],
      userFamilyCreate: [],
      userFamilyUpdate: [],
      userEducationCreate: [],
      userEducationUpdate: [],
      documents: [],
      isShowPersonalComponent: false,
      isShowEducationComponent: false,
      isShowFamilyComponent: false,
      isShowDocumentComponent: false,
      isShowModalConfirm: false,
      modalTitle: "",
      modalMessage: "",
      typeRequest: 1,
      userInfo: {},
      status: 5,
      taskId: 0,
      requestTypeId: null
    }
  }

  getUserProfileHistoryId = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[2];
  }

  processBlockStatuses = (response) => {
    const data = response
    if (data) {
      if ((data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0) 
      || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation && data.userProfileInfo.update.userProfileHistoryEducation.length > 0)) {
        this.setState({isShowEducationComponent : true});
      }
      if ((data.userProfileInfo.create && data.userProfileInfo.create.families && data.userProfileInfo.create.families.length > 0) || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryFamily && data.userProfileInfo.update.userProfileHistoryFamily.length > 0)) {
        this.setState({isShowFamilyComponent : true});
      }
      if (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null 
        && _.size(data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo) > 0) {
        this.setState({isShowPersonalComponent : true});
      }
      if (data.userProfileInfoDocuments && data.userProfileInfoDocuments.length > 0) {
        this.setState({isShowDocumentComponent : true});
      }
    }
  }

  processEducationInfo = response => {
    const data = response
    if (data) {
      if (data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0) {
        this.setState({userEducationCreate : data.userProfileInfo.create.educations});
      }
      if (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation) {
        this.setState({userEducationUpdate : data.userProfileInfo.update.userProfileHistoryEducation});
      }
    }
  }

  processMainInfo = response => {
    const data = response
    if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
      const mainInfos = this.prepareMainInfo(data.userProfileInfo.update.userProfileHistoryMainInfo);
      this.setState({userMainInfo : mainInfos});
    }
  }

  processDocumentInfo = response => {
    const data = response
    if (data && data.userProfileInfoDocuments) {
      this.setState({documents : data.userProfileInfoDocuments});
    }
  }

  prepareMainInfo = data => {
    if (data) {
      const oldMainInfo = data.OldMainInfo;
      const newMainInfo = data.NewMainInfo;
      const mainInfo = new Array(oldMainInfo, newMainInfo);
      let mainInfoData = [];
      Object.keys(oldMainInfo).forEach(key => {
        mainInfoData = mainInfoData.concat({[key]: [_.map(mainInfo, key)]});
      })
      return mainInfoData;
    }
  }

  disApproval = () => {
    const {t} = this.props;
    this.setState({
      modalTitle: t("RejectApproveRequest"),
      modalMessage: t("ReasonRejectingRequest"),
      typeRequest: 1
    });
    this.onShowModalConfirm();
  }

  approval = () => {
    const {t} = this.props;
    this.setState({
      modalTitle: t("ApproveRequest"),
      modalMessage: t("ConfirmApproveChangeRequest"),
      typeRequest: 2
    });
    this.onShowModalConfirm();
  }
  

  evictionRequest = id => {
    const {t} = this.props;
    this.setState({
        modalTitle: t("ConfirmRequestRecall"),
        modalMessage: t("SureRequestRecall"),
        isShowModalConfirm: true,
        typeRequest: 3,
        taskId: id
    });
  }

  onShowModalConfirm = () => {
    this.setState({isShowModalConfirm: true});
  }

  onHideModalConfirm = () => {
    this.setState({isShowModalConfirm: false});
  }

  processUserInfo = response => {
    if (response && response.userProfileInfo) {
      const info = response.userProfileInfo;
      const staff = info.staff;
      const manager = info.manager;
      let managerToShow = null;
      if (manager) {
        managerToShow = {
          code: manager.code,
          fullName: manager.fullName,
          title: manager.title,
          department: manager.department
        }
      }
      let userInfo = {
        staff: {
          code: staff.code,
          fullName: staff.fullName,
          title: staff.title,
          department: staff.department
        },
        manager: managerToShow
      }
      this.setState({userInfo : userInfo});
    }
  }

  processFamiliesInfo = response => {
    let userFamilyCreate = [], userFamilyUpdate = []
    if (response && response.userProfileInfo) {
      if (response.userProfileInfo?.create && response.userProfileInfo?.create?.families) {
        userFamilyCreate = response.userProfileInfo?.create?.families
      }
      if (response.userProfileInfo?.update && response.userProfileInfo?.update?.userProfileHistoryFamily) {
        userFamilyUpdate = response.userProfileInfo?.update?.userProfileHistoryFamily
      }
    }
    this.setState({userFamilyCreate: userFamilyCreate, userFamilyUpdate: userFamilyUpdate})
  }

  prepareStatus = response => {
    if (response) {
      this.setState({status: response.status, hrComment: response.hrComment ? response.hrComment : "", responseDataFromSAP: response.responseDataFromSAP ? response.responseDataFromSAP : ""})
    }
  }

  componentDidMount() {
    const config = getRequestConfigurations()
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.getUserProfileHistoryId()}`, config)
    .then(res => {
      if (res && res.data) {
        const result = res.data.result
        if (result && result.code == Constants.API_SUCCESS_CODE) {
          const response = res.data.data
          this.setState({requestTypeId: response.requestTypeId})
          this.processBlockStatuses(response);
          this.processEducationInfo(response);
          this.processMainInfo(response);
          this.processDocumentInfo(response);
          this.processUserInfo(response);
          this.prepareStatus(response);
          this.processFamiliesInfo(response)
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const { t, details } = this.props
    const { isShowModalConfirm, modalTitle, typeRequest, modalMessage, userInfo, isShowPersonalComponent, isShowEducationComponent, isShowFamilyComponent, userMainInfo, 
      userEducationUpdate, userEducationCreate, userFamilyUpdate, userFamilyCreate, status, hrComment, isShowDocumentComponent, documents, requestTypeId, responseDataFromSAP } = this.state

    const statusOptions = {
      1: {label: t("Reject"), className: 'fail'},
      2: {label: t("Approved"), className: 'success'},
      3: {label: t("Recalled"), className: 'fail'},
      4: {label: t("Canceled"), className: 'fail'},
      5: {label: t("Waiting"), className: 'waiting'},
      6: {label: t("Unsuccessful"), className: 'warning'},
      7: { label: "Rejected", className: 'fail' },
      8: { label: "PendingConsent", className: 'waiting' },
      20:{ label: "Consented", className: 'waiting' }
    }

    const timeProcessing = {
      createDate: details?.createDate,
      assessedDate: details?.assessedDate,
      approvedDate: details?.approvedDate,
      updatedDate: details?.updatedDate,
      deletedDate: details?.deletedDate,
    }

    return (
      <>
      <ConfirmationModal show={isShowModalConfirm} title={modalTitle} type={typeRequest} message={modalMessage} 
      taskId={this.getUserProfileHistoryId()} onHide={this.onHideModalConfirm} />
      <div className="edit-personal user-info-request"><h4 className="content-page-header">{t("EmployeeInfomation")}</h4></div>
      <div className="edit-personal detail-page">
        <div className="box shadow">
          <div className="row item-info">
            <div className="col-3">
              <div className="label">{t("FullName")}</div>
              <div className="detail">{userInfo.staff ? userInfo.staff.fullName : ""}</div>
            </div>
            <div className="col-2">
              <div className="label">{t("EmployeeNo")}</div>
              <div className="detail">{userInfo.staff ? userInfo.staff.code : ""}</div>
            </div>
            <div className="col-2">
              <div className="label">{t("Title")}</div>
              <div className="detail">{userInfo.staff ? userInfo.staff.title : ""}</div>
            </div>
            <div className="col-5">
              <div className="label">{t("DepartmentManage")}</div>
              <div className="detail">{userInfo.staff ? userInfo.staff.department : ""}</div>
            </div>
          </div>
        </div>
        {isShowPersonalComponent ? <div className="edit-personal user-info-request"><h4 className="content-page-header">{t("RegistrationUpdateInformation")}</h4></div> : null}
        {isShowPersonalComponent ? <PersonalComponent userMainInfo={userMainInfo} /> : null }
        {isShowEducationComponent ? <EducationComponent userEducationUpdate={userEducationUpdate} userEducationCreate={userEducationCreate} /> : null }
        {isShowFamilyComponent ? <FamilyComponent userFamilyUpdate={userFamilyUpdate} userFamilyCreate={userFamilyCreate} /> : null }
        {
          (userInfo.manager && (status == Constants.STATUS_APPROVED || status == Constants.STATUS_NOT_APPROVED)) &&
          <>
          { requestTypeId != Constants.UPDATE_PROFILE && <div className="edit-personal user-info-request"><h4 className="content-page-header">{t("InformationApprover")}</h4></div> }
          {
            status == Constants.STATUS_NOT_APPROVED 
            ? (
              <div className="box shadow">
                <div className="row item-info">
                  <div className="col-12">
                    <div className="label">{t("ReasonNotApprove")}</div>
                    <div className="detail">{hrComment}</div>
                  </div>
                </div>
              </div>
            )
            : requestTypeId != Constants.UPDATE_PROFILE && (
              <div className="box shadow">
                <div className="row item-info">
                  <div className="col-4">
                    <div className="label">{t("Approver")}</div>
                    <div className="detail">{userInfo.manager.fullName || ""}</div>
                  </div>
                  <div className="col-4">
                    <div className="label">{t("Title")}</div>
                    <div className="detail">{userInfo.manager.title || ""}</div>
                  </div>
                  <div className="col-4">
                    <div className="label">{t("DepartmentManage")}</div>
                    <div className="detail">{userInfo.manager.department || ""}</div>
                  </div>
                </div>
              </div>
            )
          }
          </>
        }
        
        <RequestProcessing {...timeProcessing} />

        <div className="block-status">
          <span className={`status ${statusOptions[status].className}`}>{statusOptions[status].label}</span>
          { (status == Constants.STATUS_PARTIALLY_SUCCESSFUL && responseDataFromSAP) && 
            <div className={`d-flex status fail`}>
              <i className="fas fa-times pr-2 text-danger align-self-center"></i>
              <div>{responseDataFromSAP}</div>
            </div>
          }
          {/* details?.comment && <span className='cancellation-reason'>{ details?.comment }</span> */} {/* comment -> lý do hủy từ api */}
        </div>
        { isShowDocumentComponent ? 
          <>
          <div className="edit-personal user-info-request"><h4 className="content-page-header">{t("RegistrationAttachmentInformation")}</h4></div>
          <DocumentComponent documents={documents} />
          </>
          : null
        }
        {
          (status == 0) ?
          <div className="clearfix mb-5">
            <span className="btn btn-primary float-right ml-3 shadow btn-eviction-task" title="Thu hồi yêu cầu" onClick={e => this.evictionRequest(this.getUserProfileHistoryId())}><i className="fas fa-undo-alt" aria-hidden="true"></i>  Thu hồi</span>
          </div>
          : null
        }
      </div>
      </>
    )
  }
}

export default HOCComponent(withTranslation()(RequestDetail))
