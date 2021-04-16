import React from 'react'
import axios from 'axios'
import {InputGroup, FormControl} from 'react-bootstrap'
import Select from 'react-select'
import { withTranslation } from "react-i18next"
import TaskList from '../taskList'
import ConfirmRequestModal from '../ConfirmRequestModal'
import Constants from '../../../commons/Constants'

class ApprovalComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: [],
      dataToSap: [],
    }
  }
  
  exportToExcel = () => {
    const config = {
      headers: {
        'Authorization': `${localStorage.getItem('accessToken')}`
      },
    }

    axios.post(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/export-to-excel?tabs=approval`, null, config)
    .then(res => {
      const fileUrl = res.data
      if (fileUrl) {
        window.open(fileUrl);
      }
    }).catch(error => {

    });
  }

  handleSelectChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {
    const { t } = this.props
    let statusFiler = [
      { value: Constants.STATUS_WAITING , label: t("Waiting") },
      { value: Constants.STATUS_APPROVED, label: t("Approved") },
      // { value: Constants.STATUS_EVICTION , label: t("Recalled") },
      { value: Constants.STATUS_NOT_APPROVED , label: t("Từ chối") },
      { value: Constants.STATUS_REVOCATION , label: t("Đã hủy") },
    ]
    return (
      <>
        <div className="task-section">
          <TaskList tasks={this.props.tasks} filterdata={statusFiler} page="approval" title={t("ApprovalManagement")}/>
        </div>
      </>
    )
  }
}

export default withTranslation()(ApprovalComponent)
