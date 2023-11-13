import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconDocument from "assets/img/icon/document-blue-icon.svg";
import HOCComponent from "components/Common/HOCComponent";
import { getCurrentLanguage } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import ButtonAction from "./ButtonActionComponent";

const CATEGORY_CODES = {
  VIN30_CHRONICLES: "1.1",
  MIRACLES_AWARDS: "1.2",
  EVENT_PICTURE: "1.3",
  ARTS: "1.4",
  ABOUT_PL: "1.5",
};

function HistoryVinGroup(props) {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=1.1,1.2,1.3,1.4,1.5`;
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

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("VingroupHistory")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("VingroupChronicles")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="vingroup-history"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.VIN30_CHRONICLES}
            />
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("MiraclesAndAwards")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="vingroup-history"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.MIRACLES_AWARDS}
            />
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("PresidentQuotes")}</p>
              <p className="sub-content">{t("PresidentQuotesSub")}</p>
            </div>
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="vingroup-history"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.EVENT_PICTURE}
            />
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("ExceptionalMentor")}</p>
              <p className="sub-content">{t("ExceptionalMentorSub")}</p>
            </div>
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="vingroup-history"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.ARTS}
            />{" "}
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;{t("VingroupGallery")}
          </div>
          <div className="btn-group">
            <ButtonAction
              parentLink="vingroup-history"
              availableTypes={availableTypes}
              cateCode={CATEGORY_CODES.ABOUT_PL}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(HistoryVinGroup);
