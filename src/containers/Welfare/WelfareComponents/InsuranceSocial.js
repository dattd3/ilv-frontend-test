import React from "react";
import { Button, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Constants from "../../../commons/Constants";
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";
import { formatNumberSpecialCase, getRequestConfigurations } from "../../../commons/Utils"

import Download from "../../../assets/img/icon/ic_download_blue.svg";
import CustomPaging from "../../../components/Common/CustomPaging";

class InsuranceSocial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            total: 0,
            showModelDetail: false,
            rowId: null,
            loadSuccess: false,
            editLastRow: false,
            dataForSearch: {
                pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
                pageSize: Constants.TASK_PAGE_SIZE_DEFAULT

            }
        };
    }

    componentDidMount() {
        const { t } = this.props;
        this.fetchData(this.state.dataForSearch.pageIndex, this.state.dataForSearch.pageSize);
    }

    fetchData = (page, size) => {
        const config = getRequestConfigurations()

        axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}benefitClaim/list?pageIndex=${page}&pageSize=${size}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    this.setState({ listData: res.data.data?.requests || [],
                    total: res.data.data?.total || 0 });

                }
            }).catch(error => {
            });
    }

    onChangePage = index => {
        index = index < Constants.TASK_PAGE_INDEX_DEFAULT ? Constants.TASK_PAGE_INDEX_DEFAULT : index;
        index = index * this.state.dataForSearch.pageSize > this.props.total ? (1 + parseInt(this.props.total / this.state.dataForSearch.pageSize)) : index;
        this.setState({
            pageNumber: index, dataForSearch: {
                ...this.state.dataForSearch,
                pageIndex: index
            }
        }, () => {
            // this.searchRemoteData(false);
            this.fetchData(index, this.state.dataForSearch.pageSize)
        });
    }

    render() {
        const { t } = this.props;
        const { listData, total } = this.state

        return <>
            <div className="health-info-page">
                <div className="clearfix edit-button w-100 pb-2">
                    <a href="/insurance-manager/createSocialInsurance"><div className="btn bg-white btn-create"
                    ><i className="fas fa-plus"></i> {t('createRequest')}</div></a>
                </div>
                <div className="task-list request-list shadow">
                    {
                        listData.length > 0 ?
                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th scope="col" className="code text-center">{t('RequestNo')}</th>
                                        <th scope="col" className="request-type text-center">{t('TypeOfRequest')}</th>
                                        <th scope="col" className="request-type text-center">{t('claim_submission_date')}</th>
                                        <th scope="col" className="status1 pl-8">{t('EvaluationStatus')}</th>
                                        <th scope="col" className="status">{t('ReasonHRReject')}</th>
                                        <th scope="col" className="request-type text-center">{t('price')}</th>
                                        <th scope="col" className="tool text-center">{t("action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listData.map((child, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td className="code text-center">{child.idDisplay}</td>
                                                    <td className="request-type text-center">{child.claimTypeName || ''}</td>
                                                    <td className="request-type text-center">{child.createdDate ? moment(child.createdDate).format('DD/MM/YYYY') : ''}</td>
                                                    <td className="status1 text-left">{child.statusName || ''}</td>
                                                    <td className="status text-left" title={child.hrReason}>{child.hrReason}</td>
                                                    <td className="request-type text-center">{formatNumberSpecialCase(child.amountMoney) || ''}</td>
                                                    <td className="tool">
                                                        <a href={`/insurance-manager/export/${child.idDisplay}`}><img alt="Sửa" src={Download} className="icon-download" /></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            : <div className="data-not-found p-2">{t("NoDataFound")}</div>
                    }
                    {(listData.length > 0 || Math.ceil(total / Constants.TASK_PAGE_SIZE_DEFAULT) == this.state.dataForSearch.pageIndex) ? <div className="row paging mt-4">
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                        <div className="col-sm">
                            <CustomPaging pageSize={this.state.dataForSearch.pageSize} onChangePage={this.onChangePage.bind(this)} totalRecords={total} />
                        </div>
                        <div className="col-sm"></div>
                        <div className="col-sm text-right"></div>
                    </div> : null}
                </div>
            </div>
        </>
    }
}
export default withTranslation()(InsuranceSocial)