import { useState, useEffect } from 'react';
import Constants from 'commons/Constants';
import { useTranslation } from 'react-i18next';
import HOCComponent from 'components/Common/HOCComponent';

import IconPdf from 'assets/img/icon/pdf-icon.svg';
import IconImage from 'assets/img/icon/image-icon.svg';
import IconCamera from 'assets/img/icon/camera-icon.svg';
import IconBluePlay from 'assets/img/icon/Icon-blue-play.svg';
import IconExpand from 'assets/img/icon/icon-arrow-expand.svg';
import IconCollapse from 'assets/img/icon/icon-arrow-collapse.svg';

const CultureItem = (props) => {
  const { item, className, parentLevel } = props;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const isVietnamese = localStorage.getItem('locale') === Constants.LANGUAGE_VI,
    { pathname } = window.location;

  const { nameVn, nameEn, lstCategory, lstDocument, categoryCode } = item,
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
      className={`content-parent-item${
        parentLevel === 0 ? ' content-parent-zero' : ''
      }${!isShowBtnGroup ? ' content-parent-child' : ''} ${className}`}
    >
      <div
        className={`content-item ${
          !isShowBtnGroup ? 'content-item-pointer' : ''
        }`}
        style={{ paddingLeft: parentLevel * 20 + 8 }}
        onClick={() => {
          if (!isShowBtnGroup) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className={`title-container`}>
          {!isShowBtnGroup && (
            <img
              src={isOpen ? IconExpand : IconCollapse}
              alt="icon-collapse-expand"
            />
          )}
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
      <CultureList
        className={`content-parent-${isOpen ? 'expand' : 'collapse'}`}
        data={lstCategory}
        parentLevel={parentLevel + 1}
      />
    </div>
  );
};

const CultureList = (props) => {
  const { data, parentLevel = 0, className = '' } = props;

  return (data || []).map((item, index) => (
    <CultureItem
      item={item}
      className={className}
      parentLevel={parentLevel}
      key={item?.id || index}
    />
  ));
};

function VingroupCulture(props) {
  const cultureMenu = JSON.parse(localStorage.getItem('cultureMenu') || '[]'),
    isVietnamese = localStorage.getItem('locale') === Constants.LANGUAGE_VI,
    categoryCode = new URLSearchParams(props.location.search).get(
      'categoryCode'
    ),
    cultureParent = cultureMenu.find(
      (ele) => ele.categoryCode === categoryCode
    ),
    { lstCategory } = cultureParent,
    title = isVietnamese ? cultureParent?.nameVn : cultureParent?.nameEn;

  useEffect(() => {
    TrackingLogVinCulture();
  }, []);

  const TrackingLogVinCulture = () => {
    try {
      fetch(`${process.env.REACT_APP_REQUEST_URL}user/log/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ code: categoryCode, name: title }),
        keepalive: true,
      });
    } catch (err) {}
  };

  return (
    <div className="vingroup-cultural-page">
      <h1 className="content-page-header">{title}</h1>
      <div className="content-page-body">
        <CultureList data={lstCategory} parentLevel={0} />
      </div>
    </div>
  );
}

export default HOCComponent(VingroupCulture);
