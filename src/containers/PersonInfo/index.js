import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import './PersonInfo.css';
import { useApi, useFetcher } from "../../modules";

const usePreload = (params) => {
  const api = useApi();
  const [user = undefined, err] = useFetcher({
    api: api.fetchPersonCommonInfo,
    autoRun: true,
    params: params
  });
  return user;
};

function PersonInfo() {

  const { t } = useTranslation();

  let objDataRes = usePreload([]);
  if (objDataRes && objDataRes.data) {

    let personCommonInfo = objDataRes.data.PersonCommonInfo;
    let curriculumVitae = objDataRes.data.CurriculumVitae;

    return (
      <div className="bgColor">
        <br />

        <div className='headerText'> {t("PersonalInformation")} </div>

        <table>
          <thead>
            <tr>
              <th className="table-header"> {t("FirstAndLastName")} </th>
              <th className="table-header"> {t("EmployeeCode")} </th>
              <th className="table-header"> {t("PAndL")} </th>
              <th className="table-header"> {t("Title")} </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-content">
                <div className="bgText"> {personCommonInfo.FullName} </div>
              </td>
              <td >
                <div className='bgText'> {personCommonInfo.PersonNo} </div>
              </td>
              <td>
                <div className="bgText"> {personCommonInfo.PAndL} </div>
              </td>
              <td>
                <div className="bgText div-end"> {personCommonInfo.Position} </div>
              </td>
            </tr>
          </tbody>

        </table>
        <br />

        <div className='headerText'> {t("CurrentAddress")} </div>
        <table>
          <thead>
            <tr>
              <th className="table-header"> {t("Nation")} </th>
              <th className="table-header"> {t("Province_City")} </th>
              <th className="table-header"> {t("District")} </th>
              <th className="table-header"> {t("Address")} </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-content">
                <div className="bgText"> {curriculumVitae.HT_QuocGia} </div>
              </td>
              <td >
                <div className='bgText'> {curriculumVitae.HT_ThanhPho} </div>
              </td>
              <td >
                <div className='bgText'> {curriculumVitae.HT_QuanHuyen} </div>
              </td>
              <td>
                <div className="bgText div-end"> {curriculumVitae.HT_DiaChi} </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <div className='headerText'> {t("CardId_Title")} </div>
        <table>
          <thead>
            <tr>
              <th className="table-header"> {t("CardId")} </th>
              <th className="table-header"> {t("DateIssue")} </th>
              <th className="table-header"> {t("PlaceIssue")} </th>
              <th className="table-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-content">
                <div className="bgText"> {curriculumVitae.SoCMND} </div>
              </td>
              <td >
                <div className='bgText'> {curriculumVitae.NgayCapCMND} </div>
              </td>
              <td>
                <div className="bgText div-end"> {curriculumVitae.NoiCapCMND} </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <div className='headerText'> {t("AccountInformation")} </div>
        <table>
          <thead>
            <tr>
              <th className="table-header"> {t("TaxCode")} </th>
              <th className="table-header"> {t("SocialInsuranceNumber")} </th>
              <th className="table-header"> {t("VinID")} </th>
              <th className="table-header"> {t("BankAccountNumber")} </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-content">
                <div className="bgText"> {curriculumVitae.MaSoThue} </div>
              </td>
              <td >
                <div className='bgText'> {curriculumVitae.SoBHXH} </div>
              </td>
              <td >
                <div className='bgText'> {curriculumVitae.SoTheVinID} </div>
              </td>
              <td >
                <div className='bgText div-end'> {curriculumVitae.SoTaiKhoan} </div>
              </td>
            </tr>
          </tbody>

          <thead>
            <tr>
              <th className="table-header"> {t("BankName")} </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table-content" colspan="2">
                <div className="bgText"> {curriculumVitae.Bank} </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <div className='headerText'> {t("LegalInformation")} </div>

        {
          curriculumVitae.ListFamily.map(function (obj, i) {
            return (
              <table className="no-border">
                <thead>
                  <tr>
                    <th className="table-header"> {t("FullName")} </th>
                    <th className="table-header"> {t("DateOfBirth")} </th>
                    <th className="table-header"> {t("Relationship")} </th>
                    <th className="table-header"> {t("FamilyAllowances")} </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="table-content">
                      <div className="bgText"> {obj.HoVaTen} </div>
                    </td>
                    <td >
                      <div className='bgText'> {obj.NgaySinh} </div>
                    </td>
                    <td >
                      <div className='bgText'> {obj.MoiQuanHe} </div>
                    </td>
                    <td>
                      <div className="bgText div-end"> {obj.NgayHieuLucGiamTru} </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })
        }

        <br />

      </div>
    );
  } else {
    return null;
  }

}
export default PersonInfo;
