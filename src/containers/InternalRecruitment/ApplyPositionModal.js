import React from "react";
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios'
import _ from 'lodash'

const getFileName = () => {
    var file = document.getElementById('file-upload');
    const fileName = file.files[0].name;
    document.getElementById('file-name-upload').innerHTML = fileName;
}


class ApplyPositionModal extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            fullname: '',
            personal_email: '',
            cell_phone_no: '',
            note: '',
            optionApply: 1,
            errors: {
                fullname: '',
                personal_email: '',
                cell_phone_no: '',
                file: ''
            }
        }
        this.fileInput = React.createRef()
      }

    componentWillMount () {
        let config = {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
              'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
          }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/user/personalinfo`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                let profile = res.data.data[0];
                this.setState({ fullname: profile.fullname, personal_email: profile.personal_email, cell_phone_no: profile.cell_phone_no });
                }
            }).catch(error => {
                // localStorage.clear();
                // window.location.href = map.Login;
            });
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    validate () {
        let errors = {
            fullname: '',
            personal_email: '',
            cell_phone_no: '',
            file: ''
        }

        if (_.isEmpty(this.state['fullname'])) {
            errors['fullname'] = '(Bắt buộc)'
        }

        if (_.isEmpty(this.state['cell_phone_no'])) {
            errors['cell_phone_no'] = '(Bắt buộc)'
        }

        if (!/^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i.test(this.state.personal_email)) {
            errors['personal_email'] = '(Format email không đúng!)'
        }
           
        if(!this.fileInput.current.files[0]) {
            errors['file'] = '(Bắt buộc)'
        }

        if (!_.isEmpty(errors['fullname']) || !_.isEmpty(errors['personal_email']) || !_.isEmpty(errors['cell_phone_no']) || !_.isEmpty(errors['file']))
        {
            this.setState({errors: errors})
            return false
        }
        return true
    }

    handleSubmit(event) {
        if (!this.validate()) return false
        debugger
        let formData = new FormData()
        formData.append('file', this.fileInput.current.files[0])
        formData.append('optionApply', this.state.optionApply)
        formData.append('fullname', this.state.fullname)
        formData.append('email', this.state.personal_email)
        formData.append('phone', this.state.cell_phone_no)
        formData.append('note', this.state.note)
        formData.append('vacancyId ', this.props.id)
        formData.append('userId ', localStorage.getItem('employeeNo'))
     
        const config = {
            headers: {
              'Authorization': `${localStorage.getItem('accessToken')}`,
              'content-type': 'multipart/form-data'
            }
        }
    
        axios.post(`${process.env.REACT_APP_REQUEST_URL}Vacancy/apply`, formData, config)
        .then(res => {
          if (res && res.data && res.data.data) {
              console.log(res.data.data)
              this.props.showStatusModal(`Bạn đã nộp đơn ${this.state.optionApply == 1 ? 'ứng tuyển' : 'giới thiệu'} thành công!`, true)
          }
        }).catch(error => {
            this.props.showStatusModal('Không thành công. Xin vui lòng thử lại!')
            // localStorage.clear();
            // window.location.href = map.Login;
        })
    }


    render () {
        return (
            <>
            <Modal size="lg" className='info-modal-common position-apply-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header className='apply-position-modal' closeButton>
                    <Modal.Title>Ứng tuyển</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div key={`inline-radio`} className="apply-option">
                            <Form.Check className="option-apply" inline label="Ứng tuyển" onChange={this.handleChange.bind(this)} value="1" type={`radio`} id={`inline-radio-1`}  name='optionApply' defaultChecked />
                            <Form.Check className="option-apply" inline label="Giới thiệu" onChange={this.handleChange.bind(this)} value="2" type={`radio`} id={`inline-radio-2`} name='optionApply' />
                        </div>
                        <Form.Group as={Row} controlId="formHorizontalName">
                            <Form.Label column sm={3}>Họ và tên</Form.Label>
                            <Col sm={9}>
                            <Form.Control type="text" placeholder="Họ và tên" name="fullname" onChange={this.handleChange.bind(this)} value={this.state.fullname} required />
                            {!_.isEmpty(this.state.errors.fullname) ? <div className="text-danger">{this.state.errors.fullname}</div> : null}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>Email</Form.Label>
                            <Col sm={9}>
                            <Form.Control type="email" placeholder="Email" name="personal_email" onChange={this.handleChange.bind(this)} value={this.state.personal_email} required />
                            {!_.isEmpty(this.state.errors.personal_email) ? <div className="text-danger">{this.state.errors.personal_email}</div> : null}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalPhone">
                            <Form.Label column sm={3}>Số điện thoại</Form.Label>
                            <Col sm={9}>
                            <Form.Control type="text" placeholder="Số điện thoại" name="cell_phone_no" onChange={this.handleChange.bind(this)} value={this.state.cell_phone_no} required />
                            {!_.isEmpty(this.state.errors.cell_phone_no) ? <div className="text-danger">{this.state.errors.cell_phone_no}</div> : null}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="file-block">
                            <Form.Label column sm={3}>Tải lên CV</Form.Label>
                            <Col sm={9}>
                            <Form.Label htmlFor="file-upload" className="custom-file-upload" column sm={9}>
                                <i className="fa fa-cloud-upload"></i><span id="file-name-upload" className="file-name-upload">Chọn file ...</span>
                            </Form.Label>
                            {!_.isEmpty(this.state.errors.file) ? <div className="text-danger">{this.state.errors.file}</div> : null}
                            </Col>
                            <Col sm={9}>
                                <Form.File
                                className="position-relative"
                                required
                                name="file"
                                label=""
                                id="file-upload"
                                ref={this.fileInput}
                                onChange={getFileName}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalPassword">
                            <Form.Label column sm={3}>Ghi chú</Form.Label>
                            <Form.Control.Feedback>(Không bắt buộc)</Form.Control.Feedback>
                            <Col sm={9}>
                            <Form.Control as="textarea" rows="4" placeholder="Nhập ghi chú ..." name="note" onChange={this.handleChange.bind(this)} value={this.state.note} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Col sm={{ span: 9, offset: 3 }} className="buttons-block">
                                <Button type="button" className="btn-close" onClick={this.props.onHide}>Hủy</Button>
                                <Button type="button" className="btn-send" onClick={this.handleSubmit.bind(this)}>Nộp hồ sơ</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}
export default ApplyPositionModal;
