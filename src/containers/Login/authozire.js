import React, { useState, useEffect } from 'react';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { getMuleSoftHeaderConfigurations } from "../../commons/Utils"
import Constants from "../../commons/Constants"
import moment from 'moment';

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

    const getUser = (token, jwtToken) => {
        if (jwtToken == null || jwtToken == "") {
            return;
        }
        if (isGetUser == true) {
            return;
        }

        SetIsShowLoadingModal(true)
        const config = getMuleSoftHeaderConfigurations() 
        config.headers['Authorization'] = `Bearer ${jwtToken}`

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/profile`, config)
            .then(res => {
                if (res && res.data && res.data.data[0]) {
                    let userProfile = res.data.data[0];
                    const vgEmail = userProfile?.company_email?.toLowerCase() || ""
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
                //return  response.data.data?.isSupporter == true || ( [Constants.pnlVCode.VinSchool, Constants.pnlVCode.VincomRetail, Constants.pnlVCode.VinHome, Constants.PnLCODE.Vin3S].includes(companyCode) && response.data.data?.hasSubordinate == true) ? true : false;
                return  response.data.data?.isSupporter == true || ( [Constants.pnlVCode.VinSchool, Constants.pnlVCode.VinHome, Constants.PnLCODE.Vin3S, Constants.PnLCODE.VinFast, Constants.PnLCODE.VinFastTrading].includes(companyCode) && response.data.data?.hasSubordinate == true) ? true : false;
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
                            tokenExpired: moment().add(3600, 'seconds'),
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
                        tokenExpired: moment().add(3600, 'seconds'),
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

    function getUserData(_token) {
        //_token = 'eyJraWQiOiJIT3E5TEREUUVMb1FGWmtVVmpEYlNSZjZvUVlTS096ek16VGNJcU1WRXUwPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiTndwNGRJWmNud1A5aVk3bTVOOS1rZyIsInN1YiI6IjFlMmU3YWY4LWU2MWQtNGVlZC1iOGQ5LTk0ZmFhMjEwYmVjMiIsImNvZ25pdG86Z3JvdXBzIjpbImFwLXNvdXRoZWFzdC0xX2c4ZjRkQkc2NV9WaW5ncm91cEF6dXJlQUQiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfZzhmNGRCRzY1IiwiY29nbml0bzp1c2VybmFtZSI6InZpbmdyb3VwYXp1cmVhZF9kZnZzal93a3E3bG1wOG02czdvcjFpYzRpZDJpb3ZndGJjc3JsbXBlaW9jIiwibm9uY2UiOiIxMC1aaDRsTXhxb0JCMGF0a3l6clFMNWVkbklSbDVjTmNTVmFLdUtaSzVrOV9UX19la2c3NVdpV0RFSzBUSzdsNUhBRmJ6VmgwaTFRZEZJMmNNbFEtcEZCSHlWOWhITVoyemNxLXZhYk5SQ0RLMHdmOEpmb1BKQWFjUDJjRGl2SzQ4a1FNM3B5dEtNMVdhVkt1b25LR0hjdHVKVUZCTXJrcllFMGFrZ25fSjQiLCJhdWQiOiIzcm9ibmdnZjZtYjJtYWFiaWJoNWE3b3JtZSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6ImRGdlNKX1dLUTdMbXA4bTZTN09yMUlDNElEMklvdkd0YmNTUkxNUEVpb2MiLCJwcm92aWRlck5hbWUiOiJWaW5ncm91cEF6dXJlQUQiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTYzMTMzNDM1MDMyNiJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjI1NDA3ODcsIm5hbWUiOiJUZXN0IDY3IiwiZXhwIjoxNjYyNTQ0Mzg3LCJpYXQiOjE2NjI1NDA3ODcsImZhbWlseV9uYW1lIjoidm0udGVzdDY3QHZpbmdyb3VwLm5ldCJ9.NkIENmMIJOpLifm0K5CZTewQ_u_di85TBfL2PONV_i8A9NMLt3Pep73waio1dJgP9mGHWz7ktYuWNaA_3XDXhj2HGoRUPSSfwQY7DU-yPFP7a69aeY90t6DWigYwdNKiNvirRiKspCZFyJxT0DWbNnd22FZBkvJs0QbbiRMnw1VGCPsMMRt7tVYY1rsqxFRFJ6dEUQfAtKx-7bM_GkMCGTJyldIZw5is3ExpF06HT1U6ODnLz1-iD7ixCqbY1YHCXdeky9wuCG4h2FAgfpnYy-FZUVWfEZ7u1tuq5NjxcKNn6Rmgt9Iglbt42k0s2qcZCUAN2NW-_haCICgC3vsqUA';
        if (isLoadingUser == false) {
            SetIsLoadingUser(true);
            SetToken(_token);
            getUser(_token, _token);
        }
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
        .catch(response => {
        })
        .finally(res => {
        })    
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(props.history.location.search);
        const accessToken = queryParams?.get('accesstoken') || null
        if (queryParams.has('accesstoken')) {
        queryParams.delete('accesstoken')
        props.history.replace({
            search: queryParams.toString(),
        })
        }
        getUserData(accessToken);
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
