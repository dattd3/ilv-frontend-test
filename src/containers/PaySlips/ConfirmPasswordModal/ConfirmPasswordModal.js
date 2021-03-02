import React from "react"
import axios from 'axios'
import { Form, Button, Col, Modal } from 'react-bootstrap'
import qs from 'qs'

class ConfirmPasswordModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            error: '',
            disabledSubmitButton: false
        }
    }

    setPassword(e) {
        this.setState({
            password: e.currentTarget.value
        })
    }

    checkPassword() {
        if (this.state.disabledSubmitButton) {
            return;
        }
        this.setState({disabledSubmitButton: true});

        const config = {
            headers: {
                'Authorization': `${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        }
        let bodyFormData = new FormData()
        bodyFormData.append('pwd', this.state.password)

        axios.post(`${process.env.REACT_APP_REQUEST_URL}user/payslip/getaccesstoken`, bodyFormData, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    if (res.data.data.redirect_uri && res.data.data.redirect_uri != '') {
                        window.location.href = res.data.data.redirect_uri;
                    } else {
                        if (res.data.data.access_token && res.data.data.access_token != '') {
                            this.props.onUpdateToken(res.data.data.access_token)
                            this.props.onHide()
                        } else {
                            this.setState({ error: 'Mật khẩu không chính xác!' })
                            this.setState({disabledSubmitButton: false});
                        }
                    }
                }
            }).catch(error => {
                
            })
    }

    keyPress(e) {
        this.setState({ error: "" })
        if (e.key == 'Enter') {
            this.checkPassword()
            e.preventDefault()
        }
    }

    render() {
        return (
            <Modal className='confirm-password-modal' backdrop="static" centered show={this.props.show}>
                <Modal.Header>
                    <a href="/" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </a>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col xs={12}><Form.Label className="label">Nhập mật khẩu để xem bảng lương</Form.Label></Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9}><Form.Control placeholder="Nhập mật khẩu" type="password" onKeyPress={this.keyPress.bind(this)} onChange={this.setPassword.bind(this)} /></Col>
                            <Col xs={3}><Button type="button" className="mb-3 btn-submit" onClick={this.checkPassword.bind(this)} disabled = {this.state.disabledSubmitButton}>Xác nhận</Button></Col>
                        </Form.Row>
                        {this.state.error.length > 0 ? <Form.Row><Col xs={12} className="text-danger">{this.state.error}</Col></Form.Row> : null}
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ConfirmPasswordModal;
