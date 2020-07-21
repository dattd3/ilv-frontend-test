import React from "react";
import { useApi, useFetcher } from "../../modules";
import JobDescriptionContent from "./JobDescriptionContent"

const usePreload = (params) => {
  const api = useApi();
  const [data = []] = useFetcher({
    api: api.fetchJobDescription,
    autoRun: true,
    params: params,
  });
  return data;
}

function JDOther(props) {
  return <>
    <div className="title">{props.title}:</div>
    <div className="content">
      {props.content}
    </div>
  </>
}

function displayOther(data) {
  return (<>
    {data.leadership ? <JDOther title="Năng lực lãnh đạo" content={data.leadership}/> : null}
    {data.specialize ? <JDOther title="Năng lực chuyên môn" content={data.specialize}/> : null}
    {data.academic ? <JDOther title="Trình độ học vấn" content={data.academic}/> : null}
    {data.experience ? <JDOther title="Kinh nghiệm làm việc" content={data.experience}/> : null}
    {data.skill ? <JDOther title="Kỹ năng" content={data.skill}/> : null}
    {data.language ? <JDOther title="Tiêu chuẩn ngoại ngữ tối thiểu" content={data.language}/> : null}
    {data.coloring ? <JDOther title="Tiêu chuẩn ngoại hình tối thiểu" content={data.coloring}/> : null}
  </>)
}

function JobDescriptionPage() {
  var jobType = localStorage.getItem("jobId")
  // var jobType = "95007240"
  var result = usePreload([jobType])

  return (
    result.data ? <div className="jd-section">
      <div id="benefit-title"> {result.data.titleSAP} </div>
      <JobDescriptionContent bg="primary" headerTitle="MÔ TẢ CÔNG VIỆC QUẢN TRỊ CHUNG" content={result.data.generalDescription} />
      <JobDescriptionContent bg="success" headerTitle="MÔ TẢ CÔNG VIỆC CHUYÊN MÔN ĐẶC THÙ" content={result.data.description} />
      <JobDescriptionContent bg="warning" headerTitle="KINH NGHIỆM, NĂNG LỰC, KỸ NĂNG CẦN THIẾT" content={displayOther(result.data)} />
    </div> : null
    )
}

export default JobDescriptionPage;
