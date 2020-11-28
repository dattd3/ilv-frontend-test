import React, { useEffect, useState } from "react"
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import { Modal, Image, Form, Button } from 'react-bootstrap'
import Select from 'react-select'
import axios from 'axios';
import _ from 'lodash'

class SubmitQuestionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {},
            categorySelectedId: 0,
            validated: false,
            questionContent: ""
        };

    }
    componentWillMount() {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/categories`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let categoriesResult = res.data.data.sort((a, b) => {
                        return a.name[0].toLowerCase().localeCompare(b.name[0].toLowerCase(), "pl");
                    });;
                    this.setState({ categories: categoriesResult, categorySelectedId: categoriesResult[0].id});
                }
            }).catch(error => {
                //localStorage.clear();
                //window.location.href = map.Login;
            });
    }
    alertSuccess = () => {
        this.props.showStatusModal('Gửi câu hỏi thành công !', true);
    }
    alertFail = () => {
        this.props.showStatusModal('Không thành công. Xin vui lòng thử lại!')
    }
    setCategory(category) {
        this.setState({ categorySelectedId: category.value });
    }
    setValidated(value) {
        this.setState({ validated: value });
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSubmit = (event) => {
        debugger;
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            debugger;
            event.preventDefault();
            this.submitQuestion(this.state.categorySelectedId, this.state.questionContent, this.alertSuccess, this.alertFail);
        }
        this.setValidated(true);
    };

    submitQuestion(categoryId, questionContent, alertSuccess, alertFail) {
        debugger;
        var axios = require('axios');
        var data = JSON.stringify({
            "subject": questionContent,
            "content": questionContent,
            "ticketstatusid": 1,
            "userid": `${localStorage.getItem('email')}`,
            "agentid": "vuongvt2@vingroup.net",
            "supporterid": "",
            "ticketcategoryid": categoryId
        });

        var config = {
            method: 'post',
            url: `${process.env.REACT_APP_REQUEST_URL}ticket/Create`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                alertSuccess();
            })
            .catch(function (error) {
                alertFail();
            });
    }
    render() {
        let categoriesDisplay = [];
        if (this.state.categories && this.state.categories.length > 0) {
            categoriesDisplay = this.state.categories.map(category => {
                return {
                    value: category.id,
                    label: category.name
                }
            });
        }
        return (
            <Modal backdrop="static" keyboard={false} className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>ĐẶT CÂU HỎI</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                        <div className="wrap-result text-left">
                            <div className="form-group">
                                <label className="form-label">Nhóm câu hỏi</label>
                                <div className="content input-container ">
                                    <Select
                                        defaultValue={categoriesDisplay[0]}
                                        placeholder="Chọn nhóm câu hỏi..."
                                        options={categoriesDisplay}
                                        onChange={this.setCategory.bind(this)} />
                                </div>
                            </div>
                            <Form.Group controlId="QuestionContent">
                                <Form.Label>Nội dung câu hỏi</Form.Label>
                                <Form.Control type="text" placeholder="Nội dung câu hỏi" required name="questionContent" onChange={this.handleChange.bind(this)} />
                                <Form.Control.Feedback type="invalid">
                                    Điền nội dung câu hỏi !
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="submitQuestionForm.CBQL">
                                <Form.Label>CBQL trực tiếp</Form.Label>
                                <Form.Control type="text" placeholder="Huy Như" readOnly />
                            </Form.Group>
                            <Form.Group controlId="submitQuestionForm.Title">
                                <Form.Label>Chức danh</Form.Label>
                                <Form.Control type="text" placeholder="Trưởng Phòng" readOnly />
                            </Form.Group>
                            <Form.Group controlId="submitQuestionForm.Department">
                                <Form.Label>Khối/ Phòng/ Bộ phận</Form.Label>
                                <Form.Control type="text" placeholder="CNTT" readOnly />
                            </Form.Group>
                        </div>
                        <div className="clearfix edit-button text-right">
                            <Button variant="secondary" className="pr-4 pl-4" onClick={this.props.onHide}>Hủy</Button>{' '}
                            <Button type="Submit" variant="primary" className="pr-4 pl-4">Gửi</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default SubmitQuestionModal
