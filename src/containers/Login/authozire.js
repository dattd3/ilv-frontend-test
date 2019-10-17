import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import map from '../map.config';
import LoadingModal from '../../components/Common/LoadingModal'
import {
    useApi,
    useFetcher
} from "../../modules";

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
    const { history } = props;
    const guard = useGuardStore();
    const [email, SetEmail] = useState('');
    const [token, SetToken] = useState('');
    const [notifyContent, SetNotifyContent] = useState('');

    let user = usePreload({ email: email, token: token });

    Auth.currentAuthenticatedUser().then(currentAuthUser => {
        if (currentAuthUser.signInUserSession.isValid()) {
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
                SetNotifyContent('Đăng nhập thành công!');
                setTimeout(() => { history.push(map.Dashboard); }, 3000);
            }
        }
        else {
            SetNotifyContent('User session invalid. Auth required!');
            setTimeout(() => { history.push(map.Login); }, 3000);
        }
    }).catch(err => {
        SetNotifyContent(JSON.stringify(err));
        setTimeout(() => { history.push(map.Login); }, 3000);
    });

    return (
        <>
            <div className='blank-page-cover'>
                <LoadingModal show={true} content={notifyContent} />
            </div>
        </>
    );
}

// class Authorize extends Component {

//     static contextType = GuardContext;

//     constructor(props) {
//         super(props);
//         this.interval = null;
//         this.validateUserSession.bind(this);
//         Hub.listen('auth', this, 'MyListener');
//     }

//     componentDidMount() {
//         this.interval = setInterval(() => {
//             clearInterval(this.interval);
//             if (_.isUndefined(this.props.authenticated) || this.props.authenticated === false) {
//                 this.validateUserSession();
//             }
//         }, 2000);
//     }

//     componentWillUnmount() {
//         if (!_.isUndefined(this.interval) && !_.isNull(this.interval)) {
//             clearInterval(this.interval);
//         }
//     }

//     onHubCapsule(capsule) {
//         const { channel, payload } = capsule;
//         if (channel === 'auth') {
//             // eslint-disable-next-line default-case
//             switch (payload.event) {
//                 case 'signIn':
//                     this.validateUserSession();
//                     break;
//                 case 'signUp':
//                     break;
//                 case 'signOut':
//                     console.log('user signed out');
//                     break;
//                 case 'signIn_failure':
//                     console.log('user sign in failed');
//                     break;
//             }
//         }
//     }

//     validateUserSession() {
//         const {
//             history
//         } = this.props;

//         Auth.currentAuthenticatedUser()
//             .then(currentAuthUser => {
//                 // grab the user session
//                 Auth.userSession(currentAuthUser)
//                     .then(session => {
//                         // finally invoke isValid() method on session to check if auth tokens are valid
//                         // if tokens have expired, lets call "logout"
//                         // otherwise, dispatch AUTH_USER success action and by-pass login screen
//                         if (session.isValid()) {
//                             this.context.setIsAuth(currentAuthUser);
//                             let user = usePreload();
//                             if (user) {
//                                 this.context.saveTest(user);
//                                 history.push(map.Dashboard, { signedIn: true, authenticated: true });
//                             }
//                         } else {
//                             const errorMessage = 'user session invalid. auth required';
//                             history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
//                         }
//                     })
//                     .catch(err => {
//                         const errorMessage = JSON.stringify(err);
//                         history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
//                     });
//             })
//             .catch(err => {
//                 const errorMessage = JSON.stringify(err);
//                 history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
//             });
//     }

//     /* eslint-disable react/jsx-handler-names */
//     render() {

//         return (
//             <>
//                 <LoadingModal show={true} />
//             </>
//         );
//     }
//     /* eslint-enable react/jsx-handler-names */
// }

export default Authorize;
