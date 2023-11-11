import React, { useEffect, useState } from "react";
import Constants from "../../../commons/Constants";
import moment from 'moment';
import axios from 'axios';
import _ from "lodash";
import { getRequestConfigurations } from "../../../commons/Utils"

import Download from "../../../assets/img/icon/ic_download_blue.svg";
import CustomPaging from "../../../components/Common/CustomPaging";

const SocialSupportListComponent = ({t}: any) =>{
    const [listData, setListData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [dataForSearch, setdataForSearch] = useState({
        pageIndex: Constants.TASK_PAGE_INDEX_DEFAULT,
        pageSize: Constants.TASK_PAGE_SIZE_DEFAULT
    })

    useEffect(() => {
        fetchData(dataForSearch.pageIndex, dataForSearch.pageSize);
    }, []);

    const fetchData = (page: number, size: number) => {
        const config = getRequestConfigurations()
        axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}insurancesupport/list?pageIndex=${page}&pageSize=${size}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    setListData(res.data.data?.requests || []);
                    setTotal(res.data.data?.total || 0)

                }
            }).catch(error => {
            });
    }

    const onChangePage = (index : number) => {
        index = index < Constants.TASK_PAGE_INDEX_DEFAULT ? Constants.TASK_PAGE_INDEX_DEFAULT : index;
        index = index * dataForSearch.pageSize > total ? (1 + parseInt((total / dataForSearch.pageSize) +'')) : index;
        setdataForSearch({
            ...dataForSearch,
            pageIndex: index
        })
        fetchData(index, dataForSearch.pageSize);
    }

    const onDownloadTemplate = (documents) => {
        if(!documents || documents?.length == 0) {
            return;
        }
        const link = document.createElement('a');
        link.href = documents[0].fileUrl;
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
    return <>
    <div className="health-info-page">
        <div className="task-list request-list shadow">
            {
                listData.length > 0 ?
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                <th scope="col" className="code text-center" style={{width: '102px'}}>{t('RequestNo')}</th>
                                <th scope="col" className="status text-center">{t('TypeOfRequest')}</th>
                                <th scope="col" className="request-type text-center">{t('userSentRequestDate')}</th>
                                <th scope="col" className="request-type text-center">{t('AppovalStatus')}</th>
                                <th scope="col" className="status text-center">{t('ReasonHRReject')}</th>
                                <th scope="col" className="request-type text-center">{t('EvaluationStatus')}</th>
                                <th scope="col" className="tool text-center">{t("action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listData.map((child, index) => {

                                    return (
                                        <tr key={index}>
                                            <td className="code text-center">{child.idDisplay}</td>
                                            <td className="status text-center" title={child.typeName}>{child.typeName || ''}</td>
                                            <td className="request-type text-center">{child.createdDate ? moment(child.createdDate).format('DD/MM/YYYY') : ''}</td>
                                            <td className="request-type text-center">{t(Constants.mappingStatusRequest[child.processStatusId]?.label || '')}</td>
                                            <td className="status text-center">{child.hrComment || ''}</td>
                                            <td className="request-type text-center">{child.statusName || ''}</td>
                                            <td className="tool">
                                                <a style={{cursor: 'pointer'}} onClick={() => onDownloadTemplate(child.userProfileDocuments)}><img alt="Sửa" src={Download} className="icon-download" /></a>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    : <div className="data-not-found p-3">{t("NoDataFound")}</div>
            }
            {(listData.length > 0 || Math.ceil(total / Constants.TASK_PAGE_SIZE_DEFAULT) == dataForSearch.pageIndex) ? <div className="row paging mt-4">
                <div className="col-sm"></div>
                <div className="col-sm"></div>
                <div className="col-sm">
                    <CustomPaging pageSize={dataForSearch.pageSize} onChangePage={onChangePage} totalRecords={total} />
                </div>
                <div className="col-sm"></div>
                <div className="col-sm text-right"></div>
            </div> : null}
        </div>
    </div>
</>
}

export default SocialSupportListComponent;