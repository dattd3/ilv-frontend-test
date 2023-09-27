import React, { useState, useEffect, useRef } from "react"
import HOCComponent from "components/Common/HOCComponent"
import { getValueParamByQueryString } from "commons/Utils"
import axios from "axios";

function VingroupCulturalGalleryPage(props) {
  const iframeRef = useRef(null);
  const [random1, setRandom1] = useState(0)
  const [random2, setRandom2] = useState(1000)
  const [testUrl, setTestUrl] = useState("https://vingroupjsc.sharepoint.com/sites/hrdx/Shared%20Documents/General/testimg.png");
  const [intervalId, setIntervalId] = useState(null);
  const [isNotLoggedSharepoint, setIsNotLoggedSharepoint] = useState(false)
  useEffect(() => {
    const _interval = setInterval(() => {
      console.log("go check")
      setTestUrl(testUrl + `?${new Date().getTime()}`)
    }, 5000)
    setIntervalId(_interval)
    console.log(_interval)
    return () => clearInterval(_interval);
  }, []);

  const reloadIframe = () => {
    setRandom1(random1 + 1)
    setRandom2(random2 + 1)
  }

  // console.log(iframeRef.current?.contentWindow)
  return (
    <div className="vingroup-cultural-page">
      {/* <h1 className="content-page-header">{name}</h1> */}
        {/* <iframe srcdoc="https://vingroupjsc.sharepoint.com/sites/hrdx/_layouts/15/embed.aspx?UniqueId=0959bd93-5ca6-4c08-983e-0a6f79a16aec" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen title="testvideo.mp4"></iframe> */}
        <iframe 
          src="https://vingroupjsc.sharepoint.com/sites/hrdx/_layouts/15/embed.aspx?UniqueId=0959bd93-5ca6-4c08-983e-0a6f79a16aec" 
          width="640" 
          height="360" 
          frameborder="0" 
          scrolling="no" 
          allowfullscreen 
          title="testvideo.mp4" 
          ref={iframeRef} key={random1} />
        <iframe 
          src="https://vingroupjsc.sharepoint.com/sites/hrdx/_layouts/15/embed.aspx?UniqueId=1f2d508a-a281-4220-858d-b3d55eb4a882" 
          width="640" 
          height="360" 
          frameborder="0" 
          scrolling="no" 
          allowfullscreen 
          title="testimg.png" 
          key={random2} /> 
          <img  src={testUrl} onError={() => setIsNotLoggedSharepoint(true)} onLoad={() => {clearInterval(intervalId); isNotLoggedSharepoint && reloadIframe()}} alt="" /> 
    </div>
  )
}


export default HOCComponent(VingroupCulturalGalleryPage)
