import _ from 'lodash'
import Constants from '../commons/Constants'


// const logout = () => {
//     try {
//         Auth.signOut({ global: true })
//         localStorage.clear()
//         window.location.reload()
//     } catch  {
//         window.location.reload()
//     }
// }

const getRequestConfigs = () => {
    return {
        headers: {            
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }
}

const checkIsExactPnL = (...companyCodes) => {
    const companyCode = localStorage.getItem('companyCode');
    return companyCodes.indexOf(companyCode) != -1;
}

export { getRequestConfigs, checkIsExactPnL }
