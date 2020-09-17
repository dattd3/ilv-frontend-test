import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

class EducationComponent extends React.Component {

    constructor() {
        super();
        this.state = {
            userEducation: [],
            newUserEducation: []
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
              this.setState({ userEducation: userEducation });
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

    itemHeader() {
        return <Row className="info-label">
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
    }

    educationInput(item) {
        return <Row className="info-value">
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
    }

    educationItem(item) {
        return <Row className="info-value">
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
    }

    addEducation() {
        this.setState({newUserEducation: [...this.state.newUserEducation, { university_name: '', academic_level: '', major: '', from_time:'', to_time: '' } ] })
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
                    <span className="mr-5"><i className="note-old"> </i> Thông tin cũ </span>
                    <span><i className="note-new"> </i> Nhập thông tin điều chỉnh</span>

                    <hr/>

                    {this.state.userEducation.map((item, i) => {
                      return <div className="item" key={i}>
                        {this.itemHeader()}
                        {userEducation[i] ? this.educationItem(userEducation[i]) : null}
                        {this.educationInput(item)}
                      </div>
                    })}

                    <button type="button" class="btn btn-primary add" onClick={this.addEducation.bind(this)}><i class="fas fa-plus"></i> Thêm mới</button>

                    {this.state.newUserEducation.map((item, i) => {
                      return <div class="clearfix new-item">
                        <div class="float-left input-table">
                            <div key={i}>
                                {this.itemHeader()}
                                {this.educationInput(item)}
                            </div>
                        </div>
                        <div class="float-left remove">
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