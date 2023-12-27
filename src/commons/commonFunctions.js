import _ from 'lodash'
import Constants from '../commons/Constants'

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

const getStateRedirect = (url, environment) => {
    let mapping = [
        { ConfigureId: "351a4f7b-e724-43c4-923f-527002a3a18c", Url: "http://localhost:3000/auth"},
        { ConfigureId: "401a4f7b-e724-43c4-923f-534002a3a18c", Url: "https://onboarding.cloudvst.net/auth"},
        { ConfigureId: "451a4f7b-e724-43c4-923f-534002a3a18c", Url: "https://myvingroup-uat.cloudvst.net/auth"},
        { ConfigureId: "501a4f7b-e724-43c4-923f-534002a3a18c", Url: "https://hrdx.cloudvst.net/auth"},
        { ConfigureId: "551a4f7b-e724-43c4-923f-534002a3a18c", Url: "https://hrdx2.cloudvst.net/auth"},
        { ConfigureId: "601a4f7b-e724-43c4-923f-534002a3a18c", Url: "https://myvingroup.cloudvst.net/auth"},
    ]

    if (environment === 'PRODUCTION') {
        mapping = [
            { ConfigureId: "bd40c812-b069-446e-b975-5ea59cccb7c3", Url: "http://localhost:3000/auth"},
            { ConfigureId: "a0294129-654b-417a-9602-b13d7302037e", Url: "https://myvingroup.vingroup.net/auth"},
        ]
    }

    const item = mapping.find(ele => ele.Url == url);
    if(item) return item.ConfigureId || '0'
}

const checkVersionPnLSameAsVinhome = (moduleType = 1, ...otherPnl) => {
    const pnlAvaiable = [...Constants.MODULE_COMPANY_AVAILABE[moduleType], ...otherPnl]; 
    return checkIsExactPnL(...pnlAvaiable);
}

const IS_VINFAST = (hasVinES = false) => checkIsExactPnL(Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, hasVinES ? Constants.pnlVCode.VinES : null);

export { getRequestConfigs, checkIsExactPnL, getStateRedirect, checkVersionPnLSameAsVinhome, IS_VINFAST }
