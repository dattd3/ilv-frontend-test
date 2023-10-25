import React, { useState, useEffect } from "react"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import HOCComponent from "components/Common/HOCComponent"
import { handleFullScreen } from "actions/index"
import LoadingModal from "components/Common/LoadingModal"
import MyBook from "./MyBook"

function Vin30Chronicles(props) {
    // const [isLoading, SetIsLoading] = useState(true)
    const linkHistoryVinGroup = "https://online.flippingbook.com/view/211567232/"

    useEffect(() => {
        // props.handleFullScreen(true)

        // const timeOut = setTimeout(() => { SetIsLoading(false) }, 1000)
        // const body = document.querySelector('#history-vingroup-page')
        // body.scrollIntoView({
        //     behavior: 'smooth'
        // }, 800)

        // return () => {
        //     clearTimeout(timeOut)
        // }
    }, [])

    return (
        <>
            {/* <LoadingModal show={isLoading} /> */}
            <MyBook />
            {/* <div className="history-vingroup-page" id="history-vingroup-page">
                <iframe src={linkHistoryVinGroup} allowFullScreen={true} title="Sử ký Vin30"></iframe>
            </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(HOCComponent(Vin30Chronicles))
