import React from 'react'
// import axios from 'axios'
import Select from 'react-select'
import ButtonComponent from '../ButtonComponent'
import ApproverComponent from '../ApproverComponent'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import _ from 'lodash'
registerLocale("vi", vi)

class SubstitutionComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      substitutions: [
        {
          startDate: null,
          startTime: null,
          endTime: null,
          endDate: null,
          substitutionType: null,
          note: null,
          errors: {}
        }
      ],
      approver: null,
      files: [],
      errors: {}
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

  setDate(index, startDate) {
    this.state.substitutions[index].startDate = startDate
    this.setState({
      substitutions: [ ...this.state.substitutions ]
    })
  }

  setStartTime(index, startTime) {
    this.state.substitutions[index].startTime = startTime
    this.setState({
      substitutions: [ ...this.state.substitutions ]
    })
  }

  setEndTime(index, endTime) {
    this.state.substitutions[index].endTime = endTime
    this.setState({
      substitutions: [ ...this.state.substitutions ]
    })
  }

  updateFiles(files) {
    this.setState({ files: files })
  }

  updateApprover(approver) {
    this.setState({ approver: approver })
  }

  handleInputChange(index, event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.state.substitutions[index][name] = value
    this.setState({
      substitutions: [ ...this.state.substitutions ]
    })
  }

  handleSelectChange(index, name, value) {
    this.state.substitutions[index][name] = value
    this.setState({
      substitutions: [ ...this.state.substitutions ]
    })
  }

  addSubstitution() {
    this.setState({substitutions: [...this.state.substitutions, {
      startDate: null,
      startTime: null,
      endTime: null,
      endDate: null,
      substitutionType: null,
      note: null,
      errors: {}
    } ] })
  }

  removeSubstitution(index) {
      this.setState({ substitutions: [...this.state.substitutions.slice(0, index), ...this.state.substitutions.slice(index + 1) ] })
  }

  verifyInput() {
    let errors = {}
    const RequiredFields = ['note', 'startDate', 'startTime', 'endTime', 'substitutionType']
    this.state.substitutions.forEach((substitution, index) => {
      RequiredFields.forEach(name => {
        if (_.isNull(substitution[name])) {
          errors[name + index] = '(Bắt buộc)'
        }
      })
    })
    
    if (_.isNull(this.state.approver)) {
      errors['approver'] = '(Bắt buộc)'
    }

    this.setState({ errors: errors })
    return errors
  }

  submit() {
    const errors = this.verifyInput()
    if (errors) {
      return
    }
  }

  error(index, name) {
    return this.state.errors[name + index] ? <div className="text-danger">{this.state.errors[name + index]}</div> : null
  }

  render() {
    const substitutionTypes = [
      { value: '01', label: 'Phân ca làm việc' },
      { value: '02', label: 'Phân ca gãy' },
      { value: '03', label: 'Phân ca bờ đảo full ngày' }
    ]
    return (
      <div className="shift-work">
        {this.state.substitutions.map((substitution, index) => {
          return <div className="box shadow">
            {this.state.substitutions.length > 1 ? <div className="clearfix">
              <button type="button" className="close text-danger" data-dismiss="alert" aria-label="Close" onClick={this.removeSubstitution.bind(this, index)}>
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </div> : null }
            <div className="row">
              <div className="col-6">
                <p className="title">Ngày thay đổi phân ca</p>
                <div className="content input-container">
                  <label>
                    <DatePicker
                      name="startDate"
                      selected={substitution.startDate}
                      startDate={substitution.startDate}
                      onChange={this.setDate.bind(this, index)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Lựa chọn"
                      locale="vi"
                      className="form-control input" />
                    <span className="input-group-addon input-img"><i className="fas fa-calendar-alt text-info"></i></span>
                  </label>
                </div>
                {this.error(index, 'startDate')}
              </div>

              <div className="col-6">
                <p className="title">Loại phân ca</p>
                <div>
                  <Select name="substitutionType" value={substitution.substitutionType} onChange={substitutionType => this.handleSelectChange(index, 'substitutionType', substitutionType)} placeholder="Lựa chọn" key="timeTotal" options={substitutionTypes} />
                </div>
                {this.error(index, 'substitutionType')}
              </div>
            </div>

            {substitution.startDate ? <div className="row">
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
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={substitution.startTime}
                                onChange={this.setStartTime.bind(this, index)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input"
                              />
                              <span className="input-group-addon input-clock text-warning"><i className="fa fa-clock-o"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'startTime')}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4">Kết thúc:</div>
                        <div className="col-8">
                          <div className="content input-container">
                            <label>
                              <DatePicker
                                selected={substitution.endTime}
                                onChange={this.setEndTime.bind(this, index)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Giờ"
                                dateFormat="h:mm aa"
                                placeholderText="Lựa chọn"
                                className="form-control input"
                              />
                              <span className="input-group-addon input-clock"><i className="fa fa-clock-o text-warning"></i></span>
                            </label>
                          </div>
                          {this.error(index, 'endTime')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> : null }

            {substitution.startDate ? <div className="row">
              <div className="col-12">
                <p className="title">Lý do thay đổi phân ca</p>
                <div>
                  <textarea class="form-control" value={substitution.note} name="note" placeholder="Nhập lý do" rows="3" onChange={this.handleInputChange.bind(this, index)}></textarea>
                </div>
                {this.error(index, 'note')}
              </div>
            </div> : null }
          </div> 
        })}

        <button className="btn btn-info shadow" onClick={this.addSubstitution.bind(this)}><i className="fa fa-plus-circle"></i> Thêm</button>

        <ApproverComponent errors={this.state.errors}  updateApprover={this.updateApprover.bind(this)} />
        <ButtonComponent updateFiles={this.updateFiles.bind(this)} submit={this.submit.bind(this)} />
      </div >
    )
  }
}
export default SubstitutionComponent