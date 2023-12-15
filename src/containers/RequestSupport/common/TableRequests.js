import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import Select from 'react-select'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Rating } from 'react-simple-star-rating'
import moment from 'moment'
import { groupUsersConfig } from ".."
import { status, feedBackLine } from "../Constant"
import IconEmailGreen from 'assets/img/icon/ic_mail-green.svg'
import IconEmailBlue from 'assets/img/icon/ic_mail-blue.svg'
import IconEmailCyan from 'assets/img/icon/ic_mail-cyan.svg'
import IconDownload from 'assets/img/ic_download_red.svg'
import IconExpand from 'assets/img/icon/ic_expand_grey.svg'
import IconCollapse from 'assets/img/icon/ic_collapse_grey.svg'
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import IconSearch from "assets/img/icon/icon-search.svg"
import IconRemove from 'assets/img/icon-delete.svg'
import IconSave from 'assets/img/icon/ic_tick_green.svg'
import IconCancel from 'assets/img/icon/ic_x_red.svg'
import IconClose from 'assets/img/icon/icon_x.svg'
import IconFeedbackOverdueActive from 'assets/img/icon/ic_feedback-overdue_active.svg'
import IconFeedbackOverdue from 'assets/img/icon/ic_feedback-overdue_grey.svg'
import IconDeadlineOverdueActive from 'assets/img/icon/ic_deadline-overdue_active.svg'
import IconDeadlineOverdue from 'assets/img/icon/ic_deadline-overdue_grey.svg'


import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
import Constants from "commons/Constants"
registerLocale("vi", vi)

const FeedbackHistoryItem = ({ fullName, ad, company, time, message, statusCode }) => {
    // const statusIconMapping = {
    //     0: IconEmailGreen,
    //     1: IconEmailBlue,
    //     2: IconEmailCyan,
    // }

    // const [expanded, setExpanded] = useState(false)

    // return (
    //     <div className="d-flex justify-content-between item">
    //         <div className="d-inline-flex align-items-baseline left">
    //             <span className="icon"><img src={statusIconMapping[statusCode]} alt="Mail" /></span>
    //             <div className="d-flex flex-column content">
    //                 <div className="author"><span className="font-weight-bold">{fullName}</span> ({ad}-{company}) - {time}</div>
    //                 { expanded && (<div className="comment">{message}</div>) }
    //                 <span className="cursor-pointer action" onClick={() => setExpanded(!expanded)}><img src={expanded ? IconCollapse : IconExpand} alt="Action" />{expanded ? 'Rút gọn' : 'Xem chi tiết'}</span>
    //             </div>
    //         </div>
    //         <div className="right">
    //             <button className="btn-download"><img src={IconDownload} alt="Download" />Tải về tệp tin</button>
    //         </div>
    //     </div>
    // )
}

const TableRequests = ({ masterData, listRequests, total }) => {
    const locale = localStorage.getItem("locale") || Constants.LANGUAGE_VI
    const { t } = useTranslation()
    const lstItems = [{}, {}, {}]

    const [isShowFilter, setIsShowFilter] = useState(false)

    const handleInputChange = () => {

    }

    const handleCheckboxChange = (e, index) => {
        const value = e?.target?.checked || false
        // const evaluationDataTemp = {...evaluationData}
        // if (index !== null) {
        //     evaluationDataTemp.data[index].isSelected = value
        //     const isSelectedAllEvaluationForm = isAllEvaluationFormSelected(evaluationDataTemp.data)
        //     SetIsSelectedAll(isSelectedAllEvaluationForm)
        //     SetEvaluationData(evaluationDataTemp)
        // } else {
        //     SetIsSelectedAll(value)
        //     if (value) {
        //         evaluationDataTemp.data = [...evaluationDataTemp.data].map(item => ({...item, isSelected: true}))
        //     } else {
        //         evaluationDataTemp.data = [...evaluationDataTemp.data].map(item => ({...item, isSelected: false}))
        //     }
        //     SetEvaluationData(evaluationDataTemp)
        // }
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

    const classIndexMapping = {
        [status.new]: 'new',
        [status.processing]: 'processing',
        [status.paused]: 'paused',
        [status.cancelled]: 'cancelled',
        [status.processed]: 'processed',
        [status.closed]: 'closed',
        [status.reopen]: 'reopen',
    }

    console.log('fsaasasdasd => ', masterData)
 
    return (
        <table className="table">
            <thead>
                <tr>
                    <th className="check">
                        <div className="val">
                            <input type="checkbox" className="cursor-pointer" checked={true} onChange={e => handleCheckboxChange(e, null)} />
                        </div>
                    </th>
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
                    <th className="deadline text-center"><div className="val">{t("Ngày hết hạn")}</div></th>
                    <th className="evaluation text-center"><div className="val">{t("Đánh giá")}</div></th>
                    <th className="comment"><div className="val">{t("Nhận xét")}</div></th>
                    <th className="action text-center"><div className="val">{t("Thao tác")}</div></th>
                </tr>
                {
                    isShowFilter && (
                        <tr className="row-filter">
                            <th className="icon" colSpan={2}>
                                <div className="val d-flex justify-content-center cursor-pointer" onClick={() => setIsShowFilter(false)}>
                                    <img src={IconClose} alt="Close" />
                                    <span style={{ margin: '2px 0 0 5px' }}>Thoát</span>
                                </div>
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
                            <th colSpan={6} className="created-date"> 
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
                    let statusId = child?.supportStatus?.id

                    return (
                        <tr key={index}>
                            <td className="check">
                                <div className="val">
                                    <input type="checkbox" className="cursor-pointer" checked={true} onChange={e => handleCheckboxChange(e, index)} />
                                </div>
                            </td>
                            <td className="icon">
                                <div className="val d-flex" style={{ justifyContent: 'space-evenly' }}>
                                    <img src={child?.requestHistory?.[0]?.colorLine == feedBackLine.requester ? IconEmailCyan : child?.requestHistory?.[0]?.colorLine == feedBackLine.receiveInformationTogether ? IconEmailBlue : IconEmailGreen} alt="Search" />
                                    {/* <img src={index === 0 ? IconFeedbackOverdueActive : index === 1 ? IconFeedbackOverdue : IconFeedbackOverdueActive} alt="Search" />
                                    <img src={index === 0 ? IconDeadlineOverdueActive : index === 1 ? IconDeadlineOverdue : IconDeadlineOverdueActive} alt="Search" /> */}
                                </div>
                            </td>
                            <td className="code text-center">
                                <a href={'#'} title={''} className="val">{child?.id}</a>
                            </td>
                            <td className="title">
                                <div className="val">{child?.name}</div>
                            </td>
                            <td className="created-by">
                                <div className="val">{JSON.parse(child?.userInfo)?.ad}</div>
                            </td>
                            <td className="group">
                                <div className="val">
                                    {child?.supportGroups?.groupName}
                                {/* <Select 
                                    placeholder={t("Select")} 
                                    isClearable={true} 
                                    value={null} 
                                    options={[]} 
                                    onChange={handleInputChange} 
                                    styles={customStyles}
                                /> */}
                                </div>
                            </td>
                            <td className="pic">
                                <div className="val">{JSON.parse(child?.handlerInfo)?.ad}</div>
                            </td>
                            <td className="status-col text-center">
                                <div className="val">
                                    <span className={`status ${classIndexMapping[statusId]}`}>{locale === Constants.LANGUAGE_VI ? child?.supportStatus?.statusVn : child?.supportStatus?.statusEn}</span>
                                </div>
                            </td>
                            <td className="created-date text-center">
                                <div className="val">{moment(child?.createdDate).isValid() ? moment(child?.createdDate).format("DD/MM/YYYY") : ''}</div>
                            </td>
                            {/* <td className="deadline text-center">
                                <div className="val">30/11/2023</div>
                            </td> */}
                            <td className="evaluation text-center">
                                <div className="val">
                                    <Rating
                                        transition
                                        readonly={Number(statusId) < status.closed}
                                    />
                                </div>
                            </td>
                            <td className="comment">
                                <div className="val">
                                    {
                                        Number(statusId) === status.closed && (
                                            <textarea 
                                                rows={2} 
                                                placeholder={'Nhập'} 
                                                value={""} 
                                                onChange={handleInputChange} 
                                                // disabled={isDisableManagerComment} 
                                            />
                                        )
                                    }
                                </div>
                            </td>
                            <td className="action">
                                <div className="val text-center d-flex">
                                    <span title={t("Remove")} className="cursor-pointer" onClick={null}><img alt={t("Remove")} src={IconRemove} className="ic-remove" /></span>
                                    <span title={t("Update")} className="cursor-pointer" onClick={null}><img alt={t("Update")} src={IconSave} className="ic-save" /></span>
                                    <span title={t("Cancel2")} className="cursor-pointer" onClick={null}><img alt={t("Cancel2")} src={IconCancel} className="ic-cancel" /></span>
                                </div>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    )
}

export default TableRequests
