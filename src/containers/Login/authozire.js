import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import { Auth, Hub } from 'aws-amplify';
import _ from 'lodash';
import { GuardContext } from '../../modules';
import map from '../map.config';

class Authorize extends Component {

    static contextType = GuardContext;

    constructor(props) {
        super(props);
        this.interval = null;
        this.validateUserSession.bind(this);
        Hub.listen('auth', this, 'MyListener');
    }

    componentDidMount() {
        // we have previously logged in and we are being redirected again.
        // onHubCapsule() won't fire in this case. So lets invoke validateSession()

        // Firefox/Safari bug -- wait for 2+ seconds before calling validate
        this.interval = setInterval(() => {
            clearInterval(this.interval);
            if (_.isUndefined(this.props.authenticated) || this.props.authenticated === false) {
                this.validateUserSession();
            }
        }, 2000);
    }

    componentWillUnmount() {
        if (!_.isUndefined(this.interval) && !_.isNull(this.interval)) {
            clearInterval(this.interval);
        }
    }

    onHubCapsule(capsule) {
        const { channel, payload } = capsule;
        if (channel === 'auth') {
            // eslint-disable-next-line default-case
            switch (payload.event) {
                case 'signIn':
                    this.validateUserSession();
                    break;
                case 'signUp':
                    break;
                case 'signOut':
                    console.log('user signed out');
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed');
                    break;
            }
        }
    }

    validateUserSession() {
        const {
            history
        } = this.props;

        Auth.currentAuthenticatedUser()
            .then(currentAuthUser => {
                // grab the user session
                Auth.userSession(currentAuthUser)
                    .then(session => {
                        // finally invoke isValid() method on session to check if auth tokens are valid
                        // if tokens have expired, lets call "logout"
                        // otherwise, dispatch AUTH_USER success action and by-pass login screen
                        if (session.isValid()) { 
                            this.context.setIsAuth(currentAuthUser);
                            history.push(map.Dashboard, { signedIn: true, authenticated: true });
                        } else {
                            const errorMessage = 'user session invalid. auth required';
                            history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
                        }
                    })
                    .catch(err => {
                        const errorMessage = JSON.stringify(err);
                        history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
                    });
            })
            .catch(err => {
                const errorMessage = JSON.stringify(err);
                history.push(map.Login, { signInFailure: true, errorMessage, authenticated: false });
            });
    }

    /* eslint-disable react/jsx-handler-names */
    render() {

        return (
            <>
                <Spinner animation="border" variant="primary" />
            </>
        );
    }
    /* eslint-enable react/jsx-handler-names */
}

export default Authorize;
