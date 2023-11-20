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
  INTERNAL_NEWS: "2.3",
  EVENT_GALLERY: "2.4",
  ART_COLLECTION: "2.5",
  HEALTH_CLUB: "2.6",
};

function VingroupCulture(props) {
  const [availableTypes, setAvailableTypes] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const url = `${
      process.env.REACT_APP_REQUEST_URL
    }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=2.1,2.2,2.3,2.4,2.5,2.6`;
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
          [CATEGORY_CODES.EVENT_GALLERY]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.EVENT_GALLERY
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.ART_COLLECTION]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.ART_COLLECTION
            )
            ?.map((item) => item.fileType),
          [CATEGORY_CODES.HEALTH_CLUB]: respData
            ?.filter(
              (item) => item.categoryCode === CATEGORY_CODES.HEALTH_CLUB
            )
            ?.map((item) => item.fileType),
        });
      }
    });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{t("VingroupCulturalGeneral")}</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("CulturalImmersionTraining")}</p>
              <p className="sub-content">{t("CulturalImmersionTrainingSub")}</p>
            </div>
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
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("EmployeeHandbookTtl")}</p>
              <p className="sub-content">{t("EmployeeHandbookSub")}</p>
            </div>
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
            &nbsp;&nbsp;{t("Newsletter")}
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

        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("EventGallery")}</p>
              <p className="sub-content">{t("EventGallerySub")}</p>
            </div>
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.EVENT_GALLERY}
              />
            }
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("ArtCollection")}</p>
              <p className="sub-content">{t("ArtCollectionSub")}</p>
            </div>
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.ART_COLLECTION}
              />
            }
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />
            &nbsp;&nbsp;
            <div className="title-content">
              <p>{t("HealthClub")}</p>
              <p className="sub-content">{t("HealthClubSub")}</p>
            </div>
          </div>
          <div className="btn-group">
            {
              <ButtonAction
                parentLink="vingroup-culture"
                availableTypes={availableTypes}
                cateCode={CATEGORY_CODES.HEALTH_CLUB}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default HOCComponent(VingroupCulture);
