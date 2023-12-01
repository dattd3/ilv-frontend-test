import React, { useState, useEffect } from "react"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import { Rating } from 'react-simple-star-rating'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import Note from "../common/Note"
import CreatedRequest from "../popup/CreateRequest"
import IconClose from 'assets/img/icon/icon_x.svg'
import IconAddNew from 'assets/img/ic-add-green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
import IconSearch from "assets/img/icon/icon-search.svg"
import IconRemove from 'assets/img/icon-delete.svg'
import IconEmailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconEmailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconEmailCyan from 'assets/img/icon/ic_mail-cyan.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

const CreatedReceiving = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [isShowFilter, setIsShowFilter] = useState(false)
    const [isShowCreateRequestModal, setIsShowCreateRequestModal] = useState(false)

    const handleInputChange = () => {

    }

    const onHideCreatedRequestModal = () => {
        setIsShowCreateRequestModal(false)
    }

    const listRequests = [{}, {}, {}, {}, {}, {}]

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
            <CreatedRequest isShow={isShowCreateRequestModal} onHide={onHideCreatedRequestModal} />
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
                            listRequests?.length > 0 
                            ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="icon">
                                                <div className="val"><img className="cursor-pointer" onClick={() => setIsShowFilter(true)} src={IconSearch} alt="Search" /></div>
                                            </th>
                                            <th className="code text-center"><div className="val">{t("RequestNo")}</div></th>
                                            <th className="title"><div className="val">{t("Tiêu đề")}</div></th>
                                            <th className="created-by"><div className="val">{t("Người tạo")}</div></th>
                                            <th className="group"><div className="val">{t("Nhóm")}</div></th>
                                            <th className="pic"><div className="val">{t("Người xử lý")}</div></th>
                                            <th className="status-col text-center"><div className="val">{t("Status")}</div></th>
                                            <th className="created-date text-center"><div className="val">{t("Ngày tạo")}</div></th>
                                            <th className="action text-center"><div className="val">{t("Hành động")}</div></th>
                                            <th className="evaluation text-center"><div className="val">{t("Đánh giá")}</div></th>
                                            <th className="comment"><div className="val">{t("Nhận xét")}</div></th>
                                        </tr>
                                        {
                                            isShowFilter && (
                                                <tr className="row-filter">
                                                    <th className="icon">
                                                        <div className="val"><img className="cursor-pointer" onClick={() => setIsShowFilter(false)} src={IconClose} alt="Close" /></div>
                                                    </th>
                                                    <th className="code text-center"><div className="val"><input type="text" value={''} placeholder="Nhập" /></div></th>
                                                    <th className="title"><div className="val"><input type="text" value={''} placeholder="Nhập" /></div></th>
                                                    <th className="created-by"><div className="val"><input type="text" value={''} placeholder="Nhập" /></div></th>
                                                    <th className="group">
                                                        <div className="val">
                                                            <Select 
                                                                placeholder={t("Chọn")} 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleInputChange} 
                                                                styles={customFilterStyles}
                                                            />
                                                        </div>
                                                    </th>
                                                    <th className="pic"><div className="val"><input type="text" value={''} placeholder="Nhập" /></div></th>
                                                    <th className="status-col text-center">
                                                        <div className="val">
                                                            <Select 
                                                                placeholder={t("Chọn")} 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleInputChange} 
                                                                styles={customFilterStyles}
                                                            />
                                                        </div>
                                                    </th>
                                                    <th colSpan={4} className="created-date">
                                                        <div className="val">
                                                            <label className="wrap-date-input">
                                                                <DatePicker
                                                                    // selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                                                    placeholderText={t("Từ ngày tạo")}
                                                                    selected={null}
                                                                    onChange={handleInputChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    showMonthDropdown={true}
                                                                    showYearDropdown={true}
                                                                    locale="vi"
                                                                    // disabled={isDisabled}
                                                                    className="form-control input" />
                                                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                                                            </label>
                                                            <label className="wrap-date-input">
                                                                <DatePicker
                                                                    // selected={filter.fromDate ? moment(filter.fromDate, 'YYYY-MM-DD').toDate() : null}
                                                                    placeholderText={t("Đến ngày tạo")}
                                                                    selected={null}
                                                                    onChange={handleInputChange}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    showMonthDropdown={true}
                                                                    showYearDropdown={true}
                                                                    locale="vi"
                                                                    // disabled={isDisabled}
                                                                    className="form-control input" />
                                                                <span className="input-img"><img src={IconDatePicker} alt="Date" /></span>
                                                            </label>
                                                            <button className="btn-search">Tìm kiếm</button>
                                                        </div>
                                                    </th>
                                                </tr>
                                            )
                                        }
                                    </thead>
                                    <tbody>
                                    {
                                        listRequests.map((child, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="icon">
                                                        <div className="val"><img src={index === 0 ? IconEmailGreen : index === 1 ? IconEmailBlue : IconEmailCyan} alt="Search" /></div>
                                                    </td>
                                                    <td className="code text-center">
                                                        <a href={'#'} title={''} className="val">{1511320}</a>
                                                    </td>
                                                    <td className="title">
                                                        <div className="val">ILOVEVINGROUP_Hỗ trợ kiểm tra lỗi không nhận được request</div>
                                                    </td>
                                                    <td className="created-by">
                                                        <div className="val">cuongnv56</div>
                                                    </td>
                                                    <td className="group">
                                                        <div className="val">
                                                        <Select 
                                                            placeholder={t("Select")} 
                                                            isClearable={true} 
                                                            value={null} 
                                                            options={[]} 
                                                            onChange={handleInputChange} 
                                                            styles={customStyles}
                                                        />
                                                        </div>
                                                    </td>
                                                    <td className="pic">
                                                        <div className="val">datth3</div>
                                                    </td>
                                                    <td className="status-col text-center">
                                                        <div className="val">
                                                            <span className={`status ${classIndexMapping[index]}`}>Mới</span>
                                                        </div>
                                                    </td>
                                                    <td className="created-date text-center">
                                                        <div className="val">25/11/2023</div>
                                                    </td>
                                                    <td className="action text-center">
                                                        <span title={t("Cancel2")} onClick={null}><img alt={t("Remove")} src={IconRemove} /></span>
                                                    </td>
                                                    <td className="evaluation text-center">
                                                        <div className="val">
                                                            <Rating
                                                                transition
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="comment">
                                                        <div className="val">
                                                            <textarea 
                                                                rows={2} 
                                                                placeholder={'Nhập'} 
                                                                value={""} 
                                                                onChange={handleInputChange} 
                                                                // disabled={isDisableManagerComment} 
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
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
