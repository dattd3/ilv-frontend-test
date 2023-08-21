import React, { useState, useEffect, useRef, forwardRef } from "react"
import HTMLFlipBook from "react-pageflip"
import Page1 from 'assets/img/vingroup_history/PMP001.webp'
import Page2 from 'assets/img/vingroup_history/PMP002.webp'
import Page3 from 'assets/img/vingroup_history/PMP003.webp'
import Page4 from 'assets/img/vingroup_history/PMP004.webp'
import Page5 from 'assets/img/vingroup_history/PMP005.webp'
import Page6 from 'assets/img/vingroup_history/PMP006.webp'
import Page7 from 'assets/img/vingroup_history/PMP007.webp'
import Page8 from 'assets/img/vingroup_history/PMP008.webp'
import Page9 from 'assets/img/vingroup_history/PMP009.webp'
import Page10 from 'assets/img/vingroup_history/PMP010.webp'

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
            <div className="header-page">

            </div>
            
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
                <Page number="6"><img src={Page7} /></Page>
                <Page number="6"><img src={Page8} /></Page>
                <Page number="6"><img src={Page9} /></Page>
                <Page number="6"><img src={Page10} /></Page>
            </HTMLFlipBook>
        </div>
    );
}