import React from "react";
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner"


const usePreload = () => {
  const guard = useGuardStore();
  const api = useApi();
  const [kpiData = undefined] = useFetcher({
    api: api.fetchKPI,
    autoRun: true
  }); 
  return kpiData;
};
function Dashboard(props) {

  const kpiData = usePreload();
  let sbCredit = {
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
    sbCredit = {
      totalHours: kpiData.data.learning_target_credits,
      perLearned: Math.round(kpiData.data.learning_earned_credits / kpiData.data.learning_target_credits),
      totalEarned: kpiData.data.learning_earned_credits
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
      labels: ['Chưa hoàn thành', 'Đã hoàn thành'],
      datasets: [{
        data: [100 - sbCredit.perLearned  , sbCredit.perLearned],
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
    grdGreen.addColorStop(0, "#91DD33");
    grdGreen.addColorStop(0.5, "#05BD29");
    grdGreen.addColorStop(1, "#91DD33");
    return {
      datasets: [{
        data: [100 - sbCredit.perLearned  , sbCredit.perLearned],
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
    const grdRed = ctx.createLinearGradient(400, 0, 0, 0);
    grdRed.addColorStop(0, "#FD5D11");
    grdRed.addColorStop(0.5, "#BC2B04");
    grdRed.addColorStop(1, "#FD5D11");
    return {
      datasets: [{
        data: [100 - sbCredit.perLearned  , sbCredit.perLearned],
        title: {
          display: true
        },
        backgroundColor: [
          grdRed,
          '#F4F3F8'
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
        <h1 className="h3 mb-0 text-gray-800">Chỉ tiêu đào tạo / Học tập</h1>
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
                <p className="mb-2">Tổng số tín chỉ yêu cầu</p>
                <strong>{sbCredit.totalHours} tín chỉ / năm</strong>
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
                <p className="mb-2">Hoàn thành tín chỉ</p>
                <strong>{sbCredit.totalEarned}/{sbCredit.totalHours}</strong>
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
                <p className="mb-2">Chưa hoàn thành tín chỉ</p>
                <strong>{sbCredit.totalHours - sbCredit.totalEarned}/{sbCredit.totalHours}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </div >
  );
}

export default Dashboard;