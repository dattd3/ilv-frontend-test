import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import _ from 'lodash'

class PersonalInfoEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      userMainInfo: [],
      userFamilyCreate: [],
      userFamilyUpdate: [],
      userEducationCreate: [],
      userEducationUpdate: [],
      isShowPersonalComponent: false,
      isShowEducationComponent: false,
      isShowFamilyComponent: false
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
        if ((data.create && data.create.educations && data.create.educations.length > 0) || (data.update && data.update.userProfileHistoryEducation && data.update.userProfileHistoryEducation.NewEducation)) {
          this.setState({isShowEducationComponent : true});
        }
        if ((data.create && data.create.families && data.create.families.length > 0) || (data.update && data.update.userProfileHistoryFamily && data.update.userProfileHistoryFamily.NewFamily)) {
          this.setState({isShowFamilyComponent : true});
        }
        if (data.update && data.update.userProfileHistoryMainInfo && data.update.userProfileHistoryMainInfo.NewMainInfo != null) {
          this.setState({isShowPersonalComponent : true});
        }
      }
    }
  }

  processEducationInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.create && data.create.educations && data.create.educations.length > 0) {
        this.setState({userEducationCreate : response.data.create.educations});
      }
      if (data && data.update && data.update.userProfileHistoryEducation && data.update.userProfileHistoryEducation.length > 0) {
        this.setState({userEducationUpdate : data.update.userProfileHistoryEducation});
      }
    }
  }

  processFamilyInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.create && data.create.families && data.create.families.length > 0) {
        this.setState({userFamilyCreate : response.data.create.families});
      }
      if (data && data.update && data.update.userProfileHistoryFamily && data.update.userProfileHistoryFamily.length > 0) {
        this.setState({userFamilyUpdate : data.update.userProfileHistoryFamily});
      }
    }
  }

  processMainInfo = response => {
    if (response && response.data) {
      const data = response.data;
      if (data && data.update && data.update.userProfileHistoryMainInfo && data.update.userProfileHistoryMainInfo.NewMainInfo != null) {
        const mainInfos = this.prepareMainInfo(data.update.userProfileHistoryMainInfo);
        this.setState({userMainInfo : mainInfos});
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
          this.processFamilyInfo(response);
          this.processMainInfo(response);
        }
      }).catch(error => {
        console.log(error);
      });
    }
    
    render() {
      return (
        <div className="edit-personal detail-page">
          {this.state.isShowPersonalComponent ? <PersonalComponent userMainInfo={this.state.userMainInfo} /> : null }
          {this.state.isShowEducationComponent ? <EducationComponent userEducationUpdate={this.state.userEducationUpdate} userEducationCreate={this.state.userEducationCreate} /> : null }
          {this.state.isShowFamilyComponent ? <FamilyComponent userFamilyUpdate={this.state.userFamilyUpdate} userFamilyCreate={this.state.userFamilyCreate} /> : null }
          <div className="clearfix mb-5">
            <button type="button" className="btn btn-danger float-right ml-3 shadow"><i className="fa fa-close" aria-hidden="true"></i> Không duyệt</button>
            <button type="button" className="btn btn-success float-right shadow"><i className="fas fa-check"></i> Phê duyệt</button>
          </div>
        </div>
      )
    }
  }
export default PersonalInfoEdit
