/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Link } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import { useKamAppCtx } from './KamAppContext';

export default function ConsumerMenu(props) {
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

    return (
        <div>
            <ListItem button>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" onClick={handleOrdersOptionClick} />
                <Badge badgeContent={orders.openOrderCount} color="error"></Badge>
            </ListItem>
            {/* <ListItem button>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" onClick={handleSettingsOptionClick} />
            </ListItem> */}
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
            <ListItem button onClick={() => logout()}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" onClick={handleLogoutOptionClick} />
            </ListItem>
        </div>
    )
}