import React, { useState, useEffect } from "react";
import DatePicker, {registerLocale } from 'react-datepicker'
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getRequestConfigs } from "commons/commonFunctions";
import { getCurrentLanguage } from "commons/Utils";
import TimeKeepingList from "./TimeKeepingList";
import LoadingModal from "components/Common/LoadingModal";
import IconDatePicker from 'assets/img/icon/Icon_DatePicker.svg'
import vi from 'date-fns/locale/vi'
import 'react-datepicker/dist/react-datepicker.css'
import moment from "../../../node_modules/moment/moment";
registerLocale("vi", vi)

const timeKeepingHistoryEndpoint = `${process.env.REACT_APP_REQUEST_URL}notifications/in/out/listbydate`;
const APIConfig = getRequestConfigs();

export default function TimeKeepingHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [timeKeepingData, setTimeKeepingData] = useState(null);
  const { t } = useTranslation();
  const lang = localStorage.getItem("locale");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(timeKeepingHistoryEndpoint, {
        params: {
          companyCode: localStorage.getItem("companyCode"),
          culture: lang === "vi-VN" ? "vi" : "en",
          date: date && moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : null,
          // page: 1,
          // pageSize: 1000,
        },
        ...APIConfig,
      });
      setTimeKeepingData(response.data?.data?.notifications);
    } catch (error) {}
    finally {
      setIsLoading(false)
    }
  };

  const handleDateInputChange = e => {
    setDate(e)
  }

  const search = () => {
    fetchData()
  }

  return (
    <>
    <LoadingModal show={isLoading} />
    <div className="time-keeping-page">
      <div className="page-title">{t("timekeeping_history").toUpperCase()}</div>
      <div className="container-card search-block">
        <div className="row align-items-end">
          <div className="col-md-4">
            <label>{ t("SearchByDate") }</label>
            <label className="date-input">
              <DatePicker 
                selected={date} 
                maxDate={new Date()}
                onChange={handleDateInputChange}
                dateFormat="dd/MM/yyyy"
                locale={getCurrentLanguage()}
                className="form-control input" />
                <span className="input-group-addon input-img"><img src={IconDatePicker} alt='IconDatePicker' /></span>
              </label> 
          </div>
          <div className="col-md-4">
            <button className="btn-search" onClick={search}>{t("Search")}</button>
          </div>
        </div>
      </div>
      {timeKeepingData?.length > 0 ? (
        <div className="container-card">
          <TimeKeepingList apiResponseData={timeKeepingData} fromPage={true} />
        </div>
      ) : (
        <div className="text-danger mt-3">
          {t("NodataExport")}
        </div>
      )}
    </div>
    </>
  );
}
