import React from 'react'
import PersonalInfoEdit from './PersonalInfoEdit'
import axios from 'axios'

class PersonalInfoRequestEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      requestedUserProfile: null,
      birthProvince: "",
      birthCountry: null
    }
  }

  setBirthCountryEdited = (data) => {
    if (data && data.userProfileInfo && data.userProfileInfo.update && data.userProfileInfo.update.userProfileHistoryMainInfo 
      && data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo) {
      const newMainInfo = data.userProfileInfo.update.userProfileHistoryMainInfo.NewMainInfo
      this.setState({birthCountry : newMainInfo.BirthCountry ? newMainInfo.BirthCountry : "" })
    }
  }

  componentDidMount() {
    let config = {
      headers: {
        'Authorization': localStorage.getItem('accessToken')
      }
    }
    
    axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${this.props.match.params.id}`, config)
    .then(res => {
      if (res && res.data) {
        const requestedUserProfile = res.data.data
        this.setBirthCountryEdited(requestedUserProfile)
        this.setState({requestedUserProfile: requestedUserProfile})
      }
    }).catch(error => {
      console.log(error);
    })
  }

  render() {
    return (
      <div>
        {this.state.requestedUserProfile ? <PersonalInfoEdit birthCountry={this.state.birthCountry} requestedUserProfile={this.state.requestedUserProfile}/> : null}
      </div>
    )
  }
}

export default PersonalInfoRequestEdit
