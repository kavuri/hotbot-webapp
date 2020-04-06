/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';

export default function ConsumerMenu(props) {

    const handleOrdersOptionClick = () => {
        props.optionSelected('orders');
    }

    const handleCheckinCheckoutMgmtOptionClick = () => {
        props.optionSelected('checkinCheckout');
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
                    {/* //FIXME: Get the actual order count in the badge */}
                    <Badge badgeContent={4} color="error"> <ShoppingCartIcon /></Badge>
                </ListItemIcon>
                <ListItemText primary="Orders" onClick={handleOrdersOptionClick} />
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
        </div>
    )
}