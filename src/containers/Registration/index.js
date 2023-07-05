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
import OTRequest from './OTRequest';

import HOCComponent from '../../components/Common/HOCComponent'
import { isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode, getRequestConfigurations, isEnableOTFunctionByPnLVCode, prepareOrganization } from "../../commons/Utils"
import LoadingModal from 'components/Common/LoadingModal'

class RegistrationComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tab: new URLSearchParams(props?.history?.location?.search).get('tab') || "LeaveOfAbsenceRegistration",
      recentlyManagers: {},
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    this.loadRecentlyAppraiser()
  }

  updateTabLink = key => {
    this.props.history.push('?tab=' + key);
    this.setState({ tab: key })
  }

  loadRecentlyAppraiser = async () => {
    const config = getRequestConfigurations()
    const response = await axios.get(`${process.env.REACT_APP_REQUEST_URL}user/suggests`, config)
    if (response && response?.data) {
      const result = response.data?.result
      if (result && result?.code == Constants.API_SUCCESS_CODE) {
        const data = response.data?.data
        const { appraiserInfo, approverInfo } = data

        let appraiser = []
        if (appraiserInfo) {
          appraiser = [{
            value: appraiserInfo?.account?.toLowerCase() || "",
            label: appraiserInfo?.fullname || appraiserInfo?.fullName,
            fullName: appraiserInfo?.fullname || appraiserInfo?.fullName,
            avatar: appraiserInfo?.avatar || "",
            employeeLevel: appraiserInfo?.employeeLevel || "",
            pnl: appraiserInfo?.pnl || "",
            orglv2Id: appraiserInfo?.orglv2Id || "",
            account: appraiserInfo?.account?.toLowerCase() || "",
            current_position: appraiserInfo?.current_position || "",
            department: appraiserInfo?.department || "",
          }]

          try {
            const payload = {
              account: appraiserInfo?.account?.trim(),
              employee_type: "APPRAISER",
              status: Constants.statusUserActiveMulesoft
            }
            const res = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
            if (res?.data?.data && res?.data?.data[0]) {
              const newInfo = res?.data?.data[0]
              appraiser = [{
                value: newInfo?.username?.toLowerCase() || "",
                label: newInfo?.fullname,
                fullName: newInfo?.fullname,
                avatar: newInfo?.avatar || "",
                employeeLevel: newInfo?.rank_title || newInfo?.rank,
                pnl: newInfo?.pnl || "",
                orglv2Id: newInfo?.organization_lv2 || "",
                account: newInfo?.username?.toLowerCase() || "",
                current_position: newInfo?.position_name || '',
                department: prepareOrganization(newInfo?.division, newInfo?.department, newInfo?.unit, newInfo?.part)
              }]
            } else {
              appraiser = []
            }
          } finally {
            this.setState({ isLoading: false })
          }
        }

        let approver = []
        if (approverInfo) {
          approver = [{
            value: approverInfo?.account?.toLowerCase() || "",
            label: approverInfo?.fullname || approverInfo?.fullName,
            fullName: approverInfo?.fullname || approverInfo?.fullName,
            avatar: approverInfo?.avatar || "",
            employeeLevel: approverInfo?.employeeLevel || "",
            pnl: approverInfo?.pnl || "",
            orglv2Id: approverInfo?.orglv2Id || "",
            account: approverInfo?.account?.toLowerCase() || "",
            current_position: approverInfo?.current_position || "",
            department: approverInfo?.department || "",
          }]

          try {
            const payload = {
              account: approverInfo?.account?.trim(),
              employee_type: "APPROVER",
              status: Constants.statusUserActiveMulesoft
            }
            const res = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, payload, config)
            if (res?.data?.data && res?.data?.data[0]) {
              const newInfo = res?.data?.data[0]
              approver = [{
                value: newInfo?.username?.toLowerCase() || "",
                label: newInfo?.fullname,
                fullName: newInfo?.fullname,
                avatar: newInfo?.avatar || "",
                employeeLevel: newInfo?.rank_title || newInfo?.rank,
                pnl: newInfo?.pnl || "",
                orglv2Id: newInfo?.organization_lv2 || "",
                account: newInfo?.username?.toLowerCase() || "",
                current_position: newInfo?.position_name || '',
                department: prepareOrganization(newInfo?.division, newInfo?.department, newInfo?.unit, newInfo?.part)
              }]
            } else {
              approver = []
            }
          } finally {
            this.setState({ isLoading: false })
          }
        }
        this.setState({recentlyManagers: {appraiser: appraiser, approver: approver}})
      }
    }
  }

  render() {
    const { t } = this.props
    const { recentlyManagers, isloading } = this.state
    const PnLVCode = localStorage.getItem("companyCode")
    const isEnableShiftChangeFunction = isEnableShiftChangeFunctionByPnLVCode(PnLVCode)
    const isEnableInOutTimeUpdateFunction = isEnableInOutTimeUpdateFunctionByPnLVCode(PnLVCode)
    const isEnableOTRequestFunction = isEnableOTFunctionByPnLVCode(PnLVCode);
    return (
      <div className="registration-section personal-info justify-content-between">
        <LoadingModal isloading={isloading} />
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
          {
            isEnableOTRequestFunction && 
            <Tab eventKey="OTRequest" title={t('OTRequest')}>
              <OTRequest recentlyManagers={recentlyManagers} />
            </Tab>
          }
        </Tabs>
      </div>
    )
  }
}

export default HOCComponent(withTranslation()(RegistrationComponent))
