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

    const getUser = (token, jwtToken, vgEmail) =>
    {      
        if(token == null) {
            return;
        }

        let config = {
          headers: {             
             'Authorization': `Bearer ${token}`
          }
        }
        
        axios.get(process.env.REACT_APP_MULE_HOST + 'user/profile', config)
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
            }
          );   
    }

    const checkUser = (user, jwtToken, vgEmail) =>
    {
        
        if (user == null || user.uid == null) {
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
                accessToken: jwtToken,
                tokenExpired: '',
                email: vgEmail,
                plEmail: user.company_email,
                avatar: '',
                fullName: user.fullname,
                jobTitle: user.job_name,
                jobId: user.job_id,
                benefitLevel: user.benefit_level || user.employee_level,
                company: user.pnl,
                sabaId: `saba-${user.uid}`,
                employeeNo: user.uid,
                jobType: user.rank_name,
                department: `${user.division} / ${user.department} / ${user.unit}`
            });
            history.push(map.Dashboard);
        }
    }

    const [token, SetToken] = useState('');
    const [isloading, SetIsloading] = useState(true);
    const [notifyContent, SetNotifyContent] = useState(t("WaitNotice"));
        
    function getUserData() {
        Auth.currentAuthenticatedUser().then(currentAuthUser => {
            if (currentAuthUser.signInUserSession.isValid()) {
                SetToken(currentAuthUser.signInUserSession.idToken.jwtToken);
                let email = currentAuthUser.attributes.family_name;
                let vgUsernameMatch = (/([^@]+)/gmi).exec(email.replace('v.', ''));
                let vgEmail = `${vgUsernameMatch[1]}@vingroup.net`;                
                getUser(token, currentAuthUser.signInUserSession.idToken.jwtToken, vgEmail);                                
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
