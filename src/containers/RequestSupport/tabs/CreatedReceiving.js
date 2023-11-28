import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import _ from 'lodash'
import Constants from 'commons/Constants'
import { getRequestConfigurations } from 'commons/Utils'
import LoadingModal from 'components/Common/LoadingModal'
import HOCComponent from 'components/Common/HOCComponent'
import IconMailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconMailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconAddNew from 'assets/img/icon/ic_btn_add_green.svg'
import IconFilter from "assets/img/icon/icon-filter.svg"
import IconSearch from "assets/img/icon/icon-search.svg"
import IconRemove from 'assets/img/icon-delete.svg'
import Note from "../common/Note"
 
const CreatedReceiving = (props) => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectChange = () => {

    }

    const listRequests = [{}]

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="created-receiving-tab">
                <div className="header-block">
                    <h1 className="header-title">Quản lý yêu cầu</h1>
                    <div className="d-flex justify-content-between align-items-center content">
                        <div className="d-inline-flex left">
                            <button className="btn btn-create-request"><img src={IconAddNew} alt="Create" />Tạo yêu cầu mới</button>
                            <div className="filter position-relative">
                                <img src={IconFilter} alt="Filter" className="icon-prefix-select" />
                                <Select
                                    value={null}
                                    isClearable={false}
                                    onChange={handleSelectChange}
                                    placeholder={t('Lọc nhanh')} 
                                    options={[]}
                                    styles={{
                                        menu: provided => ({ ...provided, zIndex: 2 })
                                    }}
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
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="icon"><img src={IconSearch} alt="Search" /></th>
                                            <th scope="col" className="code">{t("RequestNo")}</th>
                                            <th scope="col" className="title">{t("Tiêu đề")}</th>
                                            <th scope="col" className="created-by">{t("Người tạo")}</th>
                                            <th scope="col" className="group">{t("Nhóm")}</th>
                                            <th scope="col" className="pic">{t("Người xử lý")}</th>
                                            <th scope="col" className="status text-center">{t("Status")}</th>
                                            <th scope="col" className="created-date text-center">{t("Ngày tạo")}</th>
                                            <th scope="col" className="action text-center">{t("Hành động")}</th>
                                            <th scope="col" className="evaluation text-center">{t("Đánh giá")}</th>
                                            <th scope="col" className="comment">{t("Nhận xét")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        listRequests.map((child, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="icon"><img src={IconSearch} alt="Search" /></td>
                                                    <td className="code">
                                                        <a href={'#'} title={''} className="task-title">{1511320}</a>
                                                    </td>
                                                    <td className="title">
                                                        <div className="val">ILOVEVINGROUP_Hỗ trợ kiểm tra lỗi không nhận được request</div>
                                                    </td>
                                                    <td className="created-by">
                                                        <div className="val">cuongnv56</div>
                                                    </td>
                                                    <td className="group">
                                                        <div className="val">

                                                        </div>
                                                    </td>
                                                    <td className="pic">
                                                        <div className="val">

                                                        </div>
                                                    </td>
                                                    <td className="status text-center">
                                                        <div className="val">

                                                        </div>
                                                    </td>
                                                    <td className="created-date">
                                                        <div className="val">

                                                        </div>
                                                    </td>
                                                    <td className="action">
                                                        <span title={t("Cancel2")} onClick={null}><img alt={t("Remove")} src={IconRemove} /></span>
                                                    </td>
                                                    <td className="evaluation">
                                                        <div className="val">

                                                        </div>
                                                    </td>
                                                    <td className="comment">
                                                        <div className="val">

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
