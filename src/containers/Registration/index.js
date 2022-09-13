import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation  } from "react-i18next"
import axios from 'axios'
import { size } from 'lodash'
import Constants from '../../commons/Constants'
import LeaveOfAbsence from './LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTrip from './BusinessTrip/BusinessTripComponent'
import SubstitutionComponent from './Substitution/SubstitutionComponent'
import InOutTimeUpdate from './InOutTimeUpdate/InOutTimeUpdateComponent'
import { isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode, getRequestConfigurations } from "../../commons/Utils"

class RegistrationComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tab: new URLSearchParams(props.history.location.search).get('tab') || "LeaveOfAbsenceRegistration",
      recentlyManagers: {}
    }
  }

  componentDidMount() {
    this.loadRecentlyAppraiser()
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  loadRecentlyAppraiser = async () => {
    try {
      const config = getRequestConfigurations()
      const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}user/suggests`, config)
      if (response && response.data) {
        const result = response.data.result
        if (result && result.code == Constants.API_SUCCESS_CODE) {
          const data = response.data?.data
          const { appraiserInfo, approverInfo } = data

          const appraiser = appraiserInfo && size(appraiserInfo) > 0 
          ?  [{
            value: appraiserInfo?.account?.toLowerCase() || "",
            label: appraiserInfo?.fullName || "",
            fullName: appraiserInfo?.fullName || "",
            avatar: appraiserInfo?.avatar || "",
            employeeLevel: appraiserInfo?.employeeLevel || "",
            pnl: appraiserInfo?.pnl || "",
            orglv2Id: appraiserInfo?.orglv2Id || "",
            account: appraiserInfo?.account?.toLowerCase() || "",
            current_position: appraiserInfo?.current_position || "",
            department: appraiserInfo?.department || "",
          }]
          : []

          const approver = approverInfo && size(approverInfo) > 0 
          ?  [{
            value: approverInfo?.account?.toLowerCase() || "",
            label: approverInfo?.fullName || "",
            fullName: approverInfo?.fullName || "",
            avatar: approverInfo?.avatar || "",
            employeeLevel: approverInfo?.employeeLevel || "",
            pnl: approverInfo?.pnl || "",
            orglv2Id: approverInfo?.orglv2Id || "",
            account: approverInfo?.account?.toLowerCase() || "",
            current_position: approverInfo?.current_position || "",
            department: approverInfo?.department || "",
          }]
          : []

          this.setState({recentlyManagers: {appraiser: appraiser, approver: approver}})
        }
      }
    } catch (e) {

    }
  }

  render() {
    const { t } = this.props
    const { recentlyManagers } = this.state
    const PnLVCode = localStorage.getItem("companyCode")
    const isEnableShiftChangeFunction = isEnableShiftChangeFunctionByPnLVCode(PnLVCode)
    const isEnableInOutTimeUpdateFunction = isEnableInOutTimeUpdateFunctionByPnLVCode(PnLVCode)

    return (
      <div className="registration-section personal-info justify-content-between">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
          <Tab eventKey="LeaveOfAbsenceRegistration" title={t('LeaveRequest')}>
            <LeaveOfAbsence recentlyManagers={recentlyManagers} />
          </Tab>
          <Tab eventKey="BusinessTripRegistration" title={t('BizTrip_TrainingRequest')}>
            <BusinessTrip recentlyManagers={recentlyManagers} />
          </Tab>
          { 
            isEnableShiftChangeFunction && 
            <Tab eventKey="SubstitutionRegistration" title={t('ShiftChange')}>
              <SubstitutionComponent recentlyManagers={recentlyManagers} />
            </Tab>
          }
          {
            isEnableInOutTimeUpdateFunction && 
            <Tab eventKey="InOutTimeUpdate" title={t('InOutChangeRequest')}>
              <InOutTimeUpdate recentlyManagers={recentlyManagers} />
            </Tab>
          }
        </Tabs>
      </div>
    )
  }
}
export default withTranslation()(RegistrationComponent)