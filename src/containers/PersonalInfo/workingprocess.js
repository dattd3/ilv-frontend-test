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

        axios.get(`${process.env.REACT_APP_REQUEST_URL}user/bonuses?perno=${localStorage.getItem('employeeNo')}`)
              .then(res => {
                if (res && res.data && res.data.data) {
                    this.setState({ userBonuses: res.data.data, userBonusesRoot: res.data.data });
                }
              }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
              });
        axios.get(`${process.env.REACT_APP_REQUEST_URL}user/penalties?perno=${localStorage.getItem('employeeNo')}`)
              .then(res => {
                if (res && res.data && res.data.data) {
                    let userPenaltiesResult = res.data.data;
                    this.setState({ userPenalties: userPenaltiesResult, userPenaltiesRoot : userPenaltiesResult });
                }
              }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
              });
    }
    
    search (startDate, endDate) {
        const start = moment(startDate).format('YYYY-MM-DD').toString()
        const end = moment(endDate).format('YYYY-MM-DD').toString()
        this.setState({
            userBonuses: this.filterBonus(this.state.userBonusesRoot, start, end),
            userPenalties: this.filterPenalties(this.state.userPenaltiesRoot,start, end)
        });
    }
    filterBonus (bonuses, startDate, endDate) {
        debugger;
        return  bonuses.filter(bonus => Date.parse(moment(bonus.effective_date).format('YYYY-MM-DD').toString()) >= Date.parse(startDate) && Date.parse(bonus.effective_date) <= Date.parse(endDate));
    }
    
    filterPenalties (penalties, startDate, endDate) {
        return  penalties.filter(pen => Date.parse(moment(pen.effective_date).format('YYYY-MM-DD').toString()) >= Date.parse(startDate) && Date.parse(pen.effective_date) <= Date.parse(endDate));
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
                                                {t("LaborContractStartDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                {t("LaborContractEndDate")}
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                {t("LaborContractIssuesBy")}
                                            </Col>
                                        </Row>
                                        <Row className="info-value">
                                            <Col xs={12} md={6} lg={3}>
                                                <p>&nbsp;{item.contract_number}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p>&nbsp;{item.contract_type}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p>&nbsp;{item.from_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={2}>
                                                <p>&nbsp;{item.to_time}</p>
                                            </Col>
                                            <Col xs={12} md={6} lg={3}>
                                                <p>&nbsp;{item.company_name}</p>
                                            </Col>
                                        </Row>
                                    </div>;
                                }) : t("NoDataFound")
                            }
                        </Container>
                    </Tab>
                    <Tab eventKey="BonusAndPenalty" title={t("BonusAndPenalty")}>
                        <Row>
                            
                            <Container fluid className="mb-3 p-0">
                                <div className="timesheet-section p-0 search-box">
                                    <WorkingProcessSearch clickSearch={this.search.bind(this)}/>
                                </div>
                            </Container>
                            <Col>
                                <h4>QUYẾT ĐỊNH KHEN THƯỞNG</h4>
                            </Col>
                            <Container fluid className="info-tab-content shadow">
                                <form className="info-value">
                                    {(this.state.userBonuses !== undefined && this.state.userBonuses.length > 0) ?
                                        this.state.userBonuses.map((item, i) => {
                                            let bonusTitle = (item.merit ? 'Giấy khen | ' : '');
                                            bonusTitle += (item.merit_certificate ? 'Bằng khen | ' : '');
                                            bonusTitle += (item.cash ? 'Tiền mặt | ' : '');
                                            bonusTitle += (item.merit_and_cash ? 'Giấy khen & tiền mặt | ' : '');
                                            bonusTitle += (item.merit_and_cash_certificate ? 'Bằng khen & tiền mặt | ' : '');
                                            bonusTitle += (item.other_rewards ? 'Khác | ' : '');    
                                            bonusTitle = bonusTitle.substring(0, bonusTitle.length - 3);  
                                            return <div key={i}>
                                                <div className="form-row">
                                                      <div className="form-group col-md-6 col-lg-2">
                                                        <div className="info-label mb-2">Số quyết định</div>
                                                        <p>{item.decision_number}&nbsp;</p>
                                                      </div>
                                                      <div className="form-group col-md-6 col-lg-2">
                                                        <div className="info-label mb-2">Ngày hiệu lực</div>
                                                        <p>{moment(item.effective_date).format('DD/MM/YYYY').toString()}&nbsp;</p>
                                                      </div>
                                                      <div className="form-group col-md-6 col-lg-3">
                                                        <div className="info-label mb-2">Lý do khen thưởng</div>
                                                        <p>{item.compliment_reason}&nbsp;</p>
                                                      </div>
                                                      <div className="form-group col-md-6 col-lg-3">
                                                        <div className="info-label mb-2">Hình thức khen thưởng</div>
                                                        <p>
                                                            {bonusTitle}&nbsp;
                                                        </p>
                                                      </div>
                                                      <div className="form-group col-md-6 col-lg-2">
                                                        <div className="info-label mb-2">Số tiền khen thưởng</div>
                                                        <p>{item.bonus_amount ? item.bonus_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '.'} VND</p>
                                                      </div>
                                                    </div>
                                                </div>;
                                        }) : t("NoDataFound")
                                    }
                                </form>
                            </Container>
                        </Row>
                        <Row>
                            <Col>
                                <h4>QUYẾT ĐỊNH XỬ LÝ VI PHẠM</h4>
                            </Col>
                            <Container fluid className="info-tab-content shadow">
                                <form className="info-value">
                                    {(this.state.userPenalties !== undefined && this.state.userPenalties.length > 0)  ?
                                        this.state.userPenalties.map((item, i) => {
                                            let penaltiesTitle = (item.dimiss ? 'Sa thải | ' : '');
                                                penaltiesTitle += (item.removal_demotion ? 'Cách chức/ Hạ chức | ' : '');
                                                penaltiesTitle += (item.deduction_from_bonus ? 'Trừ thưởng YTCL công việc | ' : '');
                                                penaltiesTitle += (item.terminate_labour_contract ? 'Chấm dứt HĐLĐ | ' : '');
                                                penaltiesTitle += (item.compensation ? 'Bồi thường thiệt hại | ' : '');
                                                penaltiesTitle += (item.other ? 'Khác | ' : '');    
                                                penaltiesTitle = penaltiesTitle.substring(0, penaltiesTitle.length - 3);  
                                            return  <div key={i}>
                                                        <div className="form-row">
                                                          <div className="form-group col-md-6 col-lg-2">
                                                            <div className="info-label mb-2">Số quyết định</div>
                                                            <p>{item.decision_number}&nbsp;</p>
                                                          </div>
                                                          <div className="form-group col-md-6 col-lg-2">
                                                            <div className="info-label mb-2">Ngày hiệu lực</div>
                                                            <p>{moment(item.effective_date).format('DD/MM/YYYY').toString() }</p>
                                                          </div>
                                                          <div className="form-group col-md-6 col-lg-4">
                                                            <div className="info-label mb-2">Nhóm lỗi</div>
                                                            <p>{item.violation_group}&nbsp;</p>
                                                          </div>
                                                          <div className="form-group col-md-6 col-lg-4">
                                                            <div className="info-label mb-2">Lỗi vi phạm</div>
                                                            <p>{item.disciplinary_reason}&nbsp;</p>
                                                          </div>
                                                        </div>
                                                        <div className="form-row">
                                                        <div className="form-group col-12">
                                                            <div className="info-label mb-2">Hình thức xử lý vi phạm</div>
                                                            <p>
                                                                {penaltiesTitle}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        <div className="form-row">
                                                          <div className="form-group col-md-4 col-lg-2">
                                                            <div className="info-label mb-2">Số tiền kỷ luật</div>
                                                            <p>{item.bonus_deducted_amount ? item.bonus_deducted_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '0'} VND</p>
                                                          </div>
                                                          <div className="form-group col-md-4 col-lg-2">
                                                            <div className="info-label mb-2">Số tiền bồi thường</div>
                                                            <p>{item.compensation_amount ? item.compensation_amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '0'} VND</p>
                                                          </div>
                                                          <div className="form-group col-md-4 col-lg-2">
                                                            <div className="info-label mb-2">% trừ thưởng</div>
                                                             <p>{item.deduction_bonus_percent} &nbsp;</p> 
                                                          </div>
                                                        </div>
                                                        <hr />
                                                    </div>
                                        }) : t("NoDataFound")
                                    }
                                </form>
                            </Container>
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

