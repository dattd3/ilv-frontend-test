import { useTranslation } from "react-i18next";

import IconDocument from "assets/img/icon/document-blue-icon.svg";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";
import HOCComponent from "components/Common/HOCComponent";

const CATEGORY_CODES = {
  MIRACLES_AWARDS: "1.2",
  EVENT_PICTURE: "1.3",
  ARTS:"1.4",
  ABOUT_PL: "1.5" 
}

function HistoryVinGroup(props) {
  const { t } = useTranslation();

  return <div className="vingroup-cultural-page">
    <h1 className="content-page-header">{t("VingroupHistory")}</h1>
    <div className="content-page-body">
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("VingroupChronicles")}
        </div>
        <div className="btn-group">
          <a href="/vin30-chronicles" target="_blank" className="btn-link">
            <button className="btn-item">
              <img src={IconPdf} alt="" />&nbsp; PDF
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("MiraclesAndAwards")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.MIRACLES_AWARDS}`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconImage} alt="" />&nbsp; Poster
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("EventPicture")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.EVENT_PICTURE}`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconCamera} alt="" />&nbsp; {t("Photo")}
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("Arts")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.ARTS}`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconBluePlay} alt="" />&nbsp; Video
            </button>
          </a>
        </div>
      </div>
      <div className="content-item">
        <div className="title-container">
          <img src={IconDocument} alt="" />&nbsp;&nbsp;{t("AboutPnL")}
        </div>
        <div className="btn-group">
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.ABOUT_PL}?type=Image`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconCamera} alt="" />&nbsp; {t("Photo")}
            </button>
          </a>
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.ABOUT_PL}?type=PDF`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconPdf} alt="" />&nbsp; PDF
            </button>
          </a>
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.ABOUT_PL}?type=Poster`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconImage} alt="" />&nbsp; Poster
            </button>
          </a>
          <a href={`/vingroup-cultural-gallery/${CATEGORY_CODES.ABOUT_PL}?type=Video`} target="_blank" className="btn-link" rel="noreferrer">
            <button className="btn-item">
              <img src={IconBluePlay} alt="" />&nbsp; Video
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
}

export default HOCComponent(HistoryVinGroup)
