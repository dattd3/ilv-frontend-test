import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

class FamilyComponent extends React.Component {
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

    render() {
        const userFamilyUpdate = this.props.userFamilyUpdate
        const userFamilyCreate = this.props.userFamilyCreate
        return (
            <div className="education">
                <h4 className="title text-uppercase">Quan hệ nhân thân</h4>
                <div className="box shadow">
                    <span className="mr-5"><i className="note note-old"></i> Thông tin cũ</span>
                    <span className="mr-5"><i className="note note-new"></i> Thông tin điều chỉnh</span>
                    <span><i className="note note-create"></i> Thông tin mới</span>
                    <hr/>
                       { (userFamilyUpdate || []).map((item, i) => {
                            return <div className="item" key={i}>
                                <Row className="info-label">
                                    <Col xs={12} md={6} lg={2}>
                                        {t("FullName")}
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        Mối quan hệ
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Ngày tháng năm sinh
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Mã số thuế NPT
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        Có tính giảm trừ gia cảnh (Tích x)
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Thời gian bắt đầu
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        Thời gian kết thúc
                                    </Col>
                                </Row>

                                {item.OldFamily ? <Row className="info-value old">
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.OldFamily.Name}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail">{item.OldFamily.RelationshipName}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.OldFamily.Birthday}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.OldFamily.TaxCode ? item.OldFamily.TaxCode : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail" style={{textAlign: "center"}}>{item.OldFamily.IsFamilyDeduction == 1 ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.OldFamily.IsFamilyDeduction == 1 ? item.OldFamily.StartTime : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.OldFamily.IsFamilyDeduction == 1 ? item.OldFamily.EndTime : ""}</p>
                                    </Col>
                                </Row> : null }
                                <Row className="info-value new">
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.NewFamily.Name}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail">{item.NewFamily.RelationshipName}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.NewFamily.Birthday}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.NewFamily.TaxCode ? item.NewFamily.TaxCode : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p className="detail" style={{textAlign: "center"}}>{item.NewFamily.IsFamilyDeduction == 1 ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.NewFamily.IsFamilyDeduction == 1 ? item.NewFamily.StartTime : ""}</p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p className="detail">{item.NewFamily.IsFamilyDeduction == 1 ? item.NewFamily.EndTime : ""}</p>
                                    </Col>
                                </Row>
                            </div>
                        })
                    }
                    { (userFamilyCreate || []).map((item, i) => {
                            return <div className="clearfix new-item" key={i}>
                            <div>
                                    <Row className="info-label">
                                        <Col xs={12} md={6} lg={2}>
                                            Họ và tên
                                        </Col>
                                        <Col xs={12} md={6} lg={1}>
                                            Mối quan hệ
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            Ngày tháng năm sinh
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            Mã số thuế NPT
                                        </Col>
                                        <Col xs={12} md={6} lg={1}>
                                            Có tính giảm trừ gia cảnh (Tích x)
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            Thời gian bắt đầu
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            Thời gian kết thúc
                                        </Col>
                                    </Row>
                                    <Row className="info-value create">
                                        <Col xs={12} md={6} lg={2}>
                                            <p className="detail">{item.Name}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={1}>
                                            <p className="detail">{item.RelationshipName}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            <p className="detail">{item.Birthday}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            <p className="detail">{item.TaxCode ? item.TaxCode : ""}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={1}>
                                            <p className="detail" style={{textAlign: "center"}}>{item.IsFamilyDeduction == 1 ? <i style={{ color: 'green' }} className="fas fa-check-circle"></i> : ""}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            <p className="detail">{item.IsFamilyDeduction == 1 ? item.StartTime : ""}</p>
                                        </Col>
                                        <Col xs={12} md={6} lg={2}>
                                            <p className="detail">{item.IsFamilyDeduction == 1 ? item.EndTime : ""}</p>
                                        </Col>
                                    </Row>
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
