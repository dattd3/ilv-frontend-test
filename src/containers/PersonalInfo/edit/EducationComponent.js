import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class EducationComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            userEducation: [],
            newUserEducation: [],
            schools: []
        }
    }

    componentDidMount() {
        let config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
            'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
          }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userEducation = res.data.data;
              this.props.setState({ userEducation: userEducation })
              this.setState({ userEducation: userEducation });
            }
          }).catch(error => {
          })

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/schools`, config)
        .then(res => {
          if (res && res.data && res.data.data) {
            let schools = res.data.data;
            this.setState({ schools: schools });
          }
        }).catch(error => {
        })
    }

    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
          return true;
        }
        return false;
    }

    educationLevelChange (index, level) {
      let newUserEducation = [...this.state.newUserEducation]
      newUserEducation[index].schools = this.state.schools.filter(s => s.education_level_id == level.value)
      newUserEducation[index].education_level_id = level.value
      newUserEducation[index].major_id = ''
      newUserEducation[index].education_id = ''
      this.setState({ newUserEducation: [...newUserEducation] })
    }

    schoolChange (index, education) {
      let newUserEducation = [...this.state.newUserEducation]
      newUserEducation[index].education_id = education.value
      this.setState({ newUserEducation: [...newUserEducation] })
    }

    majorChange (index, major) {
      let newUserEducation = [...this.state.newUserEducation]
      newUserEducation[index].major_id = major.value
      this.setState({ newUserEducation: [...newUserEducation] })
    }

    handleDatePickerInputChange(index, dateInput, name) {
      const date = moment(dateInput).format('DD-MM-YYYY')
      let newUserEducation = [...this.state.newUserEducation]
      newUserEducation[index][name] = date
      this.setState({ newUserEducation: [...newUserEducation] })
    }

    itemHeader() {
        return <Row className="info-label">
        <Col xs={12} md={6} lg={3}>
          Loại bằng cấp
        </Col>
        <Col xs={12} md={6} lg={3}>
         Trường
        </Col>
        <Col xs={12} md={6} lg={3}>
          Chuyên môn
        </Col>
        <Col xs={12} md={6} lg={3}>
          Thời gian theo học
        </Col>
      </Row>
    }

    educationInput(item, index) {
        const educationLevels = this.props.educationLevels.map(educationLevel =>  { return { value: educationLevel.ID, label: educationLevel.TEXT } } )
        const majors = this.props.majors.map(major =>  { return { value: major.ID, label: major.TEXT } } )
        const schools = item.schools.map(school =>  { return { value: school.ID, label: school.TEXT } } )

        return <Row className="info-value">
            <Col xs={12} md={6} lg={3}>
                <div>
                  <Select placeholder="Lựa chọn bằng cấp" name="academic_level" value={educationLevels.filter(e => e.value == item.education_level_id)} options={educationLevels} onChange={this.educationLevelChange.bind(this, index)}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <div>
                  <Select placeholder="Lựa chọn trường" name="university_name" value={schools.filter(s => s.value == item.education_id)} options={schools} onChange={this.schoolChange.bind(this, index)}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <div>
                  <Select placeholder="Lựa chọn chuyên môn" name="major" value={majors.filter(m => m.value == item.major_id)} options={majors} onChange={this.majorChange.bind(this, index)}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <p className="input-container">
                <label>
                      <DatePicker 
                          name="from_time" 
                          key="from_time"
                          selected={item.from_time ? moment(item.from_time, 'DD-MM-YYYY').toDate() : null}
                          onChange={fromTime => this.handleDatePickerInputChange(index, fromTime, "from_time")}
                          dateFormat="dd-MM-yyyy"
                          locale="vi"
                          className="form-control date"/>&nbsp;-&nbsp;
                          <DatePicker 
                          name="to_time" 
                          key="to_time"
                          selected={item.to_time ? moment(item.to_time, 'DD-MM-YYYY').toDate() : null}
                          onChange={toTime => this.handleDatePickerInputChange(index, toTime, "to_time")}
                          dateFormat="dd-MM-yyyy"
                          locale="vi"
                          className="form-control date"/>
                  </label>
                </p>
            </Col>
        </Row>
    }

    educationItem(item) {
        return <Row className="info-value">
           <Col xs={12} md={6} lg={3}>
            <div className="detail">{item.academic_level}</div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <div className="detail">
                {this.isNotNull(item.university_name) ? item.university_name : item.other_uni_name}
            </div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <div className="detail">{item.major}</div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <div className="detail">{item.from_time} - {item.to_time}</div>
          </Col>
        </Row>
    }

    addEducation() {
        this.setState({newUserEducation: [...this.state.newUserEducation, { university_name: '', education_id: '' , academic_level: '', academic_level_id: '', major: '', major_id: '', from_time:'', to_time: '', schools: [] } ] })
    }

    removeEducation(index) {
        this.setState({ newUserEducation: [...this.state.newUserEducation.slice(0, index), ...this.state.newUserEducation.slice(index + 1) ] })
    }

    render() {
        const userEducation = this.props.userEducation
        return (
            <div className="education">
                <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>
                <div className="box shadow">
                    <span className="mr-5"><i className="note note-old"></i> Thông tin cũ </span>
                    <span><i className="note note-new"></i> Nhập thông tin điều chỉnh</span>
                    <hr/>

                    {this.state.userEducation.map((item, i) => {
                      return <div className="item" key={i}>
                        {this.itemHeader()}
                        {userEducation[i] ? this.educationItem(userEducation[i]) : null}
                        {this.educationInput(item, i)}
                      </div>
                    })}

                    <button type="button" className="btn btn-primary add" onClick={this.addEducation.bind(this)}><i className="fas fa-plus"></i> Thêm mới</button>

                    {this.state.newUserEducation.map((item, i) => {
                      return <div className="clearfix new-item">
                            <div className="float-left input-table">
                                <div key={i}>
                                    {this.itemHeader()}
                                    {this.educationInput(item, i)}
                                </div>
                            </div>
                            <div className="float-left remove">
                                <button type="button" onClick={this.removeEducation.bind(this, i)} className="close" data-dismiss="alert" aria-label="Close">
                                    <span className="text-danger" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                      </div>
                    })}
                </div>
            </div>
        )
    }
}

export default EducationComponent
