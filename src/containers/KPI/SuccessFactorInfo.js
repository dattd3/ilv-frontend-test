import React from "react";
import LinkIcon from '../../assets/img/link-success-factor.svg';
import { useTranslation } from "react-i18next"

function SuccessFactorInfo(props) {
  const successFactorLinkDetail = "https://performancemanager10.successfactors.com/sf/home?bplte_company=vingroupjsP2&_s.crb=J2LEhIVBHNB4E6kPde5U9e5PWb0pKfYtEGwtPJoLaM0%253d#Shell-home";
  const successFactorDomain = "https://performancemanager10.successfactors.com/"
  const {t} = useTranslation();
  return (
    <div className="success-factor-guide-line">
      <div>* {t("ForMakingEvaluation")}</div>
      <div>  
        <img className="success-factor-link-icon" src={LinkIcon} alt="Link success factor"/>
          &nbsp;
        <u><a className="success-factor-link" href={successFactorLinkDetail} target="_blank">{successFactorDomain}</a></u>
      </div>
    </div>
  );
}

export default SuccessFactorInfo;
