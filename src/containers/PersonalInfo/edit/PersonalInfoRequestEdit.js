import React from 'react'
import PersonalInfoEdit from './PersonalInfoEdit'
import axios from 'axios'

class PersonalInfoRequestEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            requestedUserProfile: null
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
              const requestedUserProfile = res.data
              this.setState({requestedUserProfile: requestedUserProfile})
            }
          }).catch(error => {
            console.log(error);
          })

          if (this.props.isEdit && this.props.requestedUserProfile) {
            
          }
    }

    render() {
        return (
           <div>
               {this.state.userProfile ? <PersonalInfoEdit requestedUserProfile={this.state.requestedUserProfile}/> : null}
           </div>
        )
    }
}

export default PersonalInfoRequestEdit
