/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Popover} from 'react-bootstrap';
import { Animated } from "react-animated-css";
import MetisMenu from 'react-metismenu';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { Navigation } from '../../modules';
import { useGuardStore } from '../../modules';
import VingroupLogo from '../../assets/img/LogoVingroup.svg';
import 'react-metismenu/dist/react-metismenu-standart.min.css';
import Constants from "../../commons/Constants";
import { removeAccents } from "commons/Utils";

const currentLocale = localStorage.getItem("locale")

class RouterLink extends React.Component {
    componentWillMount() {
      this.to = this.props.to;
      if (this.to && this.to[0] !== '/') this.to = `/${this.to}`;
      this.props.history.listen(this.onLocationChange.bind(this));
      this.onLocationChange(this.props.location);
    }
  
    onLocationChange(e) {
      const url = new URL(this.props.to, window.location.origin),
        pathname = e.pathname.indexOf('/', 1) > 0 ? e.pathname.substring(0, e.pathname.indexOf('/', 1)) : e.pathname,
        currentPath = url.pathname.indexOf('/', 1) > 0 ? url.pathname.substring(0, url.pathname.indexOf('/', 1)) : url.pathname;

      if ((pathname || '/') === (currentPath|| '/') && this.to !== '/#') {
        this.props.activateMe();
      }
    }
  
    render() {
      const {
          className,
          classNameActive,
          classNameHasActiveChild,
          active,
          hasActiveChild,
          to,
          label,
          externalLink,
          hasSubMenu,
          toggleSubMenu,
          children,
      } = this.props;
      return (
        hasSubMenu || externalLink
        ? children[0].props.className.indexOf('has-tooltip') > 0 ? (
          <OverlayTrigger
                  key={"td"}
                  placement="right"
                  overlay={ <Popover id="popover-basic" {...this.props}>
                  <Popover.Content>
                    <span style={{color: '#8c2332'}}>{label}</span>
                  </Popover.Content>
                </Popover>}>
            <a
              className={classnames(
                className,
                hasActiveChild && classNameHasActiveChild
              )}
              target={externalLink ? '_blank' : undefined}
              href={to}
              onClick={toggleSubMenu}
            >
              {children}
            </a>
          </OverlayTrigger>
        ) : (
        <a
          className={classnames(
            className,
            hasActiveChild && classNameHasActiveChild
          )}
          target={externalLink ? '_blank' : undefined}
          href={to}
          onClick={toggleSubMenu}
        >
         {children}
        </a>
      )
      : children[0].props.className.indexOf('has-tooltip') > 0 ? (
        <OverlayTrigger
                key={"td"}
                placement="right"
                overlay={ <Popover id="popover-basic" {...this.props}>
                <Popover.Content>
                  <span style={{color: '#8c2332'}}>{label}</span>
                </Popover.Content>
              </Popover>}>
          <Link
          className={classnames(
            className,
            active && classNameActive
          )}
          to={to ? to : ''}
          >
            {children}
          </Link>
        </OverlayTrigger>
      ) : (
        to === "/about-vingroup" ?
        <a
          className={classnames(
            className,
            active && classNameActive
          )}
          target={'_blank'}
          href={"https://vingroup.net/gioi-thieu"}
        >
        {children}
        </a>
        :
        to === "/about-vinfast" ?
        <a
          className={classnames(
            className,
            active && classNameActive
          )}
          target={'_blank'}
          href={`https://vinfastauto.com/${currentLocale === 'vi-VN' ? 'vn_vi' : 'vn_en'}/ve-chung-toi`}
        >
        {children}
        </a>
        :
        <Link
          className={classnames(
            className,
            active && classNameActive
          )}
          to={to ? to : ''}
          >
          {children}
        </Link>
      )
    );
  }
}

function SideBar(props) {
    const guard = useGuardStore();
    const { t } = useTranslation();
    const user = guard.getCurentUser();
    const { companyLogoUrl } = props?.user || {};
    const { show } = props;

    const getNavigation = (role) => {
        const cultureMenu = JSON.parse(localStorage.getItem('cultureMenu') || "[]"),
          culturalNavigation = cultureMenu.filter(ele => ele?.lstCategory?.length > 0).map((ele, i) => ({
            id: Number(`${995}${i+1}`),
            parentId: 995,
            icon: "menu-bullet-lv2 icon-sub-menu-lv2",
            label: currentLocale === 'vi-VN' ? ele.nameVn : ele.nameEn,
            to: `/${removeAccents(ele.nameEn.toLowerCase().replace(/\n|\r/gim, ' ').trim().split(" ").join("-"))}?categoryCode=${ele.categoryCode}`,
            role: "U",
          }));

        let _navigation = [...Navigation];
        _navigation.splice(2, 0, ...culturalNavigation);
        let allNav = _navigation.filter(x => (x.role === 'A' || x.role === 'U' || x.role.includes(role) || x.role.indexOf(user.companyCode) >= 0));
        return getSubNav(allNav, 0);
    }

    const getSubNav = (allNav, parentId) => {
        let rootNav = allNav.filter(x => x.parentId === parentId);
        if (rootNav.length > 0) {
            for (let i = 0; i < rootNav.length; i++) {
                rootNav[i].label = rootNav[i].label;
                if (user.companyCode === "V096" && rootNav[i].label2) {
                    rootNav[i].label = rootNav[i].label2;
                }
                if(user.companyCode === "V073")
                {
                    if(
                        rootNav[i].label === 'Menu_Task')
                        rootNav[i].label = 'Menu_RequestManage'
                    if(rootNav[i].label === 'Registration') 
                    rootNav[i].label = 'Registration_V073'
                }
                rootNav[i].content = getSubNav(allNav, rootNav[i].id);
            }
        }
        if (![Constants.pnlVCode.VinPearl, Constants.pnlVCode.MeliaVinpearl, Constants.pnlVCode.VinHoliday1].includes(user.companyCode)) {
            rootNav = rootNav.filter(x => x.label !== 'Menu_Training')
        }
        if(![
          ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DEXUATLUONG],
          ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.NGHIVIEC],
          ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.DIEUCHUYEN],
          ...Constants.MODULE_COMPANY_AVAILABE[Constants.MODULE.BONHIEM]
        ].includes(user.companyCode)) {
          rootNav = rootNav.filter(x => x.label !== 'CreateProposal')
        }
        if(user.prepare != 'true') {
            rootNav = rootNav.filter(x => x.id != 1006)
        }
        return rootNav;
    }

    const contents = getNavigation(user.employeeLevel).map(c => {
        const contentsChild = c.content.map(contentChild => {
            const contentGrandChildren = contentChild && contentChild.content && contentChild.content.map(cg => ({
                ...cg,
                label: t(cg.label)
            }))
            return ({
            ...contentChild,
            content: contentGrandChildren,
            label: t(contentChild.label)
            })
        })
        
        return {
            ...c,
            content: contentsChild,
            label: t(c.label)
        }
    });
    const isUpdate = (prevProps, nextProps) => true

    const MetisMenuMemo = React.memo(props => {
        return <MetisMenu
                className='sidebar'
                content={contents}
                iconNameStateVisible="arrow_expand"
                iconNameStateHidden="arrow_collapse"
                // iconNamePrefix={"sidebar-menu-icon " + (props.show ? '' : 'has-tooltip ')}
                iconNamePrefix="icon-"
                LinkComponent={withRouter(RouterLink)}
              />
    }, isUpdate);
    return (
        <>
            <div style={{position: 'fixed'}}>
                <div style={{borderColor: localStorage.getItem("companyThemeColor")}} className={show ? 'bg-vp-blue scroll-custom-sidebar' : 'bg-vp-blue scroll-custom-sidebar d-none'}>
                    <Animated animationIn="fadeIn" isVisible={show} >
                        <div className="text-center">
                            <a href="/">
                                <img className='vp-logo' src={companyLogoUrl && companyLogoUrl != 'undefined' ? companyLogoUrl : VingroupLogo} alt='My VinGroup' />
                            </a>
                        </div>
                    </Animated>
                    <MetisMenuMemo show={show}/>
                    {/* <MetisMenu
                        content={contents}
                        activeLinkFromLocation
                        iconNameStateVisible="arrow_expand"
                        iconNameStateHidden="arrow_collapse"
                        iconNamePrefix="icon-"
                        LinkComponent={withRouter(RouterLink)}
                    /> */}
                </div>
            </div>
        </>
    );
}
export default SideBar;