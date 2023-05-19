import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
  getMuleSoftHeaderConfigurations,
  getRequestConfigurations,
} from 'commons/Utils';
import { withTranslation } from 'react-i18next';
import { Modal, Button, Image, Spinner } from 'react-bootstrap';

import IconReject from '../../../../assets/img/icon/Icon_Cancel.svg';
import IconCheck from '../../../../assets/img/icon/Icon_Check_White.svg';
import IconSearchWhite from '../../../../assets/img/icon/Icon_Loop.svg';
import IconSearch from '../../../../assets/img/icon/ic_search.svg';
import debounce from 'lodash/debounce';
import Constants from 'commons/Constants';
import _ from 'lodash';

const ORG_KEY = [
    'pnl',
    'block',
    'region',
    'unit',
    'department',
    'crew',
    'team',
    'group',
  ],
  ORG_DATA = {
    pnls: [],
    blocks: [],
    regions: [],
    units: [],
    departments: [],
    crews: [],
    teams: [],
    groups: [],
  },
  companyCode = localStorage.getItem('companyCode');

class ProposalModal extends React.Component {
  constructor(props) {
    super();
    this.state = {
      orgsOrigin: { ...ORG_DATA },
      org: { ...ORG_DATA },
      data: {},
      errors: {},
      titles: [],
      currentPnl: '',
      proposalSearch: '',
      proposalLoading: false,
    };
    this.debounceProposalSearch = debounce(
      this.debounceProposalSearch.bind(this),
      800
    );
  }

