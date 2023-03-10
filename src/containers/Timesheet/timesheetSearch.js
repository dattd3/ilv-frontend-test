import React from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import { withTranslation } from "react-i18next"
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class TimesheetSearch extends React.Component {
  constructor(props) {
    super(props);
    //chọn chính xác ngày được phân ca khi mở từ thông báo
    const startDate = props?.queryParams?.has('start') && moment(props.queryParams.get('start'), 'DD/MM/YYYYY').isValid() ? moment(props.queryParams.get('start'), 'DD/MM/YYYYY').toDate() : null;
    const endDate = startDate && props.queryParams.has('end') && moment(props.queryParams.get('end'), 'DD/MM/YYYYY').isValid() ? moment(props.queryParams.get('end'), 'DD/MM/YYYY').toDate() : startDate
    this.state = {
      startDate: startDate || moment(this.getClosingSalaryDatePreMonth(), "DD/MM/YYYY").toDate(),
      endDate: startDate ? endDate : new Date()
    }

    this.setStartDate = this.setStartDate.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    if(this.props?.queryParams?.has('start')) {
      this.props.clickSearch(this.state.startDate, this.state.endDate)
    }
  }

  getClosingSalaryDatePreMonth = () => {
    const now = moment()
    let preMonth = now.month()
    const currentYear = preMonth === 0 ? now.year() - 1 : now.year()
    preMonth = preMonth === 0 ? 12 : preMonth
    return `26/${preMonth}/${currentYear}`
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
    const { t } = this.props;
    return <>
    <h5 className="content-page-header">{t("SelectTimesheetPeriod")}</h5>
    <div className="timesheet-box shadow">
      <div className="row">
        <div className="col">
          <div className="title">{t("From")}</div>
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
          <div className="title">{t("To")}</div>
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
          <button type="button" className="btn btn-lg btn-warning btn-search" onClick={this.search}>{t("Search")}</button>
          </div>
        </div>
      </div>
    </div>
    </>
  }
}
export default withTranslation()(TimesheetSearch);