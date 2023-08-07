import React from "react";
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";
import { useTranslation } from "react-i18next";
import HOCComponent from '../../components/Common/HOCComponent'

const usePreload = (params) => {
    const api = useApi();
    const [kpiData = undefined] = useFetcher({
        api: api.fetchKPI,
        autoRun: true,
        params: params
    });
    return kpiData;
};
function TrainingKPI(props) {
    const { t } = useTranslation();
    const guard = useGuardStore();
    const user = guard.getCurentUser();
    const kpiData = usePreload([user.email]);
    let learningKpi, teachingKpi = {
        totalHours: 0,
        totalEarned: 0,
        perLearned: 100
    };
    if (!kpiData) {
        return (
            <LoadingSpinner />
        )
    }

    if (kpiData && kpiData.data) {
        learningKpi = kpiData.data.learning_target_credits != 0 ?
            {
                totalHours: kpiData.data.learning_target_credits,
                perLearned: Math.round(kpiData.data.learning_earned_credits / kpiData.data.learning_target_credits),
                totalEarned: kpiData.data.learning_earned_credits
            } : {
                totalHours: 0,
                perLearned: 100,
                totalEarned: 0
            };
        teachingKpi = kpiData.data.instructing_target_credits != 0 ?
            {
                totalHours: kpiData.data.instructing_target_credits,
                perLearned: Math.round(kpiData.data.instructing_earned_credits / kpiData.data.instructing_target_credits),
                totalEarned: kpiData.data.instructing_earned_credits
            } : {
                totalHours: 0,
                perLearned: 100,
                totalEarned: 0
            };
    }
    return (
        <div className='kpi-training-page'>
            <a href="https://app.powerbi.com/links/7luTy2-bVy?ctid=ed6a2939-d153-4f92-94f8-3d790d96c9f8&pbi_source=linkShare" target="_blank" className='btn btn-primary online-search-link'>{t("OnlineSearchLink")}</a>
            <Row className="summary-chart">
                <Col xl={6} className="mb-4">
                    <Card className="shadow-customize">
                        <Card.Body>
                            <div className="text-center">
                                <div className="kpi-learning kpi-training">
                                    <i className="icon-kpi-learning"></i>
                                </div>
                                <p className="mb-2">{t("RequiredCredit")}</p>
                                <strong>{teachingKpi.totalHours} {t("ClassCredit")} / {t("Year")}</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} className="mb-4">
                    <Card className="shadow-customize">
                        <Card.Body>
                            <h4 className="text-uppercase learning-target">{t("LearnKPI")}</h4>
                            <ProgressBar className="training-kpi-progress learning-progress" now={teachingKpi.perLearned} label={teachingKpi.perLearned + '%'} />
                            <div className="training-kpi-info">
                                <div><i className="fa fa-square color-fe6927"></i>{t("Status_Done")}</div>
                                <div><span>{teachingKpi.totalEarned}/{teachingKpi.totalHours}</span></div>
                            </div>
                            <div className="training-kpi-info">
                                <div><i className="fa fa-square"></i>{t("Status_NotDoneYet")}</div>
                                <div><span>{teachingKpi.totalHours - teachingKpi.totalEarned}/{teachingKpi.totalHours}</span></div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="summary-chart">
                <Col xl={6}>
                    <Card className="shadow-customize">
                        <Card.Body>
                            <div className="text-center">
                                <div className="kpi-teaching kpi-training">
                                    <i className="icon-kpi-teaching"></i>
                                </div>
                                <p className="mb-2">{t("RequiredCredit")}</p>
                                <strong>{learningKpi.totalHours} {t("ClassCredit")} / {t("Year")}</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="shadow-customize">
                        <Card.Body>
                            <h4 className="text-uppercase training-target">{t("TeachingKPI")}</h4>
                            <ProgressBar className="training-kpi-progress teaching-progress" now={learningKpi.totalHours} label={learningKpi.totalHours + `%`} />
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square color-67BA24"></i>{t("Status_Done")}</Col>
                                <Col><span>{learningKpi.totalEarned}/{learningKpi.totalHours}</span></Col>
                            </Row>
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square"></i>{t("Status_NotDoneYet")}</Col>
                                <Col><span>{learningKpi.totalHours - learningKpi.totalEarned}/{learningKpi.totalHours}</span></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    );
}

export default HOCComponent(TrainingKPI);
