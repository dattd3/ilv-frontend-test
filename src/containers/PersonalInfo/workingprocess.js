import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col, Tabs, Tab, Form } from 'react-bootstrap';
import moment from 'moment';
import map from '../map.config';

class MyComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userContract: {}
        };
    }

    componentDidMount() {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/contract`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let userContract = res.data.data;
                    this.setState({ userContract: userContract });
                }
            }).catch(error => {
                localStorage.clear();
                window.location.href = map.Login;
            });

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
                        <Container fluid className="info-tab-content">
                            {(this.state.userContract !== undefined && this.state.userContract.length > 0) ?
                                this.state.userContract.map((item, i) => {
                                    return <div key={i}>
                                        <Row className="info-label">
                                            <Col xs={12} md={6} lg={3}>
                                                {t("LaborContractNo")}
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                {t("LaborContractType")}
                                            </Col>
                                            <Col xs={12} md={6} lg={1}>
                                                {t("LaborContractStartDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={1}>
                                                {t("LaborContractEndDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={4}>
                                                {t("LaborContractIssuesBy")}
                                            </Col>
                                        </Row>
                                        <Row className="info-value">
                                            <Col xs={12} md={6} lg={3}>
                                                <p>&nbsp;{item.contract_number}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                <p>&nbsp;{item.contract_type}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={1}>
                                                <p>&nbsp;{item.from_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={1}>
                                                <p>&nbsp;{item.to_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={4}>
                                                <p>&nbsp;{item.company_name}</p>
                                            </Col>
                                        </Row>
                                    </div>;
                                }) : t("NoDataFound")
                            }
                        </Container>
                    </Tab>
                    {/* <Tab eventKey="CommendationViolation" title={t("CommendationViolation")}>
                        <Row>
                            <Col>
                                <h4>{t("Felicitation")}</h4>
                                <div className="info-tab-content">
                                    {t("NoDataFound")}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h4>{t("Discipline")}</h4>
                                <div className="info-tab-content">
                                    {t("NoDataFound")}
                                </div>
                            </Col>
                        </Row>
                    </Tab> */}
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

