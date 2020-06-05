import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';

export default function BenefitItem(props) {
    const { t } = useTranslation();

    return (
        <div className="personal-info">
            <h1 className="h3 mb-3 text-uppercase text-gray-800">{t("WorkingProcess")}</h1>
            <Tabs defaultActiveKey="LaborContract" id="uncontrolled-tab-example">
                <Tab eventKey="LaborContract" title={t("LaborContract")}>
                    <Container fluid className="info-tab-content">
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("LaborContractNo")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("LaborContractType")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("LaborContractStartDate")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("LaborContractEndDate")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("LaborContractIssuesBy")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="CommendationViolation" title={t("CommendationViolation")}>
                    <Container fluid className="info-tab-content">
                        <h4>{t("Felicitation")}</h4>
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("NoOfDecision")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("EffectiveDate")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={4} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("ReasonsOfCompliment")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("FormOfCompliment")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("AmountOfBonus")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h4>{t("Discipline")}</h4>
                        <Row>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("NoOfDecision")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("EffectiveDate")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={1} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("ViolationGroup")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("DetailViolation")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("FormOfPunishment")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={2} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("AmountOfBonusDeducted")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={1} className="info-item mb-3">
                                <Form.Group as={Col}>
                                    <label>{t("PercentDeductionOfBonus")}</label>
                                    <p className="info-value">{/* asd */}</p>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>
        </div>
    )
};