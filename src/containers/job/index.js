import React from "react";
import { useApi, useFetcher } from "../../modules";
import JobDescriptionContent from "./content";

const usePreload = (params) => {
  const api = useApi();
  const [data = []] = useFetcher({
    api: api.fetchJobDescriptionByJobType,
    autoRun: true,
    params: params,
  });
  return data;
};

function JobDescriptionPage() {
  var jobType = localStorage.getItem("jobTitle");
  var result = usePreload([jobType]);

  console.log(`result ${JSON.stringify(result)}`);

  if (result && result.data) {
    return <JobDescriptionContent data={result.data} />;
  } else {
    return null;
  }
}

export default JobDescriptionPage;
