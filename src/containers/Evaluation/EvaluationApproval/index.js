import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { Image, Tabs, Tab, Form, Button, Modal, Row, Col, Collapse } from 'react-bootstrap'
import { useTranslation } from "react-i18next"
import axios from 'axios'

import LoadingModal from '../../../components/Common/LoadingModal'

import IconExpand from '../../../assets/img/icon/pms/icon-expand.svg'

function EvaluationApproval(props) {
    const [isLoading, SetIsLoading] = useState(false)
    const [isOpenFilterAdvancedApprovalTab, SetIsOpenFilterAdvancedApprovalTab] = useState(false)

    const handleChangeSelectInput = e => {

    }

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
                                <Form id="approval-form">
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
                                        <div className="filter-advanced-block">
                                            <span 
                                                className="btn-filter-advanced" 
                                                onClick={() => SetIsOpenFilterAdvancedApprovalTab(!isOpenFilterAdvancedApprovalTab)}
                                                aria-controls="approval-form-filter-advanced-collapse"
                                                aria-expanded={isOpenFilterAdvancedApprovalTab}
                                            >Tìm kiếm nâng cao<Image src={IconExpand} alt='Toggle' /></span>
                                        </div>
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
                                            </div>
                                        </Collapse>
                                    </Row>
                                </Form>
                            </div>
                        </Tab>
                        <Tab eventKey="batch-approval" title='Phê duyệt hàng loạt' className="tab-item">
                            <div className="batch-approval-tab-content">
                                <form id="batch-approval-form" >

                                </form>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            <div className="data-block">

            </div>
        </div>
        </>
    )
}

export default EvaluationApproval