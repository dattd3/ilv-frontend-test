import React from "react";
import { Col, Row } from 'react-bootstrap';

function MainResultComponent(props) {
    const monthData = [
        {value: 1, label: "Tháng 1 / 2020"},
        {value: 2, label: "Tháng 2 / 2020"},
        {value: 3, label: "Tháng 3 / 2020"}
    ]

    return (
        <div className="main-result-section">
            <div className="block-title">
                <h4 className="title bold special">thông tin thu nhập tháng</h4>
                <h4 className="title">kỳ lương tháng 6/2020</h4>
            </div>
            <Row>
                <Col sm={6} className="column">
                    <ul className="column-item first-column">
                        <li><span className="label">Họ và tên:</span><span>Nguyễn Văn Cường</span></li>
                        <li><span className="label">Mã nhân viên:</span><span>00112233</span></li>
                        <li><span className="label">Cấp bậc thực tế:</span><span>Chuyên viên</span></li>
                        <li><span className="label">Chức danh:</span><span>Chuyên viên</span></li>
                        <li><span className="label">Số tài khoản:</span><span>0123456789</span></li>
                    </ul>
                </Col>
                <Col sm={6} className="column">
                    <ul className="column-item second-column">
                        <li><span className="label">Ngày bắt đầu làm việc:</span><span>05/08/2019</span></li>
                        <li><span className="label">Cấp bậc chức danh:</span><span>Chuyên viên</span></li>
                        <li><span className="label">Cấp hàm:</span><span>Chuyên viên</span></li>
                        <li><span className="label">Ban/Phòng/Bộ phận:</span><span>Nhóm Kỹ thuật CĐS</span></li>
                        <li><span className="label">Ngân hàng:</span><span>Ngân hàng Đầu tư và Phát triển Việt Nam</span></li>
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default MainResultComponent;
