import React, { Suspense, createContext } from "react";
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
import NewestNotificationContext from "modules/context/newest-notification-context";

const listUsersIgnoreMaintenanceMode = ['cuongnv56@vingroup.net', 'vuongvt2@vingroup.net', 'thuypx2@vingroup.net', 'chiennd4@vingroup.net', 'datth3@vingroup.net', 
'minhkv1@vingroup.net', 'sonlt5@vingroup.net', 'tammt9@vingroup.net', 'hoalp2@vingroup.net', 'hieunm25@vingroup.net', 'dattd3@vingroup.net', 'loint8@vingroup.net']
const currentUserLogged = localStorage.getItem('email')
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
  const [notificationPayload, setNotificationPayload] = React.useState(null);

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
          case "APPRAISAL":
            redirectLink = "/tasks?tab=consent";
            break;
          case "APPROVAL":
            redirectLink = "/tasks?tab=approval";
            break;
          case "REQUEST":
          default:
            redirectLink = "/tasks";
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
      setNotificationPayload(payload);
    })
    .catch((err) => console.log("receive message fail: ", err));

  return (
    <>
      <ContextProviders>
        <BrowserRouter>
          {/* { !listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && <Maintenance /> } */}

          {/* { listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && */}
          <Switch>
            {routes.map(
              ({ component: Content, key, routeProps, contentProps }) => (
                <Route
                  key={key}
                  {...routeProps}
                  render={(props) => (
                    <GuardianRouter {...props} settings={RouteSettings}>
                      {(childProps) => (
                        <Suspense fallback={<LoadingModal show={true} />}>
                          <NewestNotificationContext.Provider value={notificationPayload}>
                            <Content {...contentProps} {...childProps} />
                          </NewestNotificationContext.Provider>
                        </Suspense>
                      )}
                    </GuardianRouter>
                  )}
                />
              )
            )}
          </Switch>
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
            top: 70,
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
    </>
  );
}

export default Root;
