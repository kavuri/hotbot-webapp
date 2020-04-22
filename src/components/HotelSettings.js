/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SettingsApplicationsRoundedIcon from '@material-ui/icons/SettingsApplicationsRounded';
import MobileScreenShareRoundedIcon from '@material-ui/icons/MobileScreenShareRounded';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';

export default function ProfileMenu(props) {
    const handleSettingsOptionClick = () => {
        props.optionSelected('settings');
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
            {/* <Selector menuName="Hotels" items={hotels} onSelectEntry={(value) => setHotel(value)} /> */}
        </div>
    )
}