import React from "react";
import { withTranslation } from "react-i18next";
import ConfirmPasswordModal from "./ConfirmPasswordModal/ConfirmPasswordModal";
import LoadingModal from "../../components/Common/LoadingModal";
import HOCComponent from "../../components/Common/HOCComponent";
import PaySlipsComponent from "./PaySlipComponent";
import { Tab, Tabs } from "react-bootstrap";
import TaxReviewComponent from "./TaxReviewComponent";

const tabConfig = {
  PaySlip: "PaySlip",
  TaxReview: "TaxReview",
};
class PaySlipsTaxComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowConfirmPasswordModal: true,
      acessToken:
        new URLSearchParams(props?.history?.location?.search).get(
          "accesstoken"
        ) || null,
      tab: tabConfig.PaySlip,
    };
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(
      this.props?.history?.location?.search
    );
    if (queryParams.has("accesstoken")) {
      queryParams.delete("accesstoken");
      this.props.history.replace({
        search: queryParams.toString(),
      });
    }
  }

  updateToken(acessToken) {
    this.setState({ acessToken: acessToken });
  }

  updateTabLink = key => {
    this.setState({ tab: key })
  }

  render() {
    const { t } = this.props;
    const { acessToken, tab, isLoading } =this.state;

    return (
      <>
        <LoadingModal show={isLoading} />
        <ConfirmPasswordModal
          show={acessToken == null}
          onUpdateToken={this.updateToken.bind(this)}
        />
        <div className="payslips-section">
          <Tabs
            defaultActiveKey={tab}
            onSelect={(key) => this.updateTabLink(key)}
          >
            <Tab
              eventKey={tabConfig.PaySlip}
              title={t("PaySlip")}
            >
              <PaySlipsComponent acessToken={acessToken} setacessToken={this.updateToken.bind(this)} t={t} />
            </Tab>

            <Tab
              eventKey={tabConfig.TaxReview}
              title={t("quyet_toan_thue")}
            >
              <TaxReviewComponent acessToken={acessToken} setacessToken={this.updateToken.bind(this)} t={t} />
            </Tab>
          </Tabs>
        </div>
      </>
    );
  }
}

export default HOCComponent(withTranslation()(PaySlipsTaxComponent));
