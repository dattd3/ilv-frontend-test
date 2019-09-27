/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
    useState
} from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Nav, NavItem, Navbar, NavDropdown } from 'react-bootstrap';


function Header(props) {
    const { name } = props.user;
    const [isShowUserMenu, setIsShowUserMenu] = useState(false);
    const [isShowNotification, setIsShowNotification] = useState(false);
    const [isShowNavigation, setIsShowNavigation] = useState(false);

    const guard = useGuardStore();
    const userLogOut = () => {
        guard.setLogOut();
        Auth.signOut();
    }

    return (
        <>
           
            <Navbar bg="light" expand="lg" className="navbar-expand bg-white topbar mb-4 static-top shadow">
                <Navbar.Brand href="#home">
                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={() => setIsShowNavigation(!isShowNavigation)} >
                        <i className="fa fa-bars"></i>
                    </button>
                    <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="">
                        <Nav.Link href="#home">
                            <i className="fas fa-bell fa-fw"></i>
                            <span className="badge badge-danger badge-counter">3+</span>
                        </Nav.Link>
                        <div className="topbar-divider d-none d-sm-block"></div>
                        <NavDropdown
                            className="mr-auto float-right"
                            title={
                                <>
                                    <span className="mr-2 text-gray-700">{name}</span>
                                    <img className="img-profile rounded-circle" src="https://www.biography.com/.image/t_share/MTIwNjA4NjM0MjAzODMzODY4/to-go-with-oly-2012-prkfeaturefiles.jpg" />
                                </>
                            }>
                            <NavDropdown.Item href="#action/3.1"><i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i> Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2"><i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i> Settings</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3"><i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i> Activity Log</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i> Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default Header;
