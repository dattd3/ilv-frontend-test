import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Select from 'react-select'
import axios from 'axios'
import _ from 'lodash'
import { omit } from "lodash"
import Constants from 'commons/Constants'
import { status, tabConfig } from "../Constant" 
import { getRequestConfigurations, hasValue } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import Note from "../common/Note"
import UpdateRequest from "../popup/UpdateRequest"
import TableRequests from "../common/TableRequests"
import CustomPaging from "components/Common/CustomPaging"
import CancelModal from "components/Common/CancelModal"
import StatusModal from "components/Common/StatusModal"
import IconArrowWhite from 'assets/img/icon/Icon-Arrow-Right-White.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
 
const Processing = ({ masterData, needLoadData, tab }) => {
    const listPageSizes = [10, 20, 30, 40, 50]
    const quickFilterOptions = [
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'Yêu cầu tồn của tôi' },
        { value: 2, label: 'Yêu cầu tồn của nhóm tôi' },
    ]
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [requestData, setRequestData] = useState({
        listRequest: [],
        total: 0,
    })
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: listPageSizes[0],
    })
    const [isShowUpdateRequestModal, setIsShowUpdateRequestModal] = useState(false)
    const [quickFilter, setQuickFilter] = useState(null)
    const [refresh, SetRefresh] = useState(false)
    const [statusModal, setStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
        needReload: true,
    })

    useEffect(() => {
        needLoadData && fetchListRequest()
    }, [needLoadData])

    const fetchListRequest = async (_paging, quickFilterValue, normalFilterData) => {
        try {
            setIsLoading(true)
            let pageIndex = paging.pageIndex
            let pageSize = paging.pageSize

            if (_paging) {
                pageIndex = _paging.pageIndex
                pageSize = _paging.pageSize
            }

            const payload = {
                pageIndex: pageIndex,
                pageSize: Number(pageSize || listPageSizes[0]),
            }

            if (quickFilterValue !== undefined && quickFilterValue !== null) {
                payload.filter = quickFilterValue
                payload.pageIndex = 1
            }

            if (normalFilterData) {
                if (hasValue(normalFilterData?.requestCode)) {
                    payload.id = normalFilterData?.requestCode
                }
                if (hasValue(normalFilterData?.title)) {
                    payload.q = normalFilterData?.title
                }
                if (hasValue(normalFilterData?.createdBy)) {
                    payload.userId = normalFilterData?.createdBy
                }
                if (hasValue(normalFilterData?.group)) {
                    payload.groupId = normalFilterData?.group
                }
                if (hasValue(normalFilterData?.handler)) {
                    payload.handlerId = normalFilterData?.handler
                }
                if (hasValue(normalFilterData?.status)) {
                    payload.statusId = normalFilterData?.status
                }
                if (hasValue(normalFilterData?.createdDateFrom)) {
                    payload.startDate = normalFilterData?.createdDateFrom
                }
                if (hasValue(normalFilterData?.createdDateTo)) {
                    payload.endDate = normalFilterData?.createdDateTo
                }
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/tech/list`, payload, getRequestConfigurations())
            setRequestData({
                listRequest: response?.data?.data?.datas || [],
                total: response?.data?.data?.totalRecord || 0,
            })
        } catch (error) {
            setRequestData({
                listRequest: [],
                total: 0,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePageSize = (pageSize) => {
        const _paging = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        setPaging(_paging)
        fetchListRequest(_paging)
    }

    const handleChangePage = (page) => {
        const _paging = {
            pageIndex: page,
            pageSize: paging.pageSize,
        }
        setPaging(_paging)
        fetchListRequest(_paging)
    }

    const handleQuickFilter = (e) => {
        setQuickFilter(e)
        fetchListRequest(null, e?.value || null)
    }

    const onHideCreatedRequestModal = () => {
        setIsShowUpdateRequestModal(false)
    }

    const handleNormalFilter = (filter) => {
        const _paging = {
            pageIndex: 1,
            pageSize: paging.pageSize,
        }
        setPaging(_paging)
        fetchListRequest(_paging, undefined, filter)
    }

    const onHideStatusModal = () => {
        setStatusModal({
            isShow: false,
            isSuccess: true,
            content: "",
            needReload: true,
        })
        
        if (statusModal?.needReload) {
            window.location.reload()
        }
    }

    const updateListRequests = (id, key, val) => {
        let listRequestToSave = []
        switch (key) {
            case 'isChecked':
                listRequestToSave = id === null 
                ? (requestData?.listRequest || []).map(item => {
                    return {
                        ...item,
                        isChecked: val,
                    }
                })
                : (requestData?.listRequest || []).map(item => {
                    return {
                        ...item,
                        isChecked: item?.id === id ? val : (item?.isChecked || false),
                    }
                })
                break
            case 'evaluate_temp':
            case 'comments_temp':
                listRequestToSave = (requestData?.listRequest || []).map(item => {
                    return {
                        ...item,
                        ...(item?.id === id && { [key]: val }),
                    }
                })
                break
        }

        setRequestData({
            ...requestData,
            listRequest: listRequestToSave
        })
    }

    const evaluateRequest = async (id) => {
        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = true

        try {
            setIsLoading(true)
            const requestEvaluating = (requestData?.listRequest || []).find(item => item?.id == id)
            const payload = {
                id: id,
                evaluate: requestEvaluating?.evaluate_temp || 0,
                comments: requestEvaluating?.comments_temp || '',
            }

            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/evaluate`, payload, getRequestConfigurations())
            statusModalTemp.isSuccess = true
            statusModalTemp.needReload = true
            statusModalTemp.content = t("Đã đánh giá thành công!")

            if (response?.data?.result?.code !== Constants.API_SUCCESS_CODE) {
                statusModalTemp.isSuccess = false
                statusModalTemp.needReload = false
                statusModalTemp.content = response?.data?.result?.message || t("AnErrorOccurred")
            }

            setStatusModal(statusModalTemp)
        } catch (error) {
            statusModalTemp.isSuccess = false
            statusModalTemp.needReload = false
            statusModalTemp.content = error?.response?.data?.result?.message || t("AnErrorOccurred")
            setStatusModal(statusModalTemp)
        }
         finally {
            setIsLoading(false)
        }
    }

    const classIndexMapping = {
        0: 'new',
        1: 'processing',
        2: 'paused',
        3: 'cancelled',
        4: 'processed',
        5: 'closed',
    }

    const customStyles = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: 35,
            padding: '0 10px'
        }),
        input: (provided, state) => ({
            ...provided,
            margin: 0,
        }),
        indicatorSeparator: (prevStyle, state) => ({
            display: 'none'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: 35,
        }),
    }

    const customFilterStyles = {
        control: base => ({
            ...base,
            height: 30,
            minHeight: 30
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: 30,
            padding: '0 5px'
        }),
        input: (provided, state) => ({
            ...provided,
            margin: 0,
        }),
        indicatorSeparator: (prevStyle, state) => ({
            display: 'none'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: 30,
        }),
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <UpdateRequest 
                isShow={isShowUpdateRequestModal}
                masterData={masterData}
                onHide={onHideCreatedRequestModal}
            />
            <StatusModal 
                show={statusModal.isShow} 
                isSuccess={statusModal.isSuccess} 
                content={statusModal.content} 
                className="evaluation-status-modal"
                onHide={onHideStatusModal} 
            />
            <div className="created-receiving-tab">
                <div className="header-block">
                    <h1 className="header-title">Quản lý yêu cầu</h1>
                    <div className="d-flex justify-content-between align-items-center content">
                        <div className="d-inline-flex left">
                            <button className="btn btn-update-request" onClick={() => setIsShowUpdateRequestModal(true)}>Cập nhật<img src={IconArrowWhite} alt="Create" /> </button>
                            <div className="filter position-relative">
                                <img src={IconFilter} alt="Filter" className="icon-prefix-select" />
                                <Select
                                    value={quickFilter}
                                    isClearable={true}
                                    onChange={handleQuickFilter}
                                    placeholder={t('Lọc nhanh')} 
                                    options={quickFilterOptions}
                                    classNamePrefix="filter-select"
                                />
                            </div>
                        </div>
                        <div className="right">
                            <Note />
                        </div>
                    </div>
                </div>
                <div className="request-list-region"> 
                    <div className="request-list">
                        <TableRequests 
                            masterData={masterData}
                            tab={tab}
                            listRequests={requestData?.listRequest}
                            total={requestData?.total}
                            updateListRequests={updateListRequests}
                            evaluateRequest={evaluateRequest}
                            handleFilterOnParent={handleNormalFilter}
                        />
                    </div>
                    {
                        requestData?.listRequest?.length > 0 && (
                            <div className="d-flex align-items-center paging-region">
                                <div className="customize-display">
                                    <label>{t("EvaluationShow")}</label>
                                    <select value={paging.pageSize || listPageSizes[0]} onChange={(e) => handleChangePageSize(e?.target?.value)}>
                                        {
                                            listPageSizes.map((page, i) => {
                                                return <option value={page} key={i}>{page}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="paging-block">
                                    <CustomPaging 
                                        pageSize={parseInt(paging.pageSize)} 
                                        onChangePage={page => handleChangePage(page)} 
                                        totalRecords={requestData?.total} 
                                        needRefresh={refresh} 
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Processing
