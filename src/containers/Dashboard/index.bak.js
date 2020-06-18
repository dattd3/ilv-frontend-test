import React from "react";
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';
import { useTranslation } from "react-i18next";
import NewsOnHome from './NewsOnHome';
import axios from 'axios';

const usePreload = (params) => {
  const api = useApi();
  const [sabaCredit = undefined, err] = useFetcher({
    api: api.fetchSabaCredit,
    autoRun: true,
    params: params
  });
  return sabaCredit;
};

function Dashboard(props) {
  
  const { t } = useTranslation();
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  const sabaCredit = usePreload([user.email]);
  let sbCredit = {
    totalHours: 0,
    perLearned: 100
  };
  if (sabaCredit && sabaCredit.data) {
    if (sabaCredit.data.learning_target_credits != 0) {
      sbCredit = {
        totalHours: sabaCredit.data.learning_target_credits,
        perLearned: Math.round(sabaCredit.data.learning_earned_credits / sabaCredit.data.learning_target_credits)
      };
    } else {
      sbCredit = {
        totalHours: 0,
        perLearned: 100
      };
    }

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

  /* Lấy thông tin ngày phép */
  let config = {
      headers: {            
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
      }
    }
       
  var userAbsenceNumberUsed = 0;
  var userAbsenceNumberTotal = 12;
  var userAbsencePercentUsed = parseInt((userAbsenceNumberUsed/userAbsenceNumberTotal)*100);
           
  axios.get(process.env.REACT_APP_MULE_HOST_HCM + 'user/absence', config)
    .then(res => {                        
      if (res && res.data && res.data.data) {  
        const userAbsence = res.data.data[0];
        if(userAbsence && userAbsence.number_used != null) {
          userAbsenceNumberUsed = userAbsence.number_used 
        }

        if(userAbsence && userAbsence.number_available != null) {
          const userAbsenceNumberAvailable = userAbsence.number_available 
          userAbsenceNumberTotal = userAbsenceNumberUsed + userAbsenceNumberAvailable;          
        }

        userAbsencePercentUsed = parseInt((userAbsenceNumberUsed/userAbsenceNumberTotal)*100);
      }                   
    }).catch(error => console.log("Call API error:",error)); 

  const annualLeaveData = (canvas) => {
    const ctx = canvas.getContext("2d")
    const grdGreen = ctx.createLinearGradient(500, 0, 100, 0);
    grdGreen.addColorStop(0, "#FF428D");
    grdGreen.addColorStop(0.5, "#FFAE46");
    grdGreen.addColorStop(1, "#FF428D");
    return {
      labels: [t("Status_NotUsedYet"), t("Status_Used")],
      datasets: [{
        data: [userAbsencePercentUsed, 100],
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
        data: [0, 100],
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
                <strong>{userAbsenceNumberUsed}/{userAbsenceNumberTotal} {t("Day")}</strong>
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
                <strong>N/A {t("Night")}</strong>
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
                  <span className="db-card-header color-blue"><i className="fas icon-term_policy"></i> {t("TermPolicy")}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Thông báo quyết định về việc ban hành chính sách thưởng khoán cho Nhân viên buồng phòng và phụ cấp làm việc ca gãy cho Nhân viên phục vụ</Card.Title>
                  <Card.Text className="temp-class">Bộ phận phát hành Văn phòng Công ty Cổ phần Vinpearl</Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 1 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Thông báo quyết định về việc bố trí nghỉ Tết Dương lịch, Tết Nguyên Đán năm 2020 và thời hạn chi trả các loại lương, thưởng, phúc lợi năm 2019</Card.Title>
                  <Card.Text className="temp-class">Bộ phận phát hành Văn phòng Công ty Cổ phần Vinpearl</Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Thông báo quyết định khen thưởng “Gương người tốt việc tốt” cho Nhân viên Cứu hộ tại Vinpearl Condotel Empire Nha Trang</Card.Title>
                  <Card.Text className="temp-class">Bộ phận phát hành Văn phòng Công ty Cổ phần Vinpearl</Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 5 days ago</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <NewsOnHome />
        </Col>
      </Row>
    </div >
  );
}

export default Dashboard;