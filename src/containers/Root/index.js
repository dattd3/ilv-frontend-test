import React, { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Constants from "commons/Constants";
import ContextProviders from "./providers";
import { Image, Toast } from "react-bootstrap";
import { GuardianRouter } from "../../modules";
import { ToastContainer } from "react-toastify";
import Maintenance from "containers/Maintenance";
import routes, { RouteSettings } from "../routes.config";
import LoadingModal from "../../components/Common/LoadingModal";
import { FirebaseMessageListener } from "../../commons/Firebase";
import NewestNotificationContext from "modules/context/newest-notification-context";
import "../../assets/scss/sb-admin-2.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "assets/img/icon/icon_x.svg";
import RedArrowIcon from "assets/img/icon/red-arrow-right.svg";

const listUsersIgnoreMaintenanceMode = [
  "cuongnv56@vingroup.net",
  "vuongvt2@vingroup.net",
  "thuypx2@vingroup.net",
  "chiennd4@vingroup.net",
  "datth3@vingroup.net",
  'minhkv1@vingroup.net',
  'sonlt5@vingroup.net',
  'tammt9@vingroup.net',
  'hoalp2@vingroup.net',
  'hieunm25@vingroup.net',
  'dattd3@vingroup.net',
  'loint8@vingroup.net'
];
const currentUserLogged = localStorage.getItem("email");

const INIT_NOTIFICATION_STATE = {
  title: "",
  body: "",
  isShow: false,
  toastTitle: "",
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
  
  const location = useLocation();
  const [notification, setNotification] = React.useState(
    INIT_NOTIFICATION_STATE
  );
  const [notificationPayload, setNotificationPayload] = React.useState(null);
  const isVietnamese = localStorage.getItem("locale") === Constants.LANGUAGE_VI;

  useEffect(() => {
    const cultureMenu = JSON.parse(localStorage.getItem('cultureMenu') || "[]");
    const cultureRouters = cultureMenu.reduce((res, ele) => {
      const link = ele.nameEn.toLowerCase().split(" ").join("-");

      return res.concat([{
        key: link,
        routeProps: {
          exact: true,
          path: `/${link}`,
        },
        component: lazy(() => import("../VingroupCulture/index.jsx")),
      },
      {
        key: `${link}-gallery`,
        routeProps: {
          exact: true,
          path: `/${link}/gallery/:code`,
        },
        component: lazy(() => import("../VingroupCulturalGallery/index.js")),
      }]);
    }, []);

    if (
      cultureRouters.length > 0 && 
      !routes.find(ele => ele.key === 'main').contentProps.routes.find(ele => ele.key === cultureRouters[0].key)
    ) {
      routes.find(ele => ele.key === 'main').contentProps.routes.push(...cultureRouters);
    }
  }, [location]);

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

  new BroadcastChannel('notification-channel').addEventListener('message', event => {
    setNotificationPayload(event.data.payload);
  });
    
  return (
    <>
      <ContextProviders>
        {/* { !listUsersIgnoreMaintenanceMode.includes(currentUserLogged) && <Maintenance /> } */}

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
            <span>
              {notification.toastTitle?.toUpperCase()}
            </span>
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
