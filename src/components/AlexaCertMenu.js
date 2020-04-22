/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MobileScreenShareRoundedIcon from '@material-ui/icons/MobileScreenShareRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import { Link } from "react-router-dom";

import { useAuth0 } from "../react-auth0-spa";
import { useKamAppCtx } from './KamAppContext';

export default function ProfileMenu(props) {
    const { logout } = useAuth0();
    const { orders } = useKamAppCtx();

    const handleOrdersOptionClick = () => {
        props.optionSelected('orders');
    }

    const handleCheckinCheckoutMgmtOptionClick = () => {
        props.optionSelected('checkinCheckout');
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

    return (
        <div>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" onClick={handleOrdersOptionClick} />
                <Badge badgeContent={orders.openOrderCount} color="error"></Badge>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <PeopleAltRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Checkin-Checkout" onClick={handleCheckinCheckoutMgmtOptionClick} />
            </ListItem>
            <ListItem component={Link} to="/profile" button>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" onClick={handleProfileOptionClick} />
            </ListItem>
            <ListSubheader inset>Hotel Settings</ListSubheader>
            <ListItem button>
                <ListItemIcon>
                    <MobileScreenShareRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Device Management" onClick={handleDeviceMgmtOptionClick} />
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