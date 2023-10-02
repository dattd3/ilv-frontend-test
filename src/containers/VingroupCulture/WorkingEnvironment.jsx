import { useTranslation } from "react-i18next";

import IconDocument from "assets/img/icon/document-blue-icon.svg";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import HOCComponent from "components/Common/HOCComponent";

const CATEGORY_CODES = {
  TEXTBOOK: "3.1",
  STORYTELLING: "3.2",
  INSPIRING_SHORT_FILM:"3.3",
}

function WorkingEnvironmentPage() {
  const { t } = useTranslation();

  return <div className="vingroup-cultural-page">
    <h1 className="content-page-header">{t("VingroupWorkingEnvironment")}</h1>
    <div className="content-page-body">
    <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("InspiringShortFilm")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.INSPIRING_SHORT_FILM}?type=Video`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconBluePlay} alt="" />&nbsp; Video
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("CivillyVingroup")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.STORYTELLING}?type=Image`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconPdf} alt="" />&nbsp; PDF
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("Banner")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.STORYTELLING}?type=Image`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconImage} alt="" />&nbsp; {t("Photo")}
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
}

export default HOCComponent(WorkingEnvironmentPage)
