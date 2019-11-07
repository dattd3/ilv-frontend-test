import React, { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import {
    useApi,
    useFetcher
} from "../../modules";
import { useTranslation } from "react-i18next";

const usePreload = (params) => {
    const api = useApi();
    api.setAuthorization({ tokenType: 'Bearer', accessToken: params.token });
    const [user = undefined, err] = useFetcher({
        api: api.fetchSabaUser,
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
    const [token, SetToken] = useState('');
    const [notifyContent, SetNotifyContent] = useState('');

    let user = usePreload({ email: email, token: token });

    function getUserData() {
        Auth.currentAuthenticatedUser().then(currentAuthUser => {
            if (currentAuthUser.signInUserSession.isValid()) {
                SetNotifyContent(t("LoginSuccessful"));
                SetToken(currentAuthUser.signInUserSession.idToken.jwtToken);
                SetEmail('quyennd9@vingroup.net');
                let vgUsernameMatch = (/[v.]+([^@]*)@/gmi).exec(currentAuthUser.attributes.email);
                let vgEmail = `${vgUsernameMatch[1]}@vingroup.net`;
                if (user) {
                    let u = {
                        tokenType: 'Bearer',
                        accessToken: currentAuthUser.signInUserSession.idToken.jwtToken,
                        tokenExpired: '',
                        plEmail: currentAuthUser.attributes.email,
                        email: vgEmail,
                        fullName: `${user.data.details.lastname} ${user.data.details.firstname}`,
                        jobTitle: user.data.details.jobtype,
                        company: user.data.details.company,
                        sabaId: user.data.details.id,
                        employeeNo: user.data.details.person_no
                    }
                    guard.setIsAuth(u);
                    setTimeout(() => { history.push(map.Dashboard); }, 500);
                }
            }
            else {
                SetNotifyContent(t("NorificationError"));
                //setTimeout(() => { history.push(map.Login); }, 5000);
            }
        }).catch(err => {
            SetNotifyContent(t("NorificationError"));
            //setTimeout(() => { history.push(map.Login); },  5000);
        });
    }

    useEffect(() => {
        getUserData();
        Hub.listen('auth', data => {
            switch (data.payload.event) {
                case 'signIn':
                    getUserData();
                    break;
                case 'signOut':
                    SetNotifyContent('Logging out...');
                    setTimeout(() => { history.push(map.Login); }, 3000);
                    break;
                default:
                    return;
            }
        })
    });

    return (
        <div className='blank-page-cover'>
            <LoadingModal show={true} content={notifyContent} />
        </div>
    );
}

export default Authorize;
