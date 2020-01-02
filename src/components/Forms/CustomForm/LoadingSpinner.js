import React from "react";
import logo from '../../../assets/img/myvp-logo.png';


class LoadingSpinner extends React.Component { 

  render() {

    return (
      <div className="vp-spinner">
        <div className="loading-spinner">
          <img src={logo} alt="Loading..." />
        </div>
      </div>
    );

  }
}
export default LoadingSpinner;