import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";

export const generateAvailableTypeComp = (avaiTypes, cateCode, t) => {
  const results = [];

  if (avaiTypes[cateCode] && avaiTypes[cateCode].includes("Image")) {
    results.push(
      <a
        href={`/vingroup-cultural-gallery/${cateCode}?type=Image`}
        className="btn-link"
        rel="noreferrer"
      >
        <button className="btn-item">
          <img src={IconCamera} alt="" />
          &nbsp; {t("Photo")}
        </button>
      </a>
    );
  }
  if (avaiTypes[cateCode] && avaiTypes[cateCode].includes("Pdf")) {
    results.push(
      <a
        href={`/vingroup-cultural-gallery/${cateCode}?type=Pdf`}
        className="btn-link"
        rel="noreferrer"
      >
        <button className="btn-item">
          <img src={IconPdf} alt="" />
          &nbsp; PDF
        </button>
      </a>
    );
  }
  if (avaiTypes[cateCode] && avaiTypes[cateCode].includes("Poster")) {
    results.push(
      <a
        href={`/vingroup-cultural-gallery/${cateCode}?type=Poster`}
        className="btn-link"
        rel="noreferrer"
      >
        <button className="btn-item">
          <img src={IconImage} alt="" />
          &nbsp; Poster
        </button>
      </a>
    );
  }
  if (avaiTypes[cateCode] && avaiTypes[cateCode].includes("Video")) {
    results.push(
      <a
        href={`/vingroup-cultural-gallery/${cateCode}?type=Video`}
        className="btn-link"
        rel="noreferrer"
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