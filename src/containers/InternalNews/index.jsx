import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getCurrentLanguage,
  getValueParamByQueryString,
  formatInternalNewsData,
  getRequestConfigurations,
} from "commons/Utils";
import IconBack from "assets/img/icon/Icon-Arrow-Left.svg";
import IconPlay from "assets/img/icon/play-icon-red.svg";

function InternalNewsPage(props) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const type = getValueParamByQueryString(window.location.search, "type") || 2;
  const lang = getCurrentLanguage();

  useEffect(() => {
    fetchNextInternalNews();
  }, [type]);

  const fetchNextInternalNews = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_REQUEST_URL}internal-news/list`,
        {
          ...getRequestConfigurations(),
          params: {
            page: currentPage,
            size: 10,
            newsType: type,
            culture: lang,
          },
        }
      );
      setCurrentPage(currentPage + 1);
      setTotal(response.data?.data?.total || 0);
      setData([
        ...data,
        ...formatInternalNewsData(response.data?.data?.data, lang),
      ]);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="internal-news-page">
      <div className="back-block">
        <a href="/" title={t("ComeBack")}>
          <img src={IconBack} alt="Back" className="ic-back" />
          {t("ComeBack")}
        </a>
      </div>
      <div className="body">
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={fetchNextInternalNews}
          height="calc(100vh - 180px)"
          hasMore={data.length < total}
          loader={<h5>Loading...</h5>}
          style={{ overflowX: "hidden" }}
        >
          <div className="internal-news-grid row">
            {data.map((item) => (
              <div className="col-md-4" key={item.id}>
                <div className="internal-news-card">
                  <img src={item.thumbnail} alt="" className="thumbnail" />
                  <div className="card-body">
                    <div className="title">{item.title}</div>
                    <div className="description">{item.description}</div>
                    <a
                      href={`/internal-news/detail/${item.id}`}
                      className="news-link"
                    >
                      <button className="play-btn">
                        <img src={IconPlay} alt="" />
                        &nbsp;&nbsp;
                        {t("PlayNow")}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default InternalNewsPage;
