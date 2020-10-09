import React from 'react'
import LeaveOfAbsenceComponent from './LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTripComponent from './BusinessTrip/BusinessTripComponent'
import axios from 'axios'
import Constants from '../../commons/Constants'

class RegistrationEditComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {}
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
        {this.state.data.requestTypeId == Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceComponent leaveOfAbsence={this.state.data}/> : null}
        {this.state.data.requestTypeId == Constants.BUSINESS_TRIP ? <BusinessTripComponent businessTrip={this.state.data}/> : null}
      </div>
      )
    }
  }
export default RegistrationEditComponent