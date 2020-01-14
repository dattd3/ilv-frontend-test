import React from "react";
import './font-karma.css';
import { Router, Route } from "react-router";
import NewsDetail from "../NewsDetail";

export default function ItemNews(props) {

  const script = document.createElement("script");
  script.src = "https://kit.fontawesome.com/a076d05399.js";
   script.async = true;
   document.body.appendChild(script);
   
  return (
    <a href={`/groupinfo/newsdetail/${props.id}`}>
      <div className="w3-quarter border-shadow content-margin no-padding content-width">
         <img src= {props.thumbnail} className="image-top-radius">
         </img>
         <div className="content-padding">
             <h4 className="row-2lines" >
               {/* <div contentEditable='false' dangerouslySetInnerHTML={{ __html: props.title }}></div> */}
               { props.title }
             </h4>
             <p className="row-2lines">
                {props.description}
             </p>
             <span className="datetime-info w3-left">
                <i className="far fa-user"></i> &nbsp;
                 {props.sourceSite}
             </span>
             <span className="datetime-info w3-right">
                 <i className="far">&#xf017;</i> &nbsp;
                  {props.publishedDate}
             </span>
         </div>
        </div>
     </a>
  );
}
