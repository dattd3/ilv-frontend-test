import React, { useState, useEffect, useRef, forwardRef } from "react"
import HTMLFlipBook from "react-pageflip"
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

const Page = forwardRef((props, ref) => {
    return (
        <div className={`page page-${props?.number}`} ref={ref}>{props.children}</div>
    )
});

export default function MyBook(props) {
    const book = useRef()

    // style={{ height: 800, objectFit: 'cover' }}

    return (
        <div className="history-vingroup-page" id="history-vingroup-page">
            {/* <button onClick={() => book.current.pageFlip().flipNext()}>Next page</button> */}
            <div className="d-flex wrap-page">
                <div className="sidebar-left"></div>
                <div className="main-content">
                    <div className="d-flex align-items-center header-block">
                        <h1 className="book-title">Sử ký VIN30</h1>
                        <div className="page-block">
                            <span className="page-label">pages:</span>
                            <input type="text" value={"1"} className="text-center page-input" />
                            <span className="seperate">/</span>
                            <span>260</span>
                        </div>
                    </div>
                    <div className="book">
                        <HTMLFlipBook 
                            showCover={true}
                            flippingTime={500}
                            width={550}
                            height={733}
                            // size="fixed"
                            size="stretch"
                            minWidth={315}
                            maxWidth={1000}
                            minHeight={400}
                            // maxHeight={1000}
                            maxShadowOpacity={0.5}
                            ref={book}>
                            <Page number="1"><img src={Page1} /></Page>
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
                            <Page number="10"><img src={Page30} /></Page>
                        </HTMLFlipBook>
                    </div>
                </div>
            </div>
        </div>
    )
}
