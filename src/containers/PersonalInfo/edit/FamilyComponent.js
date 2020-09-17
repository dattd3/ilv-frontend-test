import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

class FamilyComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            userFamily: [],
            newuserFamily: []
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

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/family`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userFamily = res.data.data;
              this.setState({ userFamily: userFamily });
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

    addFamily() {
        this.setState({newuserFamily: [...this.state.newuserFamily, { university_name: '', academic_level: '', major: '', from_time:'', to_time: '' } ] })
    }

    removeFamily(index) {
        this.setState({ newuserFamily: [...this.state.newuserFamily.slice(0, index), ...this.state.newuserFamily.slice(index + 1) ] })
    }

    render() {
        const userFamily = this.props.userFamily
        console.log(userFamily)
        return (
            <div className="education">
                <h4 className="title text-uppercase">Quan hệ nhân thân</h4>

                <div className="box shadow">
                    <span className="mr-5"><i className="note-old"> </i> Thông tin cũ </span>
                    <span><i className="note-new"> </i> Nhập thông tin điều chỉnh</span>

                    <hr/>

                       { this.state.userFamily.map((item, i) => {
                            return <div className="item" key={i}>
                                <Row className="info-label">
                                    <Col xs={12} md={6} lg={3}>
                                        Họ và tên
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        Mối QH
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Ngày sinh
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Mã số thuế NPT
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        Giảm / Trừ
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        Hiệu lực giảm trừ
                                    </Col>
                                </Row>

                                {userFamily[i] ? <Row className="info-value">
                                    <Col xs={12} md={6} lg={3}>
                                        <p className="detail">{userFamily[i].full_name}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail">{userFamily[i].relation}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{userFamily[i].dob}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{this.isNotNull(userFamily[i].tax_number) ? userFamily[i].tax_number : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail" style={{ background: "none" }}>{this.isNotNull(userFamily[i].is_reduced) ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        <p className="detail">{this.isNotNull(userFamily[i].is_reduced) ? (userFamily[i].from_date + ` - ` + userFamily[i].to_date) : ""}</p>
                                    </Col>
                                </Row> : null } 

                                <Row className="info-value">
                                    <Col xs={12} md={6} lg={3}>
                                        <p>
                                            <input class="form-control" name="full_name" type="text" value={item.full_name}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p>
                                            <input class="form-control" name="relation" type="text" value={item.relation}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p>
                                            <input class="form-control" name="dob" type="text" value={item.dob}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p>
                                            <input class="form-control" name="tax_number" type="text" value={this.isNotNull(item.tax_number) ? item.tax_number : ""}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p></p>
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        <p></p>
                                    </Col>
                                </Row>
                            </div>
                        })
                    }

                    <button type="button" class="btn btn-primary add" onClick={this.addFamily.bind(this)}><i class="fas fa-plus"></i> Thêm mới</button>

                    { this.state.newuserFamily.map((item, i) => {
                            return <div class="clearfix new-item" key={i}>
                            <div class="float-left input-table">
                                    <Row className="info-label">
                                        <Col xs={12} md={6} lg={3}>
                                            Họ và tên
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            Mối QH
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            Ngày sinh
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            Mã số thuế NPT
                                        </Col>
                                    </Row>

                                    <Row className="info-value">
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input class="form-control" name="full_name" type="text" value={item.full_name}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input class="form-control" name="relation" type="text" value={item.relation}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input class="form-control" name="dob" type="text" value={item.dob}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input class="form-control" name="tax_number" type="text" value={this.isNotNull(item.tax_number) ? item.tax_number : ""}/>
                                            </p>
                                        </Col>
                                    </Row>
                            </div>
                            <div class="float-left remove">
                                <button type="button" onClick={this.removeFamily.bind(this, i)} className="close" data-dismiss="alert" aria-label="Close">
                                    <span className="text-danger" aria-hidden="true">&times;</span>
                                </button>
                            </div>
                       </div>  
                            
                        })
                    }
                </div>
            </div>
        )
    }
}
export default FamilyComponent