  fetchData = async () => {
    const config = getMuleSoftHeaderConfigurations();
    let orgsOrigin = {};

    const res = await axios.get(
      `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/levels?page_no=1&page_size=10000&parent_id=45000000&level=2`,
      config
    );
    const {
      data: { data },
    } = res;

    orgsOrigin.pnls = data.map((val) => ({
      label: val.organization_name,
      value: val.organization_lv2,
    }));

    this.setState({
      orgsOrigin: Object.assign(this.state.orgsOrigin, orgsOrigin),
      org: Object.assign(this.state.org, { pnls: orgsOrigin.pnls }),
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevStates) {
    const { modal } = this.props,
      {
        proposedPositionCode,
        ProposedDepartmentCode,
      } = modal.data || {},
      { currentPnl, orgsOrigin } = this.state;

    if (prevStates.currentPnl !== currentPnl) this.fetchOrg();
    if (!!ProposedDepartmentCode && modal !== prevProps.modal) {
      const orgIds = ProposedDepartmentCode.split('\\'),
        pnl = orgsOrigin.pnls.filter(
          (ele) => ele.value === orgIds[0]
        )[0];
      if (!!orgIds[0]) {
        this.setState(
          {
            data: {
              ...this.state.data,
              pnl,
            },            
            currentPnl: pnl?.value,
          },
          () => this.fetchOrg(orgIds)
        );
      }
    }
  }

  fetchOrg = async (orgIds) => {
    let config = getMuleSoftHeaderConfigurations(),
      { data, org } = this.state,
      orgsOrigin = { ...ORG_DATA, pnls: this.state.orgsOrigin.pnls };

    if (!!data?.pnl?.value) {
      const res = await axios.get(
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/organization/structure/descendants?page_no=1&page_size=200&level=2&ancestor_id=${data?.pnl?.value}`,
        config
      );
      if (res?.data && res?.data?.result?.code === Constants.API_SUCCESS_CODE) {
        const dataOrg = res?.data?.data,
          orgLevels = {
            3: 'blocks',
            4: 'regions',
            5: 'units',
            6: 'departments',
            7: 'crews',
            8: 'teams',
            9: 'groups',
          };

        dataOrg.forEach((ele) => {
          if ([3, 4, 5, 6, 7, 8, 9].includes(ele.level)) {
            orgsOrigin[orgLevels[ele.level]] = orgsOrigin[
              orgLevels[ele.level]
            ].concat([
              {
                label: ele.name,
                value: ele[`organization_lv${ele.level}`],
                parentId: ele?.[`organization_lv${ele.level - 1}`] || '',
              },
            ]);
          }
        });

        if (!!orgIds) {
          // parse value from detail to modal
          for (let i = 1; i < orgIds.length; i++) {
            org[`${ORG_KEY[i]}s`] = orgsOrigin[`${ORG_KEY[i]}s`].filter(
              (ele) => ele.parentId === data[ORG_KEY[i - 1]].value
            );
            data[ORG_KEY[i]] = org[`${ORG_KEY[i]}s`].filter(
              (ele) => ele.value === orgIds[i]
            )[0];
          }
          // get data and search in here
          this.handleSearch()
        }

        this.setState({
          data,
          orgsOrigin,
          org: Object.assign(org, { blocks: orgsOrigin.blocks }),
        });
      }
    }
  };

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
    const { data, orgsOrigin, org } = this.state;
    let index = 0;

    data[key] = !!e ? e : null;
    if (!['remove-value', 'clear'].includes(action)) {
      if (ORG_KEY.slice(1, ORG_KEY.length - 1).includes(key)) {
        var indexKey = ORG_KEY.indexOf(key),
          childKey = ORG_KEY[indexKey + 1];
        org[`${childKey}s`] = orgsOrigin[`${childKey}s`].filter(
          (ele) => ele.parentId === data[key]?.value
        );
      }
    }

    if (ORG_KEY.includes(key)) {
      for (let i = ORG_KEY.length - 1; i >= 0; i--) {
        if (ORG_KEY[i] === key) index = i;
        if (index < i) data[ORG_KEY[i]] = null;
      }
    }

    this.setState(
      // { data, org, titles: [], currentPnl: key === 'pnl' },
      { data, org, currentPnl: key === 'pnl' ? data?.pnl?.value : '' },
      this.validateSearch
    );
  };

  validateSearch = () => {
    const { t } = this.props,
      { data, titles } = this.state;
    let required = ['pnl', 'proposal'],
      errors = {};

    required.forEach((ele) => {
      if (_.isEmpty(data[ele])) errors[ele] = t('Selectvalue');
    });
    if (titles.length <= 0) delete errors.proposal;
    this.setState({ errors });

    return Object.keys(errors).length > 0;
  };

  handleSearch = async () => {
    const config = getMuleSoftHeaderConfigurations(),
      { modal } = this.props,
      { proposedPositionCode } = modal.data;
    let { data } = this.state;
    config.headers.api_key = 'HrMsdkLSIF3L8sAb';

    if (_.isEmpty(data.pnl)) return;
    // handle call api get data set to titles

    const res = await axios.get(
        // `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/jobname?pnl_code=${companyCode}`,
        `${process.env.REACT_APP_MULE_HOST}api/sap/hcm/v2/ws/masterdata/jobname?pnl_code=V040`,
        config
      ),
      resData = res?.data?.data, titles = resData.map((ele) => ({
        label: ele?.job_name,
        value: ele?.job_id?.toString(),
      }));

    if (!!resData) {
      if (!!proposedPositionCode) {
        data.proposal = titles.filter(
          (ele) => ele.value === proposedPositionCode
        )?.[0];
      }

      this.setState({
        titles,
        data
      });
    }
  };

  handleProposalSearch = (ev) => {
    const proposalSearch = ev?.target?.value;
    this.setState({ proposalSearch }, () =>
      this.debounceProposalSearch(proposalSearch)
    );
  };

  debounceProposalSearch = (val) => {
    if (val) {
      const payload = {
        account: val,
        employee_type: 'EMPLOYEE',
        status: Constants.statusUserActiveMulesoft,
      };
      this.setState({ proposalLoading: true });
      axios
        .post(
          `${process.env.REACT_APP_REQUEST_URL}user/employee/search`,
          payload,
          getRequestConfigurations()
        )
        .then((res) => {
          this.setState({ titles: [] });
        })
        .then(() => this.setState({ proposalLoading: false }));
    }
  };

  handleAccept = () => {
    const { onAccept, t } = this.props;
    const { data, errors } = this.state,
      { pnl, block, region, unit, department, crew, team, group, proposal } =
        data,
      proposedDepartment = `${pnl?.label}${!!block ? `\\${block?.label}` : ''}${
        !!region ? `\\${region?.label}` : ''
      }${!!unit ? `\\${unit?.label}` : ''}${
        !!department ? `\\${department?.label}` : ''
      }${!!crew ? `\\${crew?.label}` : ''}${!!team ? `\\${team?.label}` : ''}${
        !!group ? `\\${group?.label}` : ''
      }`,
      ProposedDepartmentCode = `${pnl?.value}${
        !!block ? `\\${block?.value}` : ''
      }${!!region ? `\\${region?.value}` : ''}${
        !!unit ? `\\${unit?.value}` : ''
      }${!!department ? `\\${department?.value}` : ''}${
        !!crew ? `\\${crew?.value}` : ''
      }${!!team ? `\\${team?.value}` : ''}${
        !!group ? `\\${group?.value}` : ''
      }`;
    let errorsTemp = { ...errors };

    if (!proposal) {
      errorsTemp.proposal = t('Selectvalue');
      return this.setState({ errors: errorsTemp });
    }

    onAccept({
      proposedPosition: proposal?.label,
      proposedPositionCode: proposal?.value,
      proposedDepartment,
      ProposedDepartmentCode,
    });
    this.setState({ data: {}, errors: {}, titles: [] });
  };

  handleHideSHow = () => {
    const { onHide } = this.props;
    onHide();
    this.setState({ data: {}, errors: {}, titles: [] });
  };

  renderErrors = (name) => {
    return this.state.errors?.[name] ? (
      <p className="text-danger errors m-0">{this.state.errors[name]}</p>
    ) : null;
  };

  render() {
    const {
      modal: { show },
      t,
    } = this.props;
    const { org, data, titles, proposalSearch, proposalLoading } = this.state,
      { pnls, blocks, regions, units, departments, crews, teams, groups } = org,
      { pnl, block, region, unit, department, crew, team, group, proposal } =
        data;

    return (
      <Modal
        centered
        size="lg"
        show={show}
        onHide={this.handleHideSHow}
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

            {titles.length > 0 ? (
              <div className="row form-group">
                <div className="col-12">
                  <label className="form-label">{t('proposal_title')}</label>
                  <div
                    className="tabControl disabled"
                    dangerouslySetInnerHTML={{
                      __html: `
                    <span class="p-2">
                      ${
                        !!proposal
                          ? `${proposal?.label} <em>(${proposal?.value})</em>`
                          : ''
                      }
                    </span>`,
                    }}
                  />
                  {this.renderErrors('proposal')}

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
                        {proposalLoading ? (
                          <div className="mt-4 d-flex justify-content-center">
                            <Spinner
                              as="span"
                              animation="border"
                              role="status"
                              aria-hidden="true"
                              className="mr-2"
                            />
                          </div>
                        ) : (
                          titles.map((item, i) => (
                            <div
                              key={i}
                              className={`title-item ${
                                proposal?.value === item?.value && 'active'
                              }`}
                              onClick={() =>
                                this.handleChangeSelect(
                                  item,
                                  'proposal',
                                  'none'
                                )
                              }
                            >
                              <div className="label">{item?.label}</div>
                              <div className="value">{item?.value}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row form-group col-12 m-0 p-0">
                <div className="form-control text-center">
                  {t('NodataExport')}
                </div>
              </div>
            )}
          </div>

          {titles.length > 0 && (
            <div className="text-right form-button-group">
              <Button
                className="button-cancel d-inline-flex align-items-center justify-content-center"
                onClick={this.handleHideSHow}
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
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default withTranslation()(ProposalModal);
