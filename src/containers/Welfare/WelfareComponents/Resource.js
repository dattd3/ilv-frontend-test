import React from 'react'
import { withTranslation } from 'react-i18next';
import { parsteStringToHtml } from "../../../commons/Utils";

function Resource(props) {
    const { t } = props;

    return (
        <div className='resource'>
            <div className='title-group'>
                {t("RegimeInfoBy")} {props?.plName}
            </div>
            <div className="card border shadow regime-contain">
                <div className='box table-content'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '4%' }}>{t("BenefitNumber")}</th>
                                <th style={{ width: '40%' }}>{t("BenefitService")}</th>
                                <th style={{ width: '56%' }}>{t("BenefitRegime")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props?.regimeInfo?.length > 0 &&
                                props?.regimeInfo.map((item, index) => {
                                    return <tr key={index}>
                                        <td style={{ width: '4%' }}>{index + 1}</td>
                                        <td className="text-left" style={{ width: '40%' }}>{item?.internalBenefitServiceName}</td>
                                        <td className="text-left" style={{ width: '56%' }}>
                                            <span dangerouslySetInnerHTML={{ __html: parsteStringToHtml(item?.desciption) }} />
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(Resource);