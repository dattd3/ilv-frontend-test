import React, { useState, useEffect, useRef } from "react";
import HOCComponent from "components/Common/HOCComponent";
import { getCurrentLanguage, getValueParamByQueryString } from "commons/Utils";
import axios from "axios";
import { getRequestConfigs } from "commons/commonFunctions";
import { useTranslation } from "react-i18next";
import Gallery from "react-photo-gallery";

const DEMO_IMAGE_URL =
  "https://vingroupjsc.sharepoint.com/:i:/r/sites/hrdx/Shared%20Documents/General/Quote+11.jpg";

const DEMO_EMBED_URL =
  "https://vingroupjsc.sharepoint.com/sites/hrdx/_layouts/15/embed.aspx?UniqueId=cdd2a63c-4fe3-4b04-8b6b-7793440bc15b";

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
  const [data, setData] = useState([]);
  const [photoData, setPhotoData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const categoryCode = props.match.params.code;
  const fileType = getValueParamByQueryString(window.location.search, "type");

  useEffect(() => {
    const processPhotoData = async () => {
      const _data = await generateGalleryItems(data);
      setPhotoData(_data);
    };
    if (ImageTypes.includes(fileType) && data.length > 0) {
      processPhotoData();
    }
  }, [fileType, data]);

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
          {ImageTypes.includes(fileType) ? (
            <>
              {photoData.length > 0 && (
                <Gallery
                  photos={photoData}
                  direction="column"
                  columns={photoData.length > 3 ? 3 : 2}
                />
              )}
            </>
          ) : (
            <>
              {data.map((item) => (
                <iframe
                  src={item?.link}
                  width={data.length > 3 ? "31%" : "48%"}
                  height="400"
                  frameborder="0"
                  scrolling="no"
                  allowfullscreen
                  allow="fullscreen;"
                  title={item.fileName}
                  key={item.keyFrame}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const generateGalleryItems = async (data = []) => {
  const results = [];
  for (let i = 0; i < data.length; i++) {
    try {
      const imgMeta = await getMeta(data[i].link);
      results.push({
        src: data[i].link,
        width: imgMeta.naturalWidth,
        height: imgMeta.naturalHeight,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return results;
};

const getMeta = async (url) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
};

export default HOCComponent(VingroupCulturalGalleryPage);
