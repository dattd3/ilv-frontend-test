import React from "react"
import axios from 'axios'
import { Form, Button, Col, Modal } from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'
import { withTranslation } from "react-i18next"
import IconX from 'assets/img/icon/icon_x.svg'
import IconAccept from 'assets/img/icon/Icon_Check_White.svg'
import './styles.scss';

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
        const { disabledSubmitButton, password } = this.state
        if (disabledSubmitButton || password === '') {
            return
        }

        this.setState({ disabledSubmitButton: true })
        const config = {
            headers: {
                'Authorization': `${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        }
        let bodyFormData = new FormData()
        bodyFormData.append('pwd', password)

        if (this.props?.state) {
            bodyFormData.append('state', this.props?.state)
        }

        axios.post(`${process.env.REACT_APP_REQUEST_URL}user/payslip/getaccesstoken`, bodyFormData, config)
        .then(res => {
            if (res && res.data && res.data.data) {
                if (res.data.data.redirect_uri && res.data.data.redirect_uri != '') {
                    window.location.href = res.data.data.redirect_uri;
                } else {
                    if (res.data.data.access_token && res.data.data.access_token != '') {
                        this.props.onUpdateToken(res.data.data.access_token)
                        this.props.onHide()
                        this.setState({ disabledSubmitButton: false });
                    } else {
                        this.setState({ error: this.props.t("InvalidPassword") })
                        this.setState({ disabledSubmitButton: false });
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
        const { t, show, onHide } = this.props
        const { disabledSubmitButton, error } = this.state
        const isCancel = true

        return (
            <Modal className='modal-confirm-password' centered backdrop="static" show={show} onHide={onHide}>
                <Modal.Header className='modal-confirm-password__header'>
                    <p className='modal-confirm-password__title font-weight-bold'>{t("EnterPasswordToViewPayslip")}</p>
                    <img
                        src={IconX}
                        className='mr-1 cursor-pointer icon-delete'
                        onClick={() => onHide(isCancel)}
                    />
                </Modal.Header>
                <Modal.Body className='modal-confirm-password__body'>
                    <div className="content">
                        <Form>
                            <Form.Row>
                                <Col xs={12}><Form.Label className="modal-confirm-password__textlabel">{t("EnterPassword")}</Form.Label></Col>
                            </Form.Row>
                            <Form.Row>
                                <Col xs={9}><Form.Control type="password" onKeyPress={this.keyPress.bind(this)} onChange={this.setPassword.bind(this)} /></Col>
                                <Col xs={3}>
                                    <Button type="button" className="mb-3 btn-submit" onClick={this.checkPassword.bind(this)} disabled={disabledSubmitButton}>
                                        {/* {!disabledSubmitButton ? t("Confirm") :
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />} */}
                                            <img src={IconAccept} alt="Check" />
                                            { t("Confirm") }
                                    </Button>
                                </Col>
                            </Form.Row>
                            {error?.length > 0 ? <Form.Row><Col xs={12} className="text-danger">{error}</Col></Form.Row> : null}
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default withTranslation()(ConfirmPasswordModal)
