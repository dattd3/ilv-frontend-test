import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function Header(props) {
    const { fullName, plEmail, jobTitle, employeeNo, company, department, location } = props.user;
    const { setShow, isApp } = props;
    const [isShow, SetIsShow] = useState(false);
    const guard = useGuardStore();

    const userLogOut = () => {
        guard.setLogOut();
        try {
            Auth.signOut({ global: true });
        } catch  {
            
        }
    }

    const { t } = useTranslation();

    const handleClickSetShow = () => {

        SetIsShow(!isShow);
        setShow(isShow);
    }

    const openTopNotification = () => {
        alert('nguyen duc chien');
    }
    return (
        isApp ? null :
        <Navbar expand="lg" className="navigation-top-bar-custom">
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
                    <div className='mr-2 small text-right username'>   
                             <span onClick= { openTopNotification } >
                                <i className="notification-custom far fa-bell"></i>
                                <span className="badge-notification mt-5" data-badge="4"></span> &nbsp; | &nbsp;                                
                             </span>                                              
                                
                            <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header'>  
                                 <span className="text-gray-600"> {fullName} [<span className="strong">{employeeNo}</span>] &nbsp;                                                                 
                                   <i className="avatar-custom fa fa-user-circle"></i>    
                                </span>
                            </Dropdown.Toggle>                     
                    </div>
                <Dropdown.Menu className='animated--grow-in'>
                    <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{t("Logout")}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
}

export default Header;
