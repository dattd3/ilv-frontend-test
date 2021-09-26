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
            <ReactTooltip id='total-items-selected' place="right" type='dark'>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li className="user-item" style={{padding: '5px 0', borderBottom: '1px dashed #FFFFFF'}}>
                  <p style={{margin: 0}}>Nguyễn Như Huy</p>
                  <p style={{margin: 0, fontStyle: "italic"}}>(V.HUYNN12) Chuyên viên Phát triển sản phẩm)</p>
                </li>
                <li className="user-item" style={{padding: '5px 0'}}>
                  <p style={{margin: 0}}>Nguyễn Tiến Lợi</p>
                  <p style={{margin: 0, fontStyle: "italic"}}>(V.LOINT8) Chuyên gia Thiết kế)</p>
                </li>
              </ul>
            </ReactTooltip>
            <div className="total" data-tip data-for='total-items-selected'>{selectedMembers.length}</div></>}
        {selectedMembers.length > 0 && <i className="fa fa-close p-1 closeIconAll" aria-hidden="true" onClick={(e) => onCloseAllEvent(e)}></i>}
        <i className="fa fa-angle-down downIcon"></i>
      </div>

    </div>

  );
}
