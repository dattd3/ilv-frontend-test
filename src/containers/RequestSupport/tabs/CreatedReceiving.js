import React, { useState, useEffect } from "react"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import Note from "../common/Note"
import CreatedRequest from "../popup/CreateRequest"
import TableRequests from "../common/TableRequests"
import IconAddNew from 'assets/img/ic-add-green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const CreatedReceiving = ({ masterData, needLoadData }) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [requestData, setRequestData] = useState({
        listRequest: [],
        total: 0,
    })
    const [isShowCreateRequestModal, setIsShowCreateRequestModal] = useState(false)

    useEffect(() => {
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

        needLoadData && fetchListRequest()
    }, [needLoadData])

    const handleInputChange = () => {

    }

    const onHideCreatedRequestModal = () => {
        setIsShowCreateRequestModal(false)
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

    console.log('kakakakka ', requestData)

    return (
        <>
            <LoadingModal show={isLoading} />
            <CreatedRequest 
                isShow={isShowCreateRequestModal}
                masterData={masterData}
                onHide={onHideCreatedRequestModal}
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
                                    value={null}
                                    isClearable={false}
                                    onChange={handleInputChange}
                                    placeholder={t('Lọc nhanh')} 
                                    options={[]}
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
                                    listRequests={requestData?.listRequest}
                                    total={requestData?.total}
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

export default CreatedReceiving
