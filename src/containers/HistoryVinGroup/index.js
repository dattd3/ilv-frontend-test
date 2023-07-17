import React, { useState, useEffect } from "react"
// import $ from 'jquery'
import axios from 'axios'
import { useTranslation } from "react-i18next"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useGuardStore } from "modules/index"
import HOCComponent from "components/Common/HOCComponent"
import { handleFullScreen } from "actions/index"
import LoadingModal from "components/Common/LoadingModal"

function HistoryVinGroup(props) {
    const { t } = useTranslation()
    const guard = useGuardStore()
    const user = guard.getCurentUser()
    const [isLoading, SetIsLoading] = useState(true)
    const [htmlPdfView, setHtmlPdfView] = useState(null)

    useEffect(() => {
        setTimeout(() => { SetIsLoading(false) }, 800)

        // const fetchIframeDate = () => {
        //     window.fetch(
        //         "https://online.flippingbook.com/view/211567232/1/", {
        //         method: 'GET',
        //         accept: 'text/html',
        //         // mode: 'no-cors'
        //         })
        //         .then(async data => {
        //             const data1 = await data.text();
                    
        //             console.log(data1)

        //             var iframe = document.getElementById('myIframe');

        //             iframe.contentWindow.document.open();
        //             iframe.contentWindow.document.write(data1);
        //             iframe.contentWindow.document.getElementsByClassName("logo-svg")[0]?.remove()
        //             iframe.contentWindow.document.getElementsByClassName("logo-svg")[1]?.remove()
        //             iframe.contentWindow.document.close();
        //         });
        // }

        // fetchIframeDate()

        // props.handleFullScreen(true)
        const body = document.querySelector('#history-vingroup-page')
        body.scrollIntoView({
            behavior: 'smooth'
        }, 800)
        fetchData()

        // let curWin = window.top.document.getElementsByClassName('top-one')[0]

        // var curWin = window.parent.document.getElementsByClassName('top-one')[0];
        // curWin?.parentNode.removeChild(curWin);

        // var x = window.document.getElementById("myIframe");
        // var y=(x.contentWindow || x.contentDocument);
        // $(y.document).find(".home-page")[0]?.remove();

        // console.log(curWin)

        // $(curWin).remove()

        // $(window).load(function(){
        //     $(window.parent).load(function(){
        //       $('#ifrm', window.parent.document).hide();
        //     });
        // });

        // $('#myIframe').on('load', function() {
        //     // console.log("Iframe loaded")
        //     // setInterval(() => {
        //     //     let a = $("#publication").parent().parent().parent().parent().find("#publication")
        //     //     console.log(a?.length)
        //     // }, 1000)

        //     $(".home-page").remove()

        //     // $(this).find(".home-page").remove()
        // });

   
        // document.querySelectorAll('iframe').forEach(item => {
        //     // var y = item.contentDocument.body.getElementsByTagName("iframe");
        //     // setTimeout(() => {
        //     //     $(y[0]).contents().find(".logo-svg").remove()
        //     // }, [500])
        // })

        // window.addEventListener("message", (event) => {
        //     console.log(event?.data)
        //     // var iframe = document.getElementById("myIframe")
        //     // var innerDoc = iframe?.contentDocument || iframe?.contentWindow?.document
        //     // innerDoc.getElementsByClassName("home-page")[0]?.remove()
        // });
    }, [])

    const handelIframe = () => {
        // const iframe = document.getElementById("myIframe")
        // let innerDoc = iframe.contentDocument || iframe.contentWindow.document
        // innerDoc.getElementsByClassName("scroll-custom")[0]?.remove()
        // innerDoc.getElementsByClassName("home-page")[0].remove()
        // innerDoc.getElementById("main-content").remove()
    }
    const fetchData = async() => {
      try {
        const viewData = await axios.get(`https://online.flippingbook.com/view/211567232/1/`);
        setHtmlPdfView(viewData.data?.replace("</head>", "<style>.logo-container{display:none!important;}</style></head>"))
      } catch (error) {}
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="history-vingroup-page" id="history-vingroup-page">
                {/* <div className="hide-logo"></div> */}
                {/* <iframe id="myIframe" src="https://online.flippingbook.com/view/211567232/1/" allowFullScreen={true} className="myIframe" onLoad={iFrameLoaded}></iframe> */}
                <iframe id="myIframe" srcDoc={htmlPdfView} allowFullScreen={true} className="myIframe"></iframe>
            </div>
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFullScreen: state?.globalStatuses?.isFullScreen,
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        handleFullScreen: bindActionCreators(handleFullScreen, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HOCComponent(HistoryVinGroup))
