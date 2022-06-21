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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Health extends React.Component {
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

        axios.get(`${process.env.REACT_APP_HRDX_URL}api/HealthInsurance/employeelist?pageIndex=${page}&pageSize=${size}&CompanyCode=${localStorage.getItem('companyCode')}`, config)
            .then(res => {
                if (res && res.data) {
                    this.setState({
                        listData: res.data.data.data || [],
                        total: res.data.data.total || 0
                    });

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

    handleExportDocument = (e, id) => {
        e.preventDefault()
        const config = {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 'Content-Type': 'application/json' }
        }
        const filename = "BaoHiemSucKhoe.docx";
        const searchAdvanceEndpoint = `${process.env.REACT_APP_HRDX_URL}api/HealthInsurance/ExportWordDetail?Id=${id}`;
        axios.get(searchAdvanceEndpoint, { ...config, responseType: 'blob' }).then((response) => {
            if (response && response.data && response.data.type === 'application/json') {
                toast.error('Không tìm thấy dữ liệu để kết xuất');
                return;
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            link.setAttribute('target', "_self");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            this.setState({
                modal: {
                    ...this.state.modal,
                    isShowLoadingModal: false
                }
            })
        })
            .catch(errors => {
                const messages = 'Xuất dữ liệu không thành công !'
                toast.error(messages);
            })
    }

    render() {
        const { t } = this.props;
        const { listData, total } = this.state
        const statusOptions = [
            { value: 1, label: 'NLĐ chưa nộp hồ sơ cho công ty' },
            { value: 2, label: 'PNS đã gửi hồ sơ PVI' }
        ];
        return <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="health-info-page">
                <div className="clearfix edit-button w-100 pb-2">
                    <a href="/insurance-manager/createHealthInsurance"><div className="btn bg-white btn-create"
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
                                        <th scope="col" className="request-type text-center">Ngày nộp BHSK</th>
                                        <th scope="col" className="break-time text-center">Số tiền</th>
                                        <th scope="col" className="status pl-5">Tình trạng</th>
                                        <th scope="col" className="tool text-center">{t("action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listData.map((child, index) => {
                                            const status = statusOptions.filter(st => st.value == child.status).length > 0 ? statusOptions.filter(st => st.value == child.status)[0].label : ''
                                            return (
                                                <tr key={index}>
                                                    <td className="code text-center">{child.id}</td>
                                                    <td className="request-type text-center">{child.createdDate ? moment(child.createdDate).format('DD/MM/YYYY') : ''}</td>
                                                    <td className="request-type text-center">{child.submissionDate ? moment(child.submissionDate).format('DD/MM/YYYY') : ''}</td>
                                                    <td className="break-time text-center">{child.totalMoneyAmount}</td>
                                                    <td className="status text-left">{status}</td>
                                                    <td className="tool">
                                                        <a onClick={(e) => this.handleExportDocument(e, child.id)}><img alt="Sửa" src={Download} className="icon-download" /></a>
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
export default withTranslation()(Health)