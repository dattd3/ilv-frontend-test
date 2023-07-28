import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import iconPhone from '../../assets/img/ic_phone.svg';
import iconGlobal from '../../assets/img/ic_global.svg';
import iconDownloadBlue from '../../assets/img/icon/ic_download_blue.svg';
import iconDownloadRed from '../../assets/img/icon/ic_download_red.svg';
import iconVersionHistory from '../../assets/img/icon/ic_version_history.svg';
import HOCComponent from '../../components/Common/HOCComponent';
import LoadingModal from 'components/Common/LoadingModal';
import Constants from 'commons/Constants';

class Instruct extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         mobileUri: [],
         webUri: [],
         histories: [],
         isLoading: false,
      };
   }

   componentDidMount() {
      this.fetchData();
   }

   async fetchData() {
      try {
         this.setState({ isLoading: true })
         let config = {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
         };
         const [guide, versions] = await Promise.all([
            axios.get(
            `${process.env.REACT_APP_REQUEST_URL}user/user-guide`,
            config
            ),
            axios.get(
            `${process.env.REACT_APP_REQUEST_URL}api/system/list/versions`,
            {
               params: {
                  appId: 1,
                  device: 'MOBILE',
                  type: 1,
                  pageIndex: 1,
                  pageSize: 5,
               },
               ...config,
            }
            ),
         ]);

         if (guide?.data?.data) {
         guide?.data?.data.map((ele) => {
            const stateTmp = {};
            stateTmp[ele.isMobile ? 'mobileUri' : 'webUri'] = ele['docs'];
            this.setState(stateTmp);
            });
         }

         if(versions?.data?.data) {
         this.setState({ histories: versions?.data?.data?.lstData || [] })
         }
      } catch (err) {}
      finally {
         this.setState({ isLoading: false })
      }
   }

   download(lang, p) {
      const data = this.state[p == "web" ? 'webUri' : 'mobileUri'];
      const uridata = data.filter(x => x.language == lang);
      if(uridata.length){
         window.open(uridata[0].fileUrl);
      }
   }
    
   render() {
      const { t, i18n } = this.props,
      { histories, isLoading } = this.state,
      isEnglish = i18n.language === Constants.LANGUAGE_EN;

    return (
      <>
        <LoadingModal show={isLoading} />
        <div className="text-dark user-manual-page">
          <h1 className="content-page-header">{t('instruct')}</h1>

          <div className="card">
            <div className="content-body p-3">
              <div className="item">
                <div className="item-content">
                  <div className="wrap-icon">
                    <img src={iconGlobal} />
                  </div>
                  <span> {t('instruct_website')}</span>
                </div>

                <div className="item-group-btn">
                  <div
                    className="btn"
                    onClick={(e) => this.download(2, 'web', e)}
                  >
                    <img src={iconDownloadBlue} />
                    <span>{t('instruct_en')}</span>
                  </div>
                  <div
                    className="btn btn-red"
                    onClick={(e) => this.download(1, 'web', e)}
                  >
                    <img src={iconDownloadRed} />
                    <span>{t('instruct_vi')}</span>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="item-content">
                  <div className="wrap-icon">
                    <img src={iconPhone} />
                  </div>
                  <span> {t('instruct_mobile')}</span>
                </div>

                <div className="item-group-btn">
                  <div
                    className="btn"
                    onClick={(e) => this.download(2, 'mobi', e)}
                  >
                    <img src={iconDownloadBlue} />
                    <span>{t('instruct_en')}</span>
                  </div>
                  <div
                    className="btn btn-red"
                    onClick={(e) => this.download(1, 'mobi', e)}
                  >
                    <img src={iconDownloadRed} />
                    <span>{t('instruct_vi')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="content-page-header">
            {t('instruct_version_history')}
          </h1>
          <div className="card  p-3 version_histories">
            {histories.length > 0 ? (
              histories.map((ele, i) => (
                <div className="content-body" key={i}>
                  <img className="icon" src={iconVersionHistory} />

                  <div className="content">
                    <div className="ttl">
                      {`${isEnglish ? 'Version' : 'Phiên bản'} ${
                        ele.versionCode || ''
                      }`}
                    </div>
                    <div className="desc">
                      {isEnglish
                        ? ele?.forceUpdateContentEn
                        : ele?.forceUpdateContentVi}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="content-body">
                <div>{t('NoDataInfo')}</div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default HOCComponent(withTranslation()(Instruct));
