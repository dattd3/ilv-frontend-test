import React, { useState, useEffect } from "react";
import { useApi, useFetcher, useGuardStore } from "../../modules";
import Course from "../../components/Forms/CustomForm/Course"

const useGetRoadmap = () => {
  const guard = useGuardStore();
  const api = useApi();
  const [roadmapList = undefined] = useFetcher({
    api: api.fetchRoadmapList,
    autoRun: true
  }); 
  return roadmapList;
};

    

function Roadmap(props) {
    
    useEffect(() => {
        document.title = `Lộ trình học tập`;
    });
    const roadmap = useGetRoadmap();
    let elmCourses;
    if (roadmap &&  roadmap.data && roadmap.data.curriculums) {
       elmCourses = roadmap.data.curriculums.map((item, index) =>
        <Course name = {item.name} status = {item.status} key={index} id={item.id} target_date = {item.target_date} />
      );
    }
    
    return (
      <div>
       {elmCourses}
      </div>
    );
}
export default Roadmap;
