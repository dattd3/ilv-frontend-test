import React, { useState, useEffect } from "react"
import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HOCComponent from "components/Common/HOCComponent"
import { handleFullScreen } from "actions/index"
import LoadingModal from "components/Common/LoadingModal"

function HistoryVinGroup(props) {
    const [isLoading, SetIsLoading] = useState(true)
    const [htmlPdfView, setHtmlPdfView] = useState(null)

    useEffect(() => {
        // props.handleFullScreen(true)
        const body = document.querySelector('#history-vingroup-page')
        body.scrollIntoView({
            behavior: 'smooth'
        }, 800)

        fetchData()
    }, [])

    const fetchData = async() => {
        try {
            const viewData = await axios.get(`https://online.flippingbook.com/view/211567232/1/`);
            setHtmlPdfView(viewData.data?.replace("</head>", "<style>.logo-container{display:none!important;}</style></head>"))
        } catch (error) {}
        SetIsLoading(false)
    }

    return (
        <>
            <LoadingModal show={isLoading} />
            <div className="history-vingroup-page" id="history-vingroup-page">
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
