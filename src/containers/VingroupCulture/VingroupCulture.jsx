import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import ButtonAction from "./ButtonActionComponent";
import { getCurrentLanguage } from "commons/Utils";

const CATEGORY_CODES = {
  PRESIDENT_QUOTES: "2.1",
  OVERVIEW_CULTURE: "2.2",
  INTERNAL_NEWS: "2.3"
};

function VingroupCulture(props) {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=2.1,2.2,2.3`;
    axios.get(url, getRequestConfigs()).then((response) => {
      const respData = response.data?.data;
      if (respData.length > 0) {
        setAvailableTypes({
          [CATEGORY_CODES.PRESIDENT_QUOTES]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.PRESIDENT_QUOTES
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.OVERVIEW_CULTURE]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.OVERVIEW_CULTURE
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.INTERNAL_NEWS]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.INTERNAL_NEWS
            )
            ?.map((item) => item.fileType),
        });
      }
    });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("VingroupCulture")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("PresidentQuotes")}
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.PRESIDENT_QUOTES}
              />
            }
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("OverviewCulture")}
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.OVERVIEW_CULTURE}
              />
            }
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("InternalNews")}
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.INTERNAL_NEWS}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(VingroupCulture);
