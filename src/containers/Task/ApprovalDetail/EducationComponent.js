import React from 'react'
import { Row, Col } from 'react-bootstrap'
import _ from 'lodash'

class EducationComponent extends React.Component {
  constructor(props) {
    super();
  }

  isNullCustomize = value => {
    return (value == undefined || value == null || value == 'null' || value == '#' || value == "" || value == "00000000")
  }

  itemHeader = () => {
    return <Row className="info-label">
      <Col xs={12} md={6} lg={3}>Trường đào tạo</Col>
      <Col xs={12} md={6} lg={2}>Loại bằng cấp</Col>
      <Col xs={12} md={6} lg={3}>Chuyên ngành</Col>
      <Col xs={12} md={6} lg={2}>Từ thời gian</Col>
      <Col xs={12} md={6} lg={2}>Đến thời gian</Col>
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
        <div className="detail">{item.FromTime}</div>
      </Col>
      <Col xs={12} md={6} lg={2}>
        <div className="detail">{item.ToTime}</div>
      </Col>
    </Row>
  }

  render() {
    const userEducationUpdate = _.uniqWith(this.props.userEducationUpdate, _.isEqual);
    const userEducationCreate = _.uniqWith(this.props.userEducationCreate, _.isEqual);
    return (
      <div className="education">
        <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>
        <div className="box shadow">
            <span className="mr-5"><i className="note note-old"></i> Thông tin cũ</span>
            <span className="mr-5"><i className="note note-new"></i> Thông tin điều chỉnh</span>
            <span><i className="note note-create"></i> Thông tin mới</span>
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
export default EducationComponent
