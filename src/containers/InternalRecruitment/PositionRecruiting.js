import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';
import PositionRecruitingSearch from './PositionRecruitingSearch'
import PositionRecruitingSearchResult from './PositionRecruitingSearchResult'
import PositionRecruitingDetail from './PositionRecruitingDetail'

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timsheetSummary: {},
      timesheets: [],
      isSearch: false
    }
  }

  searchTimesheetByDate (startDate, endDate) {
    this.setState({ isSearch: false })
    const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
          'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
        }
    }

    const start = moment(startDate).format('YYYYMMDD').toString()
    const end = moment(endDate).format('YYYYMMDD').toString()

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/timekeeping?from_time=${start}&to_time=${end}`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        const timsheetSummary = res.data.data[0]
        this.setState({ timsheetSummary: timsheetSummary, isSearch: true })
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/timekeeping/detail?from_time=${start}&to_time=${end}`, config)
    .then(res => {
      if (res && res.data && res.data.data) {
        const timesheets = res.data.data
        this.setState({ timesheets: timesheets, isSearch: true })
      }
    }).catch(error => {
        // localStorage.clear();
        // window.location.href = map.Login;
    })
}

  componentDidMount() {

  }

  render() {
    return (
      <div className="position-recruiting-section">
        <PositionRecruitingSearch clickSearch={this.searchTimesheetByDate.bind(this)}/>
        <PositionRecruitingSearchResult />
        <PositionRecruitingDetail />
      </div>
    )
  }
}

const PositionRecruiting = withTranslation()(MyComponent)

export default function App() {
  return (
    <PositionRecruiting />
  );
}
