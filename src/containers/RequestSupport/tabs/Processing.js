import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Select from 'react-select'
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import Note from "../common/Note"
import TableRequests from "../common/TableRequests"
import IconMailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconAddNew from 'assets/img/ic-add-green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
 
const Processing = ({ masterData, needLoadData, tab }) => {
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
    const [isShowCreateRequestModal, setIsShowCreateRequestModal] = useState(false)
    const [quickFilter, setQuickFilter] = useState(null)

    useEffect(() => {
        needLoadData && fetchListRequest()
    }, [needLoadData])

    const fetchListRequest = async () => {
        try {
            setIsLoading(true)
            const payload = {
                pageIndex: 1, 
                pageSize: 10,
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

    const handleInputChange = (e) => {
        setQuickFilter(e)
        fetchListRequest()
    }

    const onHideCreatedRequestModal = () => {
        setIsShowCreateRequestModal(false)
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
            {/* <CreatedRequest 
                isShow={isShowCreateRequestModal}
                masterData={masterData}
                onHide={onHideCreatedRequestModal}
            /> */}
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
                                    onChange={handleInputChange}
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
                <div className="tab-content"> 
                    <div className="request-list">
                        {
                            requestData?.listRequest?.length > 0 
                            ? (
                                <TableRequests 
                                    masterData={masterData}
                                    tab={tab}
                                    listRequests={requestData?.listRequest}
                                    total={requestData?.total}
                                    updateToParent={updateListRequests}
                                />
                            )
                            : (<div className="data-not-found">{t("NoDataFound")}</div>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Processing
