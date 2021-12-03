import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import moment from 'moment'

class FamilyComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { t, userFamilyUpdate, userFamilyCreate } = this.props

        return (
            <div className="education">
                <h4 className="content-page-header">{t("PersonalRelations")}</h4>
                <div className="box shadow">
                    <span className="mr-5"><i className="note note-old"></i> {t("Record")}</span>
                    <span className="mr-5"><i className="note note-new"></i> {t("UpdateInformation")}</span>
                    <span><i className="note note-create"></i> {t("NewInformation")}</span>
                    <hr/>
                        { (userFamilyUpdate || []).map((item, i) => {
                            let oldFamily = item.OldFamily
                            let newFamily = item.NewFamily

                            return <div className="item" key={i}>
                                <Row className="info-label">
                                    <Col xs={12} md={3}>
                                        {t("FamilyLastName")}
                                    </Col>
                                    <Col xs={12} md={2}>
                                        {t("FamilyFirstName")}
                                    </Col>
                                    <Col xs={12} md={2}>
                                        {t("FamilyMember")}
                                    </Col>
                                    <Col xs={12} md={2}>
                                        {t("Gender")}
                                    </Col>
                                    <Col xs={12} md={3}>
                                        {t("DateOfBirth")}
                                    </Col>
                                </Row>

                                {item.OldFamily ? <Row className="info-value old">
                                    <Col xs={12} md={3}>
                                        <p className="detail">{oldFamily.lastName}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{oldFamily.firstName}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{oldFamily.relationshipText}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{oldFamily.genderText}</p>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <p className="detail">{moment(oldFamily.birthday).format("DD/MM/YYYY")}</p>
                                    </Col>
                                </Row> : null }
                                <Row className="info-value new">
                                    <Col xs={12} md={3}>
                                        <p className="detail">{newFamily.lastName}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{newFamily.firstName}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{newFamily.relationshipText}</p>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <p className="detail">{newFamily.genderText}</p>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <p className="detail">{moment(newFamily.birthday).format("DD/MM/YYYY")}</p>
                                    </Col>
                                </Row>
                            </div>
                        })
                    }
                    { (userFamilyCreate || []).map((item, i) => {
                        return <div className="clearfix new-item" key={i}>
                                    <div>
                                        <Row className="info-label">
                                            <Col xs={12} md={3}>
                                                {t("FamilyLastName")}
                                            </Col>
                                            <Col xs={12} md={2}>
                                                {t("FamilyFirstName")}
                                            </Col>
                                            <Col xs={12} md={2}>
                                                {t("FamilyMember")}
                                            </Col>
                                            <Col xs={12} md={2}>
                                                {t("Gender")}
                                            </Col>
                                            <Col xs={12} md={3}>
                                                {t("DateOfBirth")}
                                            </Col>
                                        </Row>
                                        <Row className="info-value create">
                                            <Col xs={12} md={3}>
                                                <p className="detail">{item.lastName}</p>
                                            </Col>
                                            <Col xs={12} md={2}>
                                                <p className="detail">{item.firstName}</p>
                                            </Col>
                                            <Col xs={12} md={2}>
                                                <p className="detail">{item.relationshipText}</p>
                                            </Col>
                                            <Col xs={12} md={2}>
                                                <p className="detail">{item.genderText}</p>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <p className="detail">{moment(item.birthday).format("DD/MM/YYYY")}</p>
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

export default withTranslation()(FamilyComponent)
