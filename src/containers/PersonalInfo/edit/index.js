import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import axios from 'axios'

class PersonalInfoEdit extends React.Component {

    constructor() {
        super();
        this.state = {
            userProfile: {},
            userDetail: {},
            userEducation: [],
            userFamily: [],
            personalUpdating: {}
        }
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
          });
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/personalinfo`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userDetail = res.data.data[0];
              this.setState({ userDetail: userDetail });
            }
          }).catch(error => {
          });
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userEducation = res.data.data;
              this.setState({ userEducation: userEducation });
            }
          }).catch(error => {
          });
    
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/family`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userFamily = res.data.data;
              this.setState({ userFamily: userFamily });
            }
          }).catch(error => {
            // localStorage.clear();
            // window.location.href = map.Login;
          })
      }

      updatePersonalInfo(name, old, value) {
        let personalUpdating = Object.assign(this.state.personalUpdating, {[name]: {old: old, value: value}})
        this.setState({ personalUpdating: personalUpdating })
      }

      removePersonalInfo(name) {
        if (this.state.personalUpdating[name]) {
          let personalUpdating = Object.assign({}, this.state.personalUpdating)
          delete personalUpdating[name]
          this.setState({personalUpdating: Object.assign({}, personalUpdating)})
        }
      }
    
    render() {
      console.log(this.state.personalUpdating)
      return (
      <div className="edit-personal">
        <PersonalComponent userDetail={this.state.userDetail} userProfile={this.state.userProfile} removeInfo={this.removePersonalInfo.bind(this)} updateInfo={this.updatePersonalInfo.bind(this)}/>
        <EducationComponent userEducation={this.state.userEducation}/>
        <FamilyComponent userFamily={this.state.userFamily}/>
        
        <div className="clearfix mb-5">
          <button type="button" class="btn btn-primary float-right ml-3 shadow"><i class="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
          <button type="button" class="btn btn-light float-right shadow"><i class="fas fa-paperclip"></i> Đính kèm tệp tin</button>
        </div>
      </div>)
    }
  }
export default PersonalInfoEdit