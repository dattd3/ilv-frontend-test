import React from "react";
import ReactTooltip from 'react-tooltip'
import './select-tab.scss'

export default function SelectTab(props) {
  const { selectedMembers, onClick, onCloseTab, onCloseAll } = props;
  const onClickSelectTab = () => {
    onClick();
  }
  const onCloseTabEvent = (e,uid) => {
    e.stopPropagation();
    onCloseTab(uid);
  }
  const onCloseAllEvent = (e) => {
    e.stopPropagation();
    onCloseAll();
  }
  const renderSelectTab = selectedMembers => {
    return selectedMembers.map((item,key) => {
      const fullname = item.fullname;
      return (
        <span key={key}>
          <span className="tabContent">
            <span className="tabLabel">
              {fullname}
            </span>
            <i className="fa fa-close p-1 closeIcon" aria-hidden="true" onClick={(e) => onCloseTabEvent(e,item.uid)}></i>
          </span>
        </span>
      )
    });
  }

  return (
    <div className="tabControl" onClick={onClickSelectTab}>
      <div className="tabContainer">
        {renderSelectTab(selectedMembers)}

      </div>
      <div className="d-flex justify-content-between align-items-center">
        {selectedMembers.length > 0 
          && <>
            <ReactTooltip id='total-items-selected' scrollHide isCapture clickable place="right" globalEventOff="click" type='light' backgroundColor="#FFFFFF" arrowColor="#CCCCCC" className="item-tooltip">
              <ul>
                {
                  selectedMembers.map((item, i) => {
                    return  <li key={i} className="user-item">
                              <p className="full-name">{item.fullname || ""}</p>
                              <p className="job-title">({item.company_email}) {item.job_name}</p>
                            </li>
                  })
                }
              </ul>
            </ReactTooltip>
            <div className="total" data-tip data-for='total-items-selected'>{selectedMembers.length}</div></>}
        {selectedMembers.length > 0 && <i className="fa fa-close p-1 closeIconAll" aria-hidden="true" onClick={(e) => onCloseAllEvent(e)}></i>}
        <i className="fa fa-angle-down downIcon"></i>
      </div>

    </div>

  );
}
