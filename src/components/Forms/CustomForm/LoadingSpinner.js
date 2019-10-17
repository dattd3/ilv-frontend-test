import React from "react";
import './LoadingSpinner.css';
import Loading_icon from "../../Logo/GIF-Vinpearl.gif"


class LoadingSpinner extends React.Component { 

  render() {

    return (
      <div className="loading-spinner">
        <img src={Loading_icon} height={225} width={400} alt='' />
      </div>
    );

  }
}
export default LoadingSpinner;