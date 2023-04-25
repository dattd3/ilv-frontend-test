import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getRequestConfigs } from "commons/commonFunctions";
import TimeKeepingList from "./TimeKeepingList";
const timeKeepingHistoryEndpoint = `${process.env.REACT_APP_REQUEST_URL}notifications/in/out/list`;
const APIConfig = getRequestConfigs();

export default function TimeKeepingHistory() {
  const [timeKeepingData, setTimeKeepingData] = useState(null);
  const { t } = useTranslation();
  const lang = localStorage.getItem("locale");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(timeKeepingHistoryEndpoint, {
        params: {
          companyCode: localStorage.getItem("companyCode"),
          culture: lang === "vi-VN" ? "vi" : "en",
          page: 1,
          pageSize: 1000,
        },
        ...APIConfig,
      });
      setTimeKeepingData(response.data?.data?.notifications);
    } catch (error) {}
  };

  return (
    <div className="time-keeping-page">
      <div className="page-title">{t("timekeeping_history").toUpperCase()}</div>
      {timeKeepingData?.length > 0 ? (
        <div className="container-card">
          <TimeKeepingList apiResponseData={timeKeepingData} />
        </div>
      ) : (
        <div className="text-danger mt-3">
          {t("NodataExport")}
        </div>
      )}
    </div>
  );
}
