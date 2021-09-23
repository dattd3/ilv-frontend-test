import React from "react";
import './select-tab.scss'

export default function SelectTab(props) {
  const { selectedMembers, onClick, onCloseTab, onCloseAll } = props;
  const onClickSelectTab = () => {
    onClick();
  }
  const onCloseTabEvent = (uid) => {
    onCloseTab(uid);
  }
  const onCloseAllEvent = () => {
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
            <i className="fa fa-close p-1 closeIcon" aria-hidden="true" onClick={() => onCloseTabEvent(item.uid)}></i>
          </span>
        </span>
      )
    });
  }
  return (
    <div className="tabControl">
      <div className="tabContainer">
        {renderSelectTab(selectedMembers)}

      </div>
      <div className="d-flex justify-content-between align-items-center">
        {selectedMembers.length > 0 && <div className="total">{selectedMembers.length}</div>
        }
        {selectedMembers.length > 0 && <i className="fa fa-close p-1 closeIconAll" aria-hidden="true" onClick={onCloseAllEvent}></i>}
        <i className="fa fa-angle-down downIcon" onClick={onClickSelectTab}></i>
      </div>

    </div>

  );
}
