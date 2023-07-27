import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import momeent from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userProfile: {},
      userDetail: {},
      userEducation: {},
      userFamily: {},
      userHealth: {}
    };
  }

  render() {
    return (
      <div className="internal-recruitment">
        <h1 className="content-page-header">internal-recruitment</h1>
      </div>
    )
  }
}

const InternalRecruitment = withTranslation()(MyComponent)

export default function App() {
  return (
    <InternalRecruitment />
  );
}
