import { useTranslation } from "react-i18next";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";

const ButtonActionComponent = ({ availableTypes, cateCode }) => {
  console.log(availableTypes, cateCode)
  const { t } = useTranslation();

  const handleOnClickBtn = (cateCode, type) => {
    const link = `/vingroup-cultural-gallery/${cateCode}?type=${type}`;
    // if (!localStorage.getItem("sharepoint_jwt") && ["Poster", "Image"].includes(type)) {
    //   const state = getStateSharepointRedirect(process.env.REACT_APP_SHAREPOINT_SIGNIN_URL, process.env.REACT_APP_ENVIRONMENT);
    //   const url = `${process.env.REACT_APP_LOGIN_V2_PATH}&state=${state}%26response_type%3Dcode&redirect_uri=${process.env.REACT_APP_REDIRECT_V2_URL}&prompt=select_account&scope=https://vingroupjsc.sharepoint.com/.default`;
    //   window.localStorage.setItem("sharepoint_redirect_url", link);
    //   window.location.assign(url);
    // }
    window.location.href = link;
  };

  const results = [];

  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Image")) {
    results.push(
      <button
        className="btn-item"
        onClick={() => handleOnClickBtn(cateCode, "Image")}
      >
        <img src={IconCamera} alt="" />
        &nbsp; {t("Photo")}
      </button>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Pdf")) {
    results.push(
      <button
        className="btn-item"
        onClick={() => handleOnClickBtn(cateCode, "Pdf")}
      >
        <img src={IconPdf} alt="" />
        &nbsp; PDF
      </button>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Poster")) {
    results.push(
      <button
        className="btn-item"
        onClick={() => handleOnClickBtn(cateCode, "Poster")}
      >
        <img src={IconImage} alt="" />
        &nbsp; Poster
      </button>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Video")) {
    results.push(
      <button
        className="btn-item"
        onClick={() => handleOnClickBtn(cateCode, "Video")}
      >
        <img src={IconBluePlay} alt="" />
        &nbsp; Video
      </button>
    );
  }
  return results;
};

export default ButtonActionComponent;
