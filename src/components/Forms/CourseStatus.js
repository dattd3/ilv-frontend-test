import React from "react";


class CourseStatus extends React.Component {

  generateStatus()
  {
    const isDone = this.props.isDone;
    if (isDone) {
      return <span className="course-status-ok">Đã hoàn thành</span>
    }
    return <span className="course-status-ng">Chưa hoàn thành</span>
  }

  render() {

    return (
        this.generateStatus()
    );
  
  }
}
export default CourseStatus;