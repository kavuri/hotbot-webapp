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
import SettingsApplicationsRoundedIcon from '@material-ui/icons/SettingsApplicationsRounded';
import MobileScreenShareRoundedIcon from '@material-ui/icons/MobileScreenShareRounded';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';

import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

export default function ProfileMenu(props) {
    const { logout } = useAuth0();

    const handleSettingsOptionClick = () => {
        props.optionSelected('settings');
    }

    const handleProfileOptionClick = () => {
        props.optionSelected('profile');
    }

    const handleLogoutOptionClick = () => {
        props.optionSelected('logout');
    }

    const handleDeviceMgmtOptionClick = () => {
        props.optionSelected('deviceMgmt');
    }

    const handleHotelsOptionClick = () => {
        props.optionSelected('hotels');
    }

    return (
        <div>
            <ListSubheader inset>Hotel Settings</ListSubheader>
            <ListItem button>
                <ListItemIcon>
                    <SettingsApplicationsRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" onClick={handleSettingsOptionClick} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <MobileScreenShareRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Device Management" onClick={handleDeviceMgmtOptionClick} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <HomeWorkRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Hotels" onClick={handleHotelsOptionClick} />
            </ListItem>
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