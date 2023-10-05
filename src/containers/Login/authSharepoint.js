import { useEffect } from "react";
import axios from "axios";
import LoadingModal from "components/Common/LoadingModal";
import moment from "moment";

function AuthorizeSharepoint(props) {
  const { history } = props;

  useEffect(() => {
    const getTokenSharepoint = async () => {
      const queryParams = new URLSearchParams(history?.location?.search);
      console.log(queryParams);
      if (queryParams.has("code")) {
        const code = queryParams.get("code");
        const bodyFormData = new FormData();
        bodyFormData.append("code", code);
        const response = await axios.post(
          `${process.env.REACT_APP_REDIRECT_V2_URL}/gettoken`,
          bodyFormData
        );
        console.log(response);
        const { access_token, expires_in } = response?.data;
        if (!access_token) {
          return window.location.replace("/");
        }

        const expireIn = expires_in || 3600; // Nếu không trả về thì mặc định thời gian hết hạn là 1h
        const timeTokenExpire = moment()
          .add(Number(expireIn), "seconds")
          .format("YYYYMMDDHHmmss");

        localStorage.setItem("sharepoint_jwt", access_token);
        localStorage.setItem("sharepoint_jwt_expired", timeTokenExpire);
        const redirectUrl = localStorage.getItem("sharepoint_redirect_url");
        localStorage.removeItem("sharepoint_redirect_url");

        return window.location.replace(redirectUrl)
      }
    };
    getTokenSharepoint();
  }, []);
  console.log(new URLSearchParams(history?.location?.search));
  return (
    <>
      <LoadingModal show={true} isloading={true} />
    </>
  );
}

export default AuthorizeSharepoint;
