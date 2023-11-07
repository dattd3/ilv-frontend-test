import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import ButtonAction from "./ButtonActionComponent";
import { getCurrentLanguage } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";

const CATEGORY_CODES = {
  TEXTBOOK: "4.1"
};

function SixManagementRulesPage() {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=4.1`;
    axios.get(url, getRequestConfigs()).then((response) => {
      const respData = response.data?.data;
      if (respData.length > 0) {
        setAvailableTypes({
          [CATEGORY_CODES.TEXTBOOK]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.TEXTBOOK)
            ?.map((item) => item.fileType)
        });
      }
    });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("SixManagementRules")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("Textbook")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="6-governance-principles"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.TEXTBOOK}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(SixManagementRulesPage);
