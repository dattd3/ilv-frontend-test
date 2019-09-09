import React, { Component, Item, useState, useEffect } from "react";
import Amplify, { Auth, Hub } from 'aws-amplify';
import _ from 'lodash';
import { useNavigate } from "./hooks";
import { useGuardStore } from "../../modules";
import axios from "axios";

Auth.currentAuthenticatedUser()
    .then(currentAuthUser => {
        console.log('Redirect.validateUserSession():Auth.currentAuthenticatedUser() currentAuthUser:', currentAuthUser);
        Auth.userSession(currentAuthUser)
            .then(session => {
                console.log('Redirect.validateUserSession():Auth.userSession() session:', session);
                if (session.isValid()) {
                    console.log('user session is valid!');
                    const config = {
                        method: 'get',
                        url: 'http://localhost:5000/api/values',
                        headers: { 'Authorization': 'Bearer ' + session.idToken.jwtToken }
                    }
                    axios(config).then(response => {
                        alert(response.data);
                        return authorize(response.data);
                    });

                } else {
                    const errorMessage = 'user session invalid. auth required';
                    console.log(errorMessage);
                    window.location.assign('/login', { signInFailure: true, errorMessage, authenticated: false });
                }
            })
            .catch(err => {
                const errorMessage = JSON.stringify(err);
                console.error('Redirect.validateUserSession():Auth.userSession() err:', err);
                window.location.assign('/login', { signInFailure: true, errorMessage, authenticated: false });
            });
    })
    .catch(err => {
        const errorMessage = JSON.stringify(err);
        console.log(errorMessage);
        console.error('Redirect.validateUserSession():Auth.currentAuthenticatedUser() err:', err);
        //window.location.assign('/login', { signInFailure: true, errorMessage, authenticated: false });
    });



function authorize(){
 
    return (
        <>
             
        </>
    );
} 
export default authorize;