import React, { useState, useEffect } from "react";
import HOCComponent from "components/Common/HOCComponent";
import { getCurrentLanguage, getValueParamByQueryString } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import { useTranslation } from "react-i18next";
import PdfGallery from "./PdfGallery";
import ImageGallery from "./ImageGallery";

const DEMO_IMAGE_URL =
  "https://vingroupjsc.sharepoint.com/sites/TDVG-Video-Podcast/Shared%20Documents/D%E1%BB%B1%20%C3%A1n%20c%E1%BA%A3i%20ti%E1%BA%BFn%20ILVG/M%E1%BB%A5c%20V%C4%83n%20h%C3%B3a%20Vingroup/%5BDEV%5DFile%20check%20quy%E1%BB%81n.%20Vui%20l%C3%B2ng%20kh%C3%B4ng%20x%C3%B3a%20file%20n%C3%A0y.png";

const DEMO_EMBED_URL =
  "https://vingroupjsc.sharepoint.com/sites/TDVG-Video-Podcast/_layouts/15/embed.aspx?UniqueId=276723bf-dbb1-48cd-b302-7040a8dfff5c";

const VINGROUP_CULTURE_CATEGORIES = [
  {
    code: "1.1",
    label: "Vin30Chronicles",
  },
  {
    code: "1.2",
    label: "MiraclesAndAwards",
  },
  {
    code: "1.3",
    label: "EventPicture",
  },
  {
    code: "1.4",
    label: "Arts",
  },
  {
    code: "1.5",
    label: "AboutPnL",
  },
  {
    code: "2.1",
    label: "PresidentQuotes",
  },
  {
    code: "2.2",
    label: "OverviewCulture",
  },
  {
    code: "3.1",
    label: "Textbook",
  },
  {
    code: "3.2",
    label: "Storytelling",
  },
  {
    code: "3.3",
    label: "InspiringShortFilm",
  },
  {
    code: "4.1",
    label: "Textbook",
  },
  {
    code: "4.2",
    label: "Storytelling",
  },
  {
    code: "4.3",
    label: "InspiringShortFilm",
  },
  {
    code: "5.1",
    label: "InspiringShortFilm",
  },
  {
    code: "5.2",
    label: "CivillyVingroup",
  },
  {
    code: "5.3",
    label: "Banner",
  },
];

const ImageTypes = ["Image", "Poster"];

function VingroupCulturalGalleryPage(props) {
  const { t } = useTranslation();
  const [testUrl, setTestUrl] = useState(DEMO_IMAGE_URL);
  const [intervalId, setIntervalId] = useState(null);
  const [isNotLoggedSharepoint, setIsNotLoggedSharepoint] = useState(false);
  const [data, setData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const categoryCode = props.match.params.code;
  const fileType = getValueParamByQueryString(window.location.search, "type");

  useEffect(() => {
    const _interval = setInterval(() => {
      setTestUrl(testUrl + `?${new Date().getTime()}`);
    }, 5000);
    setIntervalId(_interval);
    fetchData();

    return () => clearInterval(_interval);
  }, []);

  const fetchData = async () => {
    try {
      let url = `${
        process.env.REACT_APP_REQUEST_URL
      }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=${categoryCode}`;
      if (fileType) {
        url += `&fileType=${fileType}`;
      }
      const response = await axios.get(url, getRequestConfigs());
      setData(
        response.data?.data?.map((item) => ({
          ...item,
          keyFrame: item.link,
        }))
      );
      setIsFetched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onTestImageError = () => {
    setIsNotLoggedSharepoint(true);
  };

  const onTestImageLoad = () => {
    clearInterval(intervalId);
    setIsNotLoggedSharepoint(false);
  };

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">
        {t(
          VINGROUP_CULTURE_CATEGORIES?.find((it) => it.code === categoryCode)
            ?.label
        )}
      </h1>
      {isFetched && data.length === 0 && <div>{t("NodataExport")}</div>}
      {data.length > 0 && (
        <div className="gallery-container">
          {isNotLoggedSharepoint ? (
            <iframe
              src={DEMO_EMBED_URL}
              width="100%"
              height="500"
              frameborder="0"
              scrolling="no"
              allowfullscreen
              title={"DEMO"}
            />
          ) : (
            <>
              {ImageTypes.includes(fileType) ? (
                <ImageGallery data={data} />
              ) : (
                <>
                  {fileType === "Pdf" ? (
                    <PdfGallery data={data} />
                  ) : (
                    <>
                      {data.map((item) => (
                        <iframe
                          src={item?.link}
                          width="31%"
                          height={320}
                          frameborder="0"
                          scrolling="no"
                          allowfullscreen
                          allow="fullscreen;"
                          title={item.fileName}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
      <img
        style={{ display: "none" }}
        src={testUrl}
        onError={onTestImageError}
        onLoad={onTestImageLoad}
        alt=""
      />
    </div>
  );
}

export default HOCComponent(VingroupCulturalGalleryPage);
