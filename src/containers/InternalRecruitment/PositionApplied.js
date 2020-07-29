import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import momeent from 'moment';
import { Redirect } from 'react-router-dom';
import map from '../map.config';
import PositionAppliedList from './PositionAppliedList'

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

  componentDidMount() {

  }

  render() {
    return (
      <div className="position-applied-section">
        <PositionAppliedList />
      </div>
    )
  }
}

const PositionApplied = withTranslation()(MyComponent)

export default function App() {
  return (
    <PositionApplied />
  );
}
