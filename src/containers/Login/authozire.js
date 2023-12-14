import { useState, useEffect } from 'react';
import { useGuardStore } from '../../modules';
import LoadingModal from '../../components/Common/LoadingModal'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { getCurrentLanguage, getMuleSoftHeaderConfigurations } from "../../commons/Utils"
import Constants from "../../commons/Constants"
import moment from 'moment';
import { FirebaseUpdateToken } from '../../commons/Firebase';

const ERROR_TYPE = {
    NETWORK: 1,
    USER_NOT_EXIST: 2
}

function Authorize(props) {
    const { t } = useTranslation();
    const { history } = props;
    const guard = useGuardStore();
    const [isloading, SetIsloading] = useState(true);
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
    const [isGetUser, SetIsGetUser] = useState(false);
    const [isLoadingUser, SetIsLoadingUser] = useState(false);
    const [isError, SetIsError] = useState(false);
    const [errorType, SetErrorType] = useState(null);
    const [isShowLoadingModal, SetIsShowLoadingModal] = useState(true);
    // const [cookies, setCookie] = useCookies(['accessToken']);

    const getUser = (jwtToken, refreshToken, timeTokenExpire) => {
        if (!jwtToken || isGetUser == true) {
            return;
        }

        SetIsShowLoadingModal(true)
        const config = getMuleSoftHeaderConfigurations()
        config.headers['Authorization'] = `Bearer ${jwtToken}`

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`, config)
            .then(res => {
                if (res && res.data && res.data.data[0]) {
                    let userProfile = res.data.data[0];
                    //const email = userProfile?.company_email?.toLowerCase() || ""
                    //let vgUsernameMatch = (/([^@]+)/gmi).exec(email.replace('v.', ''));
                    let vgEmail = `${userProfile.username?.toLowerCase()}@vingroup.net`;
                    checkUser(userProfile, jwtToken, refreshToken, timeTokenExpire, vgEmail, () => {
                        SetIsShowLoadingModal(false)
                    });
                    getCultureMenu(jwtToken);
                    updateUser(userProfile,jwtToken)
                    updateLanguageByCode(localStorage.getItem('locale') || 'vi-VN', jwtToken)
                }
                else {
                    SetIsError(true)
                    SetErrorType(ERROR_TYPE.USER_NOT_EXIST)
                    SetIsloading(false);
                    SetIsLoadingUser(false);
                    SetIsGetUser(true)
                    SetIsShowLoadingModal(false)
                }
            })
            .catch(error => {
                SetIsloading(false);
                SetIsGetUser(true)
                SetIsError(true)
                SetErrorType(ERROR_TYPE.NETWORK)
                SetIsShowLoadingModal(false)
            });
    }

    const updateLanguageByCode = async (lang, jwtToken) => {
        if (lang) {
            try {
                const languageKeyMapping = {
                    [Constants.LANGUAGE_EN]: 'en',
                    [Constants.LANGUAGE_VI]: 'vi'
                }
                const config = {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }
                const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}user/setlanguage?culture=${languageKeyMapping[[lang]]}`, null, config)
                if (response && response.data) {
                    const result = response.data.result
                    if (result.code == Constants.API_SUCCESS_CODE) {
                        return true
                    }
                    return false
                }
                return false
            } catch (e) {
                return false
            }
        }
        return false
    }

    const hasPermissonShowPrepareTab = async (token, companyCode) => {
        try {
            const config = {
                headers: {
                  'Authorization': token
                }
            }
            const response = await axios.get(`${process.env.REACT_APP_HRDX_URL}user/managementPoint?companyCode=${companyCode}`, config)
            if (response && response.data) {
                return  response.data.data?.isSupporter == true || ( [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DANHGIA_TAIKI]].includes(companyCode) && response.data.data?.hasSubordinate == true) ? true : false;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    const checkEssAvaible = async (token, companyCode) => {
        let essAvaible = false, taxFinalizationAvaible = false;
        const listCompanyAvaible = [...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.NGHIVIEC], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DIEUCHUYEN], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.BONHIEM], ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.THANHTOAN_NOIBO]];
        if(listCompanyAvaible.includes(companyCode)) {
            essAvaible = true;
        }
        try {
            const config = {
                headers: {
                  'Authorization': token
                }
            }
            const response = await axios.get(`${process.env.REACT_APP_REQUEST_SERVICE_URL}common/taxsettlement-status`, config)
            if (response && response.data) {
                taxFinalizationAvaible = response.data.data?.status == '1' ? true : false;
                //sample for dev
                //taxFinalizationAvaible = true;
            }
        } catch(e) {
            console.log(e);
        }
        essAvaible = essAvaible || taxFinalizationAvaible;
        return {essAvaible, taxFinalizationAvaible};
    }

    const formatMuleSoftValue = val => {
        if (val == '#' || val == null || val == undefined) {
            return ""
        }
        return val
    }

    const checkUser = async (user, jwtToken, refreshToken, timeTokenExpire, vgEmail, onSaveSuccess) => {
        if (user == null || user.uid == null) {
            SetIsError(true)
            SetErrorType(ERROR_TYPE.USER_NOT_EXIST)
            SetIsloading(false);
        } else {
            SetNotifyContent(t("WaitNotice"));
            SetIsloading(true);
        }

        if (user) {
            SetNotifyContent(t("LoginSuccessful"));
            SetIsGetUser(true);

            var benefitTitle = "";
            if (user.benefit_level && user.benefit_level !== '#') {
                benefitTitle = user.benefit_level.replace('PL', '');
            } else {
                benefitTitle = user.employee_level;
            }
            //check permission show prepare tab 
            const shouldShowPrepareOnboard = await hasPermissonShowPrepareTab(jwtToken, user.company_code);

            //check quyền mở quyết toán thuế
            const {essAvaible, taxFinalizationAvaible} = await checkEssAvaible(jwtToken, user.company_code);
            // Get company config
            var companyConfig = null
            axios.get(`${process.env.REACT_APP_REQUEST_URL}company/detail/${user.company_code}/${user.pnl}`, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            })
                .then(res => {
                    if (res && res.data && res.data.data) {
                        guard.setIsAuth({
                            tokenType: 'Bearer',
                            accessToken: jwtToken,
                            refreshToken: refreshToken,
                            tokenExpired: timeTokenExpire,
                            email: vgEmail,
                            plEmail: user.company_email,
                            avatar: user.avatar,
                            fullName: user.fullname,
                            jobTitle: user.job_name,
                            jobId: user.job_id,
                            benefitLevel: benefitTitle,
                            employeeLevel: formatMuleSoftValue(user?.rank_title) ? user?.rank_title : user?.employee_level, // Có Cấp bậc chức danh thì lấy Cấp bậc chức danh ngược lại lấy Cấp bậc thực tế
                            actualRank: formatMuleSoftValue(user?.employee_level) ? user?.employee_level : '', // Cấp bậc thực tế
                            benefitTitle: benefitTitle,
                            company: user.pnl,
                            sabaId: `saba-${user.uid}`,
                            employeeNo: user.uid,
                            jobType: user.rank_name,
                            department: `${user.division} / ${user.department} / ${user.unit}`,
                            actualDepartment: user?.department,
                            organizationLvId: user.organization_id,
                            organizationLv1: user.organization_lv1,
                            organizationLv2: user.organization_lv2,
                            organizationLv3: user.organization_lv3,
                            organizationLv4: user.organization_lv4,
                            organizationLv5: user.organization_lv5,
                            organizationLv6: user.organization_lv6,
                            region: user.department,
                            companyCode: user.company_code,
                            // companyLogoUrl: res.data.data.logoUrl,
                            companyLogoUrl: '',
                            companyThemeColor: res.data.data.colorHexCode,
                            divisionId: user.organization_lv3,
                            division: user.division,
                            regionId: user.organization_lv4,
                            unitId: user.organization_lv5,
                            unit: user.unit,
                            partId: user.organization_lv6,
                            part: user.part,
                            role_assigment: user.role_assigment,
                            prepare: shouldShowPrepareOnboard,
                            jobCode: user?.job_code,
                            ad: user?.username,
                            master_code: user.master_code || '',
                            cost_center: user?.cost_center,
                            insurance_number: user?.insurance_number,
                            essAvaible: essAvaible,
                            taxEnable: taxFinalizationAvaible
                        });
                        FirebaseUpdateToken();
                    }
                })
                .catch(error => {
                    guard.setIsAuth({
                        tokenType: 'Bearer',
                        accessToken: jwtToken,
                        refreshToken: refreshToken,
                        tokenExpired: timeTokenExpire,
                        email: vgEmail,
                        plEmail: user.company_email,
                        avatar: '',
                        fullName: user.fullname,
                        jobTitle: user.job_name,
                        jobId: user.job_id,
                        benefitLevel: user.benefit_level || user.employee_level,
                        employeeLevel: formatMuleSoftValue(user?.rank_title) ? user?.rank_title : user?.employee_level, // Có Cấp bậc chức danh thì lấy Cấp bậc chức danh ngược lại lấy Cấp bậc thực tế
                        actualRank: formatMuleSoftValue(user?.employee_level) ? user?.employee_level : '', // Cấp bậc thực tế
                        benefitTitle: benefitTitle,
                        company: user.pnl,
                        sabaId: `saba-${user.uid}`,
                        employeeNo: user.uid,
                        jobType: user.rank_name,
                        department: `${user.division} / ${user.department} / ${user.unit}`,
                        actualDepartment: user?.department,
                        organizationLv1: user.organization_lv1,
                        organizationLv2: user.organization_lv2,
                        organizationLv3: user.organization_lv3,
                        organizationLv4: user.organization_lv4,
                        organizationLv5: user.organization_lv5,
                        organizationLv6: user.organization_lv6,
                        region: user.department,
                        companyCode: user.company_code,
                        companyLogoUrl: '',
                        divisionId: user.organization_lv3,
                        division: user.division,
                        regionId: user.organization_lv4,
                        unitId: user.organization_lv5,
                        unit: user.unit,
                        partId: user.organization_lv6,
                        part: user.part,
                        role_assigment: user.role_assigment,
                        prepare: shouldShowPrepareOnboard,
                        jobCode: user?.job_code,
                        ad: user?.username,
                        master_code: '',
                        cost_center: user?.cost_center,
                        insurance_number: user?.insurance_number || ''
                    });
                })
                .finally(result => {
                    //history.push(map.Dashboard);
                    onSaveSuccess();
                })
        }
    }

    function getUserData(_token, refreshToken, timeTokenExpire) {
        if (isLoadingUser == false) {
            SetIsLoadingUser(true);
            getUser(_token, refreshToken, timeTokenExpire);
        }
    }

    function updateUser(userProfile, jwtToken) {
        var benefitTitle = "";
        if (userProfile.benefit_level && userProfile.benefit_level !== '#') {
            benefitTitle = userProfile.benefit_level.replace('PL', '');
        } else {
            benefitTitle = userProfile.employee_level;
        }
       let userData = {
            fullName: userProfile.fullname,
            employeeNo: userProfile.uid,
            mobile: "",
            avatar: userProfile.avatar,
            jobTitle: userProfile.job_name,
            benefitLevel: benefitTitle,
            companyName: userProfile.pnl,
            companyCode: userProfile.company_code,
            departmentName: userProfile.department,
            culture: localStorage.getItem('locale').split("-")[0],
            orgLvId: userProfile.organization_id,
            orgLv2Id: userProfile.organization_lv2,
            orgLv3Id: userProfile.organization_lv3,
            orgLv4Id: userProfile.organization_lv4,
            orgLv5Id: userProfile.organization_lv5,
            divisionName: userProfile.division,
            unitName: userProfile.unit,
            costCenter: userProfile?.cost_center
        }

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user/update`,
            data: userData,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}`}
        })
        .then(res => {
        })
        .catch(response => {
        })
        .finally(res => {
        })    
    }

    function getCultureMenu(jwtToken) {
        axios.get(
            `${process.env.REACT_APP_REQUEST_URL}api/vanhoavin/infos?language=${getCurrentLanguage()}&device=WEB`,
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}`} }
          ).then((res) => {
            const data = res.data?.data,
              lstCategory = (data?.[0]?.lstCategory || []).sort((prev, val) => prev.categoryCode - val.categoryCode);

            localStorage.setItem('cultureMenu', JSON.stringify(lstCategory));
          });
    }

    useEffect(() => {
        const fetchUserInfoLogged = async (code) => {
            try {
                const bodyFormData = new FormData()
                bodyFormData.append('code', code)
                const response = await axios.post(
                    `${process.env.REACT_APP_REDIRECT_URL}/gettoken`,
                    bodyFormData,
                )
        
                return response?.data
            } catch (e) {
                return null
            }
        }

        const processUserLogged = async () => {
            const queryParams = new URLSearchParams(history?.location?.search)
            if (queryParams.has('code')) {
                const code = queryParams?.get('code') || ''
                if (!code) {
                    return window.location.replace(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL)
                }
        
                queryParams.delete('code')
                history.replace({
                    search: queryParams.toString(),
                })
        
                const response = await fetchUserInfoLogged(code)
                if (!response) {
                    return window.location.replace(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL)
                }
        
                const { access_token, expires_in, refresh_token } = response
                if (!access_token) {
                    return window.location.replace(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL)
                }
        
                const expireIn = expires_in || 3600 // Nếu không trả về thì mặc định thời gian hết hạn là 1h
                const timeTokenExpire = moment().add(Number(expireIn), 'seconds').format('YYYYMMDDHHmmss')
        
                // localStorage.setItem('refreshToken', refresh_token)
                // localStorage.setItem('tokenExpired', timeTokenExpire)

                getUserData(access_token, refresh_token, timeTokenExpire);
            } else {
                return window.location.replace(process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL)
            }
        }
        processUserLogged()
    }, []);

    const tryAgain = () => {
        window.location.href = process.env.REACT_APP_AWS_COGNITO_IDP_SIGNOUT_URL;
    }

    return (
        <>
        <LoadingModal show={isShowLoadingModal} content={notifyContent} isloading={isloading} />
        <div className='waiting-login'>
            {
                isError ?
                <div className="login-result">
                    <div className="top">
                        <h1 className="hight-light title">{errorType === ERROR_TYPE.NETWORK ? t('LoginErrorByNetworkTitle') : t('LoginErrorByUserIssuesTitle')}</h1>
                        <p className="description">{errorType === ERROR_TYPE.NETWORK ? t('LoginErrorByNetworkDescription') : t('LoginErrorByUserIssuesDescription')}</p>
                    </div>
                    <div className="bottom">
                        <p className="guide-line">{t('TroubleshootingGuide')} <a href={Constants.LOGIN_INSTRUCTION_PATH} title="Guide line" target="_blank" className="hight-light guide-line-path">{t('Here')}</a></p>
                        <button type="button" className="hight-light try-again" onClick={tryAgain}>{t('TryAgain')}</button>
                    </div>
                </div>
                : null
            }
        </div>
        </>
    );
}

export default Authorize;
