import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { Table, Row, Col, Form } from 'react-bootstrap';
import CustomPaging from '../../../components/Common/CustomPaging';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import moment from 'moment';

const usePreload = (params) => {
    const api = useApi();
    const [sabaEnrollments = [], err] = useFetcher({
        api: api.fetchSabaIntruction,
        autoRun: true,
        params: params
    });
    if (err) {
        sabaEnrollments.err = true;
    }
    return sabaEnrollments;
};

function OnGoingClass(props) {
    document.title = `Learning`;
    const [pageIndex, SetPageIndex] = useState(1);
    const [pageSize, SetPageSize] = useState(5);
    const sabaEnrollments = usePreload([`emplo000000000008166`, 100, pageIndex, pageSize]);

    const [isOnGoing, SetIsOnGoing] = useState(false);

    function onChangePage(page) {
        SetPageIndex(page);
    }

    function onChangePageSize(evt) {
        SetPageSize(evt.target.value);
        SetPageIndex(1);
    }

    try {
        if (sabaEnrollments && sabaEnrollments.data.classes.length > 0) {
            SetIsOnGoing(true);
        }
    } catch { }

    return (
        <>
            <div className="card mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-500 text-uppercase text-color-vp">Lớp dạy đang tiến hành</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>tên lớp</th>
                                    <th>ngày dạy</th>
                                    <th>số tín chỉ của lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isOnGoing ?
                                        sabaEnrollments.data.classes.map(function (obj, i) {
                                            return (
                                                <tr key={obj.id}>
                                                    <td>{i + 1}</td>
                                                    <td>{obj.name}</td>
                                                    <td>{moment(obj.start_date).format('DD/MM/YYYY')}</td>
                                                    <td>{obj.credits}</td>
                                                </tr>
                                            );
                                        })
                                        :
                                        (sabaEnrollments.length == 0
                                            ? <tr><td className='text-center p-3' colSpan='4'><LoadingSpinner /></td></tr>
                                            : <tr><td className='text-center p-3' colSpan='4'>Không tìm thấy dữ liệu</td></tr>)
                                }
                            </tbody>
                        </Table>
                    </div>
                    {
                        isOnGoing ?
                            <Row>
                                <Col className='total'>
                                    Tổng số: {sabaEnrollments.data.total} khoá học
                            </Col>
                                <Col className='paging'>
                                    <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={sabaEnrollments.data.total} />
                                </Col>
                                <Col>
                                    <Form.Control as="select" onChange={onChangePageSize} className='w-auto float-right'>
                                        <option value={5}>Hiển thị 5 lớp học</option>
                                        <option value={10}>Hiển thị 10 lớp học</option>
                                        <option value={15}>Hiển thị 15 lớp học</option>
                                    </Form.Control>
                                </Col>
                            </Row> : null
                    }
                </div>
            </div>
        </>
    );
}
export default OnGoingClass;