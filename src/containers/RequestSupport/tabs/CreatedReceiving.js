import { useState, useEffect } from "react"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import { status } from "../Constant"
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import Note from "../common/Note"
import CreatedRequest from "../popup/CreateRequest"
import TableRequests from "../common/TableRequests"
import CustomPaging from "components/Common/CustomPaging"
import CancelModal from "components/Common/CancelModal"
import StatusModal from "components/Common/StatusModal"
import IconAddNew from 'assets/img/ic-add-green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"

const CreatedReceiving = ({ masterData, needLoadData, tab }) => {
    const listPageSizes = [1, 20, 30, 40, 50]
    const quickFilterOptions = [
        { value: 0, label: 'Tất cả' },
        { value: 1, label: 'Yêu cầu tồn của tôi' },
        { value: 2, label: 'Yêu cầu tồn tôi đang nhận thông tin' },
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
    const [isShowCreateRequestModal, setIsShowCreateRequestModal] = useState(false)
    const [quickFilter, setQuickFilter] = useState(null)
    const [refresh, SetRefresh] = useState(false)
    const [cancelRequestModal, setCancelRequestModal] = useState({
        id: null,
        isShow: false,
        titleModal: '',
        field: {
            inputType: 'text',
            placeholderText: 'Nhập',
            inputName: '',
            labelText: '',
        },
        onHide: null,
        buttonOk: {
            label: 'Đồng ý',
            submitButtonOk: null,
        }
    })
    const [statusModal, SetStatusModal] = useState({
        isShow: false,
        isSuccess: true,
        content: "",
    })

    useEffect(() => {
        needLoadData && fetchListRequest()
    }, [needLoadData])

    const fetchListRequest = async (_paging, quickFilterVal) => {
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

            if (quickFilterVal !== undefined && quickFilterVal !== null) {
                payload.filter = quickFilterVal
                payload.pageIndex = 1
            }

            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/user/list`, payload, getRequestConfigurations())
            setRequestData({
                listRequest: response?.data?.data?.datas || [],
                total: response?.data?.data?.totalRecord || 0,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePageSize = (pageSize) => {
        const pagingInput = {
            pageIndex: 1,
            pageSize: pageSize,
        }
        setPaging(pagingInput)
        fetchListRequest(pagingInput)
    }

    const handleChangePage = (page) => {
        const pagingInput = {
            pageIndex: page,
            pageSize: paging.pageSize,
        }
        setPaging(pagingInput)
        fetchListRequest(pagingInput)
    }

    const handleQuickFilter = (e) => {
        setQuickFilter(e)
        fetchListRequest(null, e?.value || null)
    }

    const onHideCreatedRequestModal = () => {
        setIsShowCreateRequestModal(false)
    }

    const cancelRequest = (id) => {
        console.log('TING TING => ', id)

        setCancelRequestModal({
            ...cancelRequestModal,
            id: id,
            isShow: true,
            titleModal: 'Xác nhận hủy yêu cầu',
            field: {
                inputType: 'textarea',
                placeholderText: 'Nhập',
                inputName: 'reason',
                labelText: 'Lý do',
            },
            onHide: onHideCancelModal,
            buttonOk: {
                label: 'Đồng ý',
                submitButtonOk: processCancelRequest,
            },
        })
    }

    const processCancelRequest = async (dataModal) => {
        console.log('heheheh => ', dataModal)
        console.log()

        const statusModalTemp = {...statusModal}
        statusModalTemp.isShow = true

        try {
            setIsLoading(true)
            const payload = {
                id: dataModal?.id,
                statusId: status.cancelled,
                comments: dataModal[cancelRequestModal?.field?.inputName],
            }

            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}api/support/delete`, payload, getRequestConfigurations())

            console.log('response => ', response)
            return

            statusModalTemp.isSuccess = false
        } catch (error) {
            statusModalTemp.isSuccess = false
            statusModalTemp.content = error?.response?.data?.result?.message || t("AnErrorOccurred")
            SetStatusModal(statusModalTemp)
        }
         finally {
            setIsLoading(false)
        }
    }

    const onHideStatusModal = () => {
        SetStatusModal({
            isShow: false,
            isSuccess: true,
            content: "",
        })
    }

    const onHideCancelModal = () => {
        setCancelRequestModal({
            id: null,
            isShow: false,
            titleModal: '',
            field: {
                inputType: 'text',
                placeholderText: 'Nhập',
                inputName: '',
                labelText: '',
            },
            onHide: null,
            buttonOk: {
                label: 'Đồng ý',
                submitButtonOk: null,
            },
        })
    }

    const updateListRequests = (id, val) => {
        const listRequestToSave = id === null 
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

        setRequestData({
            ...requestData,
            listRequest: listRequestToSave
        })
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
            <CreatedRequest 
                isShow={isShowCreateRequestModal}
                masterData={masterData}
                onHide={onHideCreatedRequestModal}
            />
            <CancelModal 
                dataModal={cancelRequestModal}
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
                            <button className="btn btn-create-request" onClick={() => setIsShowCreateRequestModal(true)}><img src={IconAddNew} alt="Create" />Tạo yêu cầu mới</button>
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
                        {
                            requestData?.listRequest?.length > 0 
                            ? (
                                <>
                                    <TableRequests 
                                        masterData={masterData}
                                        tab={tab}
                                        listRequests={requestData?.listRequest}
                                        total={requestData?.total}
                                        updateToParent={updateListRequests}
                                        cancelRequest={cancelRequest}
                                    />
                                </>
                            )
                            : (<div className="data-not-found">{t("NoDataFound")}</div>)
                        }
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

export default CreatedReceiving
