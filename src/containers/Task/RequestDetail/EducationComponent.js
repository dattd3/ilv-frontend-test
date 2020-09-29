import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

class EducationComponent extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // let config = {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    //     'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
    //     'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
    //   }
    // }
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
        <div className="detail">
          {item.SchoolName ? item.SchoolName : ""}
        </div>
      </Col>
      <Col xs={12} md={6} lg={2}>
        <div className="detail">{item.DegreeName}</div>
      </Col>
      <Col xs={12} md={6} lg={3}>
        <div className="detail">{item.Major}</div>
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
    const userEducationUpdate = this.props.userEducationUpdate;
    const userEducationCreate = this.props.userEducationCreate;
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
