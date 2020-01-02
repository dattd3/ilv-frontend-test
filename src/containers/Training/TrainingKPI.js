import React from "react";
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner";
import { useTranslation } from "react-i18next";


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
        <div>
            <Row className="summary-chart">
                <Col xl={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <div className="kpi-learning kpi-training">
                                    <i className="icon-kpi-learning"></i>
                                </div>
                                <p className="mb-2">Số tín chỉ yêu cầu</p>
                                <strong>{teachingKpi.totalHours} tín chỉ / năm</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4 text-gray-800 text-uppercase">{t("LearnKPI")}</h4>
                            <ProgressBar className="training-kpi-progress learning-progress" now={teachingKpi.perLearned} label={teachingKpi.perLearned + '%'} />
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square color-fe6927"></i> {t("Status_Done")}</Col>
                                <Col><span>{teachingKpi.totalEarned}/{teachingKpi.totalHours}</span></Col>
                            </Row>
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square"></i> {t("Status_NotDoneYet")}</Col>
                                <Col><span>{teachingKpi.totalHours - teachingKpi.totalEarned}/{teachingKpi.totalHours}</span></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="summary-chart">
                <Col xl={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <div className="text-center">
                                <div className="kpi-teaching kpi-training">
                                    <i className="icon-kpi-teaching"></i>
                                </div>
                                <p className="mb-2">Số tín chỉ yêu cầu</p>
                                <strong>{learningKpi.totalHours} tín chỉ / năm</strong>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4 text-gray-800 text-uppercase">{t("TeachingKPI")}</h4>
                            <ProgressBar className="training-kpi-progress teaching-progress" now={learningKpi.totalHours} label={learningKpi.totalHours + `%`} />
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square color-67BA24"></i> {t("Status_Done")}</Col>
                                <Col><span>{learningKpi.totalEarned}/{learningKpi.totalHours}</span></Col>
                            </Row>
                            <Row className="training-kpi-info">
                                <Col><i className="fa fa-square"></i> {t("Status_NotDoneYet")}</Col>
                                <Col><span>{learningKpi.totalHours - learningKpi.totalEarned}/{learningKpi.totalHours}</span></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div >
    );
}

export default TrainingKPI;