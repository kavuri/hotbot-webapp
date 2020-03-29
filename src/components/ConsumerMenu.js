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
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import MobileScreenShareIcon from '@material-ui/icons/MobileScreenShare';

export default function ConsumerMenu(props) {

    const handleOrdersOptionClick = () => {
        props.optionSelected('orders');
    }

    const handleSettingsOptionClick = () => {
        props.optionSelected('settings');
    }

    const handleDeviceMgmtOptionClick = () => {
        props.optionSelected('deviceMgmt');
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
                <ListItemText primary="Orders" onClick={handleOrdersOptionClick}/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" onClick={handleSettingsOptionClick}/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <MobileScreenShareIcon />
                </ListItemIcon>
                <ListItemText primary="Device Management" onClick={handleDeviceMgmtOptionClick}/>
            </ListItem>
        </div>
    )
}