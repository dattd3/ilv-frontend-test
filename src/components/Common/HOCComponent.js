import React, { useState } from "react"
import moment from 'moment'
import axios from 'axios'
// import awsConfig from '../../../constants/aws-config'
import { getRequestConfigurations } from '../../commons/Utils'
import WarningTokenModal from './WarningTokenModal'

const tokenTimeExpireStorage = localStorage.getItem('timeTokenExpire')
const refreshToken = localStorage.getItem('refreshToken')
 
function HOCComponent(Component) {
    return function WrappedComponent(props) {
        const warning = 0
        const expired = 1
        const modalTypeContentMapping = {
            [warning]: {
                title: 'Cảnh báo hết hạn phiên làm việc',
                content: 'Phiên làm việc của bạn sẽ hết hạn sau 05:00 phút. Bạn có muốn gia hạn phiên làm việc?'
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

        React.useEffect(() => {
            const now = moment()
            const tokenTimeExpired = moment(tokenTimeExpireStorage, 'YYYYMMDDHHmmss')
            const countDownTime = tokenTimeExpired.diff(now, 'milliseconds')
            const lastMinutesCountdown = 5
            const totalTimeCountdown = 60000 * lastMinutesCountdown // 5 phút cuối bắt đầu đếm ngược

            let timerForWarning = null
            if (countDownTime > 0) {
                timerForWarning = setTimeout(() => {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: true,
                        type: warning,
                        title: modalTypeContentMapping[warning].title,
                        content: modalTypeContentMapping[warning].content
                    })
                }, countDownTime - totalTimeCountdown)
            } else {
                clearTimeout(timerForWarning)
            }

            let timerForExpired = null
            if (countDownTime > 0) {
                timerForExpired = setTimeout(() => {
                    SetWarningTokenModal({
                        ...warningTokenModal,
                        isShow: true,
                        type: expired,
                        title: modalTypeContentMapping[expired].title,
                        content: modalTypeContentMapping[expired].content
                    })
                }, countDownTime)
            }

            return () => {
                clearTimeout(timerForWarning)
                clearTimeout(timerForExpired)
            }
        }, [])

        const handleAccept = (typeModal) => {
            if (typeModal === expired) {
                window.location.assign('/login')
            } else {
                processRefreshToken()
            }
        }

        const processRefreshToken = async () => {
            try {
                let formData = new FormData()
                formData.append('refresh_token', refreshToken)
                formData.append('state', '351a4f7b-e724-43c4-923f-527002a3a18c')

                const config = getRequestConfigurations()
                config.headers['content-type'] = 'multipart/form-data'
                const response = await axios.post(`https://myvpapi.cloudvst.net/oauth2/token`, formData, config)

                if (response && response?.data) {
                    // error
                    // error_description
                    // expires_in : "4403"
                    // expires_on: "1663578859"
                    const { access_token, refresh_token, expires_in, expires_on } = response?.data
                    const timeTokenExpire = moment().add(parseInt(expires_in), 'seconds').format('YYYYMMDDHHmmss')
                    localStorage.setItem('timeTokenExpire', timeTokenExpire)
                    localStorage.setItem('accessToken', access_token || '')
                    localStorage.setItem('refreshToken', refresh_token || '')

                }
            } catch (e) {
                window.location.reload()
            } finally {
                SetWarningTokenModal({
                    ...warningTokenModal,
                    isShow: false,
                    type: warning,
                    title: '',
                    content: ''
                })
            }
        }

        const handleHideModal = () => {
            SetWarningTokenModal({
                ...warningTokenModal,
                isShow: false,
                type: warning,
                title: '',
                content: ''
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
            <Component {...props} />
            </>
        )
    }
}

export default HOCComponent
