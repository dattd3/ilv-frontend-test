import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import { getCurrentLanguage } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import ButtonAction from "./ButtonActionComponent";

const CATEGORY_CODES = {
  TEXTBOOK: "3.1",
  CULTURAL_REFLECTIONS: "3.2",
  INSPIRING_SHORT_FILM: "3.3",
};

function SixCoreValuesPage() {
  const [availableTypes, setAvailableTypes] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=3.1,3.2,3.3`;
    axios.get(url, getRequestConfigs()).then((response) => {
      const respData = response.data?.data;
      if (respData.length > 0) {
        setAvailableTypes({
          [CATEGORY_CODES.TEXTBOOK]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.TEXTBOOK)
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.CULTURAL_REFLECTIONS]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.CULTURAL_REFLECTIONS)
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.INSPIRING_SHORT_FILM]: respData
            ?.filter((item) => item.categoryCode === CATEGORY_CODES.INSPIRING_SHORT_FILM)
            ?.map((item) => item.fileType),
        });
      }
    });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("SixCoreValues")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("Textbook")}</p>
              <p className="sub-content">{t("TextbookSub")}</p>
            </div>
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="6-core-values"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.TEXTBOOK}
            />
          </div>
        </div>
        {/* <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("CulturalReflections")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="6-core-values"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.CULTURAL_REFLECTIONS}
            />
          </div>
        </div> */}
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("InspiringShortFilm")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="6-core-values"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.INSPIRING_SHORT_FILM}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(SixCoreValuesPage);
