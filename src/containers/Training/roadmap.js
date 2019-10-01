import React, { useState, useEffect } from "react";
import {
    useApi,
    useFetcher
  } from "../../modules";
import DefaultPaginationTable from "../../components/Forms/DefaultPaginationTable"

const usePreload = () => {
    const api = useApi();
    const [cers = {}, error] = useFetcher({
        api: api.fetchCertification,
        autoRun: true,
        params: ['internal', true]
    });
    return cers;
};

function Roadmap(props) {
    
    useEffect(() => {
        document.title = `Lộ trình học tập`;
    });

    return (
      <div>
        <DefaultPaginationTable tableName="ĐÀO TẠO KỸ NĂNG CHUYÊN MÔN NGHIỆP VỤ" id = "BasicSkillTable"/>

        <DefaultPaginationTable tableName="QUẢN LÝ THÔNG TIN DOANH NGHIỆP" id = "ManageSkillTable" />
      </div>
    );
}
export default Roadmap;