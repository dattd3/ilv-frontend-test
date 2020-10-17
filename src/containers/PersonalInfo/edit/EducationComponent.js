import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

class EducationComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      userEducation: [],
      newUserEducation: [],
      schools: [],
      requestedUserProfileToContinue: props.requestedUserProfile
    }
  }

  componentDidMount() {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
        'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
      }
    }

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm_itgr/v1/masterdata/schools`, config)
      .then(res => {
        if (res && res.data && res.data.data) {
          let schools = res.data.data;
          this.setState({ schools: schools });
        }
      }).catch(error => {

      })

    setTimeout(() => {
      if (this.props.isEdit && this.props.requestedUserProfile) {
        this.updateEducation(this.props.requestedUserProfile.userProfileInfo.update ? this.props.requestedUserProfile.userProfileInfo.update.userProfileHistoryEducation : [])
        this.binddingNewEducationEdited(this.props.requestedUserProfile)
      } else {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/education`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              if (!this.props.isEdit) {
                const userEducation = res.data.data.map(d => { return {} })
                this.setState({ userEducation: userEducation })
              }
            }
          }).catch(error => {
          })
      }
    }, 0)
  }

  updateEducation(userProfileHistoryEducation) {
    const userEducation = userProfileHistoryEducation.map(d => {
      return {
        school_id: d.NewEducation.SchoolCode,
        university_name: d.NewEducation.SchoolName,
        education_level_id: d.NewEducation.DegreeType,
        academic_level: d.NewEducation.DegreeTypeText,
        major_id: d.NewEducation.MajorCode,
        major: d.NewEducation.MajorCodeText,
        other_uni_name: d.NewEducation.OtherSchool,
        other_major: d.NewEducation.OtherMajor,
        from_time: d.NewEducation.FromTime,
        to_time: d.NewEducation.ToTime,
      }
    })

    this.setState({ userEducation: userEducation })
  }

  binddingNewEducationEdited = (requestedUserProfile) => {
    debugger
    if (requestedUserProfile && requestedUserProfile.userProfileInfo && requestedUserProfile.userProfileInfo.create && requestedUserProfile.userProfileInfo.create.educations) {
      const createEducations = requestedUserProfile.userProfileInfo.create.educations;
      let newEducation = []
      const mappingEducationFields = {
        SchoolCode: "school_id",
        SchoolName: "university_name",
        DegreeType: "education_level_id",
        DegreeTypeText: "academic_level",
        MajorCode: "major_id",
        MajorCodeText: "major",
        OtherSchool: "other_uni_name",
        OtherMajor: "other_major",
        FromTime: "from_time",
        ToTime: "to_time"
      }
      createEducations.forEach(item => {
        let educations = {}
        Object.keys(item).forEach(key => {
          if (item[key]) {
            educations[mappingEducationFields[key]] = item[key]
          }
        });
        newEducation = newEducation.concat(educations);
      })
      this.setState({ newUserEducation: newEducation });
    }
  }

  isNotNull(input) {
    return input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== ''
  }

  // name is : userEducation  or  newUserEducation
  educationLevelChange(index, name, level) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index].old_education_level_id = newUserEducation[index].education_level_id
    newUserEducation[index].education_level_id = level.value
    newUserEducation[index].major_id = ''
    newUserEducation[index].school_id = ''
    newUserEducation[index].degree_text = level.label
    this.updateParrent(name, [...newUserEducation])
    this.setState({ [name]: [...newUserEducation] })
  }

  schoolChange(index, name, education) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index].school_id = education.value
    newUserEducation[index].university_name = education.label
    this.setState({ [name]: [...newUserEducation] })
    this.updateParrent(name, newUserEducation)
  }

  majorChange(index, name, major) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index].major_id = major.value
    newUserEducation[index].major_name = major.label
    this.setState({ [name]: [...newUserEducation] })
    this.updateParrent(name, newUserEducation)
  }

  handleDatePickerInputChange(index, dateInput, field, name) {
    if (moment(dateInput, 'DD-MM-YYYY').isValid()) {
      const oldPrefix = "old_";
      const date = moment(dateInput).format('DD-MM-YYYY')
      let newUserEducation = [...this.state[name]]
      newUserEducation[index][oldPrefix + field] = newUserEducation[index][field]
      newUserEducation[index][field] = date
      this.setState({ [name]: [...newUserEducation] })
      this.updateParrent(name, newUserEducation)
    }
  }

  otherInputChange(index, name, inputType, e) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index][inputType] = e.target.value
    this.setState({ [name]: [...newUserEducation] })
    this.updateParrent(name, newUserEducation)
  }

  updateParrent(name, newUserEducation) {
    if (name == 'userEducation') {
      this.props.updateEducation(newUserEducation);
    } else {
      this.props.addEducation(newUserEducation)
    }
  }

  resetValueInValid = value => {
    if (value == undefined || value == null || value == 'null' || value == '#') {
      return "";
    }
    return value;
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
    const schools = this.state.schools.filter(s => s.education_level_id == item.education_level_id).map(school => { return { value: school.ID, label: school.TEXT } })
    return <Row className="info-value">
      <Col xs={12} md={6} lg={3}>
        <div>
          <Select placeholder="Lựa chọn bằng cấp" name="academic_level" value={educationLevels.filter(e => e.value == item.education_level_id)} options={educationLevels} onChange={this.educationLevelChange.bind(this, index, name)} />
        </div>
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder="Lựa chọn trường" name="university_name" value={schools.filter(s => s.value == item.school_id)} options={schools} onChange={this.schoolChange.bind(this, index, name)} />
        </div>
        <div className="form-inline float-right">
          <label className="mr-3">Khác: </label>
          <input className="form-control w-75 float-right" onChange={this.otherInputChange.bind(this, index, name, "other_uni_name")} name="other_uni_name" type="text" value={this.resetValueInValid(item.other_uni_name) || ''} />
        </div>
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder="Lựa chọn chuyên môn" name="major" value={majors.filter(m => m.value == item.major_id)} options={majors} onChange={this.majorChange.bind(this, index, name)} />
        </div>
        <div className="form-inline float-right">
          <label className="mr-3">Khác: </label>
          <input className="form-control w-75 float-right" onChange={this.otherInputChange.bind(this, index, name, "other_major")} name="other_major" type="text" value={this.resetValueInValid(item.other_major) || ''} />
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
              className="form-control date" />&nbsp;-&nbsp;
                          <DatePicker
              name="to_time"
              key="to_time"
              selected={item.to_time ? moment(item.to_time, 'DD-MM-YYYY').toDate() : null}
              onChange={toTime => this.handleDatePickerInputChange(index, toTime, "to_time", name)}
              dateFormat="dd-MM-yyyy"
              locale="vi"
              className="form-control date" />
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
    this.setState({ newUserEducation: [...this.state.newUserEducation, { university_name: '', other_uni_name: '', education_id: '', academic_level: '', academic_level_id: '', major: '', major_id: '', from_time: '', to_time: '' }] })
  }

  removeEducation(index) {
    this.setState({ newUserEducation: [...this.state.newUserEducation.slice(0, index), ...this.state.newUserEducation.slice(index + 1)] })
  }

  render() {
    const userEducation = this.props.userEducation
    return (
      <div className="education">
        <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>
        <div className="box shadow">
          <span className="mr-5"><i className="note note-old"></i> Thông tin cũ </span>
          <span><i className="note note-new"></i> Nhập thông tin điều chỉnh</span>
          <hr />

          {userEducation.map((item, i) => {
            return <div className="item" key={i}>
              {this.itemHeader()}
              {item ? this.educationItem(item) : null}
              {item ? this.educationInput(this.state.userEducation, i, 'userEducation') : null}
            </div>
          })}

          <button type="button" className="btn btn-primary add" onClick={this.addEducation.bind(this)}><i className="fas fa-plus"></i> Thêm mới</button>

          {this.state.newUserEducation && this.state.newUserEducation.map((item, i) => {
            return <div className="clearfix new-item" key={i}>
              <div className="float-left input-table">
                <div key={i}>
                  {this.itemHeader()}
                  {this.educationInput(item, i, 'newUserEducation')}
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
