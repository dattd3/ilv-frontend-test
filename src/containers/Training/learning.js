import React, { useState, useEffect } from "react";
import {
    useApi,
    useFetcher
} from "../../modules";
import { Table, Pagination } from 'react-bootstrap';

const usePreload = () => {
    const api = useApi();
    const [sabaEnrollments = undefined, err] = useFetcher({
        api: api.fetchSabaEnrollments,
        autoRun: true,
        params: ['thanhpt2@vingroup.net', 1, 10]
    });
    
    return sabaEnrollments;
};

function Learning(props) {

    useEffect(() => {
        document.title = `Learning`;
    });

    const sabaEnrollments = usePreload();

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
                                    <td>0.5</td>
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
                                    <td>1</td>
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