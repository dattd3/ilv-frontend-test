import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import Constants from 'commons/Constants';
import { getRequestConfigurations } from 'commons/Utils';
import { withTranslation } from 'react-i18next';
import { Modal, Button, Image } from 'react-bootstrap';

import IconReject from '../../../../assets/img/icon/Icon_Cancel.svg';
import IconCheck from '../../../../assets/img/icon/Icon_Check_White.svg';
import IconSearchWhite from '../../../../assets/img/icon/Icon_Loop.svg';
import IconSearch from '../../../../assets/img/icon/ic_search.svg';
import debounce from 'lodash/debounce';

const employeeCode = localStorage.getItem('employeeNo'),
  employeeAD = localStorage.getItem('email').split('@')[0],
  getOrgOptions = (options, key) =>
    (options?.[`listOrg${key}`] || []).map((item) => ({
      value: item?.[`organization_lv${key}`],
      label: item?.organization_name,
      parentId: item?.parent_id,
    })),
  INIT_DATA = [
    { label: 'PTGD Khối hỗ trợ', value: '25254625' },
    { label: 'Trưởng phòng dich vụ', value: '25254626' },
    { label: 'Senior digital solutions manager', value: '25254627' },
  ],
  ORG_KEY = [
    'pnl',
    'block',
    'region',
    'unit',
    'department',
    'crew',
    'team',
    'group',
  ];

class ProposalModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      orgsOrigin: {},
      org: {
        pnls: INIT_DATA,
        blocks: INIT_DATA,
        regions: INIT_DATA,
        units: INIT_DATA,
        departments: INIT_DATA,
        crews: INIT_DATA,
        teams: INIT_DATA,
        groups: INIT_DATA,
      },
      data: {},
      errors: {},
      titles: [
        { label: 'PTGD Khối hỗ trợ', value: '25254625' },
        { label: 'Trưởng phòng dich vụ', value: '25254626' },
        { label: 'Senior digital solutions manager', value: '25254627' },
        { label: 'Trưởng phòng dịch vụ xe điện', value: '25254628' },
        { label: 'PTGD Khối hỗ trợ', value: '25254629' },
        { label: 'Trưởng phòng dich vụ', value: '252546210' },
        { label: 'Senior digital solutions manager', value: '25254631' },
        { label: 'Trưởng phòng dịch vụ xe điện', value: '25254632' },
        { label: 'PTGD Khối hỗ trợ', value: '25254633' },
        { label: 'Trưởng phòng dich vụ', value: '25254634' },
        { label: 'Senior digital solutions manager', value: '25254635' },
        { label: 'Trưởng phòng dịch vụ xe điện', value: '25254636' },
        { label: 'PTGD Khối hỗ trợ', value: '25254637' },
        { label: 'Trưởng phòng dich vụ', value: '25254638' },
        { label: 'Senior digital solutions manager', value: '25254639' },
        { label: 'Trưởng phòng dịch vụ xe điện', value: '25254640' },
      ],
      proposalSearch: '',
      proposalLoading: false,
    };
    this.debounceProposalSearch = debounce(
      this.debounceProposalSearch.bind(this),
      800
    );
  }

  fetchData = async () => {
    const config = getRequestConfigurations(),
      formData = new FormData();
    let orgsOrigin = {};

    formData.append('ReviewerEmployeeCode', employeeCode);
    formData.append('ReviewerEmployeeAdCode', employeeAD);

    const res = await axios.post(
      `${process.env.REACT_APP_HRDX_PMS_URL}api/form/MasterData`,
      formData,
      config
    );

    if (
      res?.data &&
      res?.data?.result?.code == Constants.PMS_API_SUCCESS_CODE
    ) {
      const data = res?.data?.data;
      orgsOrigin.pnls = getOrgOptions(data, 2);
      orgsOrigin.blocks = getOrgOptions(data, 3);
      orgsOrigin.regions = getOrgOptions(data, 4);
      orgsOrigin.units = getOrgOptions(data, 5);
      orgsOrigin.departments = getOrgOptions(data, 6);

      orgsOrigin.crews = getOrgOptions(data, 6);
      orgsOrigin.teams = getOrgOptions(data, 6);
      orgsOrigin.groups = getOrgOptions(data, 6);
    }

    this.setState({ orgsOrigin, org: { pnls: orgsOrigin.pnls } });
  };

  componentDidMount() {
    // this.fetchData();
  }

  onClickSelectTab() {}

  checkDisableSelect(key) {
    const { data } = this.state;
    let index = ORG_KEY.length - 1;

    for (let i = 0; i < ORG_KEY.length; i++) {
      if (ORG_KEY[i] === key) index = i;
      if (i > index) return false;
      if (i < index && !data[ORG_KEY[i]]) {
        return true;
      }
    }
    return false;
  }

  handleChangeSelect = (e, key, action) => {
    const { data } = this.state;
    let index = 0;

    data[key] = !!e ? e : null;
    if (['remove-value', 'clear'].includes(action)) {
      for (let i = ORG_KEY.length - 1; i >= 0; i--) {
        if (ORG_KEY[i] === key) index = i;
        if (index < i) data[ORG_KEY[i]] = null;
      }
    }

    this.setState({ data });
  };

  handleSearch = async () => {
    // handle call api get data set to titles
  };

  handleProposalSearch = (ev) => {
    const proposalSearch = ev?.target?.value;
    this.setState({ proposalSearch }, () =>
      this.debounceProposalSearch(proposalSearch)
    );
  };

  debounceProposalSearch = (val) => {
    if (val) {
      this.setState({ proposalLoading: true });
      axios
        .post(`${process.env.REACT_APP_REQUEST_URL}user/employee/search`, {
          val,
        })
        .then((res) => {
          this.setState({ titles: [] });
        })
        .then(() => this.setState({ proposalLoading: false }));
    }
  };

  handleAccept = () => {
    const { onAccept } = this.props;
    const { data } = this.state,
      { pnl, block, region, unit, department, crew, team, group, proposal } =
        data,
      orgTtl = `${pnl?.label}${!!block ? `\\${block?.label}` : ''}${
        !!region ? `\\${region?.label}` : ''
      }${!!unit ? `\\${unit?.label}` : ''}${
        !!department ? `\\${department?.label}` : ''
      }${!!crew ? `\\${crew?.label}` : ''}${!!team ? `\\${team?.label}` : ''}${
        !!group ? `\\${group?.label}` : ''
      }`;

    onAccept({ proposal: proposal.label, org: orgTtl });
    this.setState({ data: {} });
  };

  renderErrors = (name) => {
    return this.state.errors?.[name] ? (
      <p className="text-danger errors">{this.state.errors[name]}</p>
    ) : null;
  };

  render() {
    const {
      modal: { show },
      onHide,
      t,
    } = this.props;
    const { org, data, titles } = this.state,
      { pnls, blocks, regions, units, departments, crews, teams, groups } = org,
      {
        pnl,
        block,
        region,
        unit,
        department,
        crew,
        team,
        group,
        proposal,
        proposalSearch,
      } = data;

    return (
      <Modal
        centered
        size="lg"
        show={show}
        onHide={onHide}
        className="confirm-modal-new2 proposal-modal"
        dialogClassName="mw-800"
      >
        <Modal.Header closeButton>
          <div className="modal-title pb-3 text-uppercase">
            {t('proposal_title')}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="content">
            <div className="row form-group">
              <div className="col-6">
                <label className="form-label">
                  P&L <span className="required">(*)</span>
                </label>
                <Select
                  options={pnls}
                  value={pnl}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'pnl', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('pnl')}
              </div>
              <div className="col-6">
                <label className="form-label">{t('DivisionName')}</label>
                <Select
                  options={blocks}
                  value={block}
                  isDisabled={this.checkDisableSelect('block')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'block', action)
                  }
                  placeholder={t('Select')}
                  isClearable={true}
                />
                {this.renderErrors('block')}
              </div>
            </div>

            <div className="row form-group">
              <div className="col-6">
                <label className="form-label">{t('RoomAreaRegion')}</label>
                <Select
                  options={regions}
                  value={region}
                  isDisabled={this.checkDisableSelect('region')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'region', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('region')}
              </div>
              <div className="col-6">
                <label className="form-label">{t('MemberUnits')}</label>
                <Select
                  options={units}
                  value={unit}
                  isDisabled={this.checkDisableSelect('unit')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'unit', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('unit')}
              </div>
            </div>

            <div className="row form-group">
              <div className="col-6">
                <label className="form-label">{t('EvaluationTeam')}</label>
                <Select
                  options={departments}
                  value={department}
                  isDisabled={this.checkDisableSelect('department')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'department', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('department')}
              </div>
              <div className="col-6">
                <label className="form-label">{t('TeamSalaryProposal')}</label>
                <Select
                  options={crews}
                  value={crew}
                  isDisabled={this.checkDisableSelect('crew')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'crew', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('crew')}
              </div>
            </div>

            <div className="row form-group">
              <div className="col-6">
                <label className="form-label">{t('Group')}</label>
                <Select
                  options={teams}
                  value={team}
                  isDisabled={this.checkDisableSelect('team')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'team', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('team')}
              </div>
              <div className="col-6">
                <label className="form-label">{t('Crew')}</label>
                <Select
                  options={groups}
                  value={group}
                  isDisabled={this.checkDisableSelect('group')}
                  onChange={(e, { action }) =>
                    this.handleChangeSelect(e, 'group', action)
                  }
                  isClearable={true}
                  placeholder={t('Select')}
                />
                {this.renderErrors('group')}
              </div>
            </div>

            <div className="row form-group col-12">
              <Button
                className="btn-warning text-white"
                style={{ fontSize: '14px' }}
                onClick={this.handleSearch}
              >
                <Image src={IconSearchWhite} alt="search" className="mr-2" />
                {t('SearchLabel')}
              </Button>
            </div>

            {titles.length > 0 && (
              <div className="row form-group">
                <div className="col-12">
                  <label className="form-label">{t('proposal_title')}</label>
                  <div className="tabControl">
                    <div className="tabContainer">
                      <span className="p-2">{proposal?.label}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <i className="fa fa-angle-down downIcon"></i>
                    </div>
                  </div>

                  <div className="proposal-title">
                    <div className="search-box">
                      <Image src={IconSearch} alt="search" className="mr-2" />
                      <input
                        type="text"
                        placeholder={t('SearchNewPosition')}
                        name="search proposal"
                        value={proposalSearch}
                        onChange={this.handleProposalSearch}
                      />
                    </div>
                    <div className="title-block">
                      <div className="title-item header">
                        <div className="label">{t('TitleSalaryProposal')}</div>
                        <div className="value">Position ID</div>
                      </div>
                      <div className="title-content">
                        {titles.map((item, i) => (
                          <div
                            key={i}
                            className={`title-item ${
                              proposal?.value === item?.value && 'active'
                            }`}
                            onClick={() =>
                              this.handleChangeSelect(item, 'proposal', 'none')
                            }
                          >
                            <div className="label">{item?.label}</div>
                            <div className="value">{item?.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {this.renderErrors('proposal')}
                </div>
              </div>
            )}
          </div>

          <div className="text-right form-button-group">
            <Button
              className="button-cancel d-inline-flex align-items-center justify-content-center"
              onClick={onHide}
            >
              <Image src={IconReject} alt="Không" className="ic-status" />
              {t('CancelSearch')}
            </Button>
            <Button
              className="button-approve d-inline-flex align-items-center justify-content-center"
              onClick={this.handleAccept}
            >
              <Image src={IconCheck} alt="Đồng ý" className="ic-status" />
              {t('accept')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default withTranslation()(ProposalModal);
