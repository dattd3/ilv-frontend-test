import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";


function Authorize(props) {
    const { t } = useTranslation();
    const { history } = props;
    const guard = useGuardStore();


    const usePreload = (params) => {
        const api = useApi();
        api.setAuthorization({ tokenType: 'Bearer', accessToken: params.token });
        const [user = undefined, err] = useFetcher({
            api: api.fetchUser,
            autoRun: true,
            params: [params.email]
        });
        return [user, err];
    };
    const [email, SetEmail] = useState('');
    const [token, SetToken] = useState('');
    const [isloading, SetIsloading] = useState(true);
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
    let api = usePreload({ email: email, token: token });

    function getUserData() {
        Auth.currentAuthenticatedUser().then(currentAuthUser => {
            if (currentAuthUser.signInUserSession.isValid()) {
                SetToken(currentAuthUser.signInUserSession.idToken.jwtToken);
                SetEmail(currentAuthUser.attributes.family_name); 
                let email = currentAuthUser.attributes.family_name;
                let vgUsernameMatch = (/([^@]+)/gmi).exec(email.replace('v.', ''));
                let vgEmail = `${vgUsernameMatch[1]}@vingroup.net`;
                let user = api[0];
                
                if (api[1] && api[1] !== undefined) {
                    SetNotifyContent(t("LoginError"));
                    SetIsloading(false);
                } else {
                    SetNotifyContent(t("WaitNotice"));
                    SetIsloading(true);
                }
                
                if (user) {
                    SetNotifyContent(t("LoginSuccessful"));
                    guard.setIsAuth({
                        tokenType: 'Bearer',
                        accessToken: currentAuthUser.signInUserSession.idToken.jwtToken,
                        tokenExpired: '',
                        email: vgEmail,
                        plEmail: email,
                        avatar: user.avatar,
                        fullName: user.fullName,
                        jobTitle: user.jobTitle,
                        company: user.companyName,
                        sabaId: user.sabaId,
                        employeeNo: user.employeeNo,
                        jobType: user.jobType,
                        department: `${user.departmentName} / ${user.siteName}`
                    });
                    history.push(map.Dashboard);
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
