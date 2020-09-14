import React from 'react'
import { Row, Col } from 'react-bootstrap'

class FamilyComponent extends React.Component {

    isNotNull(input) {
        if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
          return true;
        }
        return false;
    }

    render() {
        const userFamily = this.props.userFamily
        console.log(userFamily)
        return (
            <div className="education">
                <h4 className="title text-uppercase">Bằng cấp / Chứng chỉ chuyên môn</h4>

                <div className="box shadow">
                    <span className="mr-5"><i className="note-old"> </i> Thông tin cũ </span>
                    <span><i className="note-new"> </i> Nhập thông tin điều chỉnh</span>

                    <hr/>

                       { userFamily.map((item, i) => {
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

                                <Row className="info-value">
                                    <Col xs={12} md={6} lg={3}>
                                        <p className="detail">{item.full_name}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail">{item.relation}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.dob}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{this.isNotNull(item.tax_number) ? item.tax_number : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail" style={{ background: "none" }}>{this.isNotNull(item.is_reduced) ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        <p className="detail">{this.isNotNull(item.is_reduced) ? (item.from_date + ` - ` + item.to_date) : ""}</p>
                                    </Col>
                                </Row>

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

                    <button type="button" class="btn btn-primary add"><i class="fas fa-plus"></i> Thêm mới</button>

                </div>

            </div>
        )
    }
}
export default FamilyComponent