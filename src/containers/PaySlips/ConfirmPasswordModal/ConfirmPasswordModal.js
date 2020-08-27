import React from "react"
import axios from 'axios'
import { Form, Button, Col, Modal } from 'react-bootstrap'

class ConfirmPasswordModal extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          password: '',
          error: ''
        }
      }

    setPassword (e) {
        this.setState({
            password: e.currentTarget.value
        })
    }

    checkPassword() {
        const config = {
            headers: {
                'Authorization': `${localStorage.getItem('accessToken')}`,
                'Content-Type':'multipart/form-data'
            }
        }

        let bodyFormData = new FormData()
        bodyFormData.append('pwd', this.state.password)

        axios.post(`${process.env.REACT_APP_REQUEST_URL}user/payslip/getaccesstoken`, bodyFormData, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                if (res.data.data.access_token && res.data.data.access_token != '') {
                    this.props.onUpdateToken(res.data.data.access_token)
                    this.props.onHide()
                } else {
                    this.setState({error: 'Mật khẩu nhập không chính xác'})
                }
            }
        }).catch(error => {
            this.setState({error: 'Mật khẩu nhập không chính xác'})
        })
    }

    keyPress(e){
        if(e.key == 'Enter'){
           this.checkPassword()
        }
     }
    
    render () {
        return (
            <Modal className='confirm-password-modal' centered show={this.props.show} onHide={this.props.onHide}>
                <Modal.Body>
                    <Form>
                        <Form.Row>
                            <Col xs={12}><Form.Label className="label">Nhập mật khẩu để xem bảng lương</Form.Label></Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xs={9}><Form.Control placeholder="Nhập mật khẩu" type="password"  onKeyPress={this.keyPress.bind(this)} onChange={this.setPassword.bind(this)}/></Col>
                            <Col xs={3}><Button type="button" className="mb-3 btn-submit" onClick={this.checkPassword.bind(this)}>Xác nhận</Button></Col>
                        </Form.Row>
                        {this.state.error.length > 0 ? <Form.Row><Col xs={12} className="text-danger">{this.state.error}</Col></Form.Row> : null}
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ConfirmPasswordModal;
