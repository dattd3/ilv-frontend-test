import React from "react";
import { withTranslation } from 'react-i18next';

class VimecDTLS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
           const url = `https://auth-myvingroup.vingroup.net/oauth2/authorize?identity_provider=VingroupAzureAD&redirect_uri=${process.env.REACT_APP_VINMECT_URL}auth&response_type=TOKEN&client_id=3robnggf6mb2maabibh5a7orme&scope=aws.cognito.signin.user.admin%20email%20openid%20phone%20profile`;
            window.location.assign(url);
    }
    render() {
        return <>
        </>
    }
}
export default withTranslation()(VimecDTLS)