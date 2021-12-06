import React from 'react'
import { Row, Col } from 'react-bootstrap'
import _ from 'lodash'
import { withTranslation } from "react-i18next"
import { t } from 'i18next'
import moment from 'moment'

class EducationComponent extends React.Component {
  constructor(props) {
    super();
  }

  isNullCustomize = value => {
    return (value == undefined || value == null || value == 'null' || value == '#' || value == "" || value == "00000000")
  }

  itemHeader = () => {
    const { t } = this.props
    return <Row className="info-label">
      <Col xs={12} md={6} lg={3}>{t("UniversityAndCollege")}</Col>
      <Col xs={12} md={6} lg={2}>{t("TypeOfDegree")}</Col>
      <Col xs={12} md={6} lg={3}>{t("Major")}</Col>
      <Col xs={12} md={6} lg={2}>{t("From")}</Col>
      <Col xs={12} md={6} lg={2}>{t("To")}</Col>
    </Row>
  }

  educationItem = (item, type) => {
    return <Row className={`info-value ${type}`}>
      <Col xs={12} md={6} lg={3}>
        <div className="detail">{!this.isNullCustomize(item.OtherSchool) ? item.OtherSchool : item.SchoolName}</div>
      </Col>
      <Col xs={12} md={6} lg={2}>
        <div className="detail">{item.DegreeTypeText}</div>
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="detail">{!this.isNullCustomize(item.OtherMajor) ? item.OtherMajor : item.MajorCodeText}</div>
      </Col>
      <Col xs={12} md={6} lg={2}>
        <div className="detail">{moment(item.FromTime, 'DD-MM-YYYY').isValid() ? moment(item.FromTime, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</div>
      </Col>
      <Col xs={12} md={6} lg={2}>
        <div className="detail">{moment(item.ToTime, 'DD-MM-YYYY').isValid() ? moment(item.ToTime, 'DD-MM-YYYY').format('DD/MM/YYYY') : ""}</div>
      </Col>
    </Row>
  }

  render() {
    const userEducationUpdate = _.uniqWith(this.props.userEducationUpdate, _.isEqual);
    const userEducationCreate = _.uniqWith(this.props.userEducationCreate, _.isEqual);
    const { t } = this.props
    return (
      <div className="education">
        <h4 className="title text-uppercase">{t("Certification")}</h4>
        <div className="box shadow">
            <span className="mr-5"><i className="note note-old"></i> {t("Record")}</span>
            <span className="mr-5"><i className="note note-new"></i> {t("NewInformation")}</span>
            <span><i className="note note-create"></i> {t("NewInformation")}</span>
            <hr/>
            {(userEducationUpdate || []).map((item, i) => {
              return <div className="item" key={i}>
                {this.itemHeader()}
                {item.OldEducation ? this.educationItem(item.OldEducation, "old") : null}
                {item.NewEducation ? this.educationItem(item.NewEducation, "new") : null}
              </div>
            })}
            {(userEducationCreate || []).map((item, i) => {
              return <div className="clearfix new-item" key={i}>
                <div key={i}>
                    {this.itemHeader()}
                    {this.educationItem(item, 'create')}
                </div>
            </div> 
            })}
        </div>
      </div>
    )
  }
}
export default withTranslation()(EducationComponent)
