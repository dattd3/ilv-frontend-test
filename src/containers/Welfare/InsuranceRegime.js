import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import CreateInsuranceSocial from './CreateInsuranceSocial'
import EmptyComponent from './EmptyComponent'
import Health from './WelfareComponents/Health'
import InsuranceSocial from './WelfareComponents/InsuranceSocial'
import Resource from './WelfareComponents/Resource'
import HOCComponent from '../../components/Common/HOCComponent'
import SocialContributeInfo from './WelfareComponents/SocialContributeInfo'
import SocialSupportInfo from './WelfareComponents/SocialSupportInfo'
import { checkIsExactPnL } from 'commons/commonFunctions'
import Constants from 'commons/Constants'

class InsuranceRegime extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tab: new URLSearchParams(props?.history?.location?.search).get('tab') || "Social",
        }
    }

    updateTabLink = key => {
        this.props.history.push('?tab=' + key);
        this.setState({ tab: key })
    }

    render() {
        const { t } = this.props;
        if(this.state.tab == 'CreateInsuranceSocial') {
          return <CreateInsuranceSocial/>
        }

        return (
            <div className="registration-section personal-info justify-content-between internal-welfare">
                <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
                    {/* <Tab eventKey="Health" title={t('heath_insurance')}>
                        <Health title={t('welfare_regime_internal')}/>
                    </Tab> */}
                    {
                        checkIsExactPnL(Constants.pnlVCode.VinSchool, Constants.pnlVCode.VinFast, Constants.pnlVCode.VinFastTrading, Constants.pnlVCode.VinES) && (
                        <Tab eventKey="Social" title={t('social_insurance')}>
                            <InsuranceSocial title={t('Vinwonder/Safari')}/>
                        </Tab>)
                    }
                    {
                        checkIsExactPnL(Constants.pnlVCode.VinSchool) && (
                        <Tab eventKey="SocialContribute" title={t('social_contribute_info')}>
                            <SocialContributeInfo title={t('Vinwonder/Safari')}/>
                        </Tab>)
                    }
                    {
                        checkIsExactPnL(Constants.pnlVCode.VinSchool) && (
                            <Tab eventKey="SocialSupport" title={t('social_support_info')}>
                                <SocialSupportInfo title={t('Vinwonder/Safari')}/>
                            </Tab>
                        )
                    }
                    
                </Tabs>
            </div>
        )
    }
}

export default HOCComponent(withTranslation()(InsuranceRegime))
