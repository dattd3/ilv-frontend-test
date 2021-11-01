import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import LeaveOfAbsence from './LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTrip from './BusinessTrip/BusinessTripComponent'
import SubstitutionComponent from './Substitution/SubstitutionComponent'
import InOutTimeUpdate from './InOutTimeUpdate/InOutTimeUpdateComponent'
import { isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode } from "../../commons/Utils"

class RegistrationComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tab: new URLSearchParams(props.history.location.search).get('tab') || "LeaveOfAbsenceRegistration",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props
    const PnLVCode = localStorage.getItem("companyCode")
    const isEnableShiftChangeFunction = isEnableShiftChangeFunctionByPnLVCode(PnLVCode)
    const isEnableInOutTimeUpdateFunction = isEnableInOutTimeUpdateFunctionByPnLVCode(PnLVCode)

    return (
      <div className="registration-section personal-info justify-content-between">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
          <Tab eventKey="LeaveOfAbsenceRegistration" title={t('LeaveRequest')}>
            <LeaveOfAbsence />
          </Tab>
          <Tab eventKey="BusinessTripRegistration" title={t('BizTrip_TrainingRequest')}>
            <BusinessTrip />
          </Tab>
          { 
            isEnableShiftChangeFunction && 
            <Tab eventKey="SubstitutionRegistration" title={t('ShiftChange')}>
              <SubstitutionComponent />
            </Tab>
          }
          {
            isEnableInOutTimeUpdateFunction && 
            <Tab eventKey="InOutTimeUpdate" title={t('InOutChangeRequest')}>
              <InOutTimeUpdate />
            </Tab>
          }
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(RegistrationComponent)