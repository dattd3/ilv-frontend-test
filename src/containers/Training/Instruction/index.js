import React from "react";
import OnGoingClass from './OnGoingClass';
import SuccessClass from './SuccessClass';

function Instruction() {


    return (
        <>
            <h1 className="h3 mb-2 text-gray-800">Instruction</h1>
            <p className="mb-4">dat'z how we play</p>
            <OnGoingClass />
            <SuccessClass />
        </>
    );
}
export default Instruction;