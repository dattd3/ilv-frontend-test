import React from 'react'
import map from "../../map.config"
// import InOutTimeUpdateComponent from './InOutTimeUpdate/InOutTimeUpdateComponent'
// import SubstitutionComponent from './Substitution/SubstitutionComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import LeaveOfAbsenceComponent from '../../Registration/LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTripComponent from '../../Registration/BusinessTrip/BusinessTripComponent'
import TerminationDetailComponent from '../../Registration/RegistrationEmploymentTermination/RegistrationTerninationEdit';
import ProposedTerminationDetailComponent from '../../Registration/RegistrationEmploymentTermination/ProposedResignationEdit';

class TaskEditComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
          data: {}
        }
    }

    componentDidMount() {
      const taskId = this.props.match.params.id
      const subId = this.props.match.params.childId
        let config = {
          headers: {
            'Authorization': localStorage.getItem('accessToken')
          },
          params: {
              id: taskId,
              subid: subId
          }
        }
      
        axios.get(`${process.env.REACT_APP_REQUEST_URL}request/detail`, config)
          .then(res => {
             const response = res.data.data
             const result = res.data.result
             const code = result.code
              if (code == "000000") {
                this.setState({data: response })
              } else if (code == Constants.API_ERROR_NOT_FOUND_CODE || code == Constants.API_ERROR_CODE) {
                return window.location.href = map.NotFound
              }
          }).catch(error => {
            console.log(error)
          });
        }

    render() {
      return (
      <div className="registration-section">
        {(this.state.data && this.state.data.requestTypeId === Constants.LEAVE_OF_ABSENCE) ? <LeaveOfAbsenceComponent leaveOfAbsence={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId === Constants.BUSINESS_TRIP ? <BusinessTripComponent businessTrip={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.RESIGN_SELF && this.state.data.subTypeWorkOff == 1 ? <TerminationDetailComponent action={this.props.action} resignInfo={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.RESIGN_SELF && this.state.data.subTypeWorkOff == 2 ? <ProposedTerminationDetailComponent action={this.props.action} resignInfo={this.state.data}/> : null}
        {/* {this.state.data.requestTypeId === Constants.IN_OUT_TIME_UPDATE ? <InOutTimeUpdateComponent inOutTimeUpdate={this.state.data}/> : null}
        {this.state.data.requestTypeId === Constants.SUBSTITUTION ? <SubstitutionComponent substitution={this.state.data}/> : null} */}
      </div>
      )
    }
  }
export default TaskEditComponent