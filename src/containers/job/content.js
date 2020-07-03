import React from "react";
import { useTranslation } from "react-i18next";

export default function JobDescriptionContent(props) {
  const { t } = useTranslation();

  var { titleSAP, description, generalDescription } = props.data;


  const descView = description
    ? description.split("\n").map((item, key) => {
        return (
          <span key={key}>
            {item}
            <br />
            <br />
          </span>
        );
      })
    : "";

  const generalDescView = generalDescription
    ? generalDescription.split("\n").map((item, key) => {
        return (
          <span key={key}>
            {item}
            <br />
            <br />
          </span>
        );
      })
    : "";

  return (
    <div className="p-2 bg-white">
      <div id="benefit-title"> {titleSAP} </div>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead className="benefit-title-row">
          <tr>
            {/* <th> {t("BenefitNumber")} </th> */}
            <th> {t("SpecificOperatingWork")} </th>
            <th> {t("GeneralManagement")} </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* <td> 1 </td> */}
            <td>
              <div>{descView}</div>
            </td>
            <td>
              <div>{generalDescView}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
