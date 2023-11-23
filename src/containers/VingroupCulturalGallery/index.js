import { useState, useEffect } from 'react';
import HOCComponent from 'components/Common/HOCComponent';
import { getCurrentLanguage, getValueParamByQueryString } from 'commons/Utils';
import axios from 'axios';
import { getRequestConfigs } from 'commons/commonFunctions';
import { useTranslation } from 'react-i18next';
import PdfGallery from './PdfGallery';
import ImageGallery from './ImageGallery';
import Constants from 'commons/Constants';

const DEMO_IMAGE_URL =
    'https://vingroupjsc.sharepoint.com/:i:/r/sites/TDVG-Video-Podcast/Shared%20Documents/%5BDEV%5DFile%20check%20quy%E1%BB%81n.%20Vui%20l%C3%B2ng%20kh%C3%B4ng%20x%C3%B3a%20file%20n%C3%A0y.png',
  DEMO_EMBED_URL =
    'https://vingroupjsc.sharepoint.com/sites/TDVG-Video-Podcast/_layouts/15/embed.aspx?UniqueId=ff5ffcf3-1bcf-4514-9c72-65beef39dafe';

function VingroupCulturalGalleryPage(props) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [testUrl, setTestUrl] = useState(DEMO_IMAGE_URL);
  const [isNotLoggedSharepoint, setIsNotLoggedSharepoint] = useState(false);

  const categoryCode = props.match.params.code;
  const fileType = getValueParamByQueryString(window.location.search, 'type');
  const isVietnamese = localStorage.getItem('locale') === Constants.LANGUAGE_VI,
    name = isVietnamese ? data?.[0]?.categoryNameVn : data?.[0]?.categoryNameEn,
    [title, ...desc] = (name || '').split('\n');

  useEffect(() => {
    const _interval = setInterval(() => {
      setTestUrl(testUrl + `?${new Date().getTime()}`);
    }, 3000);
    setIntervalId(_interval);
    fetchData();

    return () => clearInterval(_interval);
  }, []);

  const fetchData = async () => {
    try {
      let url = `${
        process.env.REACT_APP_REQUEST_URL
      }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=${categoryCode}${
        !!fileType ? `&fileType=${fileType}` : ''
      }`;

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

  const generateGalleryContent = () => {
    switch (fileType) {
      case 'Image':
        return <ImageGallery data={data} />;
      case 'Pdf':
        return <PdfGallery data={data} />;
      case 'Poster':
        return (
          <>
            {data.map((item) => (
              <div className="poster-item" key={item?.id}>
                <img className="poster-img" src={item?.link} alt="" />
                {item?.descriptions && (
                  <div className="poster-desc">{item.descriptions}</div>
                )}
              </div>
            ))}
          </>
        );
      default:
        return (
          <div className="video-list">
            {data.map((item) => (
              <div className="video-item" key={item?.id}>
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
                {item?.descriptions && (
                  <div className="video-desc" title={item.descriptions}>
                    {item.descriptions}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{title}</h1>
      {isFetched && data.length === 0 && <div>{t('NodataExport')}</div>}
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
              title={'DEMO'}
            />
          ) : (
            generateGalleryContent()
          )}
        </div>
      )}
      <img
        style={{ display: 'none' }}
        src={testUrl}
        onError={onTestImageError}
        onLoad={onTestImageLoad}
        alt=""
      />
    </div>
  );
}

export default HOCComponent(VingroupCulturalGalleryPage);
