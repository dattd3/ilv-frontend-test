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
import OTRequestDetailComponent from '../Registration/OTRequest/OTRequestDetail';
import WorkOutSideGroupDetail from 'containers/PersonalInfo/WorkOutSideGroupDetail'

import axios from 'axios'
import Constants from '../../commons/Constants'
import map from "../map.config"
import InternalPaymentDetail from 'containers/Welfare/InternalPayment/InternalPaymentDetail'

class TaskDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: {}
        }
    }
  
    componentDidMount() {
      const { taskId, subId } = this.props
      const requestId = taskId?.toString().includes('.') ? taskId?.toString()?.split('.')?.[0] : taskId
      const subRequestId = taskId?.toString().includes('.') ? taskId?.toString()?.split('.')?.[1] : (subId ?? 1)
      const config = {
        headers: {
          'Authorization': localStorage.getItem('accessToken')
        },
        params:{
          id: requestId,
          subid: subRequestId,
        }
      }

      if (taskId) {
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
        const { t, action, taskId, show, onHide, isAutoShowDetailModal } = this.props
        const data = this.state.data;
        let { requestTypeId, updateField } = data
        let isWorkOutSideGroup = false;
        if (requestTypeId == Constants.UPDATE_PROFILE) {
          updateField = JSON.parse(updateField || '{}')
          isWorkOutSideGroup = updateField?.UpdateField?.length === 1 && updateField?.UpdateField[0] === 'WorkOutside'
        }
        // updateField = JSON.parse(updateField || '{}')
        // const isWorkOutSideGroup = requestTypeId == Constants.UPDATE_PROFILE && updateField?.UpdateField?.length === 1 && updateField?.UpdateField[0] === 'WorkOutside'

        if(!data) {
          return null;
        }

        return (
            <Modal backdrop="static" 
                keyboard={false}
                size="xl"
                className={`info-modal-common position-apply-modal request-detail-modal ${isWorkOutSideGroup ? 'work-out-side-group' : ''}`}
                centered show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="registration-section">
                        {data && data?.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.PROPOSED_CONTRACT_TERMINATION_CODE ? <ProposeTerminationDetailComponent action={action} resignInfo={data}/> : null}
                        {data && data?.requestTypeId == Constants.RESIGN_SELF && data?.requestInfo?.formResignation == Constants.REGISTER_CONTRACT_TERMINATION_CODE ? <TerminationDetailComponent action={action} resignInfo={data}/> : null}
                        {data && data?.requestTypeId === Constants.LEAVE_OF_ABSENCE ? <LeaveOfAbsenceDetailComponent action={action} leaveOfAbsence={data} viewPopup={true} /> : null}
                        {data && data?.requestTypeId === Constants.BUSINESS_TRIP ? <BusinessTripDetailComponent action={action} businessTrip={data} viewPopup={true} /> : null}
                        {data && data?.requestTypeId === Constants.IN_OUT_TIME_UPDATE ? <InOutUpdateDetailComponent action={action} inOutTimeUpdate={data}/> : null}
                        {data && data?.requestTypeId === Constants.SUBSTITUTION ? <SubstitutionDetailComponent action={action} substitution={data}/> : null}
                        {
                          data && data?.requestTypeId === Constants.UPDATE_PROFILE 
                          ? (isWorkOutSideGroup)
                            ? (<WorkOutSideGroupDetail details={data} viewPopup={true} />)
                            : (<PersonalDetailComponent id={taskId} data={data} />)
                          : null
                        }
                        {data && data?.requestTypeId === Constants.CHANGE_DIVISON_SHIFT ? <ChangeDivisionShiftDetail action={action} substitution={data}/> : null}
                        {data && data?.requestTypeId === Constants.DEPARTMENT_TIMESHEET ? <DepartmentTimeSheetDetail action={action} substitution={data}/> : null}
                        {data && data?.requestTypeId === Constants.OT_REQUEST ? <OTRequestDetailComponent action={action} data={data}/> : null}
                        {data && data?.requestTypeId === Constants.WELFARE_REFUND ? <InternalPaymentDetail action={action} data={data} viewPopup={true} /> : null}
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default TaskDetailModal
