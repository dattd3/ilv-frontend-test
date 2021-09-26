import React, { useState, useEffect, useRef } from "react";
import { registerLocale } from "react-datepicker";
import { withTranslation, useTranslation } from "react-i18next";
// import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import vi from "date-fns/locale/vi";
import { InputGroup, FormControl } from 'react-bootstrap'
registerLocale("vi", vi);

const MemberOption = (props, onChange) => {
  const { t } = useTranslation();
  const { innerProps, innerRef } = props.data;
  const ref = useRef(null);
  // const [checkedAll, setCheckedAll] = useState(false);
  const [members, setMembers] = useState(props.data);
  const [memberDefault] = useState(props.data);
  const [treeMembers, setTreeMembers] = useState([]);
  const [downAll, setDowAll] = useState(true);
  const [upAll, setUpAll] = useState(false);
  const [downAllChild, setDowAllChild] = useState({});
  const [upAllChild, setUpAllChild] = useState({});

  const handleAllChecked = event => {
    const newMembers = [...members];
    newMembers.forEach(member => member.checked = event.target.checked)
    setMembers(newMembers);
  }

  const handleAllCheckedChildren = (event, items) => {
    const newMembers = [...members];
    items.forEach(item => {
      newMembers.forEach(member => {
        if (member.uid === item.uid)
          member.checked = event.target.checked
      })
    })
    setMembers(newMembers);
  }

  const downAllClick = () => {
    setDowAll(false);
    setUpAll(true);
  }

  const upAllClick = () => {
    setDowAll(true);
    setUpAll(false);
  }

  const downAllChildClick = (id) => {
    setDowAllChild(downAllChild => ({
      ...downAllChild,
      [id]: false
    }));
    setUpAllChild(upAllChild => ({
      ...upAllChild,
      [id]: true
    }));
  }

  const upAllChildClick = (id) => {
    setDowAllChild(downAllChild => ({
      ...downAllChild,
      [id]: true
    }));
    setUpAllChild(upAllChild => ({
      ...upAllChild,
      [id]: false
    }));
  }

  const list_to_tree = (list) => {
    // O(n)
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].uid] = i; // initialize the map
      list[i].children = []; // initialize the children
      list[i].nodeIndex = 1;
    }
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.manager !== "0" && list[map[node.manager]] !== undefined) {
        // if  have dangling branches check that map[node.parentId] exists
        node.nodeIndex = list[map[node.manager]].nodeIndex + 1
        node.children = node.children.map(i => ({ ...i, nodeIndex: i.nodeIndex + 1 }))
        list[map[node.manager]].children.push(node);
      } else {
        const id = node.uid;
        setDowAllChild(downAllChild => ({
          ...downAllChild,
          [id]: true
        }));
        setUpAllChild(upAllChild => ({
          ...upAllChild,
          [id]: false
        }));
        roots.push(node);
      }
    }
    return roots;
  }

  const handleChange = event => {
    const newMembers = [...members];
    newMembers.forEach(member => {
      if (props.type === 'singleChoice') {
        member.checked = false;
      }
      if (member.uid === parseInt(event.target.value))
        member.checked = event.target.checked
    })
    setMembers(newMembers);
  };

  const onSearch = event => {
    const newMembers = [...memberDefault];
    const filtered = event.target.value ? newMembers.filter(member => { return member.fullname.toLowerCase().includes(event.target.value.toLowerCase()) }) : [...memberDefault];
    setMembers(filtered);
  }

  const confirmSelectedMember = () => {
    if (members.length !== memberDefault.length) {
      let mapMembers = memberDefault.map(a => {
        let obj = members.find(a2 => a2.uid === a.uid);
        if (obj) return obj;
        return a;
      })
      props.saveSelectedMember(mapMembers)
    }
    else {
      props.saveSelectedMember(members)
    }

  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        props.hideMembers()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props, ref]);

  useEffect(() => {
    const list = list_to_tree(members);
    setTreeMembers(list);
  }, [members])

  const renderTreeMember = (members) => {
    return members.map((item, index) => {
      const id = item.uid.toString();
      return (
        <div key={item.uid} ref={innerRef} {...innerProps} className="option-item" style={{ position: "relative", left: "15px" }}>
          <div className="d-flex border-bottom text-dark btn" >
            <label className="lable-custom">
              {
                props.type !== 'singleChoice' ?
                  <input type="checkbox" className="mtmr5" value={item.uid} name={item.uid} checked={item.checked}
                    onChange={handleChange} /> :
                  <input type="radio" className="mtmr5" id={item.uid} value={item.uid} name="flexRadioDefault" checked={item.checked} onChange={handleChange} />
              }
              <div className="float-left text-left text-wrap w-100">
                <div className="full-name">{item.fullname}</div>
                <div className="text-xs account-job">
                  <span>({item.company_email}) {item.job_name}</span>
                </div>
              </div>
            </label>
            {item.children.length > 0 && downAllChild[id] === true && <i className="fas fa-caret-down" style={{ cursor: "pointer" }} onClick={() => downAllChildClick(item.uid)}></i>}
            {item.children.length > 0 && upAllChild[id] === true && <i className="fas fa-caret-up" style={{ cursor: "pointer" }} onClick={() => upAllChildClick(item.uid)}></i>}
          </div>
          {item.children.length > 0 &&
            <div className={`collapse-content ${upAllChild[id] === true ? 'collapsed' : 'expanded'}`}
              aria-expanded={upAllChild === item.uid}>
              {
                props.type !== 'singleChoice' ?
                  <div className="d-flex border-bottom text-dark btn " style={{ position: "relative", left: "15px" }}>
                    <label className="lable-custom">
                      <input type="checkbox" className="mtmr5" value="checkedall" onChange={(e) => handleAllCheckedChildren(e, item.children)}
                        checked={item.children.filter(m => m.checked).length === item.children.length} />
                      <div className="float-left text-left text-wrap w-75">
                        <div className="label-select-all">{t('All')}</div>
                      </div>
                    </label>
                  </div> : null
              }{renderTreeMember(item.children)}
            </div>
          }
        </div>
      );
    })
  }

  return (
    <>
      <div ref={ref} className="member-list">

        <div className="mt-2 p-2 input-search">
          {/* <input type="text" className="fomr-control" onChange={onSearch}/> */}
          <InputGroup className="">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2"><i className="fas fa-search"></i></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder={t('EnterKeywords')}
              aria-label="SearchRequester"
              aria-describedby="basic-addon2"
              onChange={onSearch} />
          </InputGroup>
        </div>
        <div className="show-list p-1">
          {
            props.type !== 'singleChoice' ?
              <div className="d-flex border-bottom text-dark btn ">
                <label className="lable-custom">
                  <input type="checkbox" className="mtmr5" value="checkedall" onChange={handleAllChecked} />
                  <div className="float-left text-left text-wrap w-75">
                    <div className="label-select-all">{t('All')}</div>
                  </div>
                </label>
                {treeMembers.length > 0 && downAll && <i className="fas fa-caret-down" style={{ cursor: "pointer" }} onClick={downAllClick}></i>}
                {treeMembers.length > 0 && upAll && <i className="fas fa-caret-up" style={{ cursor: "pointer" }} onClick={upAllClick}></i>}
              </div> : null
          }
          <div className={`collapse-content ${upAll ? 'collapsed' : 'expanded'}`}
            aria-expanded={upAll}>
            {renderTreeMember(treeMembers)}
          </div>
        </div>
        <div className="action bg-light d-flex justify-content-center p-2">
          <button type="button" className="btn btn-secondary btn-sm mr-2" onClick={props.resetSelectedMember}>{t('CancelSearch')}</button>
          <button type="button" className="btn btn-primary btn-sm" onClick={confirmSelectedMember}>{t('ApplySearch')}</button>
        </div>
      </div>
    </>
  );
}
export default withTranslation()(MemberOption);
