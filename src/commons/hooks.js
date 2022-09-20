import moment from 'moment'
import { useEffect, useState } from 'react'
// import { useCookies } from 'react-cookie'

const useCookiesHook = () => {
    // const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);

    // const accessToken = cookies?.accessToken || null

    // return { accessToken }

    return null
}

const useCountdown = (targetTime) => {
    const [countDown, setCountDown] = useState(targetTime - moment().valueOf())

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(targetTime - moment().valueOf())
        }, 1000)

        return () => clearInterval(interval)
    }, [targetTime])

    return getReturnValues(countDown)
}

const getReturnValues = (remainingTime) => {
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)
    return [minutes < 10 ? `0${minutes}` : minutes, seconds < 10 ? `0${seconds}` : seconds]
}

export { useCountdown, useCookiesHook }
