import React, { useEffect } from "react";
import { useApi, useFetcher } from "../../modules";
import CourseListTable from "../../components/Forms/CustomForm/CourseListTable"
import Roadmap from "./roadmap.js"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoadingSpinner from "../../components/Forms/CustomForm/LoadingSpinner"



const usePreload = (Id) => {
  // const guard = useGuardStore();
  const api = useApi();
  const [roadmapDetails = {}] = useFetcher({
    api: api.fetchRoadmapDetails,
    autoRun: true,
    params: [Id,'trangdt28@vingroup.net']
  }); 
  if (roadmapDetails) {
  return roadmapDetails;
  }
};

const RoadmapDetailsElement = ({ match, location }) => {
  const {
    params: { Id }
  } = match;
  const data = usePreload(Id);
  let courseData;
  if (data && data.data && data.data.paths) {
    courseData = data.data.paths[0];
  }
  

  let courseDataElement;
   if (courseData && courseData.learning_modules) 
   {
      courseDataElement = courseData.learning_modules.map((item, index) =>
         <CourseListTable data ={item} tableName = {item.name} key={index} id={item.id} />
        
        )
    }
  if (!courseData) {
    return (
         <LoadingSpinner />
      )
  }
  return (
    <>{courseDataElement}</>
  );
};

function RoadmapDetails(props) {
    
    useEffect(() => {
        document.title = `Lộ trình học tập`;
    });


    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/training/roadmapdetails" component={Roadmap} />
            <Route path="/training/roadmapdetails/:Id" component = {RoadmapDetailsElement} />
          </Switch>
        </Router>
      </div>
    );
}
export default RoadmapDetails;