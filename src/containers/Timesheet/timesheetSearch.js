import React from "react";

class TimesheetSearch extends React.Component {
    render() {
      return <>
      <h5 className="searchTitle">LỰA CHỌN HIỂN THỊ NGÀY CÔNG</h5>
      <div className="timesheet-box">
        <div className="row">
          <div className="col">
            <div className="title">Từ ngày</div>
            <div className="content">
              <input type="date" name="startDate" max="3000-12-31" min="1000-01-01" className="form-control form-control-lg"/>
            </div>
          </div>
          <div className="col">
            <div className="title">Đến ngày</div>
            <div className="content">
            <input type="date" name="endDate" max="3000-12-31" min="1000-01-01" className="form-control form-control-lg input-lg"/>
            </div>
          </div>
          <div className="col">
          <div className="title">&nbsp;</div>
            <div className="content">
            <button type="button" className="btn btn-lg btn-warning btnSearch">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </div>
      </>
    }
  }
export default TimesheetSearch;