import React, { useState } from "react";
import { useApi, useFetcher } from "../../modules";
import { Table, Pagination, Row, Col, Form } from 'react-bootstrap';
import CustomPaging from '../../components/Common/CustomPaging';


const usePreload = (params) => {
    const api = useApi();
    const [sabaEnrollments = undefined, err] = useFetcher({
        api: api.fetchSabaEnrollments,
        autoRun: true,
        params: params
    });
    return sabaEnrollments;
};

function Learning(props) {
    const [pageIndex, SetPageIndex] = useState(1);
    const [pageSize, SetPageSize] = useState(5);
    document.title = `Learning`;
    const sabaEnrollments = usePreload([`quyennd9@vingroup.net`, pageIndex, pageSize]);

    const [isOnGoing, SetIsOnGoing] = useState(false);
    //const [isDone, SetIsDone] = useState(false);

    function onChangePage(page) {
        SetPageIndex(page);
    }

    function onChangePageSize(evt) {
        SetPageSize(evt.target.value);
        SetPageIndex(1);
    }
    console.log(sabaEnrollments);
    try {
        if (sabaEnrollments && sabaEnrollments.data.classes.length > 0) {
            SetIsOnGoing(true);
        }
    } catch { }



    return (
        <>
            <h1 className="h3 mb-2 text-gray-800">Learning</h1>
            <p className="mb-4">dat'z how we do</p>
            <div className="card mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-500 text-uppercase text-color-vp">Lớp học đang tiến hành</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>tên lớp học</th>
                                    <th>ngày vào học</th>
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
                                                    <td>{obj.start_date}</td>
                                                    <td>{obj.credits}</td>
                                                </tr>
                                            );
                                        })
                                        :
                                        <tr><td className='text-center p-3' colSpan='4'>Không tìm thấy dữ liệu</td></tr>
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
                                    <Form.Control as="select" id='ddlPageSize' onChange={onChangePageSize} className='w-auto float-right'>
                                        <option value={5}>Hiển thị 5 lớp học</option>
                                        <option value={10}>Hiển thị 10 lớp học</option>
                                        <option value={15}>Hiển thị 15 lớp học</option>
                                    </Form.Control>
                                </Col>
                            </Row> : null
                    }
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-500 text-uppercase text-color-vp">Lớp học đã hoàn thành</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>tên lớp học</th>
                                    <th>ngày vào học</th>
                                    <th>Số tín chỉ của lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Tiger Nixon</td>
                                    <td>2011/07/25</td>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Garrett Winters</td>
                                    <td>2011/07/25</td>
                                    <td>0.5</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Airi Satou</td>
                                    <td>2008/11/28</td>
                                    <td>0.5</td>
                                </tr>
                            </tbody>
                        </Table>
                        <div>
                            <div className='total float-left small'>
                                123 records
                            </div>
                            <div className='paging float-right'>
                                <Pagination>
                                    <Pagination.First />
                                    <Pagination.Prev />
                                    <Pagination.Item>{1}</Pagination.Item>
                                    <Pagination.Item>{2}</Pagination.Item>
                                    <Pagination.Item active>{3}</Pagination.Item>
                                    <Pagination.Item>{4}</Pagination.Item>
                                    <Pagination.Ellipsis />
                                    <Pagination.Item>{13}</Pagination.Item>
                                    <Pagination.Next />
                                    <Pagination.Last />
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Learning;