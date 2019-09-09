const awsConfig = {
    AWS_REGION: 'ap-southeast-1',
    AWS_COGNITO_IDENTITY_POOL_ID: 'ap-southeast-1:6f456db0-4d11-42c0-9d03-93759a57ff0a',
    AWS_COGNITO_USER_POOL_ID: 'ap-southeast-1_ynhXfx3Qy',
    AWS_COGNITO_CLIENT_ID: '5jlci8o26j87n06ffbht7hjbn',
    AWS_COGNITO_CLIENT_DOMAIN_NAME: 'vinpearl-portal-sso.auth.ap-southeast-1.amazoncognito.com',
    AWS_COGNITO_IDP_NAME: 'SETME',
    AWS_COGNITO_IDP_SIGNIN_URL: 'http://localhost:3000/auth', // must match cognito setting
    AWS_COGNITO_IDP_SIGNOUT_URL: 'http://localhost:3000/sign-out', // must match cognito setting
    AWS_COGNITO_IDP_OAUTH_CLAIMS: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    AWS_COGNITO_IDP_GRANT_FLOW: 'token' // 'code' or 'token'
  };
  
  export default awsConfig;