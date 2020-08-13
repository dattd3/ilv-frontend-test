import React from "react";
import { Col, Row } from 'react-bootstrap';

function OtherResultComponent(props) {
    const monthData = [
        {value: 1, label: "Tháng 1 / 2020"},
        {value: 2, label: "Tháng 2 / 2020"},
        {value: 3, label: "Tháng 3 / 2020"}
    ]

    return (
        <div className="other-result-section">
            <table className="workday-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="14">a. thông tin công</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="second-title">
                        <td className="title title-second kcc" colSpan="2">Kỳ chấm công</td>
                        <td className="title title-second" colSpan="5">Chi tiết thu nhập</td>
                        <td className="title title-second cc" rowSpan="2">Công chuẩn</td>
                        <td className="title title-second" colSpan="4">Chi tiết ngày công</td>
                        <td className="title same-width title-second tchl" rowSpan="2">Tổng công hưởng lương</td>
                        <td className="title same-width title-second sgcd" rowSpan="2">Số giờ công đêm</td>
                    </tr>
                    <tr className="three-title">
                        <td className="title same-width title-second tn">Từ ngày</td>
                        <td className="title same-width title-second dn">Đến ngày</td>
                        <td className="title same-width title-second lcb">Lương cơ bản</td>
                        <td className="title same-width title-second">Thưởng YTCLCV</td>
                        <td className="title same-width title-second ttng">Thưởng tay nghề</td>
                        <td className="title same-width title-second">Thưởng SC BQ/Thưởng Caddie fee (20 Fee 18 hố)</td>
                        <td className="title same-width title-second ttn">Tổng thu nhập</td>
                        <td className="title same-width title-second clvtt">Công làm việc thực tế</td>
                        <td className="title same-width title-second snnchl">Số ngày nghỉ có hưởng lương</td>
                        <td className="title same-width title-second cnv">Công ngừng việc</td>
                        <td className="title same-width title-second snnkhl">Số ngày nghỉ không hưởng lương</td>
                    </tr>
                    <tr className="data-row">
                        <td className="same-width tn">aaaaaa</td>
                        <td className="same-width dn">aaaaaa</td>
                        <td className="same-width lcb">aaaaaa</td>
                        <td className="same-width">aaaaaa</td>
                        <td className="same-width ttng">aaaaaa</td>
                        <td className="same-width">aaaaaa</td>
                        <td className="same-width ttn">1,000,000,000</td>
                        <td className="same-width cc">aaaaaa</td>
                        <td className="same-width clvtt">aaaaaa</td>
                        <td className="same-width snnchl">aaaaaa</td>
                        <td className="same-width clvtt">aaaaaa</td>
                        <td className="same-width snnkhl">aaaaaa</td>
                        <td className="same-width cnv">aaaaaa</td>
                        <td className="same-width sgcd">aaaaaa</td>
                    </tr>
                </tbody>
            </table>
            <div className="clear"></div>
            <table className="leave-days-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="4">b. thông tin ngày nghỉ phép, nghỉ bù</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title">Loại phép năm/phép bù</td>
                        <td className="same-width title">Tổng số ngày/giờ phát sinh</td>
                        <td className="same-width title">Số ngày/giờ nghỉ đã sử dụng/thanh toán</td>
                        <td className="same-width title">Số ngày/giờ nghỉ còn lại</td>
                    </tr>
                    <tr>
                        <td className="same-width">Phép năm (Ngày)</td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="same-width">OT quy bù (Giờ)</td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="same-width">OT thanh toán (Giờ)</td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                </tbody>
            </table>
            <div className="clear"></div>
            <table className="income-information-table">
                <thead>
                    <tr>
                        <th className="title top-title" colSpan="4">c. thông tin thu nhập</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="same-width title special color-black">Tên mục</td>
                        <td className="same-width title color-black">Tổng</td>
                        <td className="same-width title color-black">Chịu thuế</td>
                        <td className="same-width title color-black">Không chịu thuế</td>
                    </tr>
                    <tr className="root">
                        <td className="special bold color-black"><span className="root">I. CÁC KHOẢN PHÁT SINH TĂNG THU NHẬP = Sum(I.1 : I.3)</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr className="first">
                        <td className="special bold color-black"><span className="child-first">I.1 THU NHẬP CƠ BẢN = Sum(I.1.1 : I.1.3)</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr className="second">
                        <td className="special bold color-black"><span className="child-third">I.1.1 Lương cơ bản + Thưởng YTCLCV = Sum(I.1.1.1 : I.1.1.4)</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.1.1 Lương cơ bản</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.1.2 Thưởng YTCLCV</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.1.3 Thưởng tay nghề</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.1.4 Thưởng Service Charge/Thưởng Caddie Fee</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    {/* Row 2 */}
                    <tr className="second">
                        <td className="special bold color-black"><span className="child-third">I.1.2 Các loại phụ cấp lương (nếu có) = Sum(I.1.2.1 : I.1.2.4)</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.2.1 Phụ cấp chuyên môn/tay nghề</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.2.2 Phụ cấp kiêm nhiệm</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.3.3 Phụ cấp chức vụ</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                    <tr>
                        <td className="special"><span className="child-fourth">I.1.4.4 Phụ cấp nguy hiểm độc hại</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>

                    <tr className="second">
                        <td className="special bold color-black"><span className="child-third">I.1.3 Các khoản bổ sung khác (nếu có)</span></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                        <td className="same-width"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default OtherResultComponent;
