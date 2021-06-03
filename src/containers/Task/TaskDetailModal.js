import React from 'react'
import { Modal } from 'react-bootstrap'
import LeaveOfAbsenceDetailComponent from '../Registration/LeaveOfAbsence/LeaveOfAbsenceDetailComponent'
import BusinessTripDetailComponent from '../Registration/BusinessTrip/BusinessTripDetailComponent'
import InOutUpdateDetailComponent from '../Registration/InOutTimeUpdate/InOutUpdateDetailComponent'
import SubstitutionDetailComponent from '../Registration/Substitution/SubstitutionDetailComponent'
import ChangeDivisionShiftDetail from '../Registration/Substitution/ChangeDivisionShiftDetail'
import DepartmentTimeSheetDetail from '../Registration/DepartmentTimeSheetDetail'
import PersonalDetailComponent from './ApprovalDetail'
import ProposeTerminationDetailComponent from '../Registration/RegistrationEmploymentTermination/PropsedResignationDetail';
import TerminationDetailComponent from '../Registration/RegistrationEmploymentTermination/RegistrationTerminationDetail';
import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"

class TaskDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: {}
        }
    }
  
    componentDidMount() {
      let config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        },
        params:{
          id: this.props.taskId,
          subid: this.props.subId??1
        }
      }
      if(this.props.taskId)
      {
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
    }
    render() {
        const { t } = this.props
        const data = this.state.data;
        if(!data) {
          return null;
        }
        return (
            <Modal backdrop="static" keyboard={false}
                size="xl"
                className='info-modal-common position-apply-modal'
                centered show={this.props.show}
                onHide={this.props.onHide}
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="registration-section">
                        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.PROPOSED_CONTRACT_TERMINATION_CODE ? <ProposeTerminationDetailComponent action={this.props.action} resignInfo={this.state.data}/> : null}
                        {data && data.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE ? <TerminationDetailComponent action={this.props.action} resignInfo={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceDetailComponent action={this.props.action} leaveOfAbsence={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.BUSINESS_TRIP ? <BusinessTripDetailComponent action={this.props.action} businessTrip={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.IN_OUT_TIME_UPDATE ? <InOutUpdateDetailComponent action={this.props.action} inOutTimeUpdate={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.SUBSTITUTION ? <SubstitutionDetailComponent action={this.props.action} substitution={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.UPDATE_PROFILE ? <PersonalDetailComponent id={this.props.taskId} data={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.CHANGE_DIVISON_SHIFT ? <ChangeDivisionShiftDetail action={this.props.action} substitution={this.state.data}/> : null}
                        {this.state.data && this.state.data.requestTypeId === Constants.DEPARTMENT_TIMESHEET ? <DepartmentTimeSheetDetail action={this.props.action} substitution={this.state.data}/> : null}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default TaskDetailModal
