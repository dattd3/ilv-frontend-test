import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import { connect } from 'react-redux'
import * as actions from '../../../actions'

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

    // axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
    //   .then(res => {
    //     if (res && res.data && res.data.data) {
    //       let userEducation = [
    //         {
    //           "other_uni_name": "ĐH Bách Khoa Hà Nội",
    //           "school_id": 0,
    //           "major": "Khác",
    //           "academic_level": "Đại học",
    //           "university_name": null,
    //           "education_level_id": "VF",
    //           "to_time": "31-12-2009",
    //           "from_time": "01-01-2004",
    //           "major_id": 0
    //         }
    //       ]
    //       this.props.dispatch(actions.updateEducationAction({ education: userEducation }));
    //       //this.setState({ userEducation: userEducation });
    //     }
    //   }).catch(error => {
    //   });

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/schools`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let schools = res.data.data;
          this.props.dispatch(actions.updateSchoolDataAction({ schools: schools }));
        }
      }).catch(error => {
      });
  }

  isNotNull(input) {
    return input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== ''
  }

  educationLevelChange(index, name, level) {
    let newUserEducation = [...this.props[name]];
    newUserEducation[index].education_level_id = level.value;
    newUserEducation[index].major_id = '';
    newUserEducation[index].school_id = '';
    this.updateParrent(name, [...newUserEducation], index);
    this.props.dispatch(actions.updateNewEducationAction({ [name]: [...newUserEducation] }));
  }

  schoolChange(index, name, education) {
    let newUserEducation = [...this.props[name]]
    newUserEducation[index].school_id = education.value
    this.props.dispatch(actions.updateNewEducationAction({ [name]: [...newUserEducation] }));
    this.updateParrent(name, newUserEducation, index)
  }

  majorChange(index, name, major) {
    let newUserEducation = [...this.props[name]]
    newUserEducation[index].major_id = major.value
    this.props.dispatch(actions.updateNewEducationAction({ [name]: [...newUserEducation] }));
    this.updateParrent(name, newUserEducation, index)
  }

  handleDatePickerInputChange(index, dateInput, field, name) {
    const date = moment(dateInput).format('DD-MM-YYYY')
    let newUserEducation = [...this.props[name]]
    newUserEducation[index][field] = date
    this.props.dispatch(actions.updateNewEducationAction({ [name]: [...newUserEducation] }));
    this.updateParrent(name, newUserEducation, index)
  }

  otherUniInputChange(index, name, e) {
    let newUserEducation = [...this.props[name]]
    newUserEducation[index].other_uni_name = e.target.value
    this.props.dispatch(actions.updateNewEducationAction({ [name]: [...newUserEducation] }));
    this.updateParrent(name, newUserEducation, index)
  }

  updateParrent(name, newUserEducation, index) {
    if (name == 'education') {
      this.props.updateEducation(newUserEducation)
    } else {
      this.props.updateNewEducation(newUserEducation, index)
    }
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

  educationInput(item, index, name) {
    const educationLevels = this.props.educationLevels.map(educationLevel => { return { value: educationLevel.ID, label: educationLevel.TEXT } })
    const majors = this.props.majors.map(major => { return { value: major.ID, label: major.TEXT } })
    const schools = this.props.schools.filter(s => s.education_level_id == item.education_level_id).map(school => { return { value: school.ID, label: school.TEXT } })

    return <Row className="info-value">
            <Col xs={12} md={6} lg={3}>
                <div>
                  <Select placeholder="Lựa chọn bằng cấp" name="academic_level" value={educationLevels.filter(e => e.value == item.education_level_id)} options={educationLevels} onChange={this.educationLevelChange.bind(this, index, name)}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <div className="mb-3">
                  <Select placeholder="Lựa chọn trường" name="university_name" value={schools.filter(s => s.value == item.school_id)} options={schools} onChange={this.schoolChange.bind(this, index, name)}/>
                </div>
                <div className="form-inline float-right">
                  <label className="mr-3">Khác: </label>
                  <input className="form-control w-75 float-right" onChange={this.otherUniInputChange.bind(this, index, name)} name="other_uni_name" type="text" value={item.other_uni_name || ''}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <div>
                  <Select placeholder="Lựa chọn chuyên môn" name="major" value={majors.filter(m => m.value == item.major_id)} options={majors} onChange={this.majorChange.bind(this, index, name)}/>
                </div>
            </Col>
            <Col xs={12} md={6} lg={3}>
                <div className="input-container">
                  <label>
                      <DatePicker 
                          name="from_time" 
                          key="from_time"
                          selected={item.from_time ? moment(item.from_time, 'DD-MM-YYYY').toDate() : null}
                          onChange={fromTime => this.handleDatePickerInputChange(index, fromTime, "from_time", name)}
                          dateFormat="dd-MM-yyyy"
                          locale="vi"
                          className="form-control date"/>&nbsp;-&nbsp;
                          <DatePicker 
                          name="to_time" 
                          key="to_time"
                          selected={item.to_time ? moment(item.to_time, 'DD-MM-YYYY').toDate() : null}
                          onChange={toTime => this.handleDatePickerInputChange(index, toTime, "to_time", name)}
                          dateFormat="dd-MM-yyyy"
                          locale="vi"
                          className="form-control date"/>
                  </label>
                </div>
            </Col>
        </Row>
  }

  educationItem(item) {
    return <Row className="info-value old">
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
    this.props.dispatch(actions.updateNewEducationAction({ newEducation: [...this.props.newEducation, { university_name: '', other_uni_name: '', education_id: '', academic_level: '', academic_level_id: '', major: '', major_id: '', from_time: '', to_time: '' }] }));
  }

  removeEducation(index) {
    this.props.dispatch(actions.updateNewEducationAction({ newEducation: [...this.props.newEducation.slice(0, index), ...this.props.newEducation.slice(index + 1)] }));
  }

  render() {
    const userEducation = this.props.userEducation
    return (
      <div className="education">
        <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>
        <div className="box shadow">
            <span className="mr-5"><i className="note note-old"></i> Thông tin cũ</span>
            <span><i className="note note-new"></i> Nhập thông tin điều chỉnh</span>
            <hr/>

          {this.props.education.map((item, i) => {
            return <div className="item" key={i}>
              {this.itemHeader()}
              {userEducation[i] ? this.educationItem(userEducation[i]) : null}
              {this.educationInput(item, i, 'education')}
            </div>
          })}

          <button type="button" className="btn btn-primary add" onClick={this.addEducation.bind(this)}><i className="fas fa-plus"></i> Thêm mới</button>

          {this.props.newEducation.map((item, i) => {
            return <div className="clearfix new-item" key={i}>
              <div className="float-left input-table">
                <div key={i}>
                    {this.itemHeader()}
                  {this.educationInput(item, i, 'newEducation')}
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
const mapStateToProps = (state, ownProps) => {
  return {
    ...state.requestDetail,
    userEducation: state.requestDetail.education,
    //schools: state.requestDetail.schools
  };
}

export default connect(mapStateToProps)(EducationComponent);
