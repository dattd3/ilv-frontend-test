import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";
import axios from 'axios';


function Authorize(props) {
    const { t } = useTranslation();
    const { history } = props;
    const guard = useGuardStore();
    const [token, SetToken] = useState('');
    const [isloading, SetIsloading] = useState(true);
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
    const [isGetUser, SetIsGetUser] = useState(false);
    const [isLoadingUser, SetIsLoadingUser] = useState(false);

    const getUser = (token, jwtToken, vgEmail) => {

        if (jwtToken == null || jwtToken == "") {
            return;
        }

        if (isGetUser == true) {
            return;
        }

        let config = {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'client_id': process.env.REACT_APP_MULE_CLIENT_ID,
                'client_secret': process.env.REACT_APP_MULE_CLIENT_SECRET
            }
        }

        axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v1/ws/user/profile`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    let userProfile = res.data.data[0];
                    checkUser(userProfile, jwtToken, vgEmail);
                }
            })
            .catch(error => {
                console.log("Call getUser error:", error);
                SetNotifyContent(t("LoginError"));
                SetIsloading(false);
                SetIsLoadingUser(false);
            }
            );
    }

    const checkUser = (user, jwtToken, vgEmail) => {
        if (user == null || user.uid == null) {
            SetNotifyContent(t("LoginError"));
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
                            avatar: '',
                            fullName: user.fullname,
                            jobTitle: user.job_name,
                            jobId: user.job_id,
                            benefitLevel: user.benefit_level || user.employee_level,
                            employeeLevel: user.employee_level,
                            benefitTitle: benefitTitle,
                            company: user.pnl,
                            sabaId: `saba-${user.uid}`,
                            employeeNo: user.uid,
                            jobType: user.rank_name,
                            department: `${user.division} / ${user.department} / ${user.unit}`,
                            organizationLv2: user.organization_lv2,
                            organizationLv3: user.organization_lv3,
                            organizationLv4: user.organization_lv4,
                            organizationLv5: user.organization_lv5,
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
                            part: user.part
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
                        employeeLevel: user.employee_level,
                        benefitTitle: benefitTitle,
                        company: user.pnl,
                        sabaId: `saba-${user.uid}`,
                        employeeNo: user.uid,
                        jobType: user.rank_name,
                        department: `${user.division} / ${user.department} / ${user.unit}`,
                        organizationLv2: user.organization_lv2,
                        organizationLv3: user.organization_lv3,
                        organizationLv4: user.organization_lv4,
                        organizationLv5: user.organization_lv5,
                        region: user.department,
                        companyCode: user.company_code,
                        companyLogoUrl: '',
                        divisionId: user.organization_lv3,
                        division: user.division,
                        regionId: user.organization_lv4,
                        unitId: user.organization_lv5,
                        unit: user.unit,
                        partId: user.organization_lv6,
                        part: user.part
                    });
                })
                .finally(result => {
                    //history.push(map.Dashboard);
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
        });
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

    return (
        <div className='blank-page-cover'>
            <LoadingModal show={true} content={notifyContent} isloading={isloading} />
        </div>
    );
}

export default Authorize;
