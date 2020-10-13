import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import DocumentComponent from './DocumentComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import ConfirmationModal from '../../PersonalInfo/edit/ConfirmationModal'
import _ from 'lodash'
import moment from 'moment'

class RequestDetail extends React.Component {
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
      userInfo: {}
    }
  }

  getUserProfileHistoryId = () => {
    const pathName = window.location.pathname;
    const pathNameArr = pathName.split('/');
    return pathNameArr[pathNameArr.length - 1];
  }

  processBlockStatuses = (response) => {
    if (response && response.result) {
      const data = response.data;
      const code = response.result.code;
      if (code != Constants.API_ERROR_CODE) {
        if ((data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0) 
        || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation && data.userProfileInfo.update.userProfileHistoryEducation.length > 0)) {
          this.setState({isShowEducationComponent : true});
        }
        if ((data.userProfileInfo.create && data.userProfileInfo.create.families && data.userProfileInfo.create.families.length > 0) || (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryFamily && data.userProfileInfo.update.userProfileHistoryFamily.NewFamily)) {
          this.setState({isShowFamilyComponent : true});
        }
        if (data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
          this.setState({isShowPersonalComponent : true});
        }
        if (data.userProfileInfoDocuments && data.userProfileInfoDocuments.length > 0) {
          this.setState({isShowDocumentComponent : true});
        }
      }
    }
  }

  processEducationInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfo.create && data.userProfileInfo.create.educations && data.userProfileInfo.create.educations.length > 0) {
        this.setState({userEducationCreate : response.data.userProfileInfo.create.educations});
      }
      if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryEducation) {
        this.setState({userEducationUpdate : data.userProfileInfo.update.userProfileHistoryEducation});
      }
    }
  }

  processMainInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo != null) {
        const mainInfos = this.prepareMainInfo(data.userProfileInfo.update.userProfileHistoryMainInfo);
        this.setState({userMainInfo : mainInfos});
      }
    }
  }

  processDocumentInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.userProfileInfoDocuments) {
        this.setState({documents : data.userProfileInfoDocuments});
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
    this.setState({
      modalTitle: "Xác nhận không duyệt",
      modalMessage: "Thêm ghi chú (Không bắt buộc)",
      typeRequest: 1
    });
    this.onShowModalConfirm();
  }

  approval = () => {
    this.setState({
      modalTitle: "Xác nhận phê duyệt",
      modalMessage: "Bạn có đồng ý phê duyệt thay đổi này ?",
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

  processUserInfo = (response) => {
    if (response && response.data && response.data.userProfileInfo) {
      const info = response.data.userProfileInfo;
      const obj = {
        fullName: info.fullName,
        position: info.position,
        department: info.department
      }
      this.setState({userInfo : obj});
    }
  }

  componentDidMount() {
    let config = {
      headers: {
        'Authorization': localStorage.getItem('accessToken')
      }
    }
  
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.getUserProfileHistoryId()}`, config)
    .then(res => {
      if (res && res.data) {
        const response = res.data;
        this.processBlockStatuses(response);
        this.processEducationInfo(response);
        this.processMainInfo(response);
        this.processDocumentInfo(response);
        this.processUserInfo(response);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <>
      <ConfirmationModal show={this.state.isShowModalConfirm} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage} 
      userProfileHistoryId={this.getUserProfileHistoryId()} onHide={this.onHideModalConfirm} />
      <div className="edit-personal"><h4 className="title text-uppercase">Thông tin cá nhân</h4></div>
      <div className="edit-personal detail-page">
        {this.state.isShowPersonalComponent ? <PersonalComponent userMainInfo={this.state.userMainInfo} /> : null }
        {this.state.isShowEducationComponent ? <EducationComponent userEducationUpdate={this.state.userEducationUpdate} userEducationCreate={this.state.userEducationCreate} /> : null }
        {this.state.isShowFamilyComponent ? <FamilyComponent userFamilyUpdate={this.state.userFamilyUpdate} userFamilyCreate={this.state.userFamilyCreate} /> : null }
        {this.state.isShowDocumentComponent ? <DocumentComponent documents={this.state.documents} /> : null }
        <div className="clearfix mb-5">
          <a className="btn btn-primary float-right ml-3 shadow btn-edit-task" title="Chỉnh sửa thông tin" href={`/tasks-request/${this.getUserProfileHistoryId()}/edit`}><i className="fa fa-edit" aria-hidden="true"></i>  Sửa thông tin</a>
        </div>
      </div>
      </>
    )
  }
}

export default RequestDetail
