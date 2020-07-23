import React from 'react'
import DatePicker, {registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class LeaveTimeSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      startDate: moment().startOf('month').toDate(),
      endDate: new Date()
    }

    this.setStartDate = this.setStartDate.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.search = this.search.bind(this)
  }

  setStartDate (startDate) {
    this.setState({
      startDate: startDate,
      endDate: startDate > this.state.endDate ? startDate : this.state.endDate
    })
  }

  setEndDate (endDate) {
    this.setState({
      endDate: endDate
    })
  }

  search() {
    this.props.clickSearch(this.state.startDate, this.state.endDate)
  }

  render() {
    console.log(this.props)
    return <>
    <h5 className="searchTitle">KIỂM TRA SỐ NGÀY PHÉP / SỐ NGÀY NGHỈ BÙ / ĐÃ SỬ DỤNG</h5>
    <div className="search-box shadow">
      <div className="row">
        <div className="col">
          <div className="title">Từ kỳ lương</div>
          <div className="content input-container">
            <label>
              <DatePicker 
                name="startDate" 
                selectsStart 
                selected={this.state.startDate}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.setStartDate}
                dateFormat="dd/MM/yyyy"
                locale="vi"
                className="form-control form-control-lg input"/>
                <span class="input-group-addon input-img"><i class="fas fa-calendar-alt"></i></span>
              </label> 
          </div>
        </div>
        <div className="col">
          <div className="title">Đến kỳ lương</div>
          <div className="content input-container">
          <label>
            <DatePicker 
              name="endDate" 
              selectsEnd 
              selected={this.state.endDate} 
              minDate={this.state.startDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.setEndDate}
              dateFormat="dd/MM/yyyy"
              locale="vi"
              className="form-control form-control-lg input"/>
            <span class="input-group-addon input-img"><i class="fas fa-calendar-alt"></i></span>
            </label>
          </div>
        </div>
        <div className="col">
        <div className="title">&nbsp;</div>
          <div className="content">
          <button type="button" className="btn btn-lg btn-warning btnSearch" onClick={this.search}>Tìm kiếm</button>
          </div>
        </div>
      </div>
      <div className="note">
        <i>* Chỉ được chọn trong 1 năm, không được chọn giữa 2 năm</i>
      </div>
      {this.props.errorMessage ? <div className="note text-danger">
        <b>{this.props.errorMessage}</b>
      </div> : null}
    </div>
    </>
  }
}
export default LeaveTimeSearch