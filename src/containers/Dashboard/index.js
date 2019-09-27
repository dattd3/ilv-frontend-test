import React from "react";
import Chart from 'react-google-charts';
import { Row, Col, Card, ListGroup } from 'react-bootstrap'; import {
  useApi,
  useFetcher,
  useGuardStore
} from "../../modules";


const usePreload = () => {
  const guard = useGuardStore();

  const api = useApi();
  const [sabaCredit = {}] = useFetcher({
    api: api.fetchSabaCredit,
    autoRun: true
  });
  return sabaCredit;
};

function Dashboard(props) {
  const sabaCredit = usePreload();

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
                <Chart
                  chartType="PieChart"
                  loader={<div>Loading...</div>}
                  data={[
                    ['', ''],
                    ['Chưa hoàn thành', 25],
                    ['Đã hoàn thành', 75]
                  ]}
                  options={{
                    pieHole: 0.5,
                    legend: 'none',
                    slices: {
                      0: { color: '#BD2B04' },
                      1: { color: '#05BD29' },
                    },
                    chartArea: { left: 0, top: 0, width: "100%", height: "100%" }
                  }}
                />
              </div>
              <div className="text-center">
                <p className="mb-2">Tín chỉ học tập đã hoàn thành</p>
                <strong>23 giờ / năm</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="chart-pie pt-4">
                <Chart
                  chartType="PieChart"
                  loader={<div>Loading...</div>}
                  data={[
                    ['Task', 'Hours per Day'],
                    ['Chưa hoàn thành', 25],
                    ['Đã hoàn thành', 75]
                  ]}
                  options={{
                    pieHole: 0.5,
                    legend: 'none',
                    slices: {
                      0: { color: '#F4F3F8' },
                      1: { color: '#7EBBFC' },
                    },
                    chartArea: { left: 0, top: 0, width: "100%", height: "100%" }
                  }}
                />
              </div>
              <div className="text-center">
                <p className="mb-2">Ngàp phép đã sử dụng</p>
                <strong>7/12 ngày</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} className="mb-4">
          <Card>
            <Card.Body>
              <div className="chart-pie pt-4">
                <Chart
                  chartType="PieChart"
                  loader={<div>Loading...</div>}
                  data={[
                    ['Task', 'Hours per Day'],
                    ['Chưa hoàn thành', 25],
                    ['Đã hoàn thành', 75]
                  ]}
                  options={{
                    pieHole: 0.5,
                    legend: 'none',
                    slices: {
                      0: { color: '#F4F3F8' },
                      1: { color: '#FFC18B' },
                    },
                    chartArea: { left: 0, top: 0, width: "100%", height: "100%" }
                  }}
                />
              </div>
              <div className="text-center">
                <p className="mb-2">Đêm nghỉ dưỡng đã sử dụng</p>
                <strong>1/3 đêm</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4 news-home">
            <Card.Body className="card-body pd-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <span className="db-card-header color-blue"><i className="fas fa-fw fa-list"></i> Quy định / quy chế</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                  </Card.Text>
                  <span className="small"><i className="far fa-clock"></i> 2 days ago</span>
                </ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-4 news-home">
            <Card.Body className="card-body pd-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <span className="db-card-header color-pink"><i className="fas fa-fw fa-bullhorn"></i> Thông tin tập đoàn</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                  </Card.Text>
                </ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div >
  );
}

export default Dashboard;