import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { getMuleSoftHeaderConfigurations } from "../../commons/Utils"
import Constants from "../../commons/Constants"

const ERROR_TYPE = {
    NETWORK: 1,
    USER_NOT_EXIST: 2
}

function Authorize(props) {
    const { t } = useTranslation();
    const { history } = props;
    const guard = useGuardStore();
    const [token, SetToken] = useState('');
    const [isloading, SetIsloading] = useState(true);
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
    const [isGetUser, SetIsGetUser] = useState(false);
    const [isLoadingUser, SetIsLoadingUser] = useState(false);
    const [isError, SetIsError] = useState(false);
    const [errorType, SetErrorType] = useState(null);
    const [isShowLoadingModal, SetIsShowLoadingModal] = useState(true);

    const getUser = (token, jwtToken, vgEmail) => {
        if (jwtToken == null || jwtToken == "") {
            return;
        }
        if (isGetUser == true) {
            return;
        }

        SetIsShowLoadingModal(true)
        const config = getMuleSoftHeaderConfigurations() 
        config.headers['Authorization'] = `Bearer ${jwtToken}`

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`, config)
            .then(res => {
                if (res && res.data && res.data.data[0]) {
                    let userProfile = res.data.data[0];
                    checkUser(userProfile, jwtToken, vgEmail, () => {
                        SetIsShowLoadingModal(false)
                    });
                    updateUser(userProfile,jwtToken)
                   
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

    const hasPermissonShowPrepareTab = async (token, companyCode) => {
        try {
            const config = {
                headers: {
                  'Authorization': token
                }
            }
            const response = await axios.get(`${process.env.REACT_APP_HRDX_URL}user/managementPoint?companyCode=${companyCode}`, config)
            if (response && response.data) {
                return  response.data.data?.isSupporter == true || ( [Constants.pnlVCode.VinSchool].includes(companyCode) && response.data.data?.hasSubordinate == true) ? true : false;
            }
            return false;
        } catch(e) {
            return false;
        }
    }

    const checkUser = async (user, jwtToken, vgEmail, onSaveSuccess) => {
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
                benefitTitle = user.benefit_level;
            } else {
                benefitTitle = user.rank_name;
            }
            //check permission show prepare tab 
            const shouldShowPrepareOnboard = await hasPermissonShowPrepareTab(jwtToken, user.company_code);
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
                            tokenExpired: '',
                            email: vgEmail,
                            plEmail: user.company_email,
                            avatar: user.avatar,
                            fullName: user.fullname,
                            jobTitle: user.job_name,
                            jobId: user.job_id,
                            benefitLevel: user.benefit_level || user.employee_level,
                            employeeLevel: user.rank_title || user.employee_level, // Cấp bậc chức danh để phân quyền.
                            benefitTitle: benefitTitle,
                            company: user.pnl,
                            sabaId: `saba-${user.uid}`,
                            employeeNo: user.uid,
                            jobType: user.rank_name,
                            department: `${user.division} / ${user.department} / ${user.unit}`,
                            organizationLv1: user.organization_lv1,
                            organizationLv2: user.organization_lv2,
                            organizationLv3: user.organization_lv3,
                            organizationLv4: user.organization_lv4,
                            organizationLv5: user.organization_lv5,
                            organizationLv6: user.organization_lv6,
                            region: user.department,
                            companyCode: user.company_code,
                            companyLogoUrl: res.data.data.logoUrl,
                            companyThemeColor: res.data.data.colorHexCode,
                            divisionId: user.organization_lv3,
                            division: user.division,
                            regionId: user.organization_lv4,
                            unitId: user.organization_lv5,
                            unit: user.unit,
                            partId: user.organization_lv6,
                            part: user.part,
                            role_assigment: user.role_assigment,
                            prepare: shouldShowPrepareOnboard
                        });
                    }
                })
                .catch(error => {
                    guard.setIsAuth({
                        tokenType: 'Bearer',
                        accessToken: jwtToken,
                        tokenExpired: '',
                        email: vgEmail,
                        plEmail: user.company_email,
                        avatar: '',
                        fullName: user.fullname,
                        jobTitle: user.job_name,
                        jobId: user.job_id,
                        benefitLevel: user.benefit_level || user.employee_level,
                        employeeLevel: user.rank_title || user.employee_level, // Cấp bậc chức danh để phân quyền.
                        benefitTitle: benefitTitle,
                        company: user.pnl,
                        sabaId: `saba-${user.uid}`,
                        employeeNo: user.uid,
                        jobType: user.rank_name,
                        department: `${user.division} / ${user.department} / ${user.unit}`,
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
                        prepare: shouldShowPrepareOnboard
                    });
                })
                .finally(result => {
                    //history.push(map.Dashboard);
                    onSaveSuccess();
                })
        }
    }

    function getUserData() {
        Auth.currentAuthenticatedUser().then(currentAuthUser => {
            if (currentAuthUser.signInUserSession.isValid()) {
                if (isLoadingUser == false) {
                    SetIsLoadingUser(true);
                    SetToken(currentAuthUser.signInUserSession.idToken.jwtToken);
                    let email = currentAuthUser.attributes.family_name;
                    let vgUsernameMatch = (/([^@]+)/gmi).exec(email.replace('v.', ''));
                    let vgEmail = `${vgUsernameMatch[1]}@vingroup.net`;
                    getUser(token, currentAuthUser.signInUserSession.idToken.jwtToken, vgEmail);
                }
            }
            else {
                SetNotifyContent(t("WaitNotice"));
            }
        })
        .catch(error => {});
    }

    function updateUser(userProfile, jwtToken) {
       let userData = {
            fullName: userProfile.fullname,
            employeeNo: userProfile.uid,
            mobile: "",
            avatar: userProfile.avatar,
            jobTitle: userProfile.job_name,
            benefitLevel: userProfile.employee_level,
            companyName: userProfile.pnl,
            companyCode: userProfile.company_code,
            departmentName: userProfile.department,
            culture: localStorage.getItem('locale').split("-")[0],
            orgLv2Id: userProfile.organization_lv2,
            orgLv3Id: userProfile.organization_lv3,
            orgLv4Id: userProfile.organization_lv4,
            orgLv5Id: userProfile.organization_lv5,
            divisionName: userProfile.division,
            unitName: userProfile.unit
        }

        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_REQUEST_URL}user/update`,
            data: userData,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}`}
        })
        .then(res => {
        })
        .finally(res => {
        })
        .catch(response => {
        })    
    }

    useEffect(() => {
        getUserData();
        Hub.listen('auth', data => {
            switch (data.payload.event) {
                case 'signIn':
                    getUserData();
                    break;
                default:
                    return;
            }
        });
    });

    const tryAgain = () => {
        window.location.reload()
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
