import React from "react"
import { useTranslation } from "react-i18next"
import DatePicker, {registerLocale } from 'react-datepicker'
import moment from 'moment'
import { formatStringByMuleValue } from "../../commons/Utils"
import IconCancel from "../../assets/img/icon/Icon_Cancel_White.svg"
import IconDatePicker from "../../assets/img/icon/Icon_DatePicker.svg"
import IconAddGreen from "../../assets/img/ic-add-green.svg"
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
registerLocale("vi", vi)

function WorkOutSideGroupItem({ item }) {
    const { t } = useTranslation()
    
    const a = null

    return (
        <div className="work-outside-group-item">
            <div className="group company-info">
                <div className="group-header">
                    <h5>Thông tin Công ty</h5>
                    <span className="btn-cancel">
                        <img src={IconCancel} alt="Cancel" />
                        <span>Hủy</span>
                    </span>
                </div>
                <div className="content">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="group-name">
                                <label>Tên công ty</label>
                                <input type="text" placeholder="Nhập" value={""} className="first" />
                                <input type="text" placeholder="Nhập" value={""} className="second" />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="group-date">
                                <label>Bắt đầu</label>
                                <label className="input-date">
                                    <DatePicker
                                        selectsStart
                                        selected={a}
                                        startDate={a}
                                        endDate={a}
                                        onChange={a}
                                        dateFormat="dd/MM/yyyy"
                                        locale="vi"
                                        className="form-control form-control-lg input"/>
                                        <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="group-date">
                                <label>Kết thúc</label>
                                <label className="input-date">
                                    <DatePicker
                                        selectsStart
                                        selected={a}
                                        startDate={a}
                                        endDate={a}
                                        onChange={a}
                                        dateFormat="dd/MM/yyyy"
                                        locale="vi"
                                        className="form-control form-control-lg input"/>
                                        <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="group process">
                <div className="item">
                    <div className="group-header">
                        <h5>Quá trình 1</h5>
                        <span className="btn-cancel">
                            <img src={IconCancel} alt="Cancel" />
                        </span>
                    </div>
                    <div className="content">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Bắt đầu</label>
                                    <label className="input-date">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                    <label className="input-date second">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Kết thúc</label>
                                    <label className="input-date">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                    <label className="input-date second">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="group-input">
                                    <label>Chức vụ</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="group-input role">
                                    <label>Vai trò chính</label>
                                    <textarea rows="4">
                                    At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                    </textarea>
                                    <textarea rows="4" className="second">
                                    At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row salary">
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Lương Net</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Lương Gross</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="group-input">
                                    <label>Tiền tệ</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="item">
                    <div className="group-header">
                        <h5>Quá trình 2</h5>
                        <span className="btn-cancel">
                            <img src={IconCancel} alt="Cancel" />
                        </span>
                    </div>
                    <div className="content">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Bắt đầu</label>
                                    <label className="input-date">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                    <label className="input-date second">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Kết thúc</label>
                                    <label className="input-date">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                    <label className="input-date second">
                                        <DatePicker
                                            selectsStart
                                            selected={a}
                                            startDate={a}
                                            endDate={a}
                                            onChange={a}
                                            dateFormat="dd/MM/yyyy"
                                            locale="vi"
                                            className="form-control form-control-lg input"/>
                                            <span className="input-img"><img src={IconDatePicker} alt='Date' /></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="group-input">
                                    <label>Chức vụ</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="group-input role">
                                    <label>Vai trò chính</label>
                                    <textarea rows="4">
                                    At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                    </textarea>
                                    <textarea rows="4" className="second">
                                    At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row salary">
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Lương Net</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="group-input">
                                    <label>Lương Gross</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="group-input">
                                    <label>Tiền tệ</label>
                                    <input type="text" placeholder="Nhập" value={""} className="first" />
                                    <input type="text" placeholder="Nhập" value={""} className="second" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block-btn-add-process">
                    <button><img src={IconAddGreen} alt="Add" /><span>Thêm quá trình</span></button>
                </div>
            </div>

            {/* t("NoDataFound") */}
        </div>
    )
}

export default WorkOutSideGroupItem