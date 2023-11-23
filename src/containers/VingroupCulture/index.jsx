import HOCComponent from 'components/Common/HOCComponent';
import Constants from 'commons/Constants';

import IconPdf from 'assets/img/icon/pdf-icon.svg';
import IconImage from 'assets/img/icon/image-icon.svg';
import IconCamera from 'assets/img/icon/camera-icon.svg';
import IconBluePlay from 'assets/img/icon/Icon-blue-play.svg';
import IconDocument from 'assets/img/icon/document-blue-icon.svg';
import { useTranslation } from 'react-i18next';

function VingroupCulture(props) {
  const { t } = useTranslation();
  const cultureMenu = JSON.parse(localStorage.getItem('cultureMenu') || '[]'),
    isVietnamese = localStorage.getItem('locale') === Constants.LANGUAGE_VI,
    { pathname } = props.location,
    categoryCode = new URLSearchParams(props.location.search).get(
      'categoryCode'
    ),
    cultureParent = cultureMenu.find(
      (ele) => ele.categoryCode === categoryCode
    ),
    { lstCategory } = cultureParent;

  const renderCultureItem = (data, parentLevel = 0) => {
    return (data || []).map((ele, i) => {
      const { id, nameVn, nameEn, lstCategory, lstDocument, categoryCode } =
          ele,
        isShowBtnGroup = lstCategory.length === 0,
        availableTypes = isShowBtnGroup
          ? lstDocument.reduce((res, val) => {
              const fileTypeVal = res[val.categoryCode] || [];
              if (!fileTypeVal.includes(val.fileType)) {
                res[val.categoryCode] = fileTypeVal.concat([val.fileType]);
              }
              return res;
            }, {})
          : {},
        name = isVietnamese ? nameVn : nameEn,
        [title, ...desc] = name.split('\n');

      return (
        <div
          className={`${parentLevel === 0 ? 'content-parent-item' : ''}`}
          key={id || i}
        >
          <div
            className="content-item"
            style={{ marginLeft: parentLevel * 15 }}
          >
            <div className="title-container">
              <img src={IconDocument} alt="" />
              <div className="title-content">
                <p>{title}</p>
                {!!desc.join(' ') && (
                  <p className="sub-content">{desc.join(' ')}</p>
                )}
              </div>
            </div>
            {isShowBtnGroup && (
              <div className="btn-group">
                {(availableTypes[categoryCode] || []).includes('Image') && (
                  <a
                    href={`${pathname}/gallery/${categoryCode}?type=Image`}
                    className="btn-link"
                    key="Image"
                  >
                    <button className="btn-item">
                      <img src={IconCamera} alt="Image" />
                      {t('Photo')}
                    </button>
                  </a>
                )}
                {(availableTypes[categoryCode] || []).includes('Pdf') && (
                  <a
                    href={
                      categoryCode === '1.1'
                        ? `/vin30-chronicles`
                        : `${pathname}/gallery/${categoryCode}?type=Pdf`
                    }
                    className="btn-link"
                    key="Pdf"
                  >
                    <button className="btn-item">
                      <img src={IconPdf} alt="Pdf" />
                      PDF
                    </button>
                  </a>
                )}
                {(availableTypes[categoryCode] || []).includes('Poster') && (
                  <a
                    href={`${pathname}/gallery/${categoryCode}?type=Poster`}
                    className="btn-link"
                    key="Poster"
                  >
                    <button className="btn-item">
                      <img src={IconImage} alt="Poster" />
                      Poster
                    </button>
                  </a>
                )}
                {(availableTypes[categoryCode] || []).includes('Video') && (
                  <a
                    href={`${pathname}/gallery/${categoryCode}?type=Video`}
                    className="btn-link"
                    key="Video"
                  >
                    <button className="btn-item">
                      <img src={IconBluePlay} alt="Video" />
                      Video
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>
          {renderCultureItem(lstCategory, parentLevel + 1)}
        </div>
      );
    });
  };

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">
        {isVietnamese ? cultureParent?.nameVn : cultureParent?.nameEn}
      </h1>
      <div className="content-page-body">
        {renderCultureItem(lstCategory, 0)}
      </div>
    </div>
  );
}

export default HOCComponent(VingroupCulture);
