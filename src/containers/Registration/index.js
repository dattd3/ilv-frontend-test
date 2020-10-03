import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import LeaveOfAbsence from './LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTrip from './BusinessTrip/BusinessTripComponent'
import ShiftWork from './ShiftWork/ShiftWorkComponent'
import InOutTimeUpdate from './InOutTimeUpdate/InOutTimeUpdateComponent'
// import axios from 'axios'
// import Constants from '../../../commons/Constants'

class RegistrationComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
          tasks: []
        }
    }

    componentDidMount() {
    //   const config = {
    //     headers: {
    //       'Authorization': `${localStorage.getItem('accessToken')}`
    //     }
    //   }
    //   axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/approval`, config)
    //   .then(res => {
    //     if (res && res.data && res.data.data && res.data.result) {
    //       const result = res.data.result;
    //       if (result.code != Constants.API_ERROR_CODE) {
    //         this.setState({tasks : res.data.data.listUserProfileHistories});
    //       }
    //     }
    //   }).catch(error => {
    //     this.props.sendData(null);
    //     this.setState({tasks : []});
    //   });
    }

    render() {
      return (
      <div className="registration-section personal-info">
        <Tabs defaultActiveKey="LeaveOfAbsenceRegistration" id="uncontrolled-tab-example">
            <Tab eventKey="LeaveOfAbsenceRegistration" title={'Đăng ký nghỉ phép'}>
                <LeaveOfAbsence/>
            </Tab>
            <Tab eventKey="BusinessTripRegistration" title={'Đăng ký Công tác/Đào tạo'}>
                <BusinessTrip/>
            </Tab>
            <Tab eventKey="ShiftWorkRegistration" title={'Đăng ký phân ca'}>
                <ShiftWork/>
            </Tab>
            <Tab eventKey="InOutTimeUpdate" title={'Sửa giờ vào-ra'}>
                <InOutTimeUpdate/>
            </Tab>
        </Tabs>
      </div>
      )
    }
  }
export default RegistrationComponent