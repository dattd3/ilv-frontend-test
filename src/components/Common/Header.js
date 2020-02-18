import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { useGuardStore } from '../../modules';
import { Navbar, Form, InputGroup, Button, FormControl, Dropdown, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import NotifyItem from "../../containers/Notify/NotifyItem";
import { useApi, useFetcher } from "../../modules";

const usePreload = (params) => {
    const api = useApi();
    const [data = [], err] = useFetcher({
        api: api.fetchNotifyList,
        autoRun: true,
        params: params
    });
    return data;
};

function Header(props) {

    const { fullName, email, avatar } = props.user;
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
    return (
        isApp ? null :
            <div>
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
                        <div className='mr-2 mt-3 small text-right username'> 

                            <Dropdown.Toggle variant="light" className='text-right dropdown-menu-right user-infor-header user-info-margin'>
                                <span className="text-gray-600"> {fullName}</span>
                                <img className="ml-2 img-profile rounded-circle" src={(avatar != null && avatar !== '' && avatar !== 'null') ? `data:image/png;base64, ${avatar}` : '/no-img.png'} alt={fullName} />
                            </Dropdown.Toggle>
                        </div>
                        <Dropdown.Menu className='animated--grow-in'>
                            <Dropdown.Item onClick={userLogOut}><i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>{t("Logout")}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
            </div>
    );
}

export default Header;
