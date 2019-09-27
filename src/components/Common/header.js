/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Nav, Navbar, NavDropdown, Form, InputGroup } from 'react-bootstrap';


function Header(props) {
    const { name } = props.user;
    const guard = useGuardStore();
    const userLogOut = () => {
        guard.setLogOut();
        Auth.signOut();
    }

    return (
        <>
            <Navbar expand="lg" className="topbar mb-4 static-top">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Form className="form-inline mr-auto w-100 navbar-search">
                        <InputGroup>
                            <i className="fas fa-sm fa-sm fa-search"></i>
                            <input type="text" className="form-control bg-light border-0" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                        </InputGroup>
                    </Form>
                    <Nav className="mr-auto">
                        <NavDropdown
                            className="mr-auto dropdown-menu-right animated--grow-in"
                            title={
                                <>
                                    <span className="mr-2 text-gray-700">{name}</span>
                                    <img className="img-profile rounded-circle" src="https://www.biography.com/.image/t_share/MTIwNjA4NjM0MjAzODMzODY4/to-go-with-oly-2012-prkfeaturefiles.jpg" />
                                </>
                            }>
                            <NavDropdown.Item href="#"><i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i> Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#"><i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i> Settings</NavDropdown.Item>
                            <NavDropdown.Item href="#"><i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i> Activity Log</NavDropdown.Item>
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
