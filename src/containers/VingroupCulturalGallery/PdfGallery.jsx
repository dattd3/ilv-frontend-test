import { useState } from "react";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import { useTranslation } from "react-i18next";
import IconBack from "assets/img/icon/Icon-Arrow-Left.svg";

const PdfGallery = ({ data }) => {
  const [fileSelectedIndex, setFileSelectedIndex] = useState(-1);
  const { t } = useTranslation();

  return (
    <div>
      {fileSelectedIndex < 0 ? (
        <div className="pdf-list">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="pdf-file"
              onClick={() => setFileSelectedIndex(index)}
            >
              <img src={IconPdf} alt="" />
              <div className="pdf-content">
                <div className="name">{item.fileName}</div>
                {item?.descriptions && (<div className="desc">{item.descriptions}</div>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="back-block" onClick={() => setFileSelectedIndex(-1)}>
            <img src={IconBack} alt="Back" className="ic-back" />
            {t("ComeBack")}
          </div>
          <div style={{ height: "calc(100vh - 200px)" }}>
            <iframe
              src={data?.[fileSelectedIndex]?.link}
              width="100%"
              height="100%"
              frameborder="0"
              scrolling="no"
              allowfullscreen
              allow="fullscreen;"
              title={data?.[fileSelectedIndex].fileName}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PdfGallery;
