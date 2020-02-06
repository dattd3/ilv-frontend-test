import React from "react";

export default function StringLineBreak(props) {    
    return (
      <div>
      {          
            props.data.split('\n').map((item, i) => {
                return <p key={i}> {item} </p>
            })              
      }      
      </div>
  );
}