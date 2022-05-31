import React from "react";
import { Button, Popover, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Constants from "../../../commons/Constants";
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";
import { getRequestConfigurations } from "../../../commons/Utils"

import Download from "../../../assets/img/icon/ic_download_blue.svg";
import CustomPaging from "../../../components/Common/CustomPaging";

class InsuranceSocial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModelDetail: false,
            rowId: null,
            loadSuccess: false,
            editLastRow: false,
            dataForSearch: {
                pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
                pageSize: Constants.TASK_PAGE_SIZE_DEFAULT,
                total: 25

            }
        };
    }

    componentDidMount() {
        const { t } = this.props;
        const config = getRequestConfigurations()

        axios.get(`${process.env.REACT_APP_REQUEST_URL}vaccin/list?culture=${t('langCode')}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    this.setState({ listData: res.data.data });
                   
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
        });
    }

    render() {
        const { t } = this.props;
        //const { listData } = this.state
        const listData = [
            {
                id: '1511321',
                requestDate: '17/03/2022',
                status: 'PNS đã gửi hồ sơ BHXH',
                link: '#'
            },
            {
                id: '1812145',
                requestDate: '15/03/2022',
                applyDate: '15/03/2022',
                amount: '2400500',
                status: 'PNS đã gửi hồ sơ PVI',
                link: '#'
            },
            {
                id: '1954578',
                requestDate: '13/03/2022',
                applyDate: '13/03/2022',
                amount: '24500',
                status: 'Hồ sơ đang điều chỉnh tại CQBHXH',
                link: '#'
            },
            {
                id: '1542362',
                requestDate: '08/03/2022',
                applyDate: '08/03/2022',
                amount: '249809500',
                status: 'NLĐ chưa nộp hồ sơ cho công ty',
                link: '#'
            },

        ]
        const lastItem = listData && listData?.length > 0 ? listData[listData.length - 1] : {

        }
        const pageNumber = 1;
        const total = 20;

        return <>
            <div className="health-info-page">
                <div className="clearfix edit-button w-100 pb-2">
                <a href="/insurance-manager/createSocialInsurance"><div className="btn bg-white btn-create"
                       ><i className="fas fa-plus"></i> {'Tạo yêu cầu'}</div></a>
                </div>
                <div className="task-list request-list shadow">
                    {
                        listData.length > 0 ?
                            <table className="table table-borderless">
                                <thead>
                                    <tr>
                                        <th scope="col" className="code text-center">Mã yêu cầu</th>
                                        <th scope="col" className="request-type text-center">Ngày nộp yêu cầu</th>
                                        <th scope="col" className="status1 pl-8">Tình trạng</th>
                                        <th scope="col" className="tool text-center">{t("action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listData.map((child, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td className="code text-center">{child.id}</td>
                                                    <td className="request-type text-center">{child.requestDate}</td>
                                                    <td className="status1 text-left">{child.status}</td>
                                                    <td className="tool">
                                                        <a href={child.link}><img alt="Sửa" src={Download} className="icon-download" /></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            : <div className="data-not-found">{t("NoDataFound")}</div>
                    }
                    {(listData.length > 0 || Math.ceil(total / Constants.TASK_PAGE_SIZE_DEFAULT) == this.state.dataForSearch.pageIndex) ? <div className="row paging mt-4">
                        <div className="col-sm"></div>
                        <div className="col-sm"></div>
                        <div className="col-sm">
                            <CustomPaging pageSize={this.state.dataForSearch.pageSize} onChangePage={this.onChangePage.bind(this)} totalRecords={this.state.dataForSearch.total} />
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