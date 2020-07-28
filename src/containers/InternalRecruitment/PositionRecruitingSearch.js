import React from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import { useTranslation } from "react-i18next";
import Select from 'react-select';

registerLocale("vi", vi)

class PositionRecruitingSearch extends React.Component {
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
    const options = [
      { value: '0', label: 'Project Manager' },
      { value: '1', label: 'Nhân viên Kỹ thuật Vận hành' },
      { value: '2', label: 'Chuyên viên Tuyển dụng' },
    ];

    const address = [
      { value: '0', label: 'Hà Nội' },
      { value: '1', label: 'Hải Phòng' },
    ];

    const customStyles = {
      control: base => ({
        ...base,
        height: 48,
        minHeight: 48
      })
    };

    return <>
    <h5 className="searchTitle">tìm kiếm</h5>
    <div className="recruiting-search-box shadow">
      <div className="row">
        <div className="col">
          <div className="title">Vị trí</div>
          <div className="content input-container">
            <Select placeholder="Tất cả" options={options} styles={customStyles} />
          </div>
        </div>
        <div className="col">
          <div className="title">Địa điểm</div>
          <div className="content input-container">
            <Select placeholder="Tất cả" options={address} styles={customStyles} />
          </div>
        </div>
        <div className="col block-button">
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
export default PositionRecruitingSearch;
