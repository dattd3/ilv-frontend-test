import React from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class TimesheetSearch extends React.Component {
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
    return <>
    <h5 className="searchTitle">LỰA CHỌN HIỂN THỊ NGÀY CÔNG</h5>
    <div className="timesheet-box shadow">
      <div className="row">
        <div className="col">
          <div className="title">Từ ngày</div>
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
                <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
            </label>
          </div>
        </div>
        <div className="col">
          <div className="title">Đến ngày</div>
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
              <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
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
    </div>
    </>
  }
}
export default TimesheetSearch;