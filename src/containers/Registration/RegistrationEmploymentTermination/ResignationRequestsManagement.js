import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import ResignationRequestsManagementPage from './ResignationRequestsManagementPage'
import { withTranslation  } from "react-i18next";
import HOCComponent from '../../../components/Common/HOCComponent'

class ResignationRequestsManagement extends React.Component {
  constructor(props) {
    super()
    this.state = {
      tab: new URLSearchParams(props?.history?.location?.search).get('tab') || "ResignationRequestsManagementPage",
    }
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props;
    return (
      <div className="registration-section justify-content-between task-page task-section1">
        <ResignationRequestsManagementPage />
      </div>
    )
  }
}

export default HOCComponent(withTranslation()(ResignationRequestsManagement))
