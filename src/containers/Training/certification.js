import React, { useState, useEffect } from "react";
import {
    useApi,
    useFetcher
} from "../../modules";


const usePreload = () => {
    const api = useApi();
    const [cers = {}, error] = useFetcher({
        api: api.fetchCertification,
        autoRun: true,
        params: ['internal', true]
    });
    return cers;
};

function Certification(props) {
    usePreload();

    useEffect(() => {
        document.title = `Certification`;
    });

    return (
        <>
            <h1 className="h3 mb-2 text-gray-800">Certification</h1>
            <p className="mb-4">DataTables is a third party plugin that is used to generate the demo table below. For more information about DataTables, please visit the <a target="_blank" href="https://datatables.net">official DataTables documentation</a>.</p>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">List certifications</h6>
                </div>
                <div className="card-body">

                </div>
            </div>
        </>
    );
}
export default Certification;