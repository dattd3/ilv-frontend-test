import React from 'react'
// import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class LeaveOfAbsenceComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
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
      <div className="leave-of-absence">
          <div className="box shadow">
            <div className="row summary">
                <div className="col">
                    <div className="item">
                        <div className="title">Ngày phép tồn</div>
                        <div className="result text-danger">1</div>
                    </div>
                </div>
                <div className="col">
                    <div className="item">
                        <div className="title">Ngày phép năm</div>
                        <div className="result text-danger">2</div>
                    </div>
                </div>
                <div className="col">
                    <div className="item">
                        <div className="title">Ngày phép tạm ứng</div>
                        <div className="result text-danger">4</div>
                    </div>
                </div>
                <div className="col">
                    <div className="item">
                        <div className="title">Giờ bù tồn</div>
                        <div className="result text-danger">3</div>
                    </div>
                </div>
                <div className="col">
                    <div className="item">
                        <div className="title">Giờ nghỉ bù</div>
                        <div className="result text-danger">2</div>
                    </div>
                </div>
            </div>

            <hr/>

            <div className="form">
                <div className="row">
                    <div className="col-4">
                        <p className="title">Ngày/giờ bắt đầu</p>
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
                                    className="form-control input"/>
                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <p className="title">Ngày/giờ kết thúc</p>
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
                                    className="form-control input"/>
                                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt"></i></span>
                            </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <p className="title">Tổng thời gian nghỉ</p>
                        <div>
                            <Select name="timeTotal" placeholder="Lựa chọn tổng thời gian nghỉ" key="timeTotal" options={options}/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-4">
                        <p className="title">Loại nghỉ</p>
                        <div>
                            <Select name="timeTotal" placeholder="Lựa chọn loại nghỉ" key="timeTotal" options={options}/>
                        </div>
                    </div>

                    <div className="col-8">
                        <p className="title">Lý do đăng ký nghỉ phép</p>
                        <div>
                            <input type="text" className="form-control" placeholder="Nhập lý do đăng ký nghỉ phép"/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-4">
                        <p className="title">Người phê duyệt</p>
                        <div>
                            <Select name="timeTotal" placeholder="Lựa chọn người phê duyệt" key="timeTotal" options={options}/>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          <ButtonComponent/>
      </div>
      )
    }
  }
export default LeaveOfAbsenceComponent