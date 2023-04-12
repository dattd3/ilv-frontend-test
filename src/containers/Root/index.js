import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FirebaseMessageListener } from "../../commons/Firebase";
import { Image } from "react-bootstrap";
import { GuardianRouter } from "../../modules";
import routes, { RouteSettings } from "../routes.config";
import ContextProviders from "./providers";
import "../../assets/scss/sb-admin-2.scss";
import LoadingModal from "../../components/Common/LoadingModal";
import { Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import RedArrowIcon from "assets/img/icon/red-arrow-right.svg";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "assets/img/icon/icon_x.svg";
import Constants from "commons/Constants";

const listUsersIgnoreMaintenanceMode = [
  "cuongnv56@vingroup.net",
  "vuongvt2@vingroup.net",
  "thuypx2@vingroup.net",
  "chiennd4@vingroup.net",
  "datth3@vingroup.net",
];
const currentUserLogged = localStorage.getItem("email");

const INIT_NOTIFICATION_STATE = {
  isShow: false,
  toastTitle: "",
  title: "",
  body: "",
  redirectLink: "",
};

function Root() {
  // AWS SDK & AWS Amplity Configuration
  // AWS.config.region = config.AWS_REGION;
  // Amplify.configure({
  //   Auth: {
  //     identityPoolId: config.AWS_COGNITO_IDENTITY_POOL_ID,
  //     region: config.AWS_REGION,
  //     userPoolId: config.AWS_COGNITO_USER_POOL_ID,
  //     userPoolWebClientId: config.AWS_COGNITO_CLIENT_ID,
  //     oauth: {
  //       domain: config.AWS_COGNITO_CLIENT_DOMAIN_NAME,
  //       scope: config.AWS_COGNITO_IDP_OAUTH_CLAIMS,
  //       redirectSignIn: config.AWS_COGNITO_IDP_SIGNIN_URL,
  //       redirectSignOut: config.AWS_COGNITO_IDP_SIGNOUT_URL,
  //       responseType: config.AWS_COGNITO_IDP_GRANT_FLOW
  //     }
  //   }
  // });

  const [notification, setNotification] = React.useState(
    INIT_NOTIFICATION_STATE
  );
  const isVietnamese = localStorage.getItem("locale") === Constants.LANGUAGE_VI;


  FirebaseMessageListener()
    .then((payload) => {
      let toastTitle = isVietnamese ? "Thông báo nội bộ" : "Announcement";
      let redirectLink = "";
      let title = ""
      if (["IN", "OUT"].includes(payload.data?.detailType)) {
        toastTitle = isVietnamese ? "Lịch sử chấm công" : "Timekeeping History";
        title = payload.notification.title
        redirectLink = "/timekeeping-history";
      } else {
        switch (payload.data?.detailType) {
          case "REQUEST":
            redirectLink = "/tasks";
            break;
          case "APPRAISAL":
            redirectLink = "/tasks?tab=consent";
            break;
          case "APPROVAL":
            redirectLink = "/tab=approval";
            break;
          default:
            break;
        }
      }
      setNotification({
        isShow: true,
        toastTitle,
        title,
        body: payload.notification.body,
        redirectLink,
      });
    })
    .catch((err) => console.log("receive message fail: ", err));

  return (
    // <CookiesProvider>
      <ContextProviders>
        <BrowserRouter>
          {/* { !listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && <Maintenance /> } */}
          {/* { listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && */}
          <>
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          <Switch>
            {routes.map(
              ({ component: Content, key, routeProps, contentProps }) => (
                <Route
                  key={key}
                  {...routeProps}
                  render={props => (
                    <GuardianRouter {...props} settings={RouteSettings}>
                      {childProps => (
                        <Suspense fallback={<LoadingModal show={true} />}>
                          <Content {...contentProps} {...childProps} />
                        </Suspense>
                      )}
                    </GuardianRouter>
                  )}
                />
              )
            )}
          </Switch>
          </>
          {/* } */}
        </BrowserRouter>
        <Toast
          onClose={() =>
            setNotification(INIT_NOTIFICATION_STATE)
          }
          show={notification.isShow}
          delay={5000}
          autohide
          animation
          style={{
            position: "absolute",
            top: 50,
            right: 25,
            minWidth: 400,
            background: "#fff",
          }}
          className="custom-notification-toast"
        >
          <div className="toast-header">
            <span>{notification.toastTitle}</span>
            <Image
              onClick={() => setNotification(INIT_NOTIFICATION_STATE)}
              className="close"
              alt="details notification"
              src={CloseIcon}
            />
          </div>
          <Toast.Body>
            <div className="content-title">{notification.title}</div>
            <div className="content">{notification.body}</div>
            <a href={notification.redirectLink} className="details-link">
              {isVietnamese ? "Xem chi tiết" : "Details"} &nbsp;
              <Image alt="details notification" src={RedArrowIcon} />
            </a>
          </Toast.Body>
        </Toast>
        <ToastContainer />
      </ContextProviders>
  );
}

export default Root;
