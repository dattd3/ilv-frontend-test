import React from "react";

function Footer(props) {
  return (
    <footer style={{ backgroundColor: localStorage.getItem("companyThemeColor") }} className={`sticky-footer bg-whit shadow vg-dard-board`}>
      <div className="container my-auto">
        <div className="copyright text-center my-auto h4">
          <span>Copyright &copy; {new Date().getFullYear()} <b className="">Vingroup</b>. Designed by <b className="">VinITIS</b> All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;