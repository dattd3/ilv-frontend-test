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
    return selectedMembers.map(item => {
      const fullname = item.fullname;
      return (
        <span>
          <span className="tabContent">
            <span className="tabLabel">
              {fullname}
            </span>
            <i className="fa fa-close p-1 iconPointer" aria-hidden="true" onClick={() => onCloseTabEvent(item.uid)}></i>
          </span>
        </span>
      )
    });
  }
  return (
    <div className="d-flex justify-content-between align-items-center tabControl">
      <div className="tabContainer">
        {renderSelectTab(selectedMembers)}

      </div>
      <div className="d-flex justify-content-between align-items-center">
        {selectedMembers.length > 0 && <div className="number-selected">{selectedMembers.length}</div>
        }
        {selectedMembers.length > 0 && <i className="fa fa-close p-1 iconPointer" aria-hidden="true" onClick={onCloseAllEvent}></i>}
        <i className="fa fa-sort-down downIcon" onClick={onClickSelectTab}></i>
      </div>

    </div>

  );
}
