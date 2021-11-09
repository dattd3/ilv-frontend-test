import React from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { withTranslation } from "react-i18next"
import { getMuleSoftHeaderConfigurations } from "../../../commons/Utils"

class FamilyComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            userFamily: [],
            newuserFamily: []
        }
    }

    componentDidMount() {
        let config = getMuleSoftHeaderConfigurations()

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/family`, config)
          .then(res => {
            if (res && res.data && res.data.data) {
              let userFamily = res.data.data;
              this.props.setState({ userFamily: userFamily })
              this.setState({ userFamily: userFamily })
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
        const { t } = this.props
        return (
            <div className="education">
                <h4 className="title text-uppercase">{t("Family")}</h4>
                <div className="box shadow">
                    <span className="mr-5"><i className="note note-old"></i> {t("Record")} </span>
                    <span><i className="note note-new"></i> {t("NewInformation")}</span>
                    <hr/>

                       { this.state.userFamily.map((item, i) => {
                            return <div className="item" key={i}>
                                <Row className="info-label">
                                    <Col xs={12} md={6} lg={3}>
                                        {t("FullName")}
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        {t("Relationship")}
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        {t("DateOfBirth")}
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        {t("PitNoNpt")}
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        {t("FamilyAllowances")}
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        {t("EffectiveReductionDate")}
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
                                            <input className="form-control" name="full_name" type="text" value={item.full_name}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={1}>
                                        <p>
                                            <input className="form-control" name="relation" type="text" value={item.relation}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p>
                                            <input className="form-control" name="dob" type="text" value={item.dob}/>
                                        </p>
                                    </Col>
                                    <Col xs={12} md={6} lg={2}>
                                        <p>
                                            <input className="form-control" name="tax_number" type="text" value={this.isNotNull(item.tax_number) ? item.tax_number : ""}/>
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

                    <button type="button" className="btn btn-primary add" onClick={this.addFamily.bind(this)}><i className="fas fa-plus"></i> {t("Add")}</button>

                    { this.state.newuserFamily.map((item, i) => {
                            return <div className="clearfix new-item" key={i}>
                            <div className="float-left input-table">
                                    <Row className="info-label">
                                        <Col xs={12} md={6} lg={3}>
                                            {t("FullName")}
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            {t("Relationship")}
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            {t("DateOfBirth")}
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            {t("PitNoNpt")}
                                        </Col>
                                    </Row>

                                    <Row className="info-value">
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input className="form-control" name="full_name" type="text" value={item.full_name}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input className="form-control" name="relation" type="text" value={item.relation}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input className="form-control" name="dob" type="text" value={item.dob}/>
                                            </p>
                                        </Col>
                                        <Col xs={12} md={6} lg={3}>
                                            <p>
                                                <input className="form-control" name="tax_number" type="text" value={this.isNotNull(item.tax_number) ? item.tax_number : ""}/>
                                            </p>
                                        </Col>
                                    </Row>
                            </div>
                            <div className="float-left remove">
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
export default withTranslation()(FamilyComponent)
