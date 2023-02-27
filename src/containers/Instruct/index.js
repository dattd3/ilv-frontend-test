import React from "react";
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import iconPhone from '../../assets/img/phone.PNG';
import iconGlobal from '../../assets/img/global.PNG';
import _ from "lodash";
import HOCComponent from '../../components/Common/HOCComponent'

class Instruct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileUri: [],
            webUri: []
        };
    }

    componentDidMount() {
      const { t } = this.props;
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        }
        axios.get(`${process.env.REACT_APP_REQUEST_URL}user/user-guide`, config)
        .then(res => {
            if (res && res.data && res.data.data) {
               res.data.data.map(t => {
                  const e = {};
                  e[t.isMobile ? 'mobileUri': 'webUri'] = t['docs'];
                  this.setState(e);
               });
            }
        }).catch(error => {
        });
    }

    download(lang, p) {
      const data = this.state[p == "web" ? 'webUri' : 'mobileUri'];
      const uridata = data.filter(x => x.language == lang);
      if(uridata.length){
         window.open(uridata[0].fileUrl);
      }
    }
    
    render() {
        const { t } = this.props;
        return <>
            <div className="user-manual-page">
               <h1 className="content-page-header">{t('instruct')}</h1>
               <div className="card">
                  <div className="content-body p-3">
                     <div className="border p-2 item">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="d-flex align-items-center">
                              <div className="mr-3" >
                                 <img src={iconGlobal}/>
                              </div>
                              <div>
                                 <b> {t('instruct_website')}</b>
                              </div>
                           </div>

                           <div className="d-flex align-items-center">
                              <div>{t('instruct_download')}</div>
                              <div className="px-4">
                                 <div className="btn" style={{
                                    border:"1px solid #51b1fb",
                                    color: "#51b1fb"
                                 }}  onClick={(e) => this.download(2, "web", e)}>
                                    <i className="fa fa-download mr-2"></i>
                                    {t('instruct_en')}
                                 </div>
                              </div>
                              <div>
                                 <div className="btn border-danger text-danger"  onClick={(e) => this.download(1, "web", e)}>
                                    <i className="fa fa-download mr-2"></i>
                                    {t('instruct_vi')}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="border p-2 mt-3 item">
                        <div className="d-flex align-items-center justify-content-between">
                           <div className="d-flex  align-items-center">
                              <div className="mr-3" >
                                 <img src={iconPhone}/>
                              </div>
                              <div className="text-dark">
                                 <b>{t('instruct_mobile')}</b>
                              </div>
                           </div>

                           <div className="d-flex align-items-center">
                              <div>{t('instruct_download')}</div>
                              <div className="px-4">
                                 <div className="btn" style={{
                                    border:"1px solid #51b1fb",
                                    color: "#51b1fb"
                                 }}  onClick={(e) => this.download(2, "mobi", e)}>
                                    <i className="fa fa-download mr-2"></i>
                                    {t('instruct_en')}
                                 </div>
                              </div>
                              <div>
                                 <div className="btn border-danger text-danger"  onClick={(e) => this.download(1, "mobi", e)}>
                                    <i className="fa fa-download mr-2"></i>
                                    {t('instruct_vi')}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </>
    }
}

export default HOCComponent(withTranslation()(Instruct))
