import React from "react";
import './DefaultPaginationTable.css';
import CourseStatus from "./CourseStatus";


class DefaultPaginationTable extends React.Component {

 
  componentWillMount () {
      const script = document.createElement("script");
      const str = "$(document).ready(function() {$('#"+this.props.id+"').DataTable({'pageLength': 5, 'lengthChange': false,'info': false, 'searching': false,'ordering': false});});"
      const scriptText = document.createTextNode(str);

      script.appendChild(scriptText);
      document.head.appendChild(script);
  }

  render() {
    return (
      <div>
        <div className="white-body">
            <div className="row table-title">
                <h6 className="col-sm-8 col-md-8 col-lg-10 m-0 font-weight-500 text-uppercase text-color-vp">{this.props.tableName}</h6>
                <h6 className="col-sm-4 col-md-4 col-lg-2 m-0 font-weight-500 text-uppercase text-color-vp">HOÀN THÀNH 6/10</h6>
            </div>
            <div>
              <div className="table-responsive">
                <table className="table table-striped table-content" id={this.props.id}  width="100%" >
                  <thead>
                    <tr>
                        <th className="table-header" scope="col">STT</th>
                        <th className="table-header" scope="col">KHÓA HỌC</th>
                        <th className="table-header center-text" scope="col">HẠN HOÀN THÀNH</th>
                        <th className="table-header center-text" scope="col">TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>1</td>
                        <td className="wrap-text">Xử lý hành lý check-in cho khách đoàn, khách lẻ</td>
                        <td className="center-text">27/09/2019</td>
                        <td className="center-text"><CourseStatus isDone = {true} /></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td className="wrap-text">Quản lý hành lý lưu kho, hư hỏng, giao nhận bưu phẩm, phân loại báo, tạp chí
                        và hỗ trợ hành khách chuyển phòng.</td>
                        <td className="center-text">30/09/2019</td>
                        <td className="center-text"><CourseStatus isDone = {false}/></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td className="wrap-text">Nghiệp vụ sale. Makerting</td>
                        <td className="center-text">10/10/2019</td>
                        <td className="center-text"><CourseStatus isDone = {true}/></td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td className="wrap-text">Nghiệp vụ sale. Makerting</td>
                        <td className="center-text">10/10/2019</td>
                        <td className="center-text"><CourseStatus isDone = {true}/></td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td className="wrap-text">Nghiệp vụ sale. Makerting</td>
                        <td className="center-text">10/10/2019</td>
                        <td className="center-text"><CourseStatus isDone = {false}/></td>
                      </tr>
                      <tr>
                        <td>6</td>
                        <td className="wrap-text">Nghiệp vụ sale. Makerting</td>
                        <td className="center-text">10/10/2019</td>
                        <td className="center-text"><span className="course-status-ok">Đã hoàn thành</span></td>
                      </tr>
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    );
  
  }
}
export default DefaultPaginationTable;