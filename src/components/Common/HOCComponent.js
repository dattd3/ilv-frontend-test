import React, { useState } from "react"
import moment from 'moment'
import axios from 'axios'
import { BroadcastChannel } from 'broadcast-channel'
import { useGuardStore } from '../../modules/index'
import { getRequestConfigurations } from '../../commons/Utils'
import { getStateRedirect } from "../../commons/commonFunctions";
import WarningTokenModal from './WarningTokenModal'
// import { useIdle } from '../../commons/hooks'
 
function HOCComponent(Component) {
    return function WrappedComponent(props) {
        const guard = useGuardStore();
        const refreshTokenChannel = new BroadcastChannel('refreshTokenChannel')
        const logoutChannel = new BroadcastChannel('logoutChannel')
        const warning = 0
        const expired = 1
        const modalTypeContentMapping = {
            [warning]: {
                title: 'Cảnh báo hết hạn phiên làm việc',
                content: 'Phiên làm việc của bạn sẽ hết hạn sau 05:00 phút. Bạn có muốn gia hạn phiên làm việc?',
            },
            [expired]: {
                title: 'Phiên làm việc đã kết thúc',
                content: 'Phiên làm việc của bạn đã kết thúc. Vui lòng đăng nhập lại!'
            }
        }
        const [warningTokenModal, SetWarningTokenModal] = useState({
            isShow: false,
            type: warning,
            title: '',
            content: ''
        })
        // const isIdle = useIdle({timeToIdle: 5000})

        // const getOrganizationLevelByRawLevel = level => {
        //     return (level == undefined || level == null || level == "" || level == "#") ? 0 : level
        // }

        React.useEffect(() => {
            // const companyCode = localStorage.getItem('companyCode')
            // const lv3 = localStorage.getItem('organizationLv3')
            // const lv4 = getOrganizationLevelByRawLevel(localStorage.getItem('organizationLv4'))
            // const lv5 = getOrganizationLevelByRawLevel(localStorage.getItem('organizationLv5'))
            // const lang = localStorage.getItem("locale")
            // const apiConfig = getRequestConfigurations()

            // axios.get(`${process.env.REACT_APP_REQUEST_URL}notifications-unread-limitation`, {
            //     params: {
            //         companyCode: companyCode,
            //         level3: lv3,
            //         level4: lv4,
            //         level5: lv5,
            //         culture: lang
            //     },
            //     ...apiConfig,
            // })
            // .catch(error => {
            //     if (error?.response?.status === 401 || error?.response?.data?.result?.code == 401) {
            //         guard.setLogOut();
            //         window.location.href = process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL;
            //     }
            // })

            const tokenTimeExpireStorage = localStorage.getItem('tokenExpired')
            const now = moment()
            const tokenTimeExpired = moment(tokenTimeExpireStorage, 'YYYYMMDDHHmmss')
            const countDownTime = tokenTimeExpired.diff(now, 'milliseconds')
            const lastMinutesCountdown = 5
            const totalTimeCountdown = 60000 * lastMinutesCountdown // 5 phút cuối bắt đầu đếm ngược
            const countDownTimeToMinutes = countDownTime/60000

            let timerForWarning = null
            // if (countDownTime > 0 && countDownTimeToMinutes <= lastMinutesCountdown) {
            if (countDownTime > 0) {
                let isCancelRefreshToken = localStorage.getItem('isCancelRefreshToken')
                timerForWarning = setTimeout(() => {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: isCancelRefreshToken === 'true' ? false : true,
                        type: warning,
                        title: modalTypeContentMapping[warning].title,
                        content: modalTypeContentMapping[warning].content,
                    })
                }, countDownTime - totalTimeCountdown)
            }
            // else {
            //     clearTimeout(timerForWarning)
            // }

            let timerForExpired = null
            if (countDownTime > 0) {
                timerForExpired = setTimeout(() => {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: true,
                        type: expired,
                        title: modalTypeContentMapping[expired].title,
                        content: modalTypeContentMapping[expired].content,
                    })
                }, countDownTime)
            }

            refreshTokenChannel.onmessage = (message) => {
                if (message === true) {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: false,
                        type: warning,
                        title: '',
                        content: '',
                    })
                    clearTimeout(timerForWarning)
                    clearTimeout(timerForExpired)
                } else if (message === false) {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: false,
                        type: warning,
                        title: '',
                        content: '',
                    })
                    clearTimeout(timerForWarning)
                }
                refreshTokenChannel.close()
            }

            logoutChannel.onmessage = (message) => {
                if (message === true) {
                    guard.setLogOut()
                    window.location.reload()
                    clearTimeout(timerForWarning)
                    clearTimeout(timerForExpired)
                }
                logoutChannel.close()
            }

            return () => {
                clearTimeout(timerForWarning)
                clearTimeout(timerForExpired)
                refreshTokenChannel.close()
                logoutChannel.close()
            }
        }, [])

        const handleAccept = (typeModal) => {
            if (typeModal === expired) {
                guard.setLogOut()
                logoutChannel.postMessage(true)
                window.location.reload()
            } else {
                processRefreshToken()
            }
        }

        const processRefreshToken = async () => {
            try {
                const refreshToken = localStorage.getItem('refreshToken')
                const state = getStateRedirect(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNIN_URL, process.env.REACT_APP_ENVIRONMENT);
                let formData = new FormData()
                formData.append('refresh_token', refreshToken)
                formData.append('state', state)

                const config = getRequestConfigurations()
                config.headers['content-type'] = 'multipart/form-data'
                const response = await axios.post(`${process.env.REACT_APP_REDIRECT_URL}/token`, formData, config)

                if (response && response?.data) {
                    const { access_token, refresh_token, expires_in, expires_on } = response?.data
                    const timeTokenExpire = moment().add(parseInt(expires_in), 'seconds').format('YYYYMMDDHHmmss')
                    localStorage.setItem('tokenExpired', timeTokenExpire)
                    localStorage.setItem('accessToken', access_token || '')
                    localStorage.setItem('refreshToken', refresh_token || '')
                    refreshTokenChannel.postMessage(true)
                }
            } catch (e) {
                window.location.reload()
            } finally {
                SetWarningTokenModal({
                    ...warningTokenModal,
                    isShow: false,
                    type: warning,
                    title: '',
                    content: '',
                })
            }
        }

        const handleHideModal = (isOnClickCancel = false) => {
            if (isOnClickCancel) {
                localStorage.setItem('isCancelRefreshToken', isOnClickCancel.toString())
                refreshTokenChannel.postMessage(false)
            }

            SetWarningTokenModal({
                ...warningTokenModal,
                isShow: false,
                type: warning,
                title: '',
                content: '',
            })
        }

        return (
            <>
            <WarningTokenModal 
                isShow={warningTokenModal?.isShow} 
                type={warningTokenModal.type} 
                title={warningTokenModal.title} 
                content={warningTokenModal.content}
                handleHideModal={handleHideModal} 
                handleAccept={handleAccept}
            />
            {/* <Component {...{...props, isIdle: isIdle}} /> */}
            <Component {...props} />
            </>
        )
    }
}

export default HOCComponent
