import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import MemberOption from "../MemberOption"
import SelectTab from "../SelectTab"
import { getMuleSoftHeaderConfigurations } from "../../../../commons/Utils"

const FilterMember = (props) => {
  const { t, isSalaryAdjustment, onChangeSalaryAdjustment } = props,
    isTransferAppointProposal = window.location.href.includes('transfer-appoint/create/request');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedMemberIds, setCheckedMemberIds] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showMemberOption, setShowMemberOption] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (props.isEdit) {
      getApproverInfo();
    } else {
      setSelectedMembers(props.selectedMembers)
    }
    // eslint-disable-next-line
  }, [props.isEdit]);

  useEffect(() => {
    if(users?.length > 0 && props.selectedMembers?.length > 0 && init == false) {
      setInit(true);
      const memberIdsSelected = [...props.selectedMembers].map(m => m.uid);
      const _users = [...users].map(item => ({
        ...item,
        checked: memberIdsSelected.includes(item.uid)
      }));
      setUsers([..._users])
      setSelectedMembers(props.selectedMembers)
      setCheckedMemberIds([..._users].filter(a => a.checked).map(m => m.uid))
    }
  }, [users]);

  // useEffect(() => {
  //   // if (!props.isEdit) {
  //   //   if(init == true) setSelectedMembers(props.selectedMembers)
  //   //   console.log('aa >>>', props.selectedMembers)
  //   //   setCheckedMemberIds([...props.selectedMembers].map(m => m.uid))
  //   // }
  //   // eslint-disable-next-line
  // }, [props.selectedMembers]);

  const getApproverInfo = () => {
    const config = getMuleSoftHeaderConfigurations()
    axios.get(`${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/user/subordinate?depth=2`, config)
      .then((res) => {
        if (res && res.data && res.data.data) {
          const users = (res.data.data || []);
          setUsers([...users])
          setLoading(false)
          setShowMemberOption(false)
          props.updateEmployees(users, 'employeesForFilter')
        }
      })
      .catch((error) => { setLoading(false) });
  };

  const getSelectedMembers = (data) => {
    setUsers(data)
    setShowMemberOption(false)
    setSelectedMembers(data.filter(a => a.checked))
    setCheckedMemberIds(data.filter(a => a.checked).map(m => m.uid))
    props.handleSelectMembers(data.filter(a => a.checked))
  }

  const onHideMembers = () => { setShowMemberOption(false) }

  const resetSelectedMember = () => {
    const resetMember = [...users]
    setUsers(resetMember.map(member => { return { ...member, checked: false } }))
    setShowMemberOption(false)
    setSelectedMembers([])
    setCheckedMemberIds([])
    props.handleSelectMembers([])
  }

  const onClickSelectTab = () => {
    if (props.isEdit) setShowMemberOption(true);
  }

  const onCloseTabEvent = (uid) => {
    if (props.isEdit) {
      const members = [...users];
      const closeMember = members.find(val => val.uid === uid);
      closeMember.checked = false;
      getSelectedMembers(members);
    }
  }

  const onCloseAllEvent = () => {
    if (props.isEdit) resetSelectedMember();
  }

  const hrProfileDisplay = () => {
    let hrProfileDisplay = [];
    if (users && users.length > 0) {
      hrProfileDisplay = users.map((profile) => ({
        uid: profile.uid,
        fullname: profile.fullname,
        job_name: profile.position_name,
        title: profile.title,
        part: profile.part || "",
        division: profile.division || "",
        department: profile.department || "",
        unit: profile.unit || "",
        companyCode: profile.organization_lv2,
        orgLv3Text: profile.orgLv3Text,
        username: profile.username,
        manager: profile.manager,
        company_email: profile.company_email.includes("@") ? profile.company_email.split("@")[0] : profile.company_email,
        checked: profile.checked || false,
        isExpand: profile.isExpand || false,
        contractName: profile.contract_type_name || profile.contractName || "",
        contractType: profile.contract_type_code || profile.contractType || "",
        startDate: profile.startDate || "",
        expireDate: profile.expireDate || "",
      }));
    }
    return hrProfileDisplay
  }

  const handleCheckbox = (e) => onChangeSalaryAdjustment(e.target.checked);

  return (
    <>
      <div className="title">{t('ApplyFor')}</div>
      <SelectTab
        className="content input-container"
        isDisabled={!props.isEdit || false}
        selectedMembers={selectedMembers}
        onClick={onClickSelectTab}
        onCloseTab={onCloseTabEvent}
        onCloseAll={onCloseAllEvent}
      />          
      {isTransferAppointProposal && (
        <div className="change-proposal d-flex mt-2 mb-2">
          <input
            type="checkbox"
            checked={isSalaryAdjustment}
            onChange={handleCheckbox}
          />
          <p className="inline-layout text-dark mb-0 ml-2">
            {t("IncludeSalaryAdjustment")}
          </p>
        </div>
      )}

      {showMemberOption && (
        <MemberOption
          loading={loading}
          data={hrProfileDisplay}
          hideMembers={onHideMembers}
          resetSelectedMember={resetSelectedMember}
          saveSelectedMember={getSelectedMembers}
          type={props.type}
        />
      )}
    </>
  )
}

export default withTranslation()(FilterMember);
