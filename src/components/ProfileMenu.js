/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

export default function ProfileMenu(props) {
    const { logout } = useAuth0();

    const handleProfileOptionClick = () => {
        props.optionSelected('profile');
    }

    const handleLogoutOptionClick = () => {
        props.optionSelected('logout');
    }
    
    return (
        <div>
            <ListSubheader inset>My Details</ListSubheader>
            <ListItem component={Link} to="/profile" button>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" onClick={handleProfileOptionClick} />
            </ListItem>

            <ListItem button onClick={() => logout()}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" onClick={handleLogoutOptionClick} />
            </ListItem>
        </div>
    )
}