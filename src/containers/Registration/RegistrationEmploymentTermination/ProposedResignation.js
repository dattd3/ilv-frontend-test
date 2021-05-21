import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import ProposedResignationPage from './ProposedResignationPage'
import { withTranslation  } from "react-i18next";
class ProposedResignation extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tab: new URLSearchParams(props.history.location.search).get('tab') || "RegistrationEmploymentTerminationForm",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props;
    return (
      <div className="registration-section justify-content-between">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)} className="tab-page">
          <Tab eventKey="RegistrationEmploymentTerminationForm" title={t('ProposedForResignation')}>
            <ProposedResignationPage />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(ProposedResignation)