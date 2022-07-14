import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import CreateInsuranceSocial from './CreateInsuranceSocial'
import EmptyComponent from './EmptyComponent'
import Health from './WelfareComponents/Health'
import InsuranceSocial from './WelfareComponents/InsuranceSocial'
import Resource from './WelfareComponents/Resource'

class InsuranceRegime extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tab: new URLSearchParams(props.history.location.search).get('tab') || "Health",
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
                    <Tab eventKey="Health" title={'Bảo hiểm sức khỏe'}>
                        <Health title={t('WelfareResource')}/>
                    </Tab>
                    <Tab eventKey="Social" title={'Bảo hiểm xã hội'}>
                        <InsuranceSocial title={t('Vinwonder/Safari')}/>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}
export default withTranslation()(InsuranceRegime)