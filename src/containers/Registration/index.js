import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import LeaveOfAbsence from './LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTrip from './BusinessTrip/BusinessTripComponent'
import SubstitutionComponent from './Substitution/SubstitutionComponent'
import InOutTimeUpdate from './InOutTimeUpdate/InOutTimeUpdateComponent'

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
    return (
      <div className="registration-section personal-info">
        <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
          <Tab eventKey="LeaveOfAbsenceRegistration" title={'Đăng ký nghỉ'}>
            <LeaveOfAbsence />
          </Tab>
          <Tab eventKey="BusinessTripRegistration" title={'Đăng ký Công tác/Đào tạo'}>
            <BusinessTrip />
          </Tab>
          { 
            ['V030','V060'].includes(localStorage.getItem("companyCode")) ?
           <Tab eventKey="SubstitutionRegistration" title={'Thay đổi phân ca'}>
            <SubstitutionComponent />
          </Tab> : null
          }
          <Tab eventKey="InOutTimeUpdate" title={localStorage.getItem("companyCode") != "V096" ? 'Sửa giờ vào-ra' : 'Giải trình công'}>
            <InOutTimeUpdate />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
export default RegistrationComponent