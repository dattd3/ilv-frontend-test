import React from "react"
import { useTranslation } from "react-i18next"
import DatePicker, {registerLocale } from 'react-datepicker'
import moment from 'moment'
import { formatStringByMuleValue } from "../../commons/Utils"
import IconCancel from "assets/img/icon/Icon_Cancel_White.svg"
import IconDatePicker from "assets/img/icon/Icon_DatePicker.svg"
import IconAddGreen from "assets/img/ic-add-green.svg"
import IconEyeClosed from "assets/img/icon/not-eye.svg"
import IconEyeOpened from "assets/img/icon/eye.svg"
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
registerLocale("vi", vi)

function WorkOutSideGroupItem({ index, item, canUpdate }) {
    const { t } = useTranslation()

    console.log('vvvvvvvvvvvvv', index)
    console.log('vvvvvvvvvvvvv', item)
    const a = null

    const handleInputChange = e => {

    }
    
    return (
        <div className="work-outside-group-item">
            <div className="group company-info">
                <div className="group-header">
                    <h5>Thông tin Công ty</h5>
                    {
                        canUpdate && (
                            <span className="btn-cancel" >
                                <img src={IconCancel} alt="Cancel" />
                                <span>Hủy</span>
                            </span>
                        )
                    }
                </div>
                <div className="content">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="group-name">
                                <label>Tên công ty</label>
                                {
                                    canUpdate
                                    ? (
                                        <>
                                            <input type="text" placeholder="Nhập" value={item?.companyName || ''} className="first" />
                                            { item?.updating && (<input type="text" placeholder="Nhập" value={item?.newCompanyName || ''} className="second" />) }
                                        </>
                                    )
                                    : (<div className="value">{ item?.companyName || '' }</div>)
                                }
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="group-date">
                                <label>Bắt đầu</label>
                                {
                                    canUpdate
                                    ? (
                                        <label className="input-date">
                                            <DatePicker
                                                selected={ item?.startDate }
                                                onChange={handleInputChange}
                                                dateFormat="dd/MM/yyyy"
                                                locale="vi"
                                                className="form-control form-control-lg input"/>
                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                        </label>
                                    )
                                    : (<div className="value">{ item?.startDate || '' }</div>)
                                }
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="group-date">
                                <label>Kết thúc</label>
                                {
                                    canUpdate
                                    ? (
                                        <label className="input-date">
                                            <DatePicker
                                                selected={a}
                                                onChange={a}
                                                dateFormat="dd/MM/yyyy"
                                                locale="vi"
                                                className="form-control form-control-lg input"/>
                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                        </label>
                                    )
                                    : (<div className="value">{ item?.endDate || '' }</div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="group process">
                {
                    (Object.entries(item?.listWorking) || []).map((sub, subIndex) => {
                        return (
                            <div className="item" key={sub[0]}>
                                <div className="group-header">
                                    <h5>Quá trình {subIndex + 1}</h5>
                                    {
                                        canUpdate && (
                                            <span className="btn-cancel">
                                                <img src={IconCancel} alt="Cancel" />
                                            </span>
                                        )
                                    }
                                </div>
                                <div className="content">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="group-input">
                                                <label>Bắt đầu</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                        <label className="input-date">
                                                            <DatePicker
                                                                selected={sub[1]?.startDate}
                                                                onChange={handleInputChange}
                                                                dateFormat="dd/MM/yyyy"
                                                                locale="vi"
                                                                className="form-control form-control-lg input"/>
                                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                        </label>
                                                        {
                                                            sub[1]?.isUpdating && (
                                                                <label className="input-date second">
                                                                    <DatePicker
                                                                        selected={a}
                                                                        onChange={handleInputChange}
                                                                        dateFormat="dd/MM/yyyy"
                                                                        locale="vi"
                                                                        className="form-control form-control-lg input"/>
                                                                        <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                                </label>
                                                            )
                                                        }
                                                        </>
                                                    )
                                                    : (<div className="value">{ sub[1]?.startDate || '' }</div>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="group-input">
                                                <label>Kết thúc</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                        <label className="input-date">
                                                            <DatePicker
                                                                selected={sub[1]?.endDate}
                                                                onChange={handleInputChange}
                                                                dateFormat="dd/MM/yyyy"
                                                                locale="vi"
                                                                className="form-control form-control-lg input"/>
                                                                <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                        </label>
                                                        {
                                                            sub[1]?.isUpdating && (
                                                                <label className="input-date second">
                                                                    <DatePicker
                                                                        selected={a}
                                                                        onChange={handleInputChange}
                                                                        dateFormat="dd/MM/yyyy"
                                                                        locale="vi"
                                                                        className="form-control form-control-lg input"/>
                                                                        <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                                                </label>
                                                            )
                                                        }
                                                        </>
                                                    )
                                                    : (<div className="value">{ sub[1]?.endDate || '' }</div>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="group-input">
                                                <label>Chức vụ</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                            <input type="text" placeholder="Nhập" value={ sub[1]?.positionName || "" } className="first" />
                                                            { sub[1]?.isUpdating && (<input type="text" placeholder="Nhập" value={""} className="second" />) }       
                                                        </>
                                                    )
                                                    : (<div className="value">{ sub[1]?.positionName || '' }</div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="group-input role">
                                                <label>Vai trò chính</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                            <textarea rows="4">{ sub[1]?.roleName || "" }</textarea>
                                                            { sub[1]?.isUpdating && (<textarea rows="4" className="second">At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.</textarea>) }       
                                                        </>
                                                    )
                                                    : (<div className="value">{ sub[1]?.roleName || '' }</div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row salary">
                                        <div className="col-md-2">
                                            <div className="group-input">
                                                <label>Lương Net</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                            <input type="text" placeholder="Nhập" value={ sub[1]?.salary?.netSalary || '' } className="first" />
                                                            { sub[1]?.isUpdating && (<input type="text" placeholder="Nhập" value={""} className="second" />) }       
                                                        </>
                                                    )
                                                    : (<div className="value"><span>{ sub[1]?.salary?.netSalary || '' }</span><img src={IconEyeClosed} alt='EyeClosed' /></div>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="group-input">
                                                <label>Lương Gross</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                            <input type="text" placeholder="Nhập" value={ sub[1]?.salary?.grossSalary || '' } className="first" />
                                                            { sub[1]?.isUpdating && (<input type="text" placeholder="Nhập" value={""} className="second" />) }       
                                                        </>
                                                    )
                                                    : (<div className="value"><span>{ sub[1]?.salary?.grossSalary || '' }</span><img src={IconEyeClosed} alt='EyeClosed' /></div>)
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="group-input">
                                                <label>Tiền tệ</label>
                                                {
                                                    canUpdate
                                                    ? (
                                                        <>
                                                            <input type="text" placeholder="Nhập" value={ sub[1]?.currency || '' } className="first" />
                                                            { sub[1]?.isUpdating && (<input type="text" placeholder="Nhập" value={""} className="second" />) }       
                                                        </>
                                                    )
                                                    : (<div className="value">{ sub[1]?.currency || '' }</div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    canUpdate && (
                        <div className="block-btn-add-process">
                            <button><img src={IconAddGreen} alt="Add" /><span>Thêm quá trình</span></button>
                        </div>
                    )
                }
            </div>

            {/* t("NoDataFound") */}
        </div>
    )
}

export default WorkOutSideGroupItem