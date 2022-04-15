import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import ResignationRequestsManagementPage from './ResignationRequestsManagementPage'
import { withTranslation  } from "react-i18next";

class ResignationRequestsManagement extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tab: new URLSearchParams(props.history.location.search).get('tab') || "ResignationRequestsManagementPage",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props;
    return (
      <div className="registration-section justify-content-between task-page">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)} className="task-tabs">
          <Tab eventKey="ResignationRequestsManagementPage" title={t('ResignationRequestsManagement')}>
            <ResignationRequestsManagementPage />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(ResignationRequestsManagement)