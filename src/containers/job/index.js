import React, { useState, useEffect } from 'react';
import purify from 'dompurify';
import { useApi } from '../../modules';
import JobDescriptionContent from './JobDescriptionContent';
import { useTranslation, withTranslation } from 'react-i18next';
import HOCComponent from '../../components/Common/HOCComponent';
import { exportToPDF, isVinFast, parsteStringToHtml } from 'commons/Utils';
import ICDownloadRed from '../../assets/img/icon/ic_download_red.svg';

function JDOther(props) {
  return (
    <>
      <div className="title">{props.title}:</div>
      <div className="content">{props.content}</div>
    </>
  );
}

function displayOther(data, t) {
  return (
    <>
      {data.leadership && (
        <JDOther title={t('LeadershipSkill')} content={data.leadership} />
      )}
      {data.specialize && (
        <JDOther title={t('SpecializedSkill')} content={data.specialize} />
      )}
      {data.academic && (
        <JDOther title={t('DegreeRequirement')} content={data.academic} />
      )}
      {data.experience && (
        <JDOther title={t('Experience')} content={data.experience} />
      )}
      {data.skill && <JDOther title={t('Skill')} content={data.skill} />}
      {data.language && (
        <JDOther
          title={t('MinimumAppearanceRequirement')}
          content={data.language}
        />
      )}
      {data.coloring && (
        <JDOther
          title={t('MinimumForeignLanguageRequirement')}
          content={data.coloring}
        />
      )}
    </>
  );
}

function JobDescVinFast(props) {
  const { data, t } = props;
  const jdGeneral = [
      {
        Position: localStorage.getItem('jobTitle'),
        DirectUnit: localStorage.getItem('company'),
      },
      {
        Grade: localStorage.getItem('employeeLevel'),
        Division: localStorage.getItem('division'),
      },
      {
        EmployeeNumber: localStorage.getItem('employeeNo'),
        ReportFor: data?.reportTo,
      },
      {
        JobId: localStorage.getItem('jobId'),
      },
    ],
    jdReport = [
      [data?.academicTitle, data?.academic],
      [data?.experienceTitle, data?.experience],
      [data?.workAttitudeTitle, data?.workAttitude],
      [data?.softSkillTitle, data?.softSkill],
      [data?.knowleageTitle, data?.knowleage],
    ],
    jobDescription = [
      [data?.locationOverviewTitle, data?.locationOverview],
      [data?.hrResourceTitle, data?.hrResource],
      [data?.financialManagementTitle, data?.financialManagement],
      [data?.systemManagementTitle, data?.systemManagement],
      [data?.professionWorkTitle, data?.professionWork],
      [data?.ortherWorkingTitle, data?.ortherWorking],
    ];

  const downloadPDF = () => {
    const elementView = document.getElementById('id-jd-page');
    exportToPDF(elementView, 'jobDescription');
  };

  return (
    <>
      <div className="jd-wrap-btn">
        <button className="btn-download-pdf" onClick={downloadPDF}>
          <img src={ICDownloadRed} className="mr-2" />
          {t('Dowload')}
        </button>
      </div>
      <div className="jd-page pt-4" id="id-jd-page">
        <h5 className="font-weight-bold text-uppercase">I. {t('GeneralInfo')}</h5>
        <div className="jd-container mt-4 mb-4">
          {jdGeneral.map((ele, i) => {
            const keys = Object.keys(ele);
            return (
              <div className="jd-general-item mt-2" key={i}>
                {!!keys?.[0] && (
                  <div className="jd-general-left jd-general-right">
                    <div className="jd-general-label">{t(keys?.[0])}</div>
                    <div className="jd-general-value">: {ele[keys?.[0]]}</div>
                  </div>
                )}
                {!!keys?.[1] && (
                  <div className="jd-general-right">
                    <div className="jd-general-label">{t(keys?.[1])}</div>
                    <span
                      className="jd-general-value"
                      dangerouslySetInnerHTML={{
                        __html: purify.sanitize(
                          `: ${parsteStringToHtml(ele[keys?.[1]])}` || ''
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <h5 className="font-weight-bold text-uppercase">II. {t('Requirement')}</h5>
        <div className="jd-container mt-2 mb-4">
          <table className="jd-report">
            <tbody>
              {jdReport.map((ele, i) => (
                <tr className="jd-report-item" key={i}>
                  <td
                    className="jd-report-label"
                    dangerouslySetInnerHTML={{
                      __html: purify.sanitize(
                        parsteStringToHtml(ele?.[0]) || ''
                      ),
                    }}
                  />
                  <td
                    className="jd-report-value"
                    dangerouslySetInnerHTML={{
                      __html: purify.sanitize(
                        parsteStringToHtml(ele?.[1]) || ''
                      ),
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5 className="font-weight-bold text-uppercase">III. {t('JobDescription')}</h5>
        <div className="jd-container mt-2 mb-4">
          <table className="jd-desc">
            <tbody>
              {jobDescription.map((ele, i) => (
                <tr className="jd-desc-item" key={i}>
                  <td
                    className="jd-desc-label"
                    dangerouslySetInnerHTML={{
                      __html: purify.sanitize(
                        parsteStringToHtml(ele?.[0]) || ''
                      ),
                    }}
                  />
                  <td
                    className="jd-desc-value"
                    dangerouslySetInnerHTML={{
                      __html: purify.sanitize(
                        parsteStringToHtml(ele?.[1]) || ''
                      ),
                    }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="jd-container mb-5 pl-5 pr-5">
          <div className="jd-approver">
            <div className="jd-approver-item">
              <div className="jd-approver-content">
                <div className="jd-approver-label">{t('Drafter')}</div>
                <div className="jd-approver-value">{data?.author}</div>
              </div>
            </div>
            <div className="jd-approver-item text-center">
              <div className="jd-approver-content">
                <div className="jd-approver-label">{t('Appraiser')}</div>
                <div className="jd-approver-value">{data?.appraiser}</div>
              </div>
            </div>
            <div className="jd-approver-item text-right">
              <div className="jd-approver-content">
                <div className="jd-approver-label">{t('Approver')}</div>
                <div className="jd-approver-value">{data?.approver}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function JobDescriptionPage() {
  const [data, setData] = useState({});
  const api = useApi(),
    isVinFastCompany = isVinFast(),
    { t } = useTranslation();

  useEffect(() => {
    fetchDataJobDescription();
  }, []);

  const fetchDataJobDescription = async () => {
    var jobId = localStorage.getItem('jobId'),
      employeeLevel = localStorage.getItem('employeeNo');
    // var jobType = "95007240";

    const res = await api.fetchJobDescription(
        { jobId, employeeLevel },
        isVinFastCompany
      ),
      {
        data: { data },
      } = res;

    setData(data || {});
  };

  return !!Object.keys(data).length ? (
    isVinFastCompany ? (
      <JobDescVinFast data={data} t={t} />
    ) : (
      <div className="jd-section">
        <div id="benefit-title"> {data.titleSAP} </div>
        <JobDescriptionContent
          bg="primary"
          headerTitle={t('GeneralDescription')}
          content={data.generalDescription}
        />
        <JobDescriptionContent
          bg="success"
          headerTitle={t('SpecificDescription')}
          content={data.description}
        />
        <JobDescriptionContent
          bg="warning"
          headerTitle={t('RequiredExperienceAndSkills')}
          content={displayOther(data, t)}
        />
      </div>
    )
  ) : (
    <div className="jd-page pt-4" id="id-jd-page">
      <h5 className="font-weight-bold text-uppercase">{t('JobDescription')}</h5>
      <div className="jd-container mt-4 mb-4">{t('NodataExport')}</div>
    </div>
  );
}

export default HOCComponent(withTranslation()(JobDescriptionPage));
