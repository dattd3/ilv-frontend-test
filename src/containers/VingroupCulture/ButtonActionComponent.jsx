import { useTranslation } from "react-i18next";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";

const ButtonActionComponent = ({ parentLink, availableTypes, cateCode }) => {
  const { t } = useTranslation();

  const results = [];

  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Image")) {
    results.push(
      <a
        href={`/${parentLink}/gallery/${cateCode}?type=Image`}
        className="btn-link"
        key="Image"
      >
        <button className="btn-item">
          <img src={IconCamera} alt="" />
          &nbsp; {t("Photo")}
        </button>
      </a>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Pdf")) {
    results.push(
      <a
        href={cateCode === "1.1" ? `/vin30-chronicles` : `/${parentLink}/gallery/${cateCode}?type=Pdf`}
        className="btn-link"
        key="Pdf"
      >
        <button className="btn-item">
          <img src={IconPdf} alt="" />
          &nbsp; PDF
        </button>
      </a>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Poster")) {
    results.push(
      <a
        href={`/${parentLink}/gallery/${cateCode}?type=Poster`}
        className="btn-link"
        key="Poster"
      >
        <button className="btn-item">
          <img src={IconImage} alt="" />
          &nbsp; Poster
        </button>
      </a>
    );
  }
  if (availableTypes[cateCode] && availableTypes[cateCode].includes("Video")) {
    results.push(
      <a
        href={`/${parentLink}/gallery/${cateCode}?type=Video`}
        className="btn-link"
        key="Video"
      >
        <button className="btn-item">
          <img src={IconBluePlay} alt="" />
          &nbsp; Video
        </button>
      </a>
    );
  }
  return results;
};

export default ButtonActionComponent;
