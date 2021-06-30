import React from "react";

function Footer(props) {
    return (
        <footer style={{backgroundColor: localStorage.getItem("companyThemeColor")}} className="sticky-footer bg-whit shadow vg-footer mb-3">
        <div className="container my-auto">
          <div className="copyright text-center my-auto h4">
            <span>Copyright &copy; 2021 <b className="">Vingroup</b>. Designed by <b className="">Vin3S</b> All Rights Reserved</span>
          </div>
        </div>
      </footer>
    );
}
export default Footer;