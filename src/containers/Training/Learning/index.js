import React, { useState } from "react";
import { useApi, useFetcher } from "../../../modules";
import { Table, Pagination, Row, Col, Form } from 'react-bootstrap';
import CustomPaging from '../../../components/Common/CustomPaging';
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';
import RejectClass from './RejectClass';

function Learning(props) {


    return (
        <>
            <h1 className="h3 mb-2 text-gray-800">Learning</h1>
            <p className="mb-4">dat'z how we do</p>
            <OnGoingClass />
            <SuccessClass />
            <RejectClass />
        </>
    );
}
export default Learning;