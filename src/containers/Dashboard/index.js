import React from "react";
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import { useTranslation } from "react-i18next";


const usePreload = (params) => {
  const guard = useGuardStore();
  const api = useApi();
  const [sabaCredit = undefined] = useFetcher({
    api: api.fetchSabaCredit,
    autoRun: true,
    params: params
  });
  return sabaCredit;
};
function Dashboard(props) {
  const { t } = useTranslation();
  const sabaCredit = usePreload([`trangdt28@vingroup.net`]);
  let sbCredit = {
    totalHours: 0,
    perLearned: 100
  };
  if (sabaCredit && sabaCredit.data) {
    sbCredit = {
      totalHours: sabaCredit.data.learning_target_credits,
      perLearned: Math.round(sabaCredit.data.learning_earned_credits / sabaCredit.data.learning_target_credits)
    };
  }
  const sabaCreditData = (canvas) => {
    const ctx = canvas.getContext("2d")
    const grdGreen = ctx.createLinearGradient(500, 0, 100, 0);
    grdGreen.addColorStop(0, "#91DD33");
    grdGreen.addColorStop(0.5, "#05BD29");
    grdGreen.addColorStop(1, "#91DD33");

    const grdRed = ctx.createLinearGradient(400, 0, 0, 0);
    grdRed.addColorStop(0, "#FD5D11");
    grdRed.addColorStop(0.5, "#BC2B04");
    grdRed.addColorStop(1, "#FD5D11");

    return {
      labels: [t("Status_NotDoneYet"), t("Status_Done")],
      datasets: [{
        data: [100 - sbCredit.perLearned, sbCredit.perLearned],
        title: {
          display: true
        },
        backgroundColor: [
          grdRed,
          grdGreen
        ]
      }]
    }
  }

  const annualLeaveData = (canvas) => {
    const ctx = canvas.getContext("2d")
    const grdGreen = ctx.createLinearGradient(500, 0, 100, 0);
    grdGreen.addColorStop(0, "#FF428D");
    grdGreen.addColorStop(0.5, "#FFAE46");
    grdGreen.addColorStop(1, "#FF428D");
    return {
      labels: [t("Status_NotUsedYet"), t("Status_Used")],
      datasets: [{
        data: [25, 75],
        title: {
          display: true
        },
        backgroundColor: [
          '#F4F3F8',
          grdGreen
        ]
      }]
    }
  }

  const vpNightBenefit = (canvas) => {
    const ctx = canvas.getContext("2d")
    const grdGreen = ctx.createLinearGradient(500, 0, 100, 0);
    grdGreen.addColorStop(0, "#0169C2");
    grdGreen.addColorStop(0.5, "#7ED4EF");
    grdGreen.addColorStop(1, "#0169C2");
    return {
      labels: [t("Status_NotUsedYet"), t("Status_Used")],
      datasets: [{
        data: [25, 75],
        title: {
          display: true
        },
        backgroundColor: [
          '#F4F3F8',
          grdGreen
        ]
      }]
    }
  }

  const chartOption = {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    pieceLabel: {
      render: function (args) {
        return args.value + '%';
      },
      fontSize: 15,
      fontColor: '#fff'
    },
    rotation: -45
  }

  return (
    <div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>
      <Row className="summary-chart">
        <Col xl={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="chart-pie pt-4">
                <Doughnut
                  data={sabaCreditData}
                  options={chartOption}
                />
              </div>
              <div className="text-center mt-3">
                <p className="mb-2">{t("LearningCreditSuccessful")}</p>
                <strong>{sbCredit.totalHours} {t("Hour")} / {t("Year")}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="chart-pie pt-4">
                <Doughnut
                  data={annualLeaveData}
                  options={chartOption}
                />
              </div>
              <div className="text-center mt-3">
                <p className="mb-2">{t("AnnualLeaveDateBeUsed")}</p>
                <strong>7/12 {t("Day")}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="chart-pie pt-4">
                <Doughnut
                  data={vpNightBenefit}
                  options={chartOption}
                />
              </div>
              <div className="text-center mt-3">
                <p className="mb-2">{t("VPNightBenefitBeUsed")}</p>
                <strong>1/3 {t("Night")}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          <Card className="mb-4 news-home">
            <Card.Body className="card-body pd-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <span className="db-card-header color-blue"><i className="fas fa-fw fa-clipboard"></i> {t("TermPolicy")}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>What is Lorem Ipsum?</Card.Title>
                  <Card.Text>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Where does it come from?</Card.Title>
                  <Card.Text>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Why do we use it?</Card.Title>
                  <Card.Text>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="mb-4 news-home">
            <Card.Body className="card-body pd-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <span className="db-card-header color-pink"><i className="fas fa-fw fa-bullhorn"></i>  {t("CompanyAnnouncement")}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Lorem Ipsum Generator</Card.Title>
                  <Card.Text>
                    Generate Lorem Ipsum placeholder text. Select the number of characters, words, sentences or paragraphs, and hit generate!
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Pellentesque sit amet porttitor eget dolor morbi non</Card.Title>
                  <Card.Text>
                    Duis convallis convallis tellus id. Nunc lobortis mattis aliquam faucibus purus in. Lacinia quis vel eros donec ac odio tempor. Posuere morbi leo urna molestie at elementum eu facilisis.
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Et ligula ullamcorper malesuada proin libero nunc consequat interdum varius</Card.Title>
                  <Card.Text>
                    Elementum facilisis leo vel fringilla. A iaculis at erat pellentesque adipiscing commodo. Rhoncus urna neque viverra justo nec ultrices dui. Arcu cursus vitae congue mauris rhoncus aenean vel elit
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div >
  );
}

export default Dashboard;