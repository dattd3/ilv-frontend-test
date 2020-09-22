import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import ConfirmationModal from './ConfirmationModal'
import axios from 'axios'
import _ from 'lodash'

class PersonalInfoEdit extends React.Component {

    constructor() {
        super();
        this.state = {
            userProfile: {},
            userDetail: {},
            userEducation: [],
            userFamily: [],
            personalUpdating: {},
            educationUpdating: [],
            isConfirm: false,
            files: [],
            banks: [],
            nations: [],
            races: [],
            certificates: [],
            countries: [],
            educationLevels: [],
            genders: [],
            majors: [],
            marriages: [],
            religions: [],
            update: {},
            userProfileHistoryMainInfo: {},
            OldMainInfo: {},
            NewMainInfo: {},
            data: {}
        }
        this.inputReference = React.createRef()
    }

    componentDidMount() {
      let config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
          'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
        }
      }
  
      axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/profileinfobase`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            const data = res.data.data
            const banks = data.filter(d => d.TYPE === 'BANK')
            const nations = data.filter(d => d.TYPE === 'NATION')
            const countries = data.filter(d => d.TYPE === 'COUNTRY')
            const educationLevels = data.filter(d => d.TYPE === 'EDUCATION_LEVEL')
            const races = data.filter(d => d.TYPE === 'RACE')
            const certificates = data.filter(d => d.TYPE === 'CERTIFICATE')
            const genders = data.filter(d => d.TYPE === 'GENDER')
            const majors = data.filter(d => d.TYPE === 'MAJOR')
            const marriages = data.filter(d => d.TYPE === 'MARRIAGE')
            const religions = data.filter(d => d.TYPE === 'RELIGION')
            this.setState({
              banks: banks, 
              nations: nations, 
              races: races, 
              certificates: certificates, 
              countries: countries, 
              educationLevels: educationLevels, 
              genders: genders, 
              majors: majors,
              marriages: marriages,
              religions: religions
             })
          }
        }).catch(error => {
        })
    }

    updatePersonalInfo(name, old, value) {
      this.setState({
        OldMainInfo: {
          ...this.state.OldMainInfo,
          [name]: old
        },
        NewMainInfo: {
          ...this.state.NewMainInfo,
          [name]: value
        }
      }, () => {
        this.setState({
          userProfileHistoryMainInfo : {
            ...this.state.userProfileHistoryMainInfo,
            OldMainInfo: this.state.OldMainInfo,
            NewMainInfo: this.state.NewMainInfo
        }}, () => {
          this.setState({
            update : {
              ...this.state.update,
              userProfileHistoryMainInfo: this.state.userProfileHistoryMainInfo
            }
          }, () => {
            this.setState({data : {
              ...this.state.data,
              update: this.state.update
            }});
            let personalUpdating = Object.assign(this.state.personalUpdating, this.state.userProfileHistoryMainInfo)
            this.setState({ personalUpdating: personalUpdating })
          })
        });
      });
    }

    removePersonalInfo(name) {
      if (this.state.personalUpdating.NewMainInfo[name] && this.state.personalUpdating.OldMainInfo[name]) {
        let personalUpdating = Object.assign({}, this.state.personalUpdating)
        delete personalUpdating.NewMainInfo[name];
        delete personalUpdating.OldMainInfo[name];
        this.setState({personalUpdating: Object.assign({}, personalUpdating)})
        // if (_.isEmpty(personalUpdating.NewMainInfo) && _.isEmpty(personalUpdating.OldMainInfo)) {

        // } else {
          
        // }
      }
    }

    showConfirm(name) {
      this.setState({[name]: true})
    }

    hideConfirm(name) {
      this.setState({[name]: false})
    }

    fileUploadAction() {
      this.inputReference.current.click()
    }

    fileUploadInputChange() {
      const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
      this.setState({files: this.state.files.concat(files) })
    }

    removeFile(index) {
      this.setState({ files: [...this.state.files.slice(0, index), ...this.state.files.slice(index + 1) ] })
    }

    sendRequest = (e) => {
      console.log("===========================================");
      console.log(this.state.data);
      console.log("===========================================");

      let bodyFormData = new FormData();
      bodyFormData.append('Name', "Họ tên");
      bodyFormData.append('Comment', "Tôi muốn update thông tin Họ tên");
      bodyFormData.append('UserProfileInfo', JSON.stringify(this.state.data));
      bodyFormData.append('CreateField', "");
      bodyFormData.append('UpdateField', "FullName");
      // const fileSelected = this.state.selectedFile;
      // for(let key in fileSelected) {
      //   bodyFormData.append('Files', fileSelected[key]);
      // }

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_REQUEST_URL}user-profile-histories`,
        data: bodyFormData,
        headers: {'Content-Type': 'application/json', Authorization: `${localStorage.getItem('accessToken')}` }
      })
      .then(response => {
        // window.location.replace("/notifications");
      })
      .catch(response => {
        // window.location.replace("/notifications");
      });
    }
    
    render() {
      return (
      <div className="edit-personal">
        <ConfirmationModal show={this.state.isConfirm} onHide={this.hideConfirm.bind(this, 'isConfirm')}/>
        <PersonalComponent userDetail={this.state.userDetail} 
          userProfile={this.state.userProfile} 
          removeInfo={this.removePersonalInfo.bind(this)} 
          updateInfo={this.updatePersonalInfo.bind(this)}
          setState={this.setState.bind(this)}
          genders={this.state.genders}
          races={this.state.races}
          marriages={this.state.marriages}
          nations={this.state.nations}
          banks={this.state.banks}
          countries={this.state.countries}
          religions={this.state.religions}
        />
        <EducationComponent 
          userEducation={this.state.userEducation} 
          setState={this.setState.bind(this)}
          certificates={this.state.certificates}
          educationLevels={this.state.educationLevels}
          majors={this.state.majors}
        />
        <FamilyComponent userFamily={this.state.userFamily} setState={this.setState.bind(this)}/>

        <ul className="list-inline">
          {this.state.files.map((file, index) => {
            return <li className="list-inline-item">
                <span className="file-name">{file.name} <i className="fa fa-times remove" aria-hidden="true" onClick={this.removeFile.bind(this, index)}></i></span>
              </li>
          })}
        </ul>
        
        <div className="clearfix mb-5">
          {/* <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.showConfirm.bind(this, 'isConfirm')}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button> */}
          <button type="button" className="btn btn-primary float-right ml-3 shadow" onClick={this.sendRequest}><i className="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
          <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple/>
          <button type="button" className="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i className="fas fa-paperclip"></i> Đính kèm tệp tin</button>
        </div>
      </div>)
    }
  }
export default PersonalInfoEdit