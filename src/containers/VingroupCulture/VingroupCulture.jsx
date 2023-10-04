import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import { generateAvailableTypeComp } from "./utils";
import { getCurrentLanguage } from "commons/Utils";

const CATEGORY_CODES = {
  PRESIDENT_QUOTES: "2.1",
  OVERVIEW_CULTURE: "2.2" 
}

function VingroupCulture(props) {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=2.1,2.2`;
    axios.get(url, getRequestConfigs()).then((response) => {
      const respData = response.data?.data;
      if (respData.length > 0) {
        setAvailableTypes({
          [CATEGORY_CODES.VIN30_CHRONICLES]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.VIN30_CHRONICLES
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.MIRACLES_AWARDS]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.MIRACLES_AWARDS
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.EVENT_PICTURE]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.EVENT_PICTURE
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.ARTS]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.ARTS)
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.ABOUT_PL]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.ABOUT_PL)
            ?.map((item) => item.fileType),
        });
      }
    });
  }, []);

  return <div className="vingroup-cultural-page">
    <h1 className="content-page-header">{t("VingroupCulture")}</h1>
    <div className="content-page-body">
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("PresidentQuotes")}
        </div>
        <div className="btn-group">
          {
            generateAvailableTypeComp(availableTypes, CATEGORY_CODES.PRESIDENT_QUOTES, t)
          }
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("OverviewCulture")}
        </div>
        <div className="btn-group">
          {
            generateAvailableTypeComp(availableTypes, CATEGORY_CODES.OVERVIEW_CULTURE, t)
          }
        </div>
      </div>
    </div>
  </div>
}

export default HOCComponent(VingroupCulture)
