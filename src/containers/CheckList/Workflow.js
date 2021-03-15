import React from "react";
import { Card, Button, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { useTranslation } from "react-i18next"


function Create(props) {
    const { t } = useTranslation()
    return (
        <>
            <Card className="shadow mb-4">
                <Card.Header className="py-3">
                    <h6 className="m-0 font-weight-bold text-primary">{t("CheckList")}</h6>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <table className="table table-checklist" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th width={'50px'}>{t("NumberOrder")}</th>
                                    <th width={'60%'}>{t("Task")}</th>
                                    <th>Người phụ trách</th>
                                    <th></th>
                                    <th>{t("Confirm")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="odd-tr">
                                    <td rowSpan="3">
                                        <input type="checkbox" />
                                    </td>
                                    <td rowSpan="3">
                                        1
                                    </td>
                                    <td rowSpan="3">
                                        <h4 className="mr-1">Kiểm tra doanh thu buồng phòng
                                        <OverlayTrigger overlay={<Tooltip>Lịch sử phê duyệt</Tooltip>} >
                                                <Button variant="link" size="sm" className="mr-1"><i className="fa fa-history"></i></Button>
                                            </OverlayTrigger></h4>
                                        <p>
                                            - Đối với kỳ BCTC tháng: toàn bộ phần doanh thu 15 đêm nghỉ miễn phí đối soát, chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng<br />
                                            - Đối chiếu các bút toán interface giữa opera và SAP để đảm bảo doanh thu giữa 2 hệ thống đầy đủ, chính xác<br />
                                            - Đối với tháng 12, đối soát lần 1, xuất hóa đơn, ghi nhận doanh thu vào 28/12,  tạm tính doanh thu, chi phí 15 đêm nghỉ miễn phí nội bộ đến ngày 31/12 chốt doanh thu năm tại ngày T+2 đối với các khách chưa check out
                                        </p>
                                    </td>
                                    <td>Nguyễn Văn A<br /><Badge variant="secondary">Kế toán cơ sở</Badge></td>
                                    <td></td>
                                    <td>
                                        Đã hoàn thành
                                        <OverlayTrigger overlay={<Tooltip>Chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng</Tooltip>} >
                                            <Button variant="link" size="sm"><i className="fa fa-info-circle" ></i> Ý kiến</Button>
                                        </OverlayTrigger><br />
                                        <span className="text-xs">2019-08-30 15:14:33</span>
                                    </td>
                                </tr>
                                <tr className="odd-tr">
                                    <td>Nguyễn Văn B<br /><Badge variant="secondary">Kế toán sơ cở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>
                                        <Button variant="danger" size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>
                                <tr className="odd-tr">
                                    <td>Nguyễn Văn C<br /><Badge variant="secondary">Kế toán sơ lở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" disabled size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>

                                        <Button variant="danger" disabled size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>

                                <tr>
                                    <td rowSpan="3">
                                        <input type="checkbox" />
                                    </td>
                                    <td rowSpan="3">
                                        2
                                    </td>
                                    <td rowSpan="3">
                                    <h4 className="mr-1">Kiểm tra doanh thu buồng phòng
                                        <OverlayTrigger overlay={<Tooltip>Lịch sử phê duyệt</Tooltip>} >
                                                <Button variant="link" size="sm" className="mr-1"><i className="fa fa-history"></i></Button>
                                            </OverlayTrigger></h4>
                                        <p>
                                            - Đối với kỳ BCTC tháng: toàn bộ phần doanh thu 15 đêm nghỉ miễn phí đối soát, chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng<br />
                                            - Đối chiếu các bút toán interface giữa opera và SAP để đảm bảo doanh thu giữa 2 hệ thống đầy đủ, chính xác<br />
                                            - Đối với tháng 12, đối soát lần 1, xuất hóa đơn, ghi nhận doanh thu vào 28/12,  tạm tính doanh thu, chi phí 15 đêm nghỉ miễn phí nội bộ đến ngày 31/12 chốt doanh thu năm tại ngày T+2 đối với các khách chưa check out
                                        </p>
                                    </td>
                                    <td>Nguyễn Văn A<br /><Badge variant="secondary">Kế toán cơ sở</Badge></td>
                                    <td></td>
                                    <td>
                                        Đã hoàn thành
                                        <OverlayTrigger overlay={<Tooltip>Chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng</Tooltip>} >
                                            <Button variant="link"><i className="fa fa-info-circle" ></i></Button>
                                        </OverlayTrigger><br />
                                        <span className="text-xs">2019-08-30 15:14:33</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nguyễn Văn B<br /><Badge variant="secondary">Kế toán sơ cở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>
                                        <Button variant="danger" size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>
                                <tr>
                                    <td>Nguyễn Văn C<br /><Badge variant="secondary">Kế toán sơ lở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" disabled size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>

                                        <Button variant="danger" disabled size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>

                                <tr className="odd-tr">
                                    <td rowSpan="3">
                                        <input type="checkbox" />
                                    </td>
                                    <td rowSpan="3">
                                        3
                                    </td>
                                    <td rowSpan="3">
                                    <h4 className="mr-1">Kiểm tra doanh thu buồng phòng
                                        <OverlayTrigger overlay={<Tooltip>Lịch sử phê duyệt</Tooltip>} >
                                                <Button variant="link" size="sm" className="mr-1"><i className="fa fa-history"></i></Button>
                                            </OverlayTrigger></h4>
                                        <p>
                                            - Đối với kỳ BCTC tháng: toàn bộ phần doanh thu 15 đêm nghỉ miễn phí đối soát, chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng<br />
                                            - Đối chiếu các bút toán interface giữa opera và SAP để đảm bảo doanh thu giữa 2 hệ thống đầy đủ, chính xác<br />
                                            - Đối với tháng 12, đối soát lần 1, xuất hóa đơn, ghi nhận doanh thu vào 28/12,  tạm tính doanh thu, chi phí 15 đêm nghỉ miễn phí nội bộ đến ngày 31/12 chốt doanh thu năm tại ngày T+2 đối với các khách chưa check out
                                        </p>
                                    </td>
                                    <td>Nguyễn Văn A<br /><Badge variant="secondary">Kế toán cơ sở</Badge></td>
                                    <td></td>
                                    <td>
                                        Đã hoàn thành
                                        <OverlayTrigger overlay={<Tooltip>Chốt số, suất hóa đơn và nghi nhận vào ngày 28 hàng tháng</Tooltip>} >
                                            <Button variant="link"><i className="fa fa-info-circle" ></i></Button>
                                        </OverlayTrigger><br />
                                        <span className="text-xs">2019-08-30 15:14:33</span>
                                    </td>
                                </tr>
                                <tr className="odd-tr">
                                    <td>Nguyễn Văn B<br /><Badge variant="secondary">Kế toán sơ cở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>
                                        <Button variant="danger" size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>
                                <tr className="odd-tr">
                                    <td>Nguyễn Văn C<br /><Badge variant="secondary">Kế toán sơ lở</Badge></td>
                                    <td></td>
                                    <td>
                                        <OverlayTrigger overlay={<Tooltip>Approve</Tooltip>} >
                                            <Button variant="primary" disabled size="sm" className="mr-1"><i className="fa fa-check"></i></Button>
                                        </OverlayTrigger>

                                        <Button variant="danger" disabled size="sm"><i className="fa  fa-ban"></i></Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}
export default Create;