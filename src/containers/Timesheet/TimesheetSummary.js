import React from "react"

class TimesheetSummary extends React.Component {
    render() {
      return <div className="summary">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">TỔNG HỢP NGÀY CÔNG</div>
          <div className="card-body">
          <div class="row">
            <div class="col">
              <div className="title text-center">Công chuẩn</div>
            </div>
            <div class="col">
              <div className="title text-center">Công thực tế</div>
            </div>
            <div class="col">
              <div className="title text-center">Nghỉ có hưởng lương</div>
            </div>
            <div class="col">
              <div className="title text-center text-sm">Đào tạo/Công tác</div>
            </div>
            <div class="col">
              <div className="title text-center">Công nghỉ ngừng việc</div>
            </div>
            <div class="col">
              <div className="title text-center">Công không hưởng lương</div>
            </div>
            <div class="col">
              <div className="title text-center">Tổng OT sau quy đổi</div>
            </div>
            <div class="col">
              <div className="title text-center">Tổng công hưởng lương</div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div className="content text-center text-danger">24</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">24</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
            <div class="col">
              <div className="content text-center text-danger">22</div>
            </div>
          </div>
          </div>
        </div>
      </div>
    }
  }
export default TimesheetSummary