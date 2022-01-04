import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import { getMuleSoftHeaderConfigurations } from "../../../commons/Utils"
import vi from 'date-fns/locale/vi'
import { withTranslation } from "react-i18next"
registerLocale("vi", vi)

class EducationComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      userEducation: [],
      newUserEducation: [],
      schools: [],
      requestedUserProfileToContinue: props.requestedUserProfile,
      validationEducationMessagesFromParent: props.validationMessages
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.validationMessages !== this.props.validationMessages) {
      this.setState({ validationEducationMessagesFromParent: nextProps.validationMessages })
    }
  }

  componentDidMount() {
    const config = getMuleSoftHeaderConfigurations()

    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/masterdata/schools`, config)
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
        this.bindingNewEducationEdited(this.props.requestedUserProfile)
      } else {
        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/education`, config)
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
    if (userProfileHistoryEducation) {
      const userEducation = userProfileHistoryEducation.map((d, index) => {
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
          index: index
        }
      })
      this.setState({ userEducation: userEducation })
    }
  }

  bindingNewEducationEdited = (requestedUserProfile) => {
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
        ToTime: "to_time",
        Index: "index",
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
    if (newUserEducation[index]) {
      newUserEducation[index].old_education_level_id = newUserEducation[index].education_level_id
      newUserEducation[index].education_level_id = level ? level.value : ""
      newUserEducation[index].major_id = ''
      newUserEducation[index].school_id = ''
      newUserEducation[index].degree_text = level ? level.label : ""
      newUserEducation[index].index = index
    }
    this.updateParent(name, [...newUserEducation], index)
    this.setState({ [name]: [...newUserEducation] })
  }

  schoolChange(index, name, education) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index].school_id = education ? education.value : ""
    newUserEducation[index].university_name = education ? education.label : ""
    newUserEducation[index].other_uni_name = ""
    newUserEducation[index].isLockOtherSchool = education ? true : false
    newUserEducation[index].index = index
    this.setState({ [name]: [...newUserEducation] })
    this.updateParent(name, newUserEducation, index)
  }

  majorChange(index, name, major) {
    let newUserEducation = [...this.state[name]]
    newUserEducation[index].major_id = major ? major.value : ""
    newUserEducation[index].major_name = major ? major.label : ""
    newUserEducation[index].other_major = ""
    newUserEducation[index].isLockOtherMajor = major ? true : false
    newUserEducation[index].index = index
    this.setState({ [name]: [...newUserEducation] })
    this.updateParent(name, newUserEducation, index)
  }

  handleDatePickerInputChange(index, dateInput, field, name) {
    if (moment(dateInput, 'DD-MM-YYYY').isValid()) {
      const oldPrefix = "old_"
      const date = moment(dateInput).format('DD-MM-YYYY')
      let newUserEducation = [...this.state[name]]
      newUserEducation[index][oldPrefix + field] = newUserEducation[index][field]
      newUserEducation[index][field] = date
      newUserEducation[index].index = index
      this.setState({ [name]: [...newUserEducation] })
      this.updateParent(name, newUserEducation, index)
    }
  }

  otherInputChange(index, name, inputType, e) {
    let val = e.target.value;
    let newUserEducation = [...this.state[name]];
    newUserEducation[index][inputType] = val;
    if (inputType === "other_uni_name") {
      newUserEducation[index].school_id = "";
      newUserEducation[index].university_name = "";
    } else if (inputType === "other_major") {
      newUserEducation[index].major_id = "";
      newUserEducation[index].major = "";
    }
    newUserEducation[index].index = index
    this.setState({ [name]: [...newUserEducation] })
    this.updateParent(name, newUserEducation, index)
  }

  updateParent(name, newUserEducation, index) {
    if (name == 'userEducation') {
      this.props.updateEducation(newUserEducation)
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
    const { t } = this.props;
    return <Row className="info-label">
      <Col xs={12} md={6} lg={3}>
        {t("TypeOfDegree")}
      </Col>
      <Col xs={12} md={6} lg={3}>
        {t("UniversityAndCollege")}
      </Col>
      <Col xs={12} md={6} lg={3}>
        {t("Major")}
      </Col>
      <Col xs={12} md={6} lg={3}>
        {t("Cohort")}
      </Col>
    </Row>
  }

  updateEducationInput(item, index, name) {
    const { t } = this.props
    const { validationEducationMessagesFromParent } = this.state
    const validationUpdateItem = validationEducationMessagesFromParent && validationEducationMessagesFromParent.update ? validationEducationMessagesFromParent.update[[index]] : {}
    const educationLevels = this.props.educationLevels.filter(educationLevel => {
      return !['V060'].includes(localStorage.getItem("companyCode")) ? (educationLevel.ID !== "VN" && educationLevel.ID !== "VO" && educationLevel.ID !== "VM" && educationLevel.ID !== "VA"
        && educationLevel.ID !== "VB" && educationLevel.ID !== "VC" && educationLevel.ID !== "VD") : true
    }).map(educationLevel => {
      return { value: educationLevel.ID, label: educationLevel.TEXT }
    })
    const majors = this.props.majors.map(major => { return { value: major.ID, label: major.TEXT } })
    const schools = this.state.schools.filter(s => s.education_level_id == item.education_level_id).map(school => { return { value: school.ID, label: school.TEXT } })

    return <Row className="info-value">
      <Col xs={12} md={6} lg={3}>
        <div>
          <Select placeholder={t("SelectTypeOfDegree")} name="academic_level" isClearable={true} value={educationLevels.filter(e => e.value == item.education_level_id)} options={educationLevels} onChange={this.educationLevelChange.bind(this, index, name)} />
        </div>
        { validationUpdateItem?.degreeType_update && <div className="text-danger validation-message">{validationUpdateItem?.degreeType_update}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder={t("SelectUniversityAndCollege")} name="university_name" isClearable={true} value={schools.filter(s => s.value == item.school_id)} options={schools} onChange={this.schoolChange.bind(this, index, name)} />
        </div>
        <div className="form-inline other-field">
          <label className="mr-3 label">{t("Other")}: </label>
          <input className="form-control w-75 input" disabled={item.isLockOtherSchool} onChange={this.otherInputChange.bind(this, index, name, "other_uni_name")} name="other_uni_name" type="text" value={this.resetValueInValid(item.other_uni_name) || ''} />
        </div>
        { validationUpdateItem?.school_update && <div className="text-danger validation-message">{validationUpdateItem?.school_update}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder={t("SelectMajor")} name="major" isClearable={true} value={majors.filter(m => m.value == item.major_id)} options={majors} onChange={this.majorChange.bind(this, index, name)} />
        </div>
        <div className="form-inline other-field">
          <label className="mr-3 label">{t("Other")}: </label>
          <input className="form-control w-75 input" disabled={item.isLockOtherMajor} onChange={this.otherInputChange.bind(this, index, name, "other_major")} name="other_major" type="text" value={this.resetValueInValid(item.other_major) || ''} />
        </div>
        { validationUpdateItem?.major_update && <div className="text-danger validation-message">{validationUpdateItem?.major_update}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="row">
          <div className="col-sm-6">
            <DatePicker
              name="from_time"
              key="from_time"
              maxDate={new Date()}
              selected={item && item.from_time ? moment(item.from_time, 'DD-MM-YYYY').toDate() : null}
              onChange={fromTime => this.handleDatePickerInputChange(index, fromTime, "from_time", name)}
              dateFormat="dd-MM-yyyy"
              locale="vi"
              showMonthDropdown={true}
              showYearDropdown={true}
              autoComplete='off'
              placeholderText={t("From")}
              popperPlacement="bottom-end"
              className="form-control input" />
          </div>
          <div className="col-sm-6">
          <DatePicker
            name="to_time"
            key="to_time"
            maxDate={new Date()}
            selected={item && item.to_time ? moment(item.to_time, 'DD-MM-YYYY').toDate() : null}
            onChange={toTime => this.handleDatePickerInputChange(index, toTime, "to_time", name)}
            dateFormat="dd-MM-yyyy"
            locale="vi"
            showMonthDropdown={true}
            showYearDropdown={true}
            autoComplete='off'
            placeholderText={t("To")}
            popperPlacement="bottom-end"
            className="form-control input" />
        </div>
        { validationUpdateItem?.fromTime_update && <div className="text-danger validation-message">{validationUpdateItem?.fromTime_update}</div> }
        { validationUpdateItem?.toTime_update && <div className="text-danger validation-message">{validationUpdateItem?.toTime_update}</div> }
        </div>
      </Col>
    </Row>
  }

  educationInput(item, index, name) {
    const { t } = this.props;
    const { validationEducationMessagesFromParent } = this.state
    const validationUpdateItem = validationEducationMessagesFromParent && validationEducationMessagesFromParent.create ? validationEducationMessagesFromParent.create[[index]] : {}
    const educationLevels = this.props.educationLevels.filter(educationLevel => {
      return educationLevel.ID !== "VN" && educationLevel.ID !== "VO" && educationLevel.ID !== "VM" && educationLevel.ID !== "VA"
        && educationLevel.ID !== "VB" && educationLevel.ID !== "VC" && educationLevel.ID !== "VD";
    })
    .map(educationLevel => {
      return { value: educationLevel.ID, label: educationLevel.TEXT }
    })
    const majors = this.props.majors.map(major => { return { value: major.ID, label: major.TEXT } })
    const schools = this.state.schools.filter(s => s.education_level_id == item.education_level_id).map(school => { return { value: school.ID, label: school.TEXT } })

    return <Row className="info-value">
      <Col xs={12} md={6} lg={3}>
        <div>
          <Select placeholder={t("SelectTypeOfDegree")} name="academic_level" isClearable={true} value={educationLevels.filter(e => e.value == item.education_level_id)} options={educationLevels} onChange={this.educationLevelChange.bind(this, index, name)} />
        </div>
        { validationUpdateItem?.degreeType_create && <div className="text-danger validation-message">{validationUpdateItem?.degreeType_create}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder={t("SelectUniversityAndCollege")} name="university_name" isClearable={true} value={schools.filter(s => s.value == item.school_id)} options={schools} onChange={this.schoolChange.bind(this, index, name)} />
        </div>
        <div className="form-inline other-field">
          <label className="mr-3 label">{t("Other")}: </label>
          <input className="form-control w-75 input" disabled={item.isLockOtherSchool} onChange={this.otherInputChange.bind(this, index, name, "other_uni_name")} name="other_uni_name" type="text" value={this.resetValueInValid(item.other_uni_name) || ''} />
        </div>
        { validationUpdateItem?.school_create && <div className="text-danger validation-message">{validationUpdateItem?.school_create}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="mb-3">
          <Select placeholder={t("SelectMajor")} name="major" isClearable={true} value={majors.filter(m => m.value == item.major_id)} options={majors} onChange={this.majorChange.bind(this, index, name)} />
        </div>
        <div className="form-inline other-field">
          <label className="mr-3 label">{t("Other")}: </label>
          <input className="form-control w-75 input" disabled={item.isLockOtherMajor} onChange={this.otherInputChange.bind(this, index, name, "other_major")} name="other_major" type="text" value={this.resetValueInValid(item.other_major) || ''} />
        </div>
        { validationUpdateItem?.major_create && <div className="text-danger validation-message">{validationUpdateItem?.major_create}</div> }
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="row">
          <div className="col-sm-6">
            <DatePicker
              name="from_time"
              key="from_time"
              maxDate={new Date()}
              selected={item && item.from_time ? moment(item.from_time, 'DD-MM-YYYY').toDate() : null}
              onChange={fromTime => this.handleDatePickerInputChange(index, fromTime, "from_time", name)}
              dateFormat="dd-MM-yyyy"
              locale="vi"
              showMonthDropdown={true}
              showYearDropdown={true}
              autoComplete='off'
              placeholderText={t("From")}
              popperPlacement="bottom-end"
              className="form-control input" />
          </div>
          <div className="col-sm-6">
            <DatePicker
              name="to_time"
              key="to_time"
              maxDate={new Date()}
              selected={item && item.to_time ? moment(item.to_time, 'DD-MM-YYYY').toDate() : null}
              onChange={toTime => this.handleDatePickerInputChange(index, toTime, "to_time", name)}
              dateFormat="dd-MM-yyyy"
              locale="vi"
              showMonthDropdown={true}
              showYearDropdown={true}
              autoComplete='off'
              placeholderText={t("To")}
              popperPlacement="bottom-end"
              className="form-control input" />
          </div>
          { validationUpdateItem?.fromTime_create && <div className="text-danger validation-message">{validationUpdateItem?.fromTime_create}</div> }
          { validationUpdateItem?.toTime_create && <div className="text-danger validation-message">{validationUpdateItem?.toTime_create}</div> }
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
        <div className="detail">
          {item.major_id === 0 ? item.other_major : item.major}
        </div>
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="detail">{moment(item.from_time, 'DD-MM-YYYY').isValid() ? moment(item.from_time, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""} - {moment(item.to_time, 'DD-MM-YYYY').isValid() ? moment(item.to_time, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</div>
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
    const { t } = this.props;

    return (
      <div className="education">
        <div className="box shadow">
          <span className="mr-5"><i className="note note-old"></i> {t("Record")} </span>
          <span><i className="note note-new"></i> {t("NewInformation")}</span>
          <hr />

          {userEducation.map((item, i) => {
            return <div className="item" key={i}>
              {this.itemHeader()}
              {item ? this.educationItem(item) : null}
              {this.state.userEducation[i] ? this.updateEducationInput(this.state.userEducation[i], i, 'userEducation') : null}
            </div>
          })}

          <button type="button" className="btn btn-primary add" onClick={this.addEducation.bind(this)}><i className="fas fa-plus"></i> {t("Add")}</button>

          {this.state.newUserEducation && this.state.newUserEducation.map((item, i) => {
            return <div className="clearfix new-item" key={i}>
                    <span className="btn-remove-education-item" onClick={this.removeEducation.bind(this, i)}><i className="fas fa-times"></i></span>
                    <div className="float-left input-table">
                      <div key={i}>
                        {this.itemHeader()}
                        {this.educationInput(item, i, 'newUserEducation')}
                      </div>
                    </div>
                  </div>
          })}
        </div>
      </div>
    )
  }
}

export default withTranslation()(EducationComponent)
