import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import DocumentComponent from './DocumentComponent'
import Constants from '../../../commons/Constants'
import ConfirmationModal from '../../PersonalInfo/edit/ConfirmationModal'
import { withTranslation } from "react-i18next"
import _ from 'lodash'

class ApprovalDetail extends React.Component {
  constructor() {
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
      processStatusId: 5,
      hrComment: ""
    }

    this.manager = {
      code: localStorage.getItem('employeeNo') || "",
      fullName: localStorage.getItem('fullName') || "",
      title: localStorage.getItem('jobTitle') || "",
      department: localStorage.getItem('department') || ""
    };
  }

  getUserProfileHistoryId = () => {
    return this.props.id;
  }

  processBlockStatuses = (response) => {
    if (response && response.data) {
      const data = response.data;
      if ((data.requestInfo.create && data.requestInfo.create.educations && data.requestInfo.create.educations.length > 0) 
      || (data.requestInfo.update && data.requestInfo.update.userProfileHistoryEducation && data.requestInfo.update.userProfileHistoryEducation.length > 0)) {
        this.setState({isShowEducationComponent : true});
      }
      if ((data.requestInfo.create && data.requestInfo.create.families && data.requestInfo.create.families.length > 0) || (data.requestInfo.update && data.requestInfo.update.userProfileHistoryFamily && data.requestInfo.update.userProfileHistoryFamily.NewFamily)) {
        this.setState({isShowFamilyComponent : true});
      }
      if (data.requestInfo.update && data.requestInfo.update.userProfileHistoryMainInfo && data.requestInfo.update.userProfileHistoryMainInfo.NewMainInfo != null 
        && _.size(data.requestInfo.update.userProfileHistoryMainInfo.NewMainInfo) > 0) {
        this.setState({isShowPersonalComponent : true});
      }
      if (data.requestDocuments && data.requestDocuments.length > 0) {
        this.setState({isShowDocumentComponent : true});
      }
    }
  }

  processEducationInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.requestInfo.create && data.requestInfo.create.educations && data.requestInfo.create.educations.length > 0) {
        this.setState({userEducationCreate : response.data.requestInfo.create.educations});
      }
      if (data && data.requestInfo.update && data.requestInfo.update.userProfileHistoryEducation) {
        this.setState({userEducationUpdate : data.requestInfo.update.userProfileHistoryEducation});
      }
    }
  }

  processFamilyInfo = response => {
    let userFamilyCreate = [], userFamilyUpdate = []
    if (response && response.data) {
      const data = response.data;
      if (data) {
        if (data.requestInfo.create && data.requestInfo.create.families && data.requestInfo.create.families.length > 0) {
          userFamilyCreate = data.requestInfo.create.families
        }
        if (data.requestInfo.update && data.requestInfo.update.userProfileHistoryFamily && data.requestInfo.update.userProfileHistoryFamily.length > 0) {
          userFamilyUpdate = data.requestInfo.update.userProfileHistoryFamily
        }
      }
    }
    this.setState({userFamilyCreate: userFamilyCreate, userFamilyUpdate: userFamilyUpdate})
  }

  processMainInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.requestInfo.update && data.requestInfo.update.userProfileHistoryMainInfo && data.requestInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
        const mainInfos = this.prepareMainInfo(data.requestInfo.update.userProfileHistoryMainInfo);
        this.setState({userMainInfo : mainInfos});
      }
    }
  }

  processDocumentInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.requestDocuments) {
        this.setState({documents : data.requestDocuments});
      }
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
      modalMessage:t("ReasonRejectingRequest"),
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

  onShowModalConfirm = () => {
    this.setState({isShowModalConfirm: true});
  }

  onHideModalConfirm = () => {
    this.setState({isShowModalConfirm: false});
  }

  processUserInfo = response => {
    if (response && response.data && response.data.requestInfo) {
      const info = response.data.requestInfo;
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

  prepareStatus = response => {
    if (response && response.data) {
      this.setState({processStatusId: response.data.processStatusId});
      this.setState({approverComment: response.data.approverComment ? response.data.approverComment : ""});
    }
  }

  componentDidMount() {
    if (this.props.data) {
      const response = this.props;
      this.processBlockStatuses(response);
      this.processEducationInfo(response);
      this.processFamilyInfo(response);
      this.processMainInfo(response);
      this.processDocumentInfo(response);
      this.processUserInfo(response);
      this.prepareStatus(response);
    }
  }

  render() {
    const { t, data } = this.props
    const determineStatus = {
      5: {label: t("Waiting"), className: 'waiting'},
      1: {label: t("Reject"), className: 'fail'},
      2: {label: t("Approved"), className: 'success'},
      3: {label: t("Recalled"), className: 'fail'},
      6: {label: t("Unsuccessful"), className: 'warning'}
    }
    const { isShowModalConfirm, modalTitle, typeRequest, modalMessage, userInfo, isShowPersonalComponent, userMainInfo, 
      isShowEducationComponent, isShowFamilyComponent, userEducationUpdate, userEducationCreate, userFamilyUpdate, userFamilyCreate, 
      processStatusId, approverComment, isShowDocumentComponent, documents } = this.state
    
    return (
      <>
      <ConfirmationModal data={data} show={isShowModalConfirm} manager={this.manager} title={modalTitle} type={typeRequest} message={modalMessage} 
      taskId={this.getUserProfileHistoryId()} onHide={this.onHideModalConfirm} showConfirmModal={this.showConfirmModal} />
      <div className="edit-personal user-info-request">
        <h4 className="content-page-header">{t("EmployeeInfomation")}</h4>
      </div>
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
        {isShowPersonalComponent ? <div className="edit-personal user-info-request"><h4 className="content-page-header">Thông tin đăng ký chỉnh sửa</h4></div> : null}
        {isShowPersonalComponent ? <PersonalComponent userMainInfo={userMainInfo} /> : null }
        {isShowEducationComponent ? <EducationComponent userEducationUpdate={userEducationUpdate} userEducationCreate={userEducationCreate} /> : null }
        {isShowFamilyComponent ? <FamilyComponent userFamilyUpdate={userFamilyUpdate} userFamilyCreate={userFamilyCreate} /> : null }
        {
          (data.requestTypeId != Constants.UPDATE_PROFILE && userInfo.manager && (processStatusId == Constants.STATUS_APPROVED || processStatusId == Constants.STATUS_NOT_APPROVED)) ?
          <>
          <div className="edit-personal user-info-request"><h4 className="content-page-header">Thông tin CBLĐ phê duyệt</h4></div>
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
            {
              processStatusId == 1 ?
              <div className="row item-info">
                <div className="col-12">
                  <div className="label">Lý do không phê duyệt</div>
                  <div className="detail">{approverComment}</div>
                </div>
              </div>
              : null
            }
          </div>
          </>
          : null
        }
        <div className="block-status">
          <span className={`status ${determineStatus[processStatusId]?.className}`}>{determineStatus[processStatusId]?.label}</span>
        </div>
        { isShowDocumentComponent ? 
          <>
          <div className="edit-personal user-info-request"><h4 className="content-page-header">Thông tin file đính kèm</h4></div>
          <DocumentComponent documents={documents} />
          </>
          : null
        }
        {
          processStatusId == Constants.STATUS_WAITING ?
          <div className="clearfix mb-5">
            <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval}>
              <i className="fas fa-check" aria-hidden="true"></i> {t("Approval")}</button>
            <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval}><i className="fa fa-close"></i> {t('Reject')}</button>
          </div>
          : null
        }
      </div>
      </>
    )
  }
}

export default withTranslation()(ApprovalDetail)
