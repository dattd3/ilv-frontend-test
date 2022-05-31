import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { withTranslation } from "react-i18next"
import LeaveOfAbsence from '../Registration/LeaveOfAbsence/LeaveOfAbsenceComponent'
import BusinessTrip from '../Registration//BusinessTrip/BusinessTripComponent'
import SubstitutionComponent from '../Registration//Substitution/SubstitutionComponent'
import InOutTimeUpdate from '../Registration//InOutTimeUpdate/InOutTimeUpdateComponent'
import { isEnableShiftChangeFunctionByPnLVCode, isEnableInOutTimeUpdateFunctionByPnLVCode } from "../../commons/Utils"
import EmptyComponent from './EmptyComponent'
import Resource from './WelfareComponents/Resource'

class InternalWelfareComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tab: new URLSearchParams(props.history.location.search).get('tab') || "Resource",
        }
    }

    updateTabLink = key => {
        this.props.history.push('?tab=' + key);
        this.setState({ tab: key })
    }

    render() {
        const { t } = this.props;

        return (
            <div className="registration-section personal-info justify-content-between internal-welfare">
                <Tabs defaultActiveKey={this.state.tab} onSelect={(key) => this.updateTabLink(key)}>
                    <Tab eventKey="Resource" title={t('WelfareResource')}>
                        <Resource title={t('WelfareResource')}/>
                    </Tab>
                    <Tab eventKey="Safari" title={t('Vinwonder/Safari')}>
                        <EmptyComponent title={t('Vinwonder/Safari')}/>
                    </Tab>
                    <Tab eventKey="Golf" title={t('Golf')}>
                    <EmptyComponent title={t('Golf')}/>
                    </Tab>
                    <Tab eventKey="Vinmec" title={t('Vinmec')}>
                    <EmptyComponent title={t('Vinmec')}/>
                    </Tab>
                    <Tab eventKey="Vinschool" title={t('Vinschool/Vinuni')}>
                    <EmptyComponent title={t('Vinschool/Vinuni')}/>
                    </Tab>
                </Tabs>
            </div>
        )
    }
}
export default withTranslation()(InternalWelfareComponent)