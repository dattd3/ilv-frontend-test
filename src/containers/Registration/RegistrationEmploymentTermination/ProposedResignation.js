import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import RegistrationEmploymentTerminationForm from './RegistrationEmploymentTerminationForm'
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
      <div className="task-page justify-content-between">
        <Tabs defaultActiveKey={this.state.tab} className={`task-tabs`} onSelect={(key) => this.updateTabLink(key)} >
          <Tab eventKey="RegistrationEmploymentTerminationForm" title={t('ProposedResignation')}>
            <RegistrationEmploymentTerminationForm />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(ProposedResignation)