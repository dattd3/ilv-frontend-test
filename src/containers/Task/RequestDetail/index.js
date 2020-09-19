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
        'Authorization': localStorage.getItem('accessToken')
      }
    }
  
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories`, config)
      .then(res => {
        if (res && res.data) {
          console.log(res.data);
          // let userProfile = res.data.data[0];
          // this.setState({ userProfile: userProfile });
        }
      }).catch(error => {

      });
    }
    
    render() {
      return (
        <div className="edit-personal">
          <PersonalComponent userDetail={this.state.userDetail} userProfile={this.state.userProfile} removeInfo={this.removePersonalInfo.bind(this)} updateInfo={this.updatePersonalInfo.bind(this)} />
          <EducationComponent userEducation={this.state.userEducation} />
          <FamilyComponent userFamily={this.state.userFamily} />
          <div className="clearfix mb-5">
            <button type="button" class="btn btn-success float-right ml-3 shadow"><i class="fa fa-paper-plane" aria-hidden="true"></i> Phê duyệt</button>
            <button type="button" class="btn btn-light float-right shadow"><i class="fas fa-paperclip"></i> Không duyệt</button>
          </div>
        </div>
      )
    }
  }
export default PersonalInfoEdit
