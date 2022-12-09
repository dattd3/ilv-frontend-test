import React from 'react';
import { withTranslation } from 'react-i18next';
import PositionAppliedList from './PositionAppliedList'
import HOCComponent from '../../../components/Common/HOCComponent'

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
      <div className="position-applied-section">
        <PositionAppliedList />
      </div>
    )
  }
}

const PositionApplied = HOCComponent(withTranslation()(MyComponent))

export default function App() {
  return (
    <PositionApplied />
  );
}
