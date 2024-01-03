import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCurrentLanguage,
  getValueParamByQueryString,
  formatInternalNewsData,
  getRequestConfigurations,
  getPublishedTimeByRawTime,
} from "commons/Utils";
import IconTime from "assets/img/icon/Icon-Time.svg";
import IconPlay from "assets/img/icon/play-icon-red.svg";
import IconBack from "assets/img/icon/Icon-Arrow-Left.svg";
import CustomPaging from "components/Common/CustomPaging";
import LoadingModal from "components/Common/LoadingModal";

function InternalNewsPage(props) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const type = getValueParamByQueryString(window.location.search, "type") || 2;
  const lang = getCurrentLanguage(),
    INTERNAL_NEWS_TYPE = {
      1: t('NewsInternal'),
      2: 'Podcasts',
      3: ' Video',
    };

  useEffect(() => {
    fetchNextInternalNews();
  }, [type, currentPage]);

  const fetchNextInternalNews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
        {
          ...getRequestConfigurations(),
          params: {
            size: 15,
            page: currentPage,
            culture: lang,
            newsType: type,
          },
        }
      );
      setTotal(response.data?.data?.total || 0);
      setData(formatInternalNewsData(response.data?.data?.data, lang));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onChangePage = (page) => {
    setCurrentPage(page);
  }

  const handleViewDetail = link => window.location.href = link;

  return (
    <>
      <LoadingModal show={isLoading} />
      <div className="internal-news-page">
        <div className="back-block">
          <a href="/" title={t("Menu")}>
            <img src={IconBack} alt="Back" className="ic-back" />
            {t("Menu")}
          </a>
          <span>{`/ ${INTERNAL_NEWS_TYPE[type]}`}</span>
        </div>
        <div className="body">
          {data.length > 0 ? (
            <div className="internal-news-grid">
              {data.map((item) => (
                <div className="col-md-4" key={item.id}>
                  <div className="internal-news-card" onClick={() => handleViewDetail(`/internal-news/detail/${item.id}`)}>
                    <img src={item.thumbnail} alt="" className="thumbnail" />
                    <div className="card-body">
                      <div className="title">{item.title}</div>
                      <div className="source-time-info">
                        <span className="time">
                          <img src={IconTime} alt="Time" className="icon" />
                          <span className="hour">
                            {getPublishedTimeByRawTime(item.publishedDate)?.date || "N/A"}
                          </span>
                        </span>
                      </div>
                      <a
                        href={`/internal-news/detail/${item.id}`}
                        className="news-link"
                      >
                        <button className="play-btn">
                          {type !== '1' && (
                            <>
                              <img src={IconPlay} alt="" />
                              &nbsp;&nbsp;
                            </>
                          )}
                          {t("PlayNow")}
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              <div className="wrap-paging">
                <CustomPaging
                  pageSize={15}
                  onChangePage={onChangePage}
                  totalRecords={total} />
              </div>
            </div>
          ) : (
            <div className="col-md-12 pt-3 pb-3">{isLoading ? "" : t('NodataExport')}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default InternalNewsPage;
