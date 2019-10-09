import React from "react";
import './LoadingSpinner.css';
import Spinner from 'react-bootstrap/Spinner'
import Loading_icon from "../../Logo/GIF-Vinpearl.gif"


class Course extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    return (
            <>
              <div className = "loading-spinner">
                <img src={Loading_icon}  height={225} width={400} />
              </div>
            </>
    );
  
  }
}
export default Course;