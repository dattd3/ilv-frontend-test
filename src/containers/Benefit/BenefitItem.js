import React from "react";
import { useTranslation } from "react-i18next";

export default function BenefitItem(props) {
  const { t } = useTranslation();

  var data = props.data;
  if (data && data.title && data.benefits) {
    return (
      <div className="p-2 bg-white">
        <div id="benefit-title"> {data.title} </div>
        <table className="table table-striped">
          <thead className="benefit-title-row">
            <tr>
              <th> {t("BenefitNumber")} </th>
              <th> {t("BenefitService")} </th>
              <th> {t("BenefitRegime")} </th>
            </tr>
          </thead>
          <tbody>
            {data.benefits.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.subtitle }}
                  ></div>
                </td>
                <td>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.content
                        ? item.content.replace("\n", "<br />")
                        : ""
                    }}
                  ></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return null;
  }
}
