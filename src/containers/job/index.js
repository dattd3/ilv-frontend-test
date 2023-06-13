import React, { useState, useEffect } from 'react';
import { useApi } from '../../modules';
import JobDescriptionContent from './JobDescriptionContent';
import { useTranslation, withTranslation } from 'react-i18next';
import HOCComponent from '../../components/Common/HOCComponent';

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

function JobDescriptionPage() {
  const [data, setData] = useState({});
  const api = useApi(),
    { t } = useTranslation();

  useEffect(() => {
    fetchJobRequirement();
  }, []);

  const fetchJobRequirement = async () => {
    var jobId = localStorage.getItem('jobId');
    // var jobType = "95007240";

    const res = await api.fetchJobRequirement({ jobId }),
      {
        data: { data },
      } = res;

    setData(data || {});
  };

  return !!Object.keys(data).length ? (
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
  ) : (
    <div className="jd-page pt-4" id="id-jd-page">
      <h5 className="font-weight-bold text-uppercase">
        {t('JobRequirements')}
      </h5>
      <div className="jd-container mt-4 mb-4">{t('NodataExport')}</div>
    </div>
  );
}

export default HOCComponent(withTranslation()(JobDescriptionPage));
