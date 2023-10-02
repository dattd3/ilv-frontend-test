import { useTranslation } from "react-i18next";

import IconDocument from "assets/img/icon/document-blue-icon.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";
import HOCComponent from "components/Common/HOCComponent";

const CATEGORY_CODES = {
  PRESIDENT_QUOTES: "2.1",
  OVERVIEW_CULTURE: "2.2" 
}

function VingroupCulture(props) {
  const { t } = useTranslation();

  return <div className="vingroup-cultural-page">
    <h1 className="content-page-header">{t("VingroupCulture")}</h1>
    <div className="content-page-body">
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("PresidentQuotes")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.PRESIDENT_QUOTES}?type=Image`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconImage} alt="" />&nbsp; {t("Photo")}
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("OverviewCulture")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.OVERVIEW_CULTURE}?type=Image`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconCamera} alt="" />&nbsp; {t("Photo")}
            </button>
          </a>
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.OVERVIEW_CULTURE}?type=PDF`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconPdf} alt="" />&nbsp; PDF
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
}

export default HOCComponent(VingroupCulture)
