import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import RegistrationEmploymentTerminationForm from '../RegistrationEmploymentTermination/RegistrationEmploymentTerminationForm'
import { withTranslation  } from "react-i18next";
class RegistrationEmploymentTermination extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tab: new URLSearchParams(props?.history?.location?.search).get('tab') || "RegistrationEmploymentTerminationForm",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props;
    return (
      <div className="registration-section personal-info justify-content-between">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
          <Tab eventKey="RegistrationEmploymentTerminationForm" title={t('RegistrationEmploymentTermination')}>
            <RegistrationEmploymentTerminationForm />
          </Tab>
          {/* <Tab eventKey="BusinessTripRegistration" title={t('BizTrip_TrainingRequest')}>
            <BusinessTrip />
          </Tab>
          { 
            !['V096','V073'].includes(localStorage.getItem("companyCode")) ?
           <Tab eventKey="SubstitutionRegistration" title={t('ShiftChange')}>
            <SubstitutionComponent />
          </Tab> : null
          }
          <Tab eventKey="InOutTimeUpdate" title={localStorage.getItem("companyCode") != "V096" ? t('InOutChangeRequest') : t('Explanation')}>
            <InOutTimeUpdate />
          </Tab> */}
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(RegistrationEmploymentTermination)