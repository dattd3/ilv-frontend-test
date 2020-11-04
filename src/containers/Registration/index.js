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
          <Tab eventKey="LeaveOfAbsenceRegistration" title={'Đăng ký nghỉ phép'}>
            <LeaveOfAbsence />
          </Tab>
          <Tab eventKey="BusinessTripRegistration" title={'Đăng ký Công tác/Đào tạo'}>
            <BusinessTrip />
          </Tab>
          <Tab eventKey="SubstitutionRegistration" title={'Thay đổi phân ca'}>
            <SubstitutionComponent />
          </Tab>
          <Tab eventKey="InOutTimeUpdate" title={'Sửa giờ vào-ra'}>
            <InOutTimeUpdate />
          </Tab>
        </Tabs>
      </div>
    )
  }
}
export default RegistrationComponent