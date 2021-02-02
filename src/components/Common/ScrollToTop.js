import React from "react";


class ScrollToTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_visible: false
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
        is_visible: true
      });
    } else {
      this.setState({
        is_visible: false
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
    const { is_visible } = this.state;
    return (
      <div className="scroll-to-top2" style={{color: localStorage.getItem("companyThemeColor")}}>
        {is_visible && (
          <div onClick={() => this.scrollToTop()}>
            <span><i className="fa fa-arrow-circle-o-up fa-2x" aria-hidden="true"></i></span>
          </div>
        )}
      </div>
    );
  }
}

export default ScrollToTop;
