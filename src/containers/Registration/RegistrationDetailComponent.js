import React from 'react'
import LeaveOfAbsenceDetailComponent from './LeaveOfAbsence/LeaveOfAbsenceDetailComponent'
import BusinessTripDetailComponent from './BusinessTrip/BusinessTripDetailComponent'
import InOutUpdateDetailComponent from './InOutTimeUpdate/InOutUpdateDetailComponent'
import SubstitutionDetailComponent from './Substitution/SubstitutionDetailComponent'
import ChangeDivisionShiftDetail from '../Registration/Substitution/ChangeDivisionShiftDetail'
import DepartmentTimeSheetDetail from './DepartmentTimeSheetDetail'
import TerminationDetailComponent from './RegistrationEmploymentTermination/RegistrationTerminationDetail';
import ProposeTerminationDetailComponent from './RegistrationEmploymentTermination/PropsedResignationDetail';
import RegistrationConfirmationModal from './ConfirmationModal'
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"
import UpdateProfileDetailComponent from '../Task/RequestDetail'

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

  evictionRequest = (taskId) => {
    alert(taskId)
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
    const data = this.state.data
    const action = this.props.action

    return (
      <>
      <RegistrationConfirmationModal show={this.state.isShowModalRegistrationConfirm} id={this.state.taskId} title={this.state.modalTitle} message={this.state.modalMessage} 
        type={this.state.typeRequest} urlName={this.state.requestUrl} onHide={this.onHideModalRegistrationConfirm} />
      <div className="registration-section">
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.PROPOSED_CONTRACT_TERMINATION_CODE ? <ProposeTerminationDetailComponent action={action} resignInfo={data}/> : null}
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE ? <TerminationDetailComponent action={action} resignInfo={data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceDetailComponent leaveOfAbsence={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.BUSINESS_TRIP ? <BusinessTripDetailComponent businessTrip={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.IN_OUT_TIME_UPDATE ? <InOutUpdateDetailComponent inOutTimeUpdate={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.SUBSTITUTION ? <SubstitutionDetailComponent substitution={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId === Constants.CHNAGE_DIVISON_SHIFT ? <ChangeDivisionShiftDetail action={this.props.action} substitution={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId === Constants.DEPARTMENT_TIMESHEET ? <DepartmentTimeSheetDetail action={this.props.action} substitution={this.state.data}/> : null}
        {this.state.data && this.state.data.requestTypeId == Constants.UPDATE_PROFILE ? <UpdateProfileDetailComponent/> : null}
        {/* {
          data.status == 0 && this.getTypeDetail() === "request" ?
          <div className="clearfix mb-5 registration-detail">
            <span className="btn btn-primary float-right ml-3 shadow btn-eviction-task" title="Thu hồi yêu cầu" onClick={e => this.evictionRequest(data.id)}><i className="fas fa-undo-alt" aria-hidden="true"></i>  Thu hồi</span>
          </div>
          : null
        } */}
      </div>
      </>
    )
  }
}

export default RegistrationDetailComponent
