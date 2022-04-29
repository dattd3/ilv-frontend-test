import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Modal, Row, Col, Collapse } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useTranslation } from "react-i18next"
import axios from 'axios'
import LoadingModal from '../../../components/Common/LoadingModal'
import CustomPaging from '../../../components/Common/CustomPaging';
import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'
import IconSearch from '../../../assets/img/icon/Icon_Loop.svg'
import 'react-datepicker/dist/react-datepicker.css'
import vi from 'date-fns/locale/vi'
registerLocale("vi", vi)

function EvaluationApproval(props) {
    const { t } = useTranslation()
    const [isLoading, SetIsLoading] = useState(false)
    const [isOpenFilterAdvancedApprovalTab, SetIsOpenFilterAdvancedApprovalTab] = useState(false)
    const [isOpenFilterAdvancedBatchApprovalTab, SetIsOpenFilterAdvancedBatchApprovalTab] = useState(false)

    const handleChangeSelectInput = e => {

    }

    const handleDatePickerInputChange = (date, stateName) => {

    }

    const handleFilter = (e, tab) => {

    }

    const onChangePage = () => {

    }

    const evaluationForms = [1]
    const pageSize = 10
    const total = 30

    return (
        <>
        <LoadingModal show={isLoading} />
        <div className="evaluation-approval-page">
            <h1 className="content-page-header">Đánh giá</h1>
            <div className="filter-block">
                <div className="card shadow card-filter">
                    <Tabs defaultActiveKey="approval" id="filter-tabs">
                        <Tab eventKey="approval" title='Đánh giá/Phê duyệt' className="tab-item">
                            <div className="approval-tab-content">
                                <Form id="approval-form" onSubmit={e => handleFilter(e, 'approval')}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} controlId="status">
                                                <Form.Label column sm={12}>Trạng thái</Form.Label>
                                                <Col sm={12}>
                                                    <Select 
                                                        placeholder="Lựa chọn" 
                                                        isClearable={true} 
                                                        value={null} 
                                                        options={[]} 
                                                        onChange={handleChangeSelectInput} />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} controlId="employee">
                                                <Form.Label column sm={12}>Tìm kiếm nhân viên</Form.Label>
                                                <Col sm={12}>
                                                    <Select 
                                                        placeholder="Lựa chọn" 
                                                        isClearable={true} 
                                                        value={null} 
                                                        options={[]} 
                                                        onChange={handleChangeSelectInput} />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <div className="filter-advanced-block">
                                                <span 
                                                    className="btn-filter-advanced" 
                                                    onClick={() => SetIsOpenFilterAdvancedApprovalTab(!isOpenFilterAdvancedApprovalTab)}
                                                    aria-controls="approval-form-filter-advanced-collapse"
                                                    aria-expanded={isOpenFilterAdvancedApprovalTab}
                                                >Tìm kiếm nâng cao<Image src={IconExpand} alt='Toggle' /></span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Collapse in={isOpenFilterAdvancedApprovalTab}>
                                        <div id="approval-form-filter-advanced-collapse" className="filter-advanced-form">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="current-step">
                                                        <Form.Label column sm={12}>Bước hiện tại</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="block">
                                                        <Form.Label column sm={12}>Ban/Chuỗi/Khối</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="region">
                                                        <Form.Label column sm={12}>Phòng/Vùng/Miền</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="unit">
                                                        <Form.Label column sm={12}>Các đơn vị thành viên</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <Form.Group as={Row} controlId="group">
                                                        <Form.Label column sm={12}>Phòng/Bộ phận/Nhóm</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="rank">
                                                        <Form.Label column sm={12}>Cấp bậc</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="title">
                                                        <Form.Label column sm={12}>Chức danh</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="from-date">
                                                        <Form.Label column sm={12}>Từ ngày</Form.Label>
                                                        <Col sm={12}>
                                                            <DatePicker
                                                                // selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                                                selected={null}
                                                                onChange={fromDate => handleDatePickerInputChange(fromDate, "fromDate")}
                                                                dateFormat="dd/MM/yyyy"
                                                                showMonthDropdown={true}
                                                                showYearDropdown={true}
                                                                locale="vi"
                                                                className="form-control input" />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="to-date">
                                                        <Form.Label column sm={12}>Đến ngày</Form.Label>
                                                        <Col sm={12}>
                                                            <DatePicker
                                                                // selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                                                selected={null}
                                                                onChange={toDate => handleDatePickerInputChange(toDate, "toDate")}
                                                                dateFormat="dd/MM/yyyy"
                                                                showMonthDropdown={true}
                                                                showYearDropdown={true}
                                                                locale="vi"
                                                                className="form-control input" />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Collapse>
                                    <Row>
                                        <Col md={12}>
                                            <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt="Search" />Tìm kiếm</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="batch-approval" title='Phê duyệt hàng loạt' className="tab-item">
                            <div className="batch-approval-tab-content">
                            <Form id="batch-approval-form" onSubmit={e => handleFilter(e, 'batch-approval')}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} controlId="status">
                                                <Form.Label column sm={12}>Chọn biểu mẫu</Form.Label>
                                                <Col sm={12}>
                                                    <Select 
                                                        placeholder="Lựa chọn" 
                                                        isClearable={true} 
                                                        value={null} 
                                                        options={[]} 
                                                        onChange={handleChangeSelectInput} />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} controlId="employee">
                                                <Form.Label column sm={12}>Tìm kiếm nhân viên</Form.Label>
                                                <Col sm={12}>
                                                    <Select 
                                                        placeholder="Lựa chọn" 
                                                        isClearable={true} 
                                                        value={null} 
                                                        options={[]} 
                                                        onChange={handleChangeSelectInput} />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <div className="filter-advanced-block">
                                                <span 
                                                    className="btn-filter-advanced" 
                                                    onClick={() => SetIsOpenFilterAdvancedBatchApprovalTab(!isOpenFilterAdvancedBatchApprovalTab)}
                                                    aria-controls="approval-form-filter-advanced-collapse"
                                                    aria-expanded={isOpenFilterAdvancedBatchApprovalTab}
                                                >Tìm kiếm nâng cao<Image src={IconExpand} alt='Toggle' /></span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Collapse in={isOpenFilterAdvancedBatchApprovalTab}>
                                        <div id="approval-form-filter-advanced-collapse" className="filter-advanced-form">
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="current-step">
                                                        <Form.Label column sm={12}>Bước hiện tại</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="block">
                                                        <Form.Label column sm={12}>Ban/Chuỗi/Khối</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="region">
                                                        <Form.Label column sm={12}>Phòng/Vùng/Miền</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group as={Row} controlId="unit">
                                                        <Form.Label column sm={12}>Các đơn vị thành viên</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <Form.Group as={Row} controlId="group">
                                                        <Form.Label column sm={12}>Phòng/Bộ phận/Nhóm</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="rank">
                                                        <Form.Label column sm={12}>Cấp bậc</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="title">
                                                        <Form.Label column sm={12}>Chức danh</Form.Label>
                                                        <Col sm={12}>
                                                            <Select 
                                                                placeholder="Lựa chọn" 
                                                                isClearable={true} 
                                                                value={null} 
                                                                options={[]} 
                                                                onChange={handleChangeSelectInput} />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="from-date">
                                                        <Form.Label column sm={12}>Từ ngày</Form.Label>
                                                        <Col sm={12}>
                                                            <DatePicker
                                                                // selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                                                selected={null}
                                                                onChange={fromDate => handleDatePickerInputChange(fromDate, "fromDate")}
                                                                dateFormat="dd/MM/yyyy"
                                                                showMonthDropdown={true}
                                                                showYearDropdown={true}
                                                                locale="vi"
                                                                className="form-control input" />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={3}>
                                                    <Form.Group as={Row} controlId="to-date">
                                                        <Form.Label column sm={12}>Đến ngày</Form.Label>
                                                        <Col sm={12}>
                                                            <DatePicker
                                                                // selected={item.new_dob ? moment(item.new_dob, 'DD-MM-YYYY').toDate() : null}
                                                                selected={null}
                                                                onChange={toDate => handleDatePickerInputChange(toDate, "toDate")}
                                                                dateFormat="dd/MM/yyyy"
                                                                showMonthDropdown={true}
                                                                showYearDropdown={true}
                                                                locale="vi"
                                                                className="form-control input" />
                                                        </Col>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Collapse>
                                    <Row>
                                        <Col md={12}>
                                            <Button type="submit" className="btn btn-submit"><Image src={IconSearch} alt="Search" />Tìm kiếm</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>

            <div className="data-block">
                {
                    isOpenFilterAdvancedApprovalTab && !isOpenFilterAdvancedBatchApprovalTab && 
                    <div className="card shadow approval-data">
                    {
                        evaluationForms?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-form-code"><div className="form-code">Mã biểu mẫu</div></th>
                                        <th className="c-form-sender"><div className="form-sender">Người gửi biểu mẫu</div></th>
                                        <th className="c-form-name"><div className="form-name">Tên biểu mẫu</div></th>
                                        <th className="c-sent-date"><div className="sent-date">Ngày gửi</div></th>
                                        <th className="c-status"><div className="status">Tình trạng</div></th>
                                        <th className="c-current-step"><div className="current-step">Bước hiện tại</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="c-form-code"><div className="form-code">A12345</div></td>
                                        <td className="c-form-sender"><div className="form-sender">Nguyễn Văn An</div></td>
                                        <td className="c-form-name"><div className="form-name">Biểu mẫu Q1/2022</div></td>
                                        <td className="c-sent-date"><div className="sent-date">01/03/2021</div></td>
                                        <td className="c-status"><div className="status">Đang đánh giá</div></td>
                                        <td className="c-current-step"><div className="current-step">QLTT đánh giá</div></td>
                                    </tr>
                                    <tr>
                                        <td className="c-form-code"><div className="form-code">A12345</div></td>
                                        <td className="c-form-sender"><div className="form-sender">Nguyễn Văn An</div></td>
                                        <td className="c-form-name"><div className="form-name">Biểu mẫu Q1/2022</div></td>
                                        <td className="c-sent-date"><div className="sent-date">01/03/2021</div></td>
                                        <td className="c-status"><div className="status">Đang đánh giá</div></td>
                                        <td className="c-current-step"><div className="current-step">QLTT đánh giá</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select>
                                    <option></option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }

                {
                    isOpenFilterAdvancedBatchApprovalTab &&
                    <div className="card shadow batch-approval-data">
                    {
                        evaluationForms?.length > 0 ?
                        <>
                        <div className="wrap-table-list-evaluation">
                            <div className="select-item-block">
                                <input type="checkbox" checked={false} id="check-all" name="check-all" />
                                <label htmlFor="check-all">Chọn tất cả</label>
                            </div>
                            <table className='table-list-evaluation'>
                                <thead>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"></th>
                                        <th className="c-attitude" colSpan="2">Tinh thần thái độ</th>
                                        <th className="c-work-results" colSpan="2">Kết quả công việc</th>
                                        <th className="c-summary" colSpan="2">Tổng kết</th>
                                    </tr>
                                    <tr>
                                        <th className="c-user-info" colSpan="2"><div className="user-info">Họ và tên CBNV được đánh giá</div></th>
                                        <th className="c-self-assessment"><div className="self-assessment">Tự đánh giá</div></th>
                                        <th className="c-cbql-assessment"><div className="cbql-assessment">CBQL đánh giá</div></th>
                                        <th className="c-self-assessment"><div className="self-assessment">Tự đánh giá</div></th>
                                        <th className="c-cbql-assessment"><div className="cbql-assessment">CBQL đánh giá</div></th>                                        <th className="c-self-assessment"><div className="self-assessment">Tự đánh giá</div></th>
                                        <th className="c-cbql-assessment"><div className="cbql-assessment">CBQL đánh giá</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="c-self-assessment">80</td>
                                        <td className="c-cbql-assessment">85</td>
                                        <td className="c-self-assessment">100</td>
                                        <td className="c-cbql-assessment">90</td>
                                        <td className="c-self-assessment">96</td>
                                        <td className="c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                    <tr>
                                        <td className="c-check"><div className="check"><input type="checkbox" checked={false} /></div></td>
                                        <td className="c-full-name"><div className="full-name">Nguyễn Hoàng Minh Duy</div></td>
                                        <td className="c-self-assessment">80</td>
                                        <td className="c-cbql-assessment">85</td>
                                        <td className="c-self-assessment">100</td>
                                        <td className="c-cbql-assessment">90</td>
                                        <td className="c-self-assessment">96</td>
                                        <td className="c-cbql-assessment">89</td>
                                    </tr>
                                    <tr className="divider"></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bottom-region">
                            <div className="customize-display">
                                <label>Hiển thị</label>
                                <select>
                                    <option></option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div className="paging-block">
                                <CustomPaging pageSize={parseInt(pageSize)} onChangePage={onChangePage} totalRecords={total} />
                            </div>
                        </div>
                        </>
                        : <h6 className="alert alert-danger not-found-data" role="alert">{t("NoDataFound")}</h6>
                    }
                    </div>
                }
            </div>
        </div>
        </>
    )
}

export default EvaluationApproval