/* eslint-disable no-useless-concat */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { useTranslation } from "react-i18next";

function sumDays(days) {
  let total = days.reduce((sum, day) => sum + day);
  return total.toString().length > 1 ? total.toFixed(2) : total;
}

export default function LeaveTimeCard(props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className=" leave-time-card mb-2">
      <div className="card shadow">
        <div
          className={"card-header clearfix text-white " + "bg-" + props.bg}
          onClick={() => setOpen(!open)}
        >
          <div className="float-left text-uppercase">{props.headerTitle}</div>
          <div className="float-right">
            <i className={open ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
          </div>
        </div>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <div className="content">
              <div className="card-body">
                <div className="row header text-primary">
                  <div className="col-md-2 text-left">
                    {props.headers.month}
                  </div>
                  <div className="col-md-3 text-center">
                    {props.headers.annualLeaveOfArising}
                  </div>
                  <div className="col-md-3 text-center">
                    {props.headers.usedAnnualLeave}
                  </div>
                  <div className="col-md-4 text-center">
                    {props.headers.daysOfAnnualLeave}
                  </div>
                </div>
                <div>
                  {props.data.map((value, key) => {
                    return value.arisingLeave.length > 0 ||
                      value.usedLeave.length > 0 ? (
                      <div className="row text-left" key={key}>
                        <div className="col-md-2">{value.month}</div>
                        <div className="col-md-3 text-center">
                          {value.arisingLeave.length > 0
                            ? sumDays(value.arisingLeave.map((al) => al.days))
                            : 0}
                        </div>
                        <div className="col-md-3 text-center">
                          {value.usedLeave.length > 0
                            ? sumDays(value.usedLeave.map((ul) => ul.days))
                            : 0}
                        </div>
                        <div className="col-md-4 text-center text-capitalize">
                          {value.usedLeave.length > 0
                            ? value.usedLeave.map((d, k) => (
                                <p key={k}>
                                  {d.date.replace(/-/g, "/")} - {d.days}{" "}
                                  {t("Day")}
                                </p>
                              ))
                            : ""}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
