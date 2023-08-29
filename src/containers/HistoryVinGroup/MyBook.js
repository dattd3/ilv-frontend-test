import React, { useState, useEffect, useRef, forwardRef } from "react"
import HTMLFlipBook from "react-pageflip"
import { saveAs } from 'file-saver'
import Page1 from 'assets/img/vingroup_history/Page1.png'
import Page2 from 'assets/img/vingroup_history/Page2.png'
import Page3 from 'assets/img/vingroup_history/Page3.png'
import Page4 from 'assets/img/vingroup_history/Page4.png'
import Page5 from 'assets/img/vingroup_history/Page5.png'
import Page6 from 'assets/img/vingroup_history/Page6.png'
import Page7 from 'assets/img/vingroup_history/Page7.png'
import Page8 from 'assets/img/vingroup_history/Page8.png'
import Page9 from 'assets/img/vingroup_history/Page9.png'
import Page10 from 'assets/img/vingroup_history/Page10.png'
import Page11 from 'assets/img/vingroup_history/Page11.png'
import Page12 from 'assets/img/vingroup_history/Page12.png'
import Page13 from 'assets/img/vingroup_history/Page13.png'
import Page14 from 'assets/img/vingroup_history/Page14.png'
import Page15 from 'assets/img/vingroup_history/Page15.png'
import Page16 from 'assets/img/vingroup_history/Page16.png'
import Page17 from 'assets/img/vingroup_history/Page17.png'
import Page18 from 'assets/img/vingroup_history/Page18.png'
import Page19 from 'assets/img/vingroup_history/Page19.png'
import Page20 from 'assets/img/vingroup_history/Page20.png'
import Page21 from 'assets/img/vingroup_history/Page21.png'
import Page22 from 'assets/img/vingroup_history/Page22.png'
import Page23 from 'assets/img/vingroup_history/Page23.png'
import Page24 from 'assets/img/vingroup_history/Page24.png'
import Page25 from 'assets/img/vingroup_history/Page25.png'
import Page26 from 'assets/img/vingroup_history/Page26.png'
import Page27 from 'assets/img/vingroup_history/Page27.png'
import Page28 from 'assets/img/vingroup_history/Page28.png'
import Page29 from 'assets/img/vingroup_history/Page29.png'
import Page30 from 'assets/img/vingroup_history/Page30.png'
import LoadingModal from "components/Common/LoadingModal"

const Page = forwardRef((props, ref) => {
    // return (
    //     <div className={`page page-${props?.number}`} ref={ref}>{props.children}</div>
    // )

    const imageMapping = {
        1: Page1,
        2: Page2,
        3: Page3,
        4: Page4,
        5: Page5,
        6: Page6,
        7: Page7,
        8: Page8,
        9: Page9,
        10: Page10,
        11: Page11,
        12: Page12,
        13: Page13,
        14: Page14,
        15: Page15,
        16: Page16,
        17: Page17,
        18: Page18,
        19: Page19,
        20: Page20,
        21: Page21,
        22: Page22,
        23: Page23,
        24: Page24,
        25: Page25,
        26: Page26,
        27: Page27,
        28: Page28,
        29: Page29,
        30: Page30,
    }

    return (
        <div className={`page page-${props?.page}`} ref={ref} data-density="soft">
            <div className="page-content">
                {/* <div className="page-image" style={{ backgroundImage: `url(${Page1})` }}></div> */}
                {/* <div className="page-image" style={{ backgroundImage: `url(${imageMapping[props?.page]})` }}></div> */}
                <div className="page-image"><img src={imageMapping[props?.page]} /></div>
            </div>
        </div>
    )
});

export default function MyBook(props) {
    const book = useRef()
    const page = useRef()
    const [isShowThumbnails, setIsShowThumbnails] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false)
    // const [isLoading, SetIsLoading] = useState(true)
    // style={{ height: 800, objectFit: 'cover' }}

    useEffect(() => {
        page.current.scrollIntoView({
            behavior: 'instant'
        }, 0)

        const onFullscreenChange = () => {
            setIsFullScreen(Boolean(document.fullscreenElement))
        }

        document.addEventListener('fullscreenchange', onFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
    }, [])

    useEffect(() => {
        const timeOut = setTimeout(() => {
            if (!isFullScreen) {
                page.current.scrollIntoView({
                    behavior: 'smooth'
                }, 0)
            }
        }, 100)

        return () => {
            clearTimeout(timeOut)
        }
    }, [isFullScreen])

    const handleCloseMenu = () => {
        setIsShowThumbnails(false)
    }

    const handleChangePageFilter = e => {

    }

    const openFullscreen = () => {
        if (page?.current?.requestFullscreen) {
            page?.current.requestFullscreen();
        } else if (page?.current?.webkitRequestFullscreen) { /* Safari */
            page?.current?.webkitRequestFullscreen();
        } else if (page?.current?.msRequestFullscreen) { /* IE11 */
            page?.current?.msRequestFullscreen();
        }
        setIsFullScreen(true)
    }
    
    const closeFullscreen = () => {
        if (document?.exitFullscreen) {
            document?.exitFullscreen()
        } else if (document?.webkitExitFullscreen) { /* Safari */
            document?.webkitExitFullscreen()
        } else if (document?.msExitFullscreen) { /* IE11 */
            document?.msExitFullscreen()
        }
        setIsFullScreen(false)
    }

    const handleScreen = () => {
        setIsFullScreen(!isFullScreen)
        if (!isFullScreen) {
            openFullscreen()
        } else {
            closeFullscreen()
        }
    }

    const handleShowThumbnails = () => {
        setIsShowThumbnails(!isShowThumbnails)
    }

    const handlePrint = (event) => {
        // if('print' in window){
        //     window.print();
        //   } else {
        //     alert("Printing is not supported on this device");
        //   }


        var iframe = document.createElement('iframe');
        // iframe.id = 'pdfIframe'
        iframe.className='pdfIframe'
        document.body.appendChild(iframe);
        iframe.style.display = 'none';
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
                URL.revokeObjectURL("https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf")
                // document.body.removeChild(iframe)
            }, 1);
        };
        iframe.src = "https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf";
    }

    const downloadBook = () => {
        saveAs("https://myvinpearl.s3.ap-southeast-1.amazonaws.com/shared/SK.pdf")
    }

    let pages = []
    for (let index = 0; index < 30; index++) {
        pages.push(index + 1)
    }

    return (
        <>
            {/* <LoadingModal show={isLoading} /> */}
            <div className="history-vingroup-page" id="history-vingroup-page" ref={page}>
                {/* <button onClick={() => book.current.pageFlip().flipNext()}>Next page</button> */}
                <div className="d-flex wrap-page">
                    {
                        isShowThumbnails && (
                            <div className="sidebar-left">
                                <div className="d-flex align-items-center justify-content-between top-sidebar">
                                    <span className="d-inline-flex align-items-center thumbnails">
                                        <span className="d-inline-flex justify-content-center align-items-center menu-item">
                                            <svg data-v-78b93dcc="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-icon svg-fill" focusable="false"><path pid="0" d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"></path></svg>
                                        </span>
                                        <span>Thumbnails</span>
                                    </span>
                                    <span className="d-inline-flex justify-content-center align-items-center cursor-pointer menu-close" onClick={handleCloseMenu}>
                                        <svg data-v-78b93dcc="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-icon svg-fill" focusable="false"><path pid="0" d="M14.251 12.003l3.747-3.746-2.248-2.248-3.747 3.746-3.746-3.746-2.248 2.248 3.746 3.746-3.746 3.747 2.248 2.248 3.746-3.747 3.747 3.747 2.248-2.248z"></path></svg>
                                    </span>
                                </div>
                            </div>
                        )
                    }
                    <div className="main-content">
                        <div className="d-flex align-items-center header-block">
                            <h1 className="book-title">Sử ký VIN30</h1>
                            <div className="page-block">
                                <span className="page-label">pages:</span>
                                <input type="text" value={"1"} className="text-center page-input" onChange={handleChangePageFilter} />
                                <span className="seperate">/</span>
                                <span>260</span>
                            </div>
                        </div>
                        <div className="book">
                            <div className="wrap-book">
                                <HTMLFlipBook 
                                    showCover={true}
                                    flippingTime={500}
                                    width={550}
                                    height={733}
                                    // size="fixed"
                                    size="stretch"
                                    minWidth={315}
                                    maxWidth={1000}
                                    minHeight={420}
                                    maxHeight={1350}
                                    // maxShadowOpacity={0.5}
                                    drawShadow={false}
                                    mobileScrollSupport={false}
                                    ref={book}>
                                    {
                                        pages.map((item) => {
                                            return (
                                                <Page key={item} page={item}></Page>
                                            )
                                        })
                                    }
                                    {/* <Page number="1"><img src={Page1} /></Page>
                                    <Page number="2"><img src={Page2} /></Page>
                                    <Page number="3"><img src={Page3} /></Page>
                                    <Page number="4"><img src={Page4} /></Page>
                                    <Page number="5"><img src={Page5} /></Page>
                                    <Page number="6"><img src={Page6} /></Page>
                                    <Page number="7"><img src={Page7} /></Page>
                                    <Page number="8"><img src={Page8} /></Page>
                                    <Page number="9"><img src={Page9} /></Page>
                                    <Page number="10"><img src={Page10} /></Page>
                                    <Page number="11"><img src={Page11} /></Page>
                                    <Page number="12"><img src={Page12} /></Page>
                                    <Page number="13"><img src={Page13} /></Page>
                                    <Page number="14"><img src={Page14} /></Page>
                                    <Page number="15"><img src={Page15} /></Page>
                                    <Page number="16"><img src={Page16} /></Page>
                                    <Page number="17"><img src={Page17} /></Page>
                                    <Page number="18"><img src={Page18} /></Page>
                                    <Page number="19"><img src={Page19} /></Page>
                                    <Page number="20"><img src={Page20} /></Page>
                                    <Page number="21"><img src={Page21} /></Page>
                                    <Page number="22"><img src={Page22} /></Page>
                                    <Page number="23"><img src={Page23} /></Page>
                                    <Page number="24"><img src={Page24} /></Page>
                                    <Page number="25"><img src={Page25} /></Page>
                                    <Page number="26"><img src={Page26} /></Page>
                                    <Page number="27"><img src={Page27} /></Page>
                                    <Page number="28"><img src={Page28} /></Page>
                                    <Page number="29"><img src={Page29} /></Page>
                                    <Page number="10"><img src={Page30} /></Page> */}
                                </HTMLFlipBook>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center bottom-block">
                            <span className={`menu-item cursor-pointer ${isShowThumbnails ? 'active' : ''}`} onClick={handleShowThumbnails}>
                                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M9 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h5zM9 14c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5zm11 0c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-5c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h5z"></path></svg>
                            </span>
                            <span className="btn-download cursor-pointer" onClick={handlePrint}>
                                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M17.511 10.276h-2.516V4.201c.087-.456-.1-.921-.48-1.191H9.482c-.38.27-.567.735-.48 1.19v6.076H6.247L12 16.352l5.512-6.076zM18.597 17v2H5.402v-2H3.003v2.8c-.049.603.479 1.132 1.2 1.2h15.593c.724-.063 1.256-.595 1.2-1.2V17h-2.4z"></path></svg>
                            </span>
                            <span className="btn-download cursor-pointer" onClick={downloadBook}>
                                <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M17.511 10.276h-2.516V4.201c.087-.456-.1-.921-.48-1.191H9.482c-.38.27-.567.735-.48 1.19v6.076H6.247L12 16.352l5.512-6.076zM18.597 17v2H5.402v-2H3.003v2.8c-.049.603.479 1.132 1.2 1.2h15.593c.724-.063 1.256-.595 1.2-1.2V17h-2.4z"></path></svg>
                            </span>
                            <span className={`btn-full-screen cursor-pointer ${isFullScreen ? 'active' : ''}`} onClick={handleScreen}>
                                {
                                    isFullScreen ? (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M20.664 19.114l-2.806-2.854L19.845 14H14v5.947l2.104-2.141 2.806 2.854a1.155 1.155 0 001.637 0 .96.96 0 00.117-1.546zM6.197 7.864l-2.141 2.14h5.947V4.059L7.862 6.2 5.007 3.345a1.19 1.19 0 00-1.665 0 1.19 1.19 0 000 1.665l2.855 2.854zm-.06 8.308L3.242 19.07a1.207 1.207 0 001.69 1.69l2.897-2.897L10 20.034V14H3.965l2.173 2.172zM17.743 7.86l2.924-2.854a1.204 1.204 0 000-1.665 1.156 1.156 0 00-1.637 0l-2.807 2.973L14 4.053V10h5.847l-2.105-2.14z"></path></svg>
                                    )
                                    : (
                                        <svg data-v-71c99c82="" version="1.1" viewBox="0 0 24 24" className="svg-icon svg-fill" focusable="false"><path pid="0" d="M6.733 5.1l2.1-2.1H3v5.833l2.1-2.1 2.8 2.8A1.167 1.167 0 109.533 7.9l-2.8-2.8zM18.9 17.328l-2.8-2.869a1.18 1.18 0 00-1.633-.23 1.135 1.135 0 000 1.837l2.916 2.754L15.167 21H21v-5.738l-2.1 2.066zm-3.014-7.664l2.854-2.806L21 8.845V3h-5.947l2.141 2.104L14.34 7.91a1.155 1.155 0 000 1.637.96.96 0 001.546.117zm-7.857 4.673L5.222 17.26 3 15.156v5.847h5.847l-2.105-2.105 2.924-2.807a1.17 1.17 0 000-1.637 1.052 1.052 0 00-1.637-.117z"></path></svg>
                                    )
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
