import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import { useApi, useFetcher } from "../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
    const api = useApi();
    api.setAuthorization({ tokenType: 'Bearer', accessToken: params.token });
    const [user = undefined, err] = useFetcher({
        api: api.fetchUser,
        autoRun: true,
        params: [params.email]
    });
    return user;
};

function Authorize(props) {
    const { t } = useTranslation();
    const { history } = props;
    const guard = useGuardStore();
    const [email, SetEmail] = useState('');
    const [show, SetShow] = useState(true);
    const [token, SetToken] = useState('');
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
    let user = usePreload({ email: email, token: token });

    function getUserData() {
        Auth.currentAuthenticatedUser().then(currentAuthUser => {
            if (currentAuthUser.signInUserSession.isValid()) {
                SetToken(currentAuthUser.signInUserSession.idToken.jwtToken);
                SetEmail(currentAuthUser.attributes.email);
                let email = 'v.trangdt28@vinpearl.com'; //user.email;
                let vgUsernameMatch = (/[v.]+([^@]*)@/gmi).exec(email);
                let vgEmail = `${vgUsernameMatch[1]}@vingroup.net`;

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
        }).catch(err => {
            SetNotifyContent(t("WaitNotice"));
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
            <LoadingModal show={show} content={notifyContent} />
        </div>
    );
}

export default Authorize;
