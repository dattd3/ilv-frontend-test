import React from 'react'
import { Row, Col } from 'react-bootstrap'

class EducationComponent extends React.Component {

    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
          return true;
        }
        return false;
    }

    render() {
        const userEducation = this.props.userEducation
        return (
            <div className="education">
                <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>

                <div className="box shadow">
                    <span className="mr-5"><i className="note-old"> </i> Thông tin cũ </span>
                    <span><i className="note-new"> </i> Nhập thông tin điều chỉnh</span>

                    <hr/>

                    {userEducation.map((item, i) => {
                      return <div className="item" key={i}>
                        <Row className="info-label">
                          <Col xs={12} md={6} lg={3}>
                            Trường
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            Loại bằng cấp
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            Chuyên môn
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            Thời gian theo học
                          </Col>
                        </Row>
                        <Row className="info-value">
                          <Col xs={12} md={6} lg={3}>
                            <p><div className="detail">
                                {this.isNotNull(item.university_name) ? item.university_name : item.other_uni_name}
                            </div></p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p><div className="detail">{item.academic_level}</div></p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p><div className="detail">{item.major}</div></p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p><div className="detail">{item.from_time} - {item.to_time}</div></p>
                          </Col>
                        </Row>

                        <Row className="info-value">
                        <Col xs={12} md={6} lg={3}>
                            <p>
                                <input class="form-control" name="bank_name" type="text" value={this.isNotNull(item.university_name) ? item.university_name : item.other_uni_name}/>
                            </p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>
                                <input class="form-control" name="bank_name" type="text" value={item.academic_level}/>
                            </p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>
                                <input class="form-control" name="bank_name" type="text" value={item.major}/>
                            </p>
                          </Col>
                          <Col xs={12} md={6} lg={3}>
                            <p>
                                <input class="form-control" name="bank_name" type="text" value={`${item.from_time} - ${item.to_time}`}/>
                            </p>
                          </Col>
                        </Row>
                      </div>;
                    })}

                    <button type="button" class="btn btn-primary add"><i class="fas fa-plus"></i> Thêm mới</button>

                </div>

            </div>
        )
    }
}
export default EducationComponent