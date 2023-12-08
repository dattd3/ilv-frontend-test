import moment from "moment";
import React, { useState } from "react";
import IconArrowDown from 'assets/img/icon-arrow-full.svg';
import IconArrowUp from 'assets/img/icon-arrow-up-full.svg';

function UserInfoEvaluation({
  item,
  t,
  templateUrl
}: {
  item: ICandidateApplication;
  t: any;
  templateUrl?: string
}) {
  const [layoutHeight, setLayoutHeight] = useState<any>(0);
  const cadidateInfo = item.candidate || {};
  const degreeInfos = item.degrees || [];
  const experienceInfos = item.experiences || [];
  const genderOptions = [
    { value: "1", label: "Nam" },
    { value: "2", label: "Nữ" },
  ];
  const maritalStatusOptions = [
    { value: "0", label: "Độc thân" },
    { value: "1", label: "Đã kết hôn" },
    { value: "2", label: "Ly hôn" },
  ];
  const sourceOptions = [
    { value: "0", label: "Online" },
    { value: "1", label: "Networking" },
    { value: "2", label: "Headhunter" },
    { value: "3", label: "Đăng tuyển" },
    { value: "4", label: "Cung ứng nhân lực" },
    { value: "5", label: "Hợp tác nhà trường" },
    { value: "6", label: "Giới thiệu" },
    { value: "7", label: "Điều chuyển" },
    { value: "8", label: "Tự tìm" },
  ];

  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex flex-row">
          <div
            className="action-button-collapse"
            onClick={(e) => {
              e.preventDefault();
              setLayoutHeight(0);
            }}
          >
            <img src={IconArrowUp}/>
            {t("Collapse")}
          </div>
          <div
            className="action-button-expand"
            onClick={(e) => {
              e.preventDefault();
              setLayoutHeight(null);
            }}
          >
            <img src={IconArrowDown}/>
            {t("Expand")}
          </div>
        </div>
        <a className="btn btn-outline-danger pe-auto" style={{cursor: templateUrl ? 'pointer' : 'not-allowed'}} href={templateUrl}>
          {t("tai_tep_tin")}
        </a>
      </div>
      <div
        className="d-flex flex-column mt-3"
        style={{
          height: layoutHeight,
          overflow: "hidden",
        }}
      >
        <h5 className="content-page-title my-0">{t("thong_tin_co_ban")}</h5>
        <div className="box-content info-body box shadow">
          <div className="content border-dash">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("FullName")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">{cadidateInfo.fullName}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("Gender")}</p>
                </div>
                <div className="col-md-4 ">
                  <p className="text-info1">
                    {cadidateInfo.gender
                      ? genderOptions.find(
                          (ms) => ms.value === cadidateInfo.gender
                        )
                        ? genderOptions.find(
                            (ms) => ms.value === cadidateInfo.gender
                          )?.label
                        : ""
                      : ""}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("Address")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">{cadidateInfo.address}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("number_phone")}</p>
                </div>
                <div className="col-md-8 ">
                  <p
                    className="text-info1 text-highlight"
                    style={{ color: "#C11D2A" }}
                  >
                    {cadidateInfo.mobile}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("source")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">
                    {cadidateInfo.source
                      ? sourceOptions.find(
                          (ms) => ms.value === cadidateInfo.source
                        )
                        ? sourceOptions.find(
                            (ms) => ms.value === cadidateInfo.source
                          )?.label
                        : ""
                      : ""}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("other_infomation")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">{cadidateInfo.description}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("birthday")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">
                    {cadidateInfo.dateOfBirth
                      ? moment(cadidateInfo.dateOfBirth).format("DD/MM/YYYY")
                      : ""}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("MaritalStatus")}</p>
                </div>
                <div className="col-md-4 ">
                  <p className="text-info1">
                    {cadidateInfo.maritalStatus
                      ? maritalStatusOptions.find(
                          (ms) => ms.value === cadidateInfo.maritalStatus
                        )
                        ? maritalStatusOptions.find(
                            (ms) => ms.value === cadidateInfo.maritalStatus
                          )?.label
                        : ""
                      : ""}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{"Email"}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1 text-hightligh">
                    {cadidateInfo.email}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("indenfy_number_3")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">{cadidateInfo.idNumber}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <p className="text-subject">{t("source_detail")}</p>
                </div>
                <div className="col-md-8">
                  <p className="text-info1">{cadidateInfo.sourceDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h5 className="content-page-title my-0">{t("Certification")}</h5>
        <div className="box-content  box shadow">
          {renderEducations(t, degreeInfos)}
        </div>

        <h5 className="content-page-title my-0">
          {t("kinh_nghiem_lam_viec")}
        </h5>
        <div className="box-content box shadow">
          {renderExperiences(t, experienceInfos)}
        </div>
      </div>
    </>
  );
}

export default UserInfoEvaluation;

const renderExperiences = (t: any, experienceInfos: ExperienceInfo[]) => {
  if (
    experienceInfos === undefined ||
    experienceInfos === null ||
    experienceInfos.length === 0
  ) {
    return null;
  }

  return experienceInfos.map((exp, index) => {
    return (
      <div key={index} className={`info-body ${index > 0 ? "add-border" : ""}`}>
        <div className="content experiences-block">
          <div className="experiences-wrap">
            <div className="row">
              <div className="col-md-2 label-column">
                <p className="text-subject">{t("vi_tri")}</p>
              </div>
              <div className="col-md-10">
                <p className="text-info1 per-line">{exp.position}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 label-column">
                <p className="text-subject">{t("proposal_company")}</p>
              </div>
              <div className="col-md-10">
                <p className="text-info1 per-line">{exp.companyName}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 label-column">
                <p className="text-subject">{t("Address")}</p>
              </div>
              <div className="col-md-10">
                <p className="text-info1 per-line">{exp.placeOfWorkName}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 label-column">
                <p className="text-subject">{t("thoi_gian_hoc")}</p>
              </div>
              <div className="col-md-10">
                <p className="text-info1 per-line">
                  {(exp.fromMonth
                    ? moment(exp.fromMonth).format("MM/YYYY")
                    : "") +
                    " - " +
                    (exp.toMonth ? moment(exp.toMonth).format("MM/YYYY") : "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

const renderEducations = (t: any, degreeInfos: DegreeInfo[]) => {
  if (
    degreeInfos === undefined ||
    degreeInfos === null ||
    degreeInfos.length === 0
  ) {
    return null;
  }
  return degreeInfos.map((degree, i) => {
    return (
      <div key={i} className={`info-body ${i > 0 ? "add-border" : ""}`}>
        <div className="content educations-block">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <p className="text-subject">{t("Degree")}</p>
              </div>
              <div className="col-md-9">
                <p className="text-info1 per-line">{degree.degreeName}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <p className="text-subject">{t("school")}</p>
              </div>
              <div className="col-md-9">
                <p className="text-info1 per-line">
                  {degree.schoolName && degree.schoolName.trim() !== ""
                    ? degree.schoolName
                    : degree.otherSchool}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <p className="text-subject">{t("EducationMajor")}</p>
              </div>
              <div className="col-md-9">
                <p className="text-info1 per-line">
                  {degree.majors && degree.majors.trim() != ""
                    ? degree.majors
                    : degree.otherMajor}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                <p className="text-subject">{t("thoi_gian_hoc")}</p>
              </div>
              <div className="col-md-9">
                <p className="text-info1 per-line">
                  {(degree.fromDate
                    ? moment(degree.fromDate).format("MM/YYYY")
                    : "") +
                    " - " +
                    (degree.toDate
                      ? moment(degree.toDate).format("MM/YYYY")
                      : "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

interface ICandidateApplication {
  id: number;
  candidate: CandidateInfo;
  experiences: ExperienceInfo[];
  degrees: DegreeInfo[];
  cvInfo: CvInfo;
  duplicateInfo: null;
}

interface CandidateInfo {
  id: number;
  fullName: string;
  idNumber?: string;
  position?: string;
  maritalStatus?: string;
  gender?: string;
  mobile?: string;
  email?: string;
  dateOfBirth?: Date;
  address?: string;
  source?: string;
  sourceDescription?: string;
  mostRecentCompanyAddress?: string;
  profilePicture?: string;
  status: number;
  primaryCvDiplayUrl?: string;
  primaryCvFileUrl: string;
  description?: string;
  note?: string;
  userId?: string;
  dateModified: Date;
  updatedBy: string;
  companyCode?: string;
  skillList: any[];
  numberExperience: number;
}

interface CvInfo {
  primaryCvDiplayUrl?: string;
  primaryCvFileUrl?: string;
  openLink: boolean;
  attachedDocuments: any[];
}

interface DegreeInfo {
  createdBy: null;
  updatedBy: null;
  id: number;
  employeeCode: null;
  degreeName: string;
  degreeCode: null;
  schoolName: string;
  schoolCode: null;
  majorCode: null;
  otherSchool: null;
  otherMajor: null;
  gradedCode: null;
  mark: null;
  ethnicCode: null;
  majors: string;
  dateCreated: Date;
  dateModified: null;
  fromDate: null | string;
  toDate: null | string;
  order: number;
}

interface ExperienceInfo {
  createdBy: null;
  updatedBy: null;
  id: number;
  candidateId: number;
  position: string;
  companyName: string;
  description: null;
  dateCreated: Date;
  fromMonth: string;
  toMonth: string;
  isCurrent: boolean;
  order: number;
  dateModified: null;
  placeOfWorkId: number;
  placeOfWorkName: null;
  numberExperience: number;
}
