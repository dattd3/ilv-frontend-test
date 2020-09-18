import React from 'react'
import PersonalComponent from './PersonalComponent'
import EducationComponent from './EducationComponent'
import FamilyComponent from './FamilyComponent'
import { Form, Button, Modal, Row, Col } from 'react-bootstrap'
import ConfirmationModal from './ConfirmationModal'

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
            files: []
        }
        this.inputReference = React.createRef()
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

    showConfirm() {
      this.setState({isConfirm: true})
    }

    hideConfirm() {
      this.setState({isConfirm: false})
    }

    fileUploadAction() {
      this.inputReference.current.click()
    }

    fileUploadInputChange() {
      const files = Object.keys(this.inputReference.current.files).map((key) => this.inputReference.current.files[key])
      this.setState({files: files})
      // console.log(this.inputReference.current.files[0].name)
    }
    
    render() {
      console.log(this.state.personalUpdating)
      return (
      <div className="edit-personal">
        <ConfirmationModal show={this.state.isConfirm} onHide={this.hideConfirm.bind(this)}/>
        <PersonalComponent userDetail={this.state.userDetail} 
          userProfile={this.state.userProfile} 
          removeInfo={this.removePersonalInfo.bind(this)} 
          updateInfo={this.updatePersonalInfo.bind(this)}
          setState={this.setState.bind(this)}
        />
        <EducationComponent userEducation={this.state.userEducation} setState={this.setState.bind(this)}/>
        <FamilyComponent userFamily={this.state.userFamily} setState={this.setState.bind(this)}/>

        <ul class="list-inline">
          {this.state.files.map(file => {
            return <li class="list-inline-item">
                <span className="file-name">{file.name} <i class="fa fa-times remove" aria-hidden="true"></i></span>
              </li>
          })}
        </ul>
        
        <div className="clearfix mb-5">
          <button type="button" class="btn btn-primary float-right ml-3 shadow" onClick={this.showConfirm.bind(this)}><i class="fa fa-paper-plane" aria-hidden="true"></i>  Gửi yêu cầu</button>
          <input type="file" hidden ref={this.inputReference} id="file-upload" name="file-upload[]" onChange={this.fileUploadInputChange.bind(this)} multiple/>
          <button type="button" class="btn btn-light float-right shadow" onClick={this.fileUploadAction.bind(this)}><i class="fas fa-paperclip"></i> Đính kèm tệp tin</button>
          
        </div>
      </div>)
    }
  }
export default PersonalInfoEdit