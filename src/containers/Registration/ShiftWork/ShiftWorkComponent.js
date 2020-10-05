import React from 'react'
// import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class ShiftWorkComponent extends React.Component {
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
      <div className="shift-work">
        <div className="box shadow">
          <div className="row">
            <div className="col-6">
              <p className="title">Ngày thay đổi phân ca</p>
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
                    placeholderText="Lựa chọn"
                    // locale="vi"
                    showTimeSelect
                    className="form-control input" />
                  <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                </label>
              </div>
            </div>

            <div className="col-6">
              <p className="title">Loại phân ca</p>
              <div>
                <Select name="timeTotal" placeholder="Lựa chọn" key="timeTotal" options={options} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <div className="box-time">
                <p className="text-center">Giờ kế hoạch</p>
                <div className="row">
                  <div className="col-6">
                    Bắt đầu: <b>09:00:00</b>
                  </div>
                  <div className="col-6 text-right">
                    Kết thúc: <b>09:00:00</b>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="col-6">
              <div className="box-time">
                <p className="text-center">Giờ phân ca thay đổi</p>
                <div className="row">
                  <div className="col-6">
                    <div className="row">
                        <div className="col-4">Bắt đầu:</div>
                        <div className="col-8">
                          <input type="text" class="form-control" value="09:00:00"/>
                        </div>
                      </div>
                  </div>
                  <div className="col-6">
                    <div className="row">
                      <div className="col-4">Kết thúc:</div>
                      <div className="col-8">
                        <input type="text" class="form-control" value="18:00:00"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <p className="title">Lý do thay đổi phân ca</p>
              <div>
                <textarea class="form-control" placeholder="Nhập lý do" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="row ml-1">
          <button class="btn btn-outline-primary shadow"><i className="fa fa-plus-circle"></i> Thêm ngày thay đổi phân ca</button>
        </div>

        <ApproverComponent/>
        <ButtonComponent/>
      </div>
    )
  }
}
export default ShiftWorkComponent