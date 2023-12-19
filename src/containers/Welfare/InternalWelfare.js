import React from 'react'
import { withTranslation } from "react-i18next"
import Resource from './WelfareComponents/Resource'
import ICRankLevel from "../../assets/img/icon/ic_rank_level.svg";
import ICDownload from "../../assets/img/icon/ic_download.svg";
import axios from 'axios';
import { getRequestConfigurations } from "../../commons/Utils";
import LoadingModal from '../../components/Common/LoadingModal';
import HOCComponent from '../../components/Common/HOCComponent'

class InternalWelfareComponent extends React.Component {
    constructor(props) {
        super();
        this.state = {
            tab: new URLSearchParams(props?.history?.location?.search).get('tab') || "Resource",
            dataWelfare: [],
            isLoading: false,
            hiddenButton: true,
        }
    }

    componentDidMount() {
        this.fetchData();
        this.handleDownloadWelfare(false);
    }

    fetchData = () => {
        const config = getRequestConfigurations()
        const companyCode = localStorage.getItem("companyCode")
        const employeeLevel = localStorage.getItem("benefitTitle")
        this.setState({
            isLoading: true,
        });
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/InternalBenefit/getbylevel?CompanyCode=${companyCode}&RankId=${employeeLevel}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    const arrTmp = Object.keys(res.data.data).map(key => ({ plName: key, regimeInfo: res.data.data[key] }));
                    this.setState({
                        dataWelfare: arrTmp || [],
                        isLoading: false,
                    });
                }
            }).catch(error => {
            });
    }

    handleDownloadWelfare = (isSaveFile) => {
        const config = getRequestConfigurations()
        const companyCode = localStorage.getItem("companyCode")
        axios.get(`${process.env.REACT_APP_HRDX_URL}api/InternalBenefit/downloadGuideFile?CompanyCode=${companyCode}`, config)
            .then(res => {
                if (res && res.data && res.data.data) {
                    this.setState({
                        hiddenButton: res.data.data ? false : true,
                    });
                    if (isSaveFile) {
                        window.open(res.data.data, "_blank")
                    }
                }
            }).catch(error => {
            });
    }

    render() {
        const { t } = this.props;
        const employeeLevel = localStorage.getItem("benefitTitle")
        const { dataWelfare, isLoading, hiddenButton } = this.state;

        return (
            <>
                <LoadingModal show={isLoading} />
                <div className="registration-section personal-info justify-content-between internal-welfare">
                    <div className="row pt-2 button-block">
                        <div className="col-md-6 text-left">
                            <div className="clearfix w-100 pb-2">
                                <div className="btn bg-white btn-create color-red" style={{ cursor: 'default', border: '1px solid' }}>
                                    <img src={ICRankLevel} className="mr-2" />
                                    {t("WelfareLevel")}: <strong>{employeeLevel}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 text-right">
                            <div className="clearfix w-100 pb-2">
                                <button className="btn btn-primary shadow-customize btn-download"
                                    onClick={() => this.handleDownloadWelfare(true)} disabled={hiddenButton}
                                >
                                    <img src={ICDownload} className="mr-2" />
                                    {t("Dowload")}
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        dataWelfare.map((child, index) => {
                            return (
                                <div key={index}>
                                    <Resource {...child} />
                                </div>
                            )
                        })
                    }
                    {dataWelfare.length !== 0 &&
                        <div className="notice">
                            {/* <div className='font-weight-bold'>* {t("WelfareNoteTitle")}</div>
                            <div>- {t("WelfareNoteContent1")}</div>
                            <div>- {t("WelfareNoteContent2")}</div>
                            <div>- {t("WelfareNoteContent3")}</div> */}
                        </div>
                    }
                </div>
            </>
        )
    }
}

export default HOCComponent(withTranslation()(InternalWelfareComponent))
