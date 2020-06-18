import React from "react";
import { Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useApi, useFetcher, useGuardStore } from "../../modules";
import { useTranslation } from "react-i18next";
import NewsOnHome from './NewsOnHome';
import axios from 'axios';
 

function Dashboard(props) {
  
  const { t } = useTranslation();
  const guard = useGuardStore();
  const user = guard.getCurentUser();
  return (
    <div>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
      </div>
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