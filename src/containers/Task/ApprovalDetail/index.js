import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import DocumentComponent from './DocumentComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import ConfirmationModal from '../../PersonalInfo/edit/ConfirmationModal'
import _ from 'lodash'

const code = localStorage.getItem('employeeNo') || "";
const fullName = localStorage.getItem('fullName') || "";
const title = localStorage.getItem('jobTitle') || "";
const department = localStorage.getItem('department') || "";
let manager = {};

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
      status: 0,
      hrComment: ""
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

  // processFamilyInfo = response => {
  //   if (response && response.data) {
  //     const data = response.data;
  //     if (data && data.userProfileInfo.create && data.userProfileInfo.create.families && data.userProfileInfo.create.families.length > 0) {
  //       this.setState({userFamilyCreate : response.data.userProfileInfo.create.families});
  //     }
  //     if (data && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryFamily && data.userProfileInfo.update.userProfileHistoryFamily.length > 0) {
  //       this.setState({userFamilyUpdate : data.userProfileInfo.update.userProfileHistoryFamily});
  //     }
  //   }
  // }

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
      modalTitle: "Xác nhận không phê duyệt",
      modalMessage: "Lý do không phê duyệt (Bắt buộc)",
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
    const result = this.prepareManagerInfo();
    if (result) {
      this.setState({isShowModalConfirm: true});
    }
  }

  onHideModalConfirm = () => {
    this.setState({isShowModalConfirm: false});
  }

  processUserInfo = response => {
    if (response && response.data && response.data.userProfileInfo) {
      const info = response.data.userProfileInfo;
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

  prepareManagerInfo = () => {
    manager = {
      code: code,
      fullName: fullName,
      title: title,
      department: department
    };
    return true;
  }

  prepareStatus = response => {
    if (response && response.data) {
      this.setState({status: response.data.status});
      this.setState({hrComment: response.data.hrComment ? response.data.hrComment : ""});
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
        // this.processFamilyInfo(response);
        this.processMainInfo(response);
        this.processDocumentInfo(response);
        this.processUserInfo(response);
        this.prepareStatus(response);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const status = {
      0: {label: 'Đang chờ xử lý', className: ''},
      1: {label: 'Không phê duyệt', className: 'fail'},
      2: {label: 'Đã phê duyệt', className: 'success'},
      3: {label: 'Đã thu hồi', className: ''}
    }

    return (
      <>
      <ConfirmationModal show={this.state.isShowModalConfirm} manager={manager} title={this.state.modalTitle} type={this.state.typeRequest} message={this.state.modalMessage} 
      userProfileHistoryId={this.getUserProfileHistoryId()} onHide={this.onHideModalConfirm} showConfirmModal={this.showConfirmModal} />
      <div className="edit-personal user-info-request"><h4 className="title text-uppercase">Thông tin CBNV đăng ký</h4><span className={`status ${status[this.state.status].className}`}>{status[this.state.status].label}</span></div>
      <div className="edit-personal detail-page">
        <div className="box shadow">
          <div className="row item-info">
            <div className="col-3">
              <div className="label">Họ và tên</div>
              <div className="detail">{this.state.userInfo.staff ? this.state.userInfo.staff.fullName : ""}</div>
            </div>
            <div className="col-2">
              <div className="label">Mã nhân viên</div>
              <div className="detail">{this.state.userInfo.staff ? this.state.userInfo.staff.code : ""}</div>
            </div>
            <div className="col-2">
              <div className="label">Chức danh</div>
              <div className="detail">{this.state.userInfo.staff ? this.state.userInfo.staff.title : ""}</div>
            </div>
            <div className="col-5">
              <div className="label">Khối/Phòng/Bộ phận</div>
              <div className="detail">{this.state.userInfo.staff ? this.state.userInfo.staff.department : ""}</div>
            </div>
          </div>
        </div>
        <div className="edit-personal user-info-request"><h4 className="title text-uppercase">Thông tin đăng ký chỉnh sửa</h4></div>
        {this.state.isShowPersonalComponent ? <PersonalComponent userMainInfo={this.state.userMainInfo} /> : null }
        {this.state.isShowEducationComponent ? <EducationComponent userEducationUpdate={this.state.userEducationUpdate} userEducationCreate={this.state.userEducationCreate} /> : null }
        {this.state.isShowFamilyComponent ? <FamilyComponent userFamilyUpdate={this.state.userFamilyUpdate} userFamilyCreate={this.state.userFamilyCreate} /> : null }
        {
          (this.state.userInfo.manager && this.state.status == 2) ?
          <>
          <div className="edit-personal user-info-request"><h4 className="title text-uppercase">Thông tin CBLĐ phê duyệt</h4></div>
          <div className="box shadow">
            <div className="row item-info">
              <div className="col-4">
                <div className="label">Người phê duyệt</div>
                <div className="detail">{this.state.userInfo.manager.fullName || ""}</div>
              </div>
              <div className="col-4">
                <div className="label">Chức danh</div>
                <div className="detail">{this.state.userInfo.manager.title || ""}</div>
              </div>
              <div className="col-4">
                <div className="label">Khối/Phòng/Bộ phận</div>
                <div className="detail">{this.state.userInfo.manager.department || ""}</div>
              </div>
            </div>
            {
              this.state.status == 1 ?
              <div className="row item-info">
                <div className="col-12">
                  <div className="label">Lý do không phê duyệt</div>
                  <div className="detail">{this.state.hrComment}</div>
                </div>
              </div>
              : null
            }
          </div>
          </>
          : null
        }
        {this.state.isShowDocumentComponent ? <DocumentComponent documents={this.state.documents} /> : null }
        {
          this.state.status == 0 ?
          <div className="clearfix mb-5">
            <button type="button" className="btn btn-success float-right ml-3 shadow" onClick={this.approval}>
              <i className="fas fa-check" aria-hidden="true"></i> Phê duyệt</button>
            <button type="button" className="btn btn-danger float-right shadow" onClick={this.disApproval}><i className="fa fa-close"></i> Không duyệt</button>
          </div>
          : null
        }
      </div>
      </>
    )
  }
}

export default ApprovalDetail
