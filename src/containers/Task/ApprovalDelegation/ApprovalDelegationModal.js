import React, { useState, useEffect, useRef } from "react"
import axios from 'axios'
import _ from 'lodash'
import Select from 'react-select'
import { useTranslation } from "react-i18next"
import { Modal, Button, Form } from 'react-bootstrap'
import { formatStringByMuleValue } from "../../../commons/Utils"
import './ApprovalDelegationModal.scss'
import defaultAvartar from '../../../components/Common/DefaultAvartar'
import { actionApprovalDelegation } from "./Constant"
import Constants from "../../../commons/Constants"

const MyOption = props => {
    const { innerProps, innerRef, data } = props
    return (
        <div ref={innerRef} {...innerProps} className="user-options">
            <div className="user-info">
                <div className="avatar-block">
                    <img className="avatar" src={`data:image/png;base64,${data.avatar}`} onError={defaultAvartar} alt="avatar" />
                </div>
                <div className="info">
                    <div className="full-name">{data.fullName}</div>
                    <div className="detail">({data.userAccount}) {data.current_position}</div>
                </div>
            </div>
        </div>
    )
}

function ApprovalDelegationModal(props) {
    const { t } = useTranslation()
    const { isShow, onHideApprovalDelegationModal, action, title, userApprovalDelegation, updateStatus } = props
    const [users, SetUsers] = useState([])
    const [newUserApprovalDelegation, SetNewUserApprovalDelegation] = useState(null)
    const [textSearch, SetTextSearch] = useState("")
    const [keyword, SetKeyword] = useState("")
    const [error, SetError] = useState("")

    useEffect(() => {
        async function searchUsers() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            const response = await axios.post(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/search/info`, { account: keyword, should_check_superviser: false }, config)
            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    const data = response.data.data
                    const users = (data || []).map(res => {
                        return {
                            value: res.user_account,
                            label: res.fullName,
                            employeeNo: res.uid,
                            fullName: res.fullName,
                            avatar: res.avatar,
                            employeeLevel: res.employee_level,
                            pnl: res.pnl,
                            userAccount: res.user_account,
                            part: res.part,
                            current_position: res.title,
                            department: res.division + (res.department ? '/' + res.department : '') + (res.part ? '/' + res.part : '')
                        }
                    })
                    SetUsers(users)
                }
            }
        }

        if (keyword != "") {
            searchUsers()
        }
    }, [keyword])

    const sendQuery = query => {
        SetKeyword(query)
    }
    
    const delayedQuery = useRef(_.debounce(q => sendQuery(q), 1000)).current;

    const onChangeTextSearch = val => {
        SetTextSearch(val)
        delayedQuery(val)
    }

    const renderError = () => {
        return error ? <div className="text-danger">{error}</div> : null
    }

    const isDataValid = () => {
        const currentUserEmployeeNoLogged = localStorage.getItem("employeeNo")

        if (!newUserApprovalDelegation) {
            SetError(t("PleaseEnterInfo"))
            return false
        } else if (currentUserEmployeeNoLogged == newUserApprovalDelegation?.employeeNo) {
            SetError(t("ApprovalDeligationNotAllowedForYourSelf"))
            return false
        } else {
            SetError(t(""))
            return true
        }
    }

    const handleSubmit = async actionModal => {
        let result
        if (actionModal === actionApprovalDelegation.cancel) {
            result = await cancelApprovalDelegation()
        } else {
            const isValid = isDataValid()
            if (!isValid) {
                return
            }
            result = await createApprovalDelegation()
        }
        onHideApprovalDelegationModal()
        updateStatus(result)
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

    const createApprovalDelegation = async () => {
        try {
            const config = {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
            const data = {
                delegationUserId: newUserApprovalDelegation.userAccount,
                title: newUserApprovalDelegation.current_position,
                division: newUserApprovalDelegation.department,
                fullName: newUserApprovalDelegation.fullName
            }
            const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/delegation`, data, config)

            if (response && response.data) {
                const result = response.data.result
                if (result.code == Constants.API_SUCCESS_CODE) {
                    return {
                        message: t("ApprovalDelegatedSuccessfully"),
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

    const handleSelectChange = (value) => {
        SetNewUserApprovalDelegation(value)
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
                            <label className="form-label">{t("DelegateTo")}</label>
                            {
                                action === actionApprovalDelegation.cancel ?
                                <input type="text" className="input-text form-control" value={userApprovalDelegation.fullName || ""} readOnly />
                                :
                                <div className="content input-container ">
                                    <Select 
                                        components={{ Option: MyOption }}
                                        options={users}
                                        value={newUserApprovalDelegation}
                                        styles={customStyles}  
                                        onInputChange={onChangeTextSearch} 
                                        onChange={item => handleSelectChange(item)} 
                                        placeholder={t("SearchTextPlaceholder")} />
                                </div>
                            }
                        </div>
                        <Form.Group className="col-4">
                            <Form.Label>{t("Title")}</Form.Label>
                            {
                                action === actionApprovalDelegation.cancel 
                                ? <Form.Control type="text" className="input-text" value={userApprovalDelegation.title || ''} readOnly />
                                : <Form.Control type="text" className="input-text" value={newUserApprovalDelegation ? newUserApprovalDelegation.current_position : ''} readOnly />
                            }
                        </Form.Group>
                        <Form.Group className="col-4">
                            <Form.Label>{t("DepartmentManage")}</Form.Label>
                            {
                                action === actionApprovalDelegation.cancel 
                                ? <Form.Control type="text" className="input-text" value={userApprovalDelegation.division || ''} readOnly />
                                : <Form.Control type="text" className="input-text" value={newUserApprovalDelegation ? newUserApprovalDelegation.department : ''} readOnly />
                            }
                        </Form.Group>
                    </div>
                    {renderError()}
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
