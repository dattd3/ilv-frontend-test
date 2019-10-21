import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown } from 'react-bootstrap';
import { useTranslation } from "react-i18next";


function Header(props) {
    const { fullName, plEmail, jobTitle, employeeNo, company } = props.user;
    const { setShow } = props;
    const [isShow, SetIsShow] = useState(false);
    const guard = useGuardStore();

    const userLogOut = () => {
        guard.setLogOut();
        Auth.signOut();
    }
    const { t } = useTranslation();

    const handleClickSetShow = () => {
        SetIsShow(!isShow);
        setShow(isShow);
    }

    return (
        <>
            <Navbar expand="lg" className="topbar mb-4 static-top">
                <Button variant="outline-primary" className='d-block d-lg-none' onClick={handleClickSetShow}><i className='fas fa-bars'></i></Button>
                <Form className="form-inline mr-auto navbar-search d-none d-lg-block">
                    <InputGroup className='d-none'>
                        <InputGroup.Prepend>
                            <Button className="bg-light border-0" variant="outline-secondary"><i className="fas fa-sm fa-sm fa-search"></i></Button>
                        </InputGroup.Prepend>
                        <FormControl className="bg-light border-0" placeholder={t("SearchTextPlaceholder")} aria-label="Search" aria-describedby="basic-addon1" />
                    </InputGroup>
                </Form>
                <Dropdown>
                    <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header'>
                        <div className='mr-2 small text-right username'>
                            <div className="text-gray-600">{fullName} ({plEmail})</div>
                            <div className='d-none d-md-block'>
                                <span className='small text-gray-500'>{jobTitle}</span> - <span className='small text-gray-500'>{company}</span>
                            </div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='animated--grow-in'>
                        <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{t("Logout")}</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>
        </>
    );
}

export default Header;
