import React, {useEffect, useRef, useState} from "react";
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';
import RejectClass from './RejectClass';
import { useTranslation } from "react-i18next";
import { Form } from 'react-bootstrap';
import _ from "lodash";

function Learning(props) {
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
            <div>
                <h1 className="h3 mb-3 text-uppercase text-gray-800 d-inline-block">{t("LearningHistory")}</h1>
                <Form.Control as="select" onChange={onChangeYear} className='w-auto float-md-right'>
                    <option value={0}>{t("All")}</option>
                    {
                        yearArr.map((item, index) => {
                            return <option value={item} key = {index}>{item}</option>        
                        })
                    }
                    
                </Form.Control>
            </div>
            
            
            <OnGoingClass _year={year}/>
            <SuccessClass _year={year} />
            <RejectClass _year = {year}/>
        </>
    );
}
export default Learning;