import React from 'react'
import LeaveOfAbsenceDetailComponent from './LeaveOfAbsence/LeaveOfAbsenceDetailComponent'
import BusinessTripDetailComponent from './BusinessTrip/BusinessTripDetailComponent'
import InOutUpdateDetailComponent from './InOutTimeUpdate/InOutUpdateDetailComponent'
import SubstitutionDetailComponent from './Substitution/SubstitutionDetailComponent'
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"

class RegistrationDetailComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {}
        }
    }

    getTypeDetail = () => {
      const pathName = window.location.pathname;
      const pathNameArr = pathName.split('/');
      return pathNameArr[pathNameArr.length - 1];
    }

    componentDidMount() {
      const taskId = this.props.match.params.id
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        }
      }
    
      axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/${taskId}?typeDetail=${this.getTypeDetail()}`, config)
      .then(res => {
        if (res && res.data) {
          const data = res.data
          if (data.result && data.result.code == Constants.API_ERROR_NOT_FOUND_CODE) {
            return window.location.href = map.NotFound;
          }
          const response = data.data
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