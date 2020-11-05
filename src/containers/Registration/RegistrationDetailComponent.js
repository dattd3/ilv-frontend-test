import React from 'react'
import LeaveOfAbsenceDetailComponent from './LeaveOfAbsence/LeaveOfAbsenceDetailComponent'
import BusinessTripDetailComponent from './BusinessTrip/BusinessTripDetailComponent'
import InOutUpdateDetailComponent from './InOutTimeUpdate/InOutUpdateDetailComponent'
import SubstitutionDetailComponent from './Substitution/SubstitutionDetailComponent'
import axios from 'axios'
import Constants from '../../commons/Constants'

class RegistrationDetailComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {}
        }
    }

    componentDidMount() {
      const userProfileHistoryId = this.props.match.params.id
      const notificationId = this.props.match.params.notificationId
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        }
      }
    
      axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${userProfileHistoryId}/${notificationId}`, config)
      .then(res => {
        if (res && res.data) {
          const response = res.data.data
          this.setState({data: response })
        }
      }).catch(error => {
        console.log(error)
      });
    }

    render() {
      return (
      <div className="registration-section">
        {this.state.data && this.state.data.requestTypeId == Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceDetailComponent leaveOfAbsence={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.BUSINESS_TRIP ? <BusinessTripDetailComponent businessTrip={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.IN_OUT_TIME_UPDATE ? <InOutUpdateDetailComponent inOutTimeUpdate={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.SUBSTITUTION ? <SubstitutionDetailComponent substitution={this.state.data}/> : null}
      </div>
      )
    }
  }
export default RegistrationDetailComponent