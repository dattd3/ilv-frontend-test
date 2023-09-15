import React from "react";
import IconBackToTop from "assets/img/icon/Icon_back_to_top.svg"

class ScrollToTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleGoToTop: false
    };
  }

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener("scroll", function(e) {
      scrollComponent.toggleVisibility();
    });
  }

  toggleVisibility() {
    if (window.pageYOffset > 250) {
      this.setState({
        isVisibleGoToTop: true
      });
    } else {
      this.setState({
        isVisibleGoToTop: false
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  render() {
    const { isVisibleGoToTop } = this.state

    return (
      <>
        {
          isVisibleGoToTop && (
            <div className="scroll-to-top2" onClick={() => this.scrollToTop()}>
              <span><img src={IconBackToTop} alt="Back to top" /></span>
            </div>
          )
        }
      </>
    )
  }
}

export default ScrollToTop;
