import React, { useEffect, useState } from "react";
import { Modal, FormControl } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import IconSearch from "assets/img/icon/icon-search.svg";
import IconCloseModal from "assets/img/icon/Icon_Close_Modal.svg";
import IconRedEye from "assets/img/icon/icon-red-eye.svg";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import { getRequestConfigurations } from "commons/Utils";
import Constants from "commons/Constants";

export default function UseGuideModal({ show, onHide, setShowUseGuideIcon }) {
  const [useGuideData, setUseGuideData] = useState([]);
  const [useGuideDataShow, setUseGuideDataShow] = useState([]);
  const { t } = useTranslation();
  const currentLocale = localStorage.getItem("locale");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let data = [];
    const dataLocalStorage = localStorage.getItem("user-guides");

    if (dataLocalStorage) {
      try {
        data = JSON.parse(dataLocalStorage);
      } catch (_) {}
    }
    if (!data.length) {
      try {
        const config = getRequestConfigurations();
        const response = await axios.get(
          `${
            process.env.REACT_APP_REQUEST_URL
          }user-operation-guide/by-pnl/${localStorage.getItem(
            "organizationLv2"
          )}`,
          config
        );
        data = response.data?.data;
        localStorage.setItem("user-guides", JSON.stringify(data));
      } catch (_) {}
    }
    if (data.length > 0) {
      setUseGuideData(processUserGuideData(data, currentLocale));
      setUseGuideDataShow(processUserGuideData(data, currentLocale));
      setShowUseGuideIcon(true);
    }
  };

  const handleSearchInputChange = (e) => {
    setUseGuideDataShow(
      useGuideData.filter((item) =>
        removeAccentsAndLowerCase(item.nameLocale).includes(
          removeAccentsAndLowerCase(e.target.value)
        )
      )
    );
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      className="use-guide-modal"
      centered
      show={show}
      onHide={onHide}
      dialogClassName="use-guide-dialog-modal"
    >
      <Modal.Body>
        <div className="title position-relative">
          {t("HowToUseOurSystem")}
          <img
            src={IconCloseModal}
            alt=""
            className="icon-close"
            onClick={onHide}
          />
        </div>
        <div className="body">
          <div className="flex-1 position-relative">
            <img src={IconSearch} alt="" className="icon-prefix-select" />
            <FormControl
              placeholder={t("SearchByFeatureName")}
              className="search-input"
              onChange={handleSearchInputChange}
            />
            <div className="content-table">
              <div className="content-header mb-15">
                <div className="content-col-1">
                  <b>{t("NO")}</b>
                </div>
                <div className="content-col-2">
                  <b>{t("FeatureName")}</b>
                </div>
                <div className="content-col-3">
                  <b>{t("Website")}</b>
                </div>
                <div className="content-col-4">
                  <b>{t("Mobile")}</b>
                </div>
              </div>
              {useGuideDataShow?.map((item, index) => (
                <div className="content-item mb-15" key={index}>
                  <div className="content-col-1">{item.order}</div>
                  <div className="content-col-2">
                    <div>
                      <b>{item.nameLocale}</b>
                    </div>
                    <div>
                      {t("ModifiedDate")}:{" "}
                      {moment(item.dateModified || item.dateCreated).format(
                        "DD/MM/YYYY"
                      )}
                    </div>
                  </div>
                  <div className="content-col-3">
                    <a
                      className="cursor-pointer link"
                      href={`https://view.officeapps.live.com/op/view.aspx?src=${item.webFileUrlLocale}`}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        !item.webFileUrlLocale
                          ? { opacity: 0.3, pointerEvents: "none" }
                          : {}
                      }
                    >
                      <img src={IconRedEye} alt="" />
                      &nbsp;&nbsp;
                      {t("WatchFile")}
                    </a>
                    <a
                      className="cursor-pointer link"
                      href={item.webVideoUrlLocale}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        !item.webVideoUrlLocale
                          ? { opacity: 0.3, pointerEvents: "none" }
                          : {}
                      }
                    >
                      <img src={IconBluePlay} alt="" />
                      &nbsp;&nbsp;
                      {t("WatchVideo")}
                    </a>
                  </div>
                  <div className="content-col-4">
                    <a
                      className="cursor-pointer link"
                      href={`https://view.officeapps.live.com/op/view.aspx?src=${item.mobileFileUrlLocale}`}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        !item.mobileFileUrlLocale
                          ? { opacity: 0.3, pointerEvents: "none" }
                          : {}
                      }
                    >
                      <img src={IconRedEye} alt="" />
                      &nbsp;&nbsp;
                      {t("WatchFile")}
                    </a>
                    <a
                      className="cursor-pointer link"
                      href={item.mobileVideoUrlLocale}
                      target="_blank"
                      rel="noreferrer"
                      style={
                        !item.mobileVideoUrlLocale
                          ? { opacity: 0.3, pointerEvents: "none" }
                          : {}
                      }
                    >
                      <img src={IconBluePlay} alt="" />
                      &nbsp;&nbsp;
                      {t("WatchVideo")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const processUserGuideData = (data, currentLocale) => {
  return (
    data?.map((item) => ({
      ...item,
      nameLocale:
        currentLocale === Constants.LANGUAGE_VI ? item.name : item.nameEn,
      webFileUrlLocale:
        currentLocale === Constants.LANGUAGE_VI
          ? item.webFileUrl
          : item.webFileEnUrl,
      webVideoUrlLocale:
        currentLocale === Constants.LANGUAGE_VI
          ? item.webVideoUrl
          : item.webVideoEnUrl,
      mobileFileUrlLocale:
        currentLocale === Constants.LANGUAGE_VI
          ? item.mobileFileUrl
          : item.mobileFileEnUrl,
      mobileVideoUrlLocale:
        currentLocale === Constants.LANGUAGE_VI
          ? item.mobileVideoUrl
          : item.mobileVideoEnUrl,
    })) || []
  );
};

const removeAccentsAndLowerCase = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
