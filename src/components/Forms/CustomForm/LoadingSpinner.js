import React from "react";
import logo from '../../../assets/img/myvp-logo.png';
import Spinner from 'react-bootstrap/Spinner'


class LoadingSpinner extends React.Component { 

  render() {

    return (
      <div className="text-center no-bg">
        <Spinner animation="border" variant="danger" sile="lg" />
      </div>
    );

  }
}
export default LoadingSpinner;