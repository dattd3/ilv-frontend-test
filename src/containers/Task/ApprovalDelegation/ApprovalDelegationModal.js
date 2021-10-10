import React, { useState, useEffect } from "react"
import axios from 'axios'
import _ from 'lodash'
import Select, { components } from 'react-select'
import { useTranslation } from "react-i18next"
import { Modal, Button, Form } from 'react-bootstrap'
import { formatStringByMuleValue, formatNumberInteger } from "../../../commons/Utils"
import './ApprovalDelegationModal.scss'
import 'react-datepicker/dist/react-datepicker.css'
import defaultAvartar from '../../../components/Common/DefaultAvartar'
import { actionApprovalDelegation } from "./Constant"
import Constants from "../../../commons/Constants"

const MyOption = props => {
    const { innerProps, innerRef, data } = props
    return (
        <div ref={innerRef} {...innerProps} className="supporter">
            <div className="d-block clearfix">
                <div className="float-left mr-2 w-20">
                    <img width="50" height="50" className="avatar" src={`data:image/png;base64,${data.avatar}`} onError={defaultAvartar} alt="avatar" />
                </div>
                <div className="float-left text-wrap w-75">
                    <div className="title">{data.fullname}</div>
                    <div className="comment" style={{fontStyle: 'italic'}}>({data.userAccount}) {data.current_position}</div>
                </div>
            </div>
        </div>
    )
}

function ApprovalDelegationModal(props) {
    const { t } = useTranslation()
    const { isShow, onHideApprovalDelegationModal, action, title, userApprovalDelegation, updateStatus } = props
    const { users, SetUsers } = useState([])
    const { supporter, SetSupporter } = useState([])

    const handleSubmit = async actionModal => {
        if (actionModal === actionApprovalDelegation.cancel) {
            const result = await cancelApprovalDelegation()
            onHideApprovalDelegationModal()
            updateStatus(result)
        }
    }

    const cancelApprovalDelegation = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            const data = {
                delegationUserId: userApprovalDelegation.delegateUserId
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/remove-delegation`, data, config)

            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    return {
                        message: t("DelegationEndedSuccessfully"),
                        isSuccess: true
                    }
                }
                return {
                    message: result.message,
                    isSuccess: false
                }
            }
            return {
                message: t("AnErrorOccurred"),
                isSuccess: false
            }
        } catch (e) {
            return {
                message: t("AnErrorOccurred"),
                isSuccess: false
            }
        }
    }

    const onInputChange = () => {

    }

    const customStyles = {
        option: (styles, state) => ({
          ...styles,
          cursor: 'pointer',
        }),
        control: (styles) => ({
          ...styles,
          cursor: 'pointer',
        })
    }

    console.log(userApprovalDelegation)

    return (
        <>
        <Modal backdrop="static" keyboard={false} size="lg" className='approval-delegation-modal' centered show={isShow} onHide={onHideApprovalDelegationModal}>
            <Modal.Header className={action} closeButton>
                <h6 className="text-uppercase">{title}</h6>
            </Modal.Header>
            <Modal.Body className='approval-delegation-modal-body'>
                <div className="user-infos">
                    <div className="row">
                        <div className="form-group col-4">
                            <label className="form-label">{t("FullName")}</label>
                            {
                                action === actionApprovalDelegation.cancel ?
                                <input type="text" className="input-text form-control" value={userApprovalDelegation.delegateUserId || ""} readOnly />
                                :
                                <div className="content input-container ">
                                    <Select 
                                        name="supporter"
                                        options={users}
                                        value={supporter}
                                        styles={customStyles} components={{ Option: MyOption }} 
                                        onInputChange={onInputChange}  
                                        onChange={item => this.handleSelectChange('supporter', item)} 
                                        placeholder={t("SearchTextPlaceholder")} key="supporter" />
                                </div>
                            }
                        </div>
                        <Form.Group className="col-4">
                            <Form.Label>{t("Title")}</Form.Label>
                            {
                                action === actionApprovalDelegation.cancel 
                                ? <Form.Control type="text" className="input-text" value={userApprovalDelegation.title || ''} readOnly />
                                : <Form.Control type="text" className="input-text" placeholder={supporter ? supporter.current_position : ''} readOnly />
                            }
                        </Form.Group>
                        <Form.Group className="col-4">
                            <Form.Label>{t("DepartmentManage")}</Form.Label>
                            {
                                action === actionApprovalDelegation.cancel 
                                ? <Form.Control type="text" className="input-text" value={userApprovalDelegation.division || ''} readOnly />
                                : <Form.Control type="text" className="input-text" placeholder={supporter ? supporter.department : ''} readOnly />
                            }
                        </Form.Group>
                    </div>
                </div>
                <div className="buttons-block">
                    <Button type="button" variant="secondary" className="btn-cancel" onClick={onHideApprovalDelegationModal}>{t("CancelSearch")}</Button>
                    <Button type="button" variant="primary" className={`btn-submit ${action}`} onClick={() => handleSubmit(action)}>{t("Confirm")}</Button>
                </div>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ApprovalDelegationModal
