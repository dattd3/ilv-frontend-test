import React from 'react'
// import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class BusinessTripComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      tasks: []
    }
  }

  componentDidMount() {
    //   const config = {
    //     headers: {
    //       'Authorization': `${localStorage.getItem('accessToken')}`
    //     }
    //   }
    //   axios.get(`${process.env.REACT_APP_REQUEST_URL}user-profile-histories/approval`, config)
    //   .then(res => {
    //     if (res && res.data && res.data.data && res.data.result) {
    //       const result = res.data.result;
    //       if (result.code != Constants.API_ERROR_CODE) {
    //         this.setState({tasks : res.data.data.listUserProfileHistories});
    //       }
    //     }
    //   }).catch(error => {
    //     this.props.sendData(null);
    //     this.setState({tasks : []});
    //   });
  }

  render() {
    const options = [
      { value: '1', label: '01 ngày' },
      { value: '2', label: '02 ngày' },
      { value: '3', label: '03 ngày' }
    ]
    return (
      <div className="business-trip">
        <div className="box shadow">
          <div className="form">
            <div className="row">
              <div className="col-4">
                <p className="title">Từ ngày/giờ</p>
                <div className="content input-container">
                  <label>
                    <DatePicker
                      name="startDate"
                      selectsStart
                      // selected={this.state.startDate}
                      // startDate={this.state.startDate}
                      // endDate={this.state.endDate}
                      // onChange={this.setStartDate}
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Lựa chọn ngày/giờ bắt đầu"
                      // locale="vi"
                      showTimeSelect
                      className="form-control input" />
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                  </label>
                </div>
              </div>

              <div className="col-4">
                <p className="title">Đến ngày/giờ</p>
                <div className="content input-container">
                  <label>
                    <DatePicker
                      name="startDate"
                      selectsStart
                      // selected={this.state.startDate}
                      // startDate={this.state.startDate}
                      // endDate={this.state.endDate}
                      // onChange={this.setStartDate}
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Lựa chọn ngày/giờ kết thúc"
                      // locale="vi"
                      showTimeSelect
                      className="form-control input" />
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                  </label>
                </div>
              </div>

              <div className="col-4">
                <p className="title">Tổng thời gian Công tác/Đào tạo</p>
                <div>
                  <Select name="timeTotal" placeholder="Lựa chọn tổng thời gian nghỉ" key="timeTotal" options={options} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <p className="title">Loại chuyến Công tác/Đào tạo</p>
                <div>
                  <Select name="timeTotal" placeholder="Lựa chọn loại chuyến Công tác/Đào tạo" key="timeTotal" options={options} />
                </div>
              </div>

              <div className="col-4">
                <p className="title">Địa điểm</p>
                <div>
                  <Select name="timeTotal" placeholder="Lựa chọn loại nghỉ" key="timeTotal" options={options} />
                </div>
              </div>

              <div className="col-4">
                <p className="title">Phương tiện</p>
                <div>
                  <Select name="timeTotal" placeholder="Lựa chọn" key="timeTotal" options={options} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="title">Lý do đăng ký Công tác/Đào tạo</p>
                <div>
                  <textarea class="form-control" placeholder="Nhập lý do" rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ApproverComponent/>
        <ButtonComponent />
      </div>
    )
  }
}
export default BusinessTripComponent