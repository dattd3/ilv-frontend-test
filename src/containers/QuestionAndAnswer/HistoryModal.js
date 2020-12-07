import React from "react"
import IconSuccess from '../../assets/img/ic-success.svg'
import IconFailed from '../../assets/img/ic-failed.svg'
import {Modal,  Image, Form, Button } from 'react-bootstrap'
import HistoryTable from './HistoryTable'
import CustomPaging from '../../components/Common/CustomPaging'
import TableUtil from '../../components/Common/table'
import axios from 'axios';
import ConfirmModal from './ConfirmModal'

class HistoryModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            search: {
                position: '',
                placeOfWork: 0
            },
            pageNumber: 1,
            isShowConfirmModal: false,
            questionSelectedID: 0
        }
    }

    onChangePage(index) {
        this.setState({ pageNumber: index })
    }

    componentDidMount() {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}ticket/histories`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let questionResult = res.data.data.sort((a, b) => Date.parse(a.createdAt) <= Date.parse(b.createdAt) ? 1 : -1);
                    this.setState({ questions: questionResult });
                }
            }).catch(error => {
                //localStorage.clear();
                //window.location.href = map.Login;
            });
    }
    
    showConfirmModal = (modalStatus, questionId = null) =>{
        this.setState({questionSelectedID: questionId, isShowConfirmModal: modalStatus });
    }

    showEditModal = (question) =>{
        this.props.showEditModal(question)
    }

    deleteQuestion = (questionId) => {
        this.props.onHide();
        var axios = require('axios');
        var config = {
            method: 'post',
            url: `${process.env.REACT_APP_REQUEST_URL}ticket/delete/` + questionId,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        };
        let _this = this
        axios(config)
            .then(function (response) {
                _this.showConfirmModal(false);
                _this.props.showStatusModal("Thu hồi câu hỏi thành công!", true)
            })
            .catch(function (error) {
                _this.props.showStatusModal("Có lỗi xảy ra!")
            });
    }

    render() {
        const recordPerPage = 5
        const questions = this.state.questions
        return (
            <>
                <ConfirmModal 
                questionSelectedID = {this.state.questionSelectedID} 
                show={this.state.isShowConfirmModal} 
                onHide={() => this.showConfirmModal(false)} 
                showStatusModal={this.props.showStatusModal}
                onAcceptClick = {() => this.deleteQuestion(this.state.questionSelectedID)}
                onCancelClick = {() => this.showConfirmModal(false)}
                confirmHeader = "XÁC NHẬN THU HỒI"
                confirmContent = "Bạn xác nhận muốn thu hồi nội dung này?"
                />
                <Modal size="xl" className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                    <Modal.Header className='apply-position-modal' closeButton>
                        <Modal.Title>LỊCH SỬ GIẢI ĐÁP</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <HistoryTable showConfirms={this.showConfirmModal.bind(this)} 
                        showEditModal = {this.showEditModal.bind(this)}
                        questions={TableUtil.updateData(questions, this.state.pageNumber - 1, recordPerPage)} />

                        <div className="row paging">
                            <div className="col-sm content-center">
                                <CustomPaging pageSize={recordPerPage} onChangePage={this.onChangePage.bind(this)} totalRecords={questions.length} />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

export default HistoryModal
