import React from 'react'
import LeaveOfAbsenceEdit from './LeaveOfAbsenceEdit'
// import BusinessTripComponent from './BusinessTrip/BusinessTripComponent'
// import InOutTimeUpdateComponent from './InOutTimeUpdate/InOutTimeUpdateComponent'
// import SubstitutionComponent from './Substitution/SubstitutionComponent'
import axios from 'axios'
import Constants from '../../../commons/Constants'

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
        {this.state.data.requestTypeId === Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceEdit leaveOfAbsence={this.state.data}/> : null}
        {/* {this.state.data.requestTypeId === Constants.BUSINESS_TRIP ? <BusinessTripComponent businessTrip={this.state.data}/> : null}
        {this.state.data.requestTypeId === Constants.IN_OUT_TIME_UPDATE ? <InOutTimeUpdateComponent inOutTimeUpdate={this.state.data}/> : null}
        {this.state.data.requestTypeId === Constants.SUBSTITUTION ? <SubstitutionComponent substitution={this.state.data}/> : null} */}
      </div>
      )
    }
  }
export default TaskEditComponent