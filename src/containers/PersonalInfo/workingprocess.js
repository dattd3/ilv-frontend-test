import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';

export default function BenefitItem(props) {
    const { t } = useTranslation();

    return (
        <div className="personal-info">
            <h1 className="h3 text-uppercase text-gray-800">{t("WorkingProcess")}</h1>
            <Tabs defaultActiveKey="LaborContract" id="uncontrolled-tab-example">
                <Tab eventKey="LaborContract" title={t("LaborContract")}>
                    <Container fluid className="info-tab-content">
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("LaborContractNo")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("LaborContractType")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("LaborContractStartDate")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("LaborContractEndDate")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="info-item">
                                <label>{t("LaborContractIssuesBy")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="CommendationViolation" title={t("CommendationViolation")}>
                    <Container fluid className="info-tab-content">
                        <h4>{t("Felicitation")}</h4>
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("NoOfDecision")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("EffectiveDate")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="info-item">
                                <label>{t("ReasonsOfCompliment")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("FormOfCompliment")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("AmountOfBonus")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                        </Row>

                        <h4>{t("Discipline")}</h4>
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("NoOfDecision")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("EffectiveDate")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={1} className="info-item">
                                <label>{t("ViolationGroup")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("DetailViolation")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("FormOfPunishment")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item">
                                <label>{t("AmountOfBonusDeducted")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                            <Col xs={12} md={6} lg={1} className="info-item">
                                <label>{t("PercentDeductionOfBonus")}</label>
                                <p>{/* asd */}</p>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    )
};