import { useState } from "react";
import IconDocument from "assets/img/icon/document-blue-icon.svg";
import IconBluePlay from "assets/img/icon/Icon-blue-play.svg";
import IconImage from "assets/img/icon/image-icon.svg";
import IconPdf from "assets/img/icon/pdf-icon.svg";
import IconCamera from "assets/img/icon/camera-icon.svg";

import HOCComponent from "components/Common/HOCComponent"

function HistoryVinGroup(props) {
    return <div className="vingroup-cultural-page">
      <h1 className="content-page-header">Lịch sử VINGROUP</h1>
      <div className="content-page-body">
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />&nbsp;&nbsp;Sử ký Tập đoàn
          </div>
          <div className="btn-group">
            <a href="/vin30-chronicles" target="_blank" className="btn-link">
              <button className="btn-item">
                <img src={IconPdf} alt="" />&nbsp; PDF
              </button>
            </a>
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />&nbsp;&nbsp;Kỳ tích và giải thưởng
          </div>
          <div className="btn-group">
            <a href={`/vingroup-cultural-gallery`} target="_blank" className="btn-link" rel="noreferrer">
              <button className="btn-item">
                <img src={IconImage} alt="" />&nbsp; Poster
              </button>
            </a>
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />&nbsp;&nbsp;Ảnh sự kiện
          </div>
          <div className="btn-group">
            <button className="btn-item">
              <img src={IconCamera} alt="" />&nbsp; Ảnh
            </button>
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />&nbsp;&nbsp;Tác phẩm nghệ thuật
          </div>
          <div className="btn-group">
            <button className="btn-item">
              <img src={IconBluePlay} alt="" />&nbsp; Video
            </button>
          </div>
        </div>
        <div className="content-item">
          <div className="title-container">
            <img src={IconDocument} alt="" />&nbsp;&nbsp;Thông tin P&L
          </div>
          <div className="btn-group">
            <button className="btn-item">
              <img src={IconCamera} alt="" />&nbsp; Ảnh
            </button>
            <button className="btn-item">
              <img src={IconPdf} alt="" />&nbsp; PDF
            </button>
            <button className="btn-item">
              <img src={IconImage} alt="" />&nbsp; Poster
            </button>
            <button className="btn-item">
              <img src={IconBluePlay} alt="" />&nbsp; Video
            </button>
          </div>
        </div>
      </div>
    </div>
}

export default HOCComponent(HistoryVinGroup)
