import React from "react";
import { Button, Card } from 'react-bootstrap';
import LearningKPI from './learningKPI';
import TeachingKPI from './teachingKPI';
import { useTranslation } from "react-i18next";

function Instruction() {
    const { t } = useTranslation();

    return (
        <> 
            <LearningKPI />
            <TeachingKPI />
        </>
    );
}
export default Instruction;