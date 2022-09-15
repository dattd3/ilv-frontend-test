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

const getStateRedirect = (url) => {
    const mapping = [
        { ConfigureId : "351a4f7b-e724-43c4-923f-527002a3a18c", Url : "http://localhost:3000/auth"},
        { ConfigureId : "401a4f7b-e724-43c4-923f-534002a3a18c", Url : "https://onboarding.cloudvst.net/auth"},
        { ConfigureId : "451a4f7b-e724-43c4-923f-534002a3a18c", Url : "https://hrms-myvp.cloudvst.net/auth"},
        { ConfigureId : "501a4f7b-e724-43c4-923f-534002a3a18c", Url : "https://hrdx.cloudvst.net/auth"},
        { ConfigureId : "551a4f7b-e724-43c4-923f-534002a3a18c", Url : "https://hrdx2.cloudvst.net/auth"},
        { ConfigureId : "601a4f7b-e724-43c4-923f-534002a3a18c", Url : "https://myvp.cloudvst.net/auth"},
    ]
    const item = mapping.find(ele => ele.Url == url);
    if(item) return item.ConfigureId || '0'
}

export { getRequestConfigs, checkIsExactPnL, getStateRedirect }
