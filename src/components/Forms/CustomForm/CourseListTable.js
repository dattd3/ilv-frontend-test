import React from "react";
import './CourseListTable.css';
import CourseStatus from "./CourseStatus";


class CourseListTable extends React.Component {

 
  UNSAFE_componentWillMount () {
      const script = document.createElement("script");
      const dom = "'dom': 'rtp'";
      const str = "$(document).ready(function() {$('#"+this.props.id+"').DataTable({'pageLength': 5, 'lengthChange': false,'info': false, 'searching': false,'ordering': false,"+dom+"});});"
      const scriptText = document.createTextNode(str);

      script.appendChild(scriptText);
      document.head.appendChild(script);
  }

  render() {
    let courseList = this.props.data;
    if (courseList) {
    console.log(courseList);
    }
    let courseListElement;
     if (courseList && courseList.courses) 
     {
        courseListElement = courseList.courses.map((item, index) =>
            <tr key ={index}>
              <td>{index + 1}</td>
              <td className="wrap-text">{item.name}</td>
              <td className="center-text"><CourseStatus id={index} status = {item.status} /></td>
            </tr>
          )
      }

    return (
      <div>
        <div className="white-body">
            <div className="row table-title">
                <h6 className="col-sm-8 col-md-8 col-lg-8 m-0 font-weight-500 text-uppercase text-color-vp">{this.props.tableName}</h6>
                <h6 className="col-sm-4 col-md-4 col-lg-4 padding-right-50 m-0 font-weight-500 text-uppercase text-color-vp">HOÀN THÀNH 6/10</h6>
            </div>
            <div>
              <div className="table-responsive">
                <table className="table table-striped table-content" id={this.props.id}  width="100%" >
                  <thead>
                    <tr>
                        <th className="table-header" scope="col">STT</th>
                        <th className="table-header" scope="col">KHÓA HỌC</th>
                        <th className="table-header center-text" scope="col">TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                      {courseListElement}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    );
  
  }
}
export default CourseListTable;