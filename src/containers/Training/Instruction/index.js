import React, {useEffect, useState} from "react";
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';
import { useTranslation } from "react-i18next";
import { Form } from 'react-bootstrap';
import _ from "lodash";
import HOCComponent from '../../../components/Common/HOCComponent'

function Instruction() {
    const { t } = useTranslation();
    const [year, setYear] = useState(0);
    const [yearArr, SetYearArr] = useState([])
    function onChangeYear(event) {
        setYear(event.target.value);
    }

    useEffect(() => {
        const currentYear = (new Date()).getFullYear();
        const range = 5;
        SetYearArr(_.range(currentYear, currentYear - range, -1))
    }, [])
    
    return (
        <>
            <div className="training-instruction-page">
                <div className="top-header">
                    <h1 className="content-page-header d-inline-block">{t("TeachingHistory")}</h1>
                    <Form.Control as="select" onChange={onChangeYear} className='w-auto float-md-right filter-by-year'>
                        <option value={0}>{t("All")}</option>
                        {
                            yearArr.map((item, index) => {
                                return <option value={item} key = {index}>{item}</option>        
                            })
                        }
                    </Form.Control>
                </div>
                <OnGoingClass _year={year} />
                <SuccessClass _year = {year}/>
            </div>
        </>
    );
}

export default HOCComponent(Instruction);
