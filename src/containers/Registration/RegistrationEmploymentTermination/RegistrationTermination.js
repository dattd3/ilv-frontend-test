import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import RegistrationEmploymentTerminationForm from './RegistrationEmploymentTerminationForm'

class RegistrationEmploymentTermination extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tab: new URLSearchParams(props.history.location.search).get('tab') || "RegistrationEmploymentTerminationForm",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key)
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props
    return (
      <div className="task-page justify-content-between ">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)} className="task-tabs">
          <Tab eventKey="RegistrationEmploymentTerminationForm" title={t('RegistrationEmploymentTermination')}>
            <RegistrationEmploymentTerminationForm />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default withTranslation()(RegistrationEmploymentTermination)
