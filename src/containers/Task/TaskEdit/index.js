import React from 'react'
import map from "../../map.config"
// import InOutTimeUpdateComponent from './InOutTimeUpdate/InOutTimeUpdateComponent'
// import SubstitutionComponent from './Substitution/SubstitutionComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'
import LeaveOfAbsenceComponent from '../../Registration/LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTripComponent from '../../Registration/BusinessTrip/BusinessTripComponent'
import TerminationDetailComponent from '../../Registration/RegistrationEmploymentTermination/RegistrationTerninationEdit'
import ProposedResignationEdit from '../../Registration/RegistrationEmploymentTermination/ProposedResignationEdit'

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
      const {data} = this.state
      
      return (
      <div className="registration-section">
        {data && data.requestTypeId === Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceComponent leaveOfAbsence={data}/> : null}
        {data && data.requestTypeId === Constants.BUSINESS_TRIP ? <BusinessTripComponent businessTrip={data}/> : null}
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE ? <TerminationDetailComponent action="edit" resignInfo={data} /> : null}
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.PROPOSED_CONTRACT_TERMINATION_CODE ? <ProposedResignationEdit action="edit" resignInfo={data} /> : null}
        {/* {this.state.data.requestTypeId === Constants.IN_OUT_TIME_UPDATE ? <InOutTimeUpdateComponent inOutTimeUpdate={this.state.data}/> : null}
        {this.state.data.requestTypeId === Constants.SUBSTITUTION ? <SubstitutionComponent substitution={this.state.data}/> : null} */}
      </div>
      )
    }
  }
export default TaskEditComponent