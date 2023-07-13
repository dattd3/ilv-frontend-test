import React, { useState, useEffect } from "react"
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

    useEffect(() => {
        setTimeout(() => { SetIsLoading(false) }, 800)
        // props.handleFullScreen(true)
        const body = document.querySelector('#history-vingroup-page')
        body.scrollIntoView({
            behavior: 'smooth'
        }, 800)

        // $(window).load(function(){
        //     $(window.parent).load(function(){
        //       $('#ifrm', window.parent.document).hide();
        //     });
        // });
    }, [])

    useEffect(() => {
        // $(function () {
        //     setInterval(() => {
        //         console.log(111)
        //         $("#ifrm .logo-link").hide()
        //     }, 1000)
        // });
 
        // $("iframe .logo-link").hide()

        // $(".logo-link").css("display", "none")

        // $(".logo-link").css("display", "none");

        // $(document).on('click','.hide-coppy-right',function(){
        //     $(".logo-link").css("display", "none")
        //     $("iframe .logo-link").hide()
        // });
    })

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="history-vingroup-page" id="history-vingroup-page">
                <iframe src="https://online.flippingbook.com/view/211567232/1/" allowFullScreen={true} id="ifrm"></iframe>
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
