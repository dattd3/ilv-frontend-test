import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import ButtonAction from "./ButtonActionComponent";
import { getCurrentLanguage } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";

const CATEGORY_CODES = {
  CIVILLY_VINGROUP: "5.2",
};

function WorkingEnvironmentPage() {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=5.2`;
    axios.get(url, getRequestConfigs()).then((response) => {
      const respData = response.data?.data;
      if (respData.length > 0) {
        setAvailableTypes({
          [CATEGORY_CODES.CIVILLY_VINGROUP]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.CIVILLY_VINGROUP
            )
            ?.map((item) => item.fileType)
        });
      }
    });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("VingroupWorkingEnvironment")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("CivillyVingroup")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="working-environment"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.CIVILLY_VINGROUP}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(WorkingEnvironmentPage);
