import React, { useState, useEffect } from "react";
import { useApi, useFetcher, useGuardStore } from "../../../modules";
import { Table, Row, Col, Form } from 'react-bootstrap';
import CustomPaging from '../../../components/Common/CustomPaging';
import LoadingSpinner from "../../../components/Forms/CustomForm/LoadingSpinner";
import { useTranslation } from "react-i18next";


const usePreload = (params) => {
    const api = useApi();
    const [sabaEnrollments = [], err] = useFetcher({
        api: api.fetchSabaLearning_Transcript,
        autoRun: true,
        params: params
    });
    if (err) {
        sabaEnrollments.err = true;
    }
    return sabaEnrollments;
};

function RejectClass({_year}) {
    const { t } = useTranslation();
    const [pageIndex, SetPageIndex] = useState(1);
    const [pageSize, SetPageSize] = useState(5);
    const [refresh, SetRefresh] = useState(false);
    document.title = `Learning`;
    const guard = useGuardStore();
    const user = guard.getCurentUser();
    const sabaEnrollments = usePreload([300, pageIndex, pageSize, _year]);

    const [isOnGoing, SetIsOnGoing] = useState(false);

    function onChangePage(page) {
        SetPageIndex(page);
    }

    function onChangePageSize(evt) {
        SetPageSize(evt.target.value);
        SetPageIndex(1);
    }

    useEffect(() => {
        SetPageIndex(1);
        SetRefresh(!refresh)
    }, [_year])

    try {
        if (!isOnGoing && sabaEnrollments && sabaEnrollments.data.classes.length > 0) {
            SetIsOnGoing(true);
        }
    } catch { }

    return (
        <>
            <div className="card">
                <div className="card-header py-3">
                    <h6 className="m-0 text-uppercase">{t("UnsuccessfulClass")}</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t("ClassName")}</th>
                                    <th>{t("ClassStartDate")}</th>
                                    <th>{t("ClassCredit")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isOnGoing ?
                                        sabaEnrollments.data.classes.map(function (obj, i) {
                                            return (
                                                <tr key={obj.id}>
                                                    <td>{(pageSize * pageIndex) - (pageSize - i) + 1}</td>
                                                    <td>{obj.course_name}</td>
                                                    <td>{obj.start_date}</td>
                                                    <td>{obj.credits}</td>
                                                </tr>
                                            );
                                        })
                                        :
                                        (sabaEnrollments.length == 0
                                            ? <tr><td className='text-center p-3' colSpan='4'><LoadingSpinner /></td></tr>
                                            : <tr><td className='text-center p-3' colSpan='4'>{t("NoDataFound")}</td></tr>)
                                }
                            </tbody>
                        </Table>
                    </div>
                    {
                        isOnGoing ?
                            <Row>
                                <Col className='total'>
                                    {t("Total")}: {sabaEnrollments.data.total} {t("Course")}
                                </Col>
                                <Col className='paging'>
                                    <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={sabaEnrollments.data.total} needReset={refresh} />
                                </Col>
                                <Col>
                                    <Form.Control as="select" onChange={onChangePageSize} className='w-auto float-right'>
                                        <option value={5}>{t("Display5Classes")}</option>
                                        <option value={10}>{t("Display10Classes")}</option>
                                        <option value={15}>{t("Display15Classes")}</option>
                                    </Form.Control>
                                </Col>
                            </Row> : null
                    }
                </div>
            </div>
        </>
    );
}
export default RejectClass;