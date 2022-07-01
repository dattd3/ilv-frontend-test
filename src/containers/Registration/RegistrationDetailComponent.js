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
    const { data, isShowModalRegistrationConfirm, taskId, modalTitle, modalMessage, typeRequest, requestUrl } = this.state
    const { action } = this.props

    return (
      <>
      <RegistrationConfirmationModal show={isShowModalRegistrationConfirm} id={taskId} title={modalTitle} message={modalMessage}
        type={typeRequest} urlName={requestUrl} onHide={this.onHideModalRegistrationConfirm} />
      <div className="registration-section">
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.PROPOSED_CONTRACT_TERMINATION_CODE ? <ProposeTerminationDetailComponent action={action} resignInfo={data}/> : null}
        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE ? <TerminationDetailComponent action={action} resignInfo={data}/> : null}
        {data && data.requestTypeId == Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceDetailComponent leaveOfAbsence={data}/> : null}
        {data && data.requestTypeId == Constants.BUSINESS_TRIP ? <BusinessTripDetailComponent businessTrip={data}/> : null}
        {data && data.requestTypeId == Constants.IN_OUT_TIME_UPDATE ? <InOutUpdateDetailComponent inOutTimeUpdate={data}/> : null}
        {data && data.requestTypeId == Constants.SUBSTITUTION ? <SubstitutionDetailComponent substitution={data}/> : null}
        {data && data.requestTypeId == Constants.CHANGE_DIVISON_SHIFT ? <ChangeDivisionShiftDetail action={action} substitution={data}/> : null}
        {data && data.requestTypeId == Constants.DEPARTMENT_TIMESHEET ? <DepartmentTimeSheetDetail action={action} substitution={data}/> : null}
        {data && data.requestTypeId == Constants.UPDATE_PROFILE ? <UpdateProfileDetailComponent details={data}/> : null}
      </div>
      </>
    )
  }
}

export default RegistrationDetailComponent
