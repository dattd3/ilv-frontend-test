import React from "react";
import { useApi, useFetcher } from "../../modules";
import JobDescriptionContent from "./content";

const usePreload = params => {
  const api = useApi();
  const [data = []] = useFetcher({
    api: api.fetchJobDescription,
    autoRun: true,
    params: params
  });
  return data;
};

function JobDescriptionPage() {
  var jobCode = "95007240"; //Todo remove this
  var result = usePreload([jobCode]);

  console.log(`result ${JSON.stringify(result)}`);

  if (result && result.data) {
    return <JobDescriptionContent data={result.data} />;
  } else {
    return null;
  }
}

export default JobDescriptionPage;
