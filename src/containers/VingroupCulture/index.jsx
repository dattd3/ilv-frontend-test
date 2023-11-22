import { useState, useEffect } from 'react';
import IconDocument from 'assets/img/icon/document-blue-icon.svg';
import HOCComponent from 'components/Common/HOCComponent';
import axios from 'axios';
import { getRequestConfigs } from 'commons/commonFunctions';
import { getCurrentLanguage } from 'commons/Utils';
import Constants from 'commons/Constants';

function VingroupCulture(props) {
  console.log('----------------------------------------');
  console.log('props: ', props);
  console.log('----------------------------------------');
  const [availableTypes, setAvailableTypes] = useState({});
  // const cultureMenu = JSON.parse(localStorage.getItem('cultureMenu') || '[]'),
  //   isVietnamese = localStorage.getItem('locale') === Constants.LANGUAGE_VI;
    // categoryCode = new URLSearchParams(props.location.search).get(
    //   'categoryCode'
    // ),
    // cultureParent = cultureMenu.find(
    //   (ele) => ele.categoryCode === categoryCode
    // ),
    // { lstCategory } = cultureParent;

  useEffect(() => {
    // console.log('----------------------------------------');
    // console.log('lstCategory: ', lstCategory);
    // console.log('----------------------------------------');
    // const url = `${
    //   process.env.REACT_APP_REQUEST_URL
    // }api/vanhoavin/list?language=${getCurrentLanguage()}&categoryCode=${lstCategory.map(
    //   (ele) => ele.categoryCode.join(',')
    // )}`;

    // axios.get(url, getRequestConfigs()).then((res) => {
    //   const data = res.data?.data;
    //   console.log('----------------------------------------');
    //   console.log('data: ', data);
    //   console.log('----------------------------------------');
    //   if (data.length > 0) {
    //   }
    // });
  }, []);

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">
        {/* {isVietnamese ? cultureParent?.nameVn : cultureParent?.nameEn} */}
        "AAAAAAAAAAAAAAA"
      </h1>
      {/* <div className="content-page-body">
        {(lstCategory || []).map((ele, i) => (
          <div className="content-item" key={i}>
            <div className="title-container">
              <img src={IconDocument} alt="" />
              &nbsp;&nbsp;
              <div className="title-content">
                <p>{t("CulturalImmersionTraining")}</p>
                <p className="sub-content">{t("CulturalImmersionTrainingSub")}</p>
              </div>
            </div>
            <div className="btn-group">
              {
                <ButtonAction
                  parentLink="vingroup-culture"
                  availableTypes={availableTypes}
                  cateCode={CATEGORY_CODES.PRESIDENT_QUOTES}
                />

                // if (availableTypes[cateCode] && availableTypes[cateCode].includes("Image")) {
                //   results.push(
                //     <a
                //       href={`/${parentLink}/gallery/${cateCode}?type=Image`}
                //       className="btn-link"
                //       key="Image"
                //     >
                //       <button className="btn-item">
                //         <img src={IconCamera} alt="" />
                //         &nbsp; {t("Photo")}
                //       </button>
                //     </a>
                //   );
                // }
                // if (availableTypes[cateCode] && availableTypes[cateCode].includes("Pdf")) {
                //   results.push(
                //     <a
                //       href={cateCode === "1.1" ? `/vin30-chronicles` : `/${parentLink}/gallery/${cateCode}?type=Pdf`}
                //       className="btn-link"
                //       key="Pdf"
                //     >
                //       <button className="btn-item">
                //         <img src={IconPdf} alt="" />
                //         &nbsp; PDF
                //       </button>
                //     </a>
                //   );
                // }
                // if (availableTypes[cateCode] && availableTypes[cateCode].includes("Poster")) {
                //   results.push(
                //     <a
                //       href={`/${parentLink}/gallery/${cateCode}?type=Poster`}
                //       className="btn-link"
                //       key="Poster"
                //     >
                //       <button className="btn-item">
                //         <img src={IconImage} alt="" />
                //         &nbsp; Poster
                //       </button>
                //     </a>
                //   );
                // }
                // if (availableTypes[cateCode] && availableTypes[cateCode].includes("Video")) {
                //   results.push(
                //     <a
                //       href={`/${parentLink}/gallery/${cateCode}?type=Video`}
                //       className="btn-link"
                //       key="Video"
                //     >
                //       <button className="btn-item">
                //         <img src={IconBluePlay} alt="" />
                //         &nbsp; Video
                //       </button>
                //     </a>
                //   );
                // }
              }
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default HOCComponent(VingroupCulture);
