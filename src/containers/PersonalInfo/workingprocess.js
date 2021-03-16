import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import map from '../map.config';
import WorkingProcessSearch from './workingProcessSearch';
class MyComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userContract: {},
            userBonuses: {},
            userPenalties: {},
            userBonusesRoot: {},
            userPenaltiesRoot: {}
        };
    }

    componentWillMount() {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/contract`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let userContract = res.data.data;
                    this.setState({ userContract: userContract });
                }
            }).catch(error => {
                localStorage.clear();
                window.location.href = map.Login;
            });

        config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }

        axios.get(`${process.env.REACT_APP_REQUEST_URL}user/bonuses?perno=${localStorage.getItem('employeeNo')}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let userBonusResult = res.data.data.sort((a, b) => Date.parse(a.effective_date) <= Date.parse(b.effective_date) ? 1 : -1);
                    this.setState({ userBonuses: userBonusResult, userBonusesRoot: userBonusResult });
                }
            }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
            });
        axios.get(`${process.env.REACT_APP_REQUEST_URL}user/penalties?perno=${localStorage.getItem('employeeNo')}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let userPenaltiesResult = res.data.data.sort((a, b) => Date.parse(a.effective_date) <= Date.parse(b.effective_date) ? 1 : -1);
                    this.setState({ userPenalties: userPenaltiesResult, userPenaltiesRoot: userPenaltiesResult });
                }
            }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
            });
    }

    search(startDate, endDate) {
        const start = moment(startDate).format('YYYY-MM-DD').toString()
        const end = moment(endDate).format('YYYY-MM-DD').toString()
        this.setState({
            userBonuses: this.filterBonus(this.state.userBonusesRoot, start, end),
            userPenalties: this.filterPenalties(this.state.userPenaltiesRoot, start, end)
        });
    }
    filterBonus(bonuses, startDate, endDate) {
        return bonuses && bonuses.length > 0 ?
        bonuses.filter(bonus => Date.parse(moment(bonus.effective_date).format('YYYY-MM-DD').toString()) >= Date.parse(startDate) && Date.parse(bonus.effective_date) <= Date.parse(endDate))
        : []
    }

    filterPenalties(penalties, startDate, endDate) {
        return penalties && penalties.length > 0 ? penalties.filter(pen => Date.parse(moment(pen.effective_date).format('YYYY-MM-DD').toString()) >= Date.parse(startDate) && Date.parse(pen.effective_date) <= Date.parse(endDate)) : [];
    }

    render() {

        function isNotNull(input) {
            if (input !== undefined && input !== null && input !== 'null' && input !== '#' && input !== '') {
                return true;
            }
            return false;
        }

        const { t } = this.props;

        return (
            <div className="personal-info">
                <h1 className="h3 text-uppercase text-gray-800">{t("WorkingProcess")}</h1>
                <Tabs defaultActiveKey="LaborContract" id="uncontrolled-tab-example">
                    <Tab eventKey="LaborContract" title={t("LaborContract")}>
                        <Container fluid className="info-tab-content shadow">
                            {(this.state.userContract !== undefined && this.state.userContract.length > 0) ?
                                this.state.userContract.map((item, i) => {
                                    return <div key={i}>
                                        <Row className="info-label">
                                            <Col xs={12} md={6} lg={3}>
                                                {t("LaborContractNo")}
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                {t("LaborContractType")}
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                {t("StartDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                {t("EndDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                {t("PAndL")}
                                            </Col>
                                        </Row>
                                        <Row className="info-value">
                                            <Col xs={12} md={6} lg={3}>
                                                <p className="mb-0">&nbsp;{item.contract_number}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p className="mb-0">&nbsp;{item.contract_type}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p className="mb-0">&nbsp;{item.from_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p className="mb-0">&nbsp;{item.to_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                <p className="mb-0">&nbsp;{item.company_name}</p>
                                            </Col>
                                        </Row>
                                    </div>;
                                }) : t("NoDataFound")
                            }
                        </Container>
                    </Tab>
                    <Tab eventKey="BonusAndPenalty" title={t("BonusAndPenalty")}>
                        <Row>

                            <Container fluid className="p-0">
                                <div className="timesheet-section p-0 search-box">
                                    <WorkingProcessSearch clickSearch={this.search.bind(this)} />
                                </div>
                            </Container>
                            <Col>
                                <h4 className="pl-0 pt-0">{t("Awards")}</h4>
                            </Col>

                            {(this.state.userBonuses !== undefined && this.state.userBonuses.length > 0) ?
                                this.state.userBonuses.map((item, i) => {
                                    let bonusTitle = (item.merit ? 'Giấy khen | ' : '');
                                    bonusTitle += (item.merit_certificate ? 'Bằng khen | ' : '');
                                    bonusTitle += (item.cash ? 'Tiền mặt | ' : '');
                                    bonusTitle += (item.merit_and_cash ? 'Giấy khen & tiền mặt | ' : '');
                                    bonusTitle += (item.merit_and_cash_certificate ? 'Bằng khen & tiền mặt | ' : '');
                                    bonusTitle += (item.other_rewards ? 'Khác | ' : '');
                                    bonusTitle = bonusTitle.length > 3 ? bonusTitle.substring(0, bonusTitle.length - 3) : '';
                                    return <Container key={i} fluid className="info-tab-content shadow mb-3 pb-0">
                                        <form className="info-value pb-0"><div >
                                            <div className="form-row">
                                                <div className="form-group col-md-6 ">
                                                    <div className="info-label mb-2">{t("DecisionNo")}</div>
                                                    <p className="mb-0">{item.decision_number}&nbsp;</p>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <div className="info-label mb-2">{t("EffectiveDate")}</div>
                                                    <p className="mb-0">{moment(item.effective_date).format('DD/MM/YYYY').toString()}&nbsp;</p>
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <div className="info-label mb-2">{t("ReasonReward")}</div>
                                                    <p className="mb-0">{item.compliment_reason}&nbsp;</p>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <div className="info-label mb-2">{t("FormOfCompliment")}</div>
                                                    <p className="mb-0">
                                                        {bonusTitle}&nbsp;
                                                    </p>
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <div className="info-label mb-2">{t("AmountOfBonus")}</div>
                                                    <p className="mb-0">{item.bonus_amount ? item.bonus_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '0'} VND</p>
                                                </div>
                                            </div>
                                        </div>
                                        </form>
                                    </Container>;
                                }) : t("NoDataFound")
                            }

                        </Row>
                        <Row>
                            <Col>
                                <h4>{t("Penalties")}</h4>
                            </Col>
                            <>

                                {(this.state.userPenalties !== undefined && this.state.userPenalties.length > 0) ?
                                    this.state.userPenalties.map((item, i) => {
                                        let penaltiesTitle = (item.dimiss ? 'Sa thải | ' : '');
                                        penaltiesTitle += (item.removal_demotion ? 'Cách chức/ Hạ chức | ' : '');
                                        penaltiesTitle += (item.deduction_from_bonus ? 'Trừ thưởng YTCL công việc | ' : '');
                                        penaltiesTitle += (item.terminate_labour_contract ? 'Chấm dứt HĐLĐ | ' : '');
                                        penaltiesTitle += (item.compensation ? 'Bồi thường thiệt hại | ' : '');
                                        penaltiesTitle += (item.other ? 'Khác | ' : '');
                                        penaltiesTitle = penaltiesTitle.length > 3 ? penaltiesTitle.substring(0, penaltiesTitle.length - 3) : '';
                                        return <Container key={i} fluid className="info-tab-content shadow mb-3 pb-0">
                                            <form className="info-value pb-0">
                                                <div >
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <div className="info-label mb-2">{t("DecisionNo")}</div>
                                                            <p className="mb-0">{item.decision_number}&nbsp;</p>
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <div className="info-label mb-2">{t("EffectiveDate")}</div>
                                                            <p className="mb-0">{moment(item.effective_date).format('DD/MM/YYYY').toString()}</p>
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <div className="info-label mb-2">{t("ViolationGroup")}</div>
                                                            <p className="mb-0">{item.violation_group}&nbsp;</p>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-12">
                                                            <div className="info-label mb-2">{t("ReasonPenalty")}</div>
                                                            <p className="mb-0">{item.disciplinary_reason}&nbsp;</p>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-12">
                                                            <div className="info-label mb-2">{t("TypeOfPenalty")}</div>
                                                            <p className="mb-0">
                                                                {penaltiesTitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-4">
                                                            <div className="info-label mb-2">{t("Amountpenalty")}</div>
                                                            <p className="mb-0">{item.bonus_deducted_amount ? item.bonus_deducted_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '0'} VND</p>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <div className="info-label mb-2">% trừ thưởng</div>
                                                            <p className="mb-0">{item.deduction_bonus_percent ? item.deduction_bonus_percent + '%' : ''} &nbsp;</p>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <div className="info-label mb-2">{t("CompensatedAmount")}</div>
                                                            <p className="mb-0">{item.compensation_amount ? item.compensation_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '0'} VND</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </Container>
                                    }) : t("NoDataFound")
                                }

                            </>
                        </Row>
                    </Tab>

                </Tabs>
            </div>
        )
    }
}

const WorkingProcess = withTranslation()(MyComponent)

export default function App() {
    return (
        <WorkingProcess />
    );
}

