import React,{ useState } from "react";
import LinkIcon from '../../assets/img/link-success-factor.svg';
import { useTranslation } from "react-i18next"

function SuccessFactorInfo(props) {   

  const SuccessFactorLink = "https://performancemanager10.successfactors.com/sf/home?bplte_company=vingroupjsP2&_s.crb=J2LEhIVBHNB4E6kPde5U9e5PWb0pKfYtEGwtPJoLaM0%253d#Shell-home";
  const {t} = useTranslation();
  return (
      <div>
          <div>* {t("ForMakingEvaluation")}</div>
          <div>              
              <img className="success-factor-link-icon" src={LinkIcon} alt="Link success factor"/>
                &nbsp;
              <u><a className="success-factor-link" href={SuccessFactorLink} target="_blank">https://performancemanager10.successfactors.com/</a></u>
          </div>
          <div className="mb-4">
          </div>
      </div>      
    );
}

export default SuccessFactorInfo;
