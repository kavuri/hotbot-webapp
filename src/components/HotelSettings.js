/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useContext } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SettingsApplicationsRoundedIcon from '@material-ui/icons/SettingsApplicationsRounded';
import MobileScreenShareRoundedIcon from '@material-ui/icons/MobileScreenShareRounded';
import HomeWorkRoundedIcon from '@material-ui/icons/HomeWorkRounded';

import { useSnackbar } from 'notistack';

import Selector from './Selector';
import { APICall } from '../utils/API';
import { KamAppContext } from './KamAppContext';

export default function ProfileMenu(props) {
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = React.useState([]);

    React.useEffect(() => {
        loadHotels();
    }, []);

    const { enqueueSnackbar } = useSnackbar();
    const ctx = useContext(KamAppContext);

    const handleSettingsOptionClick = () => {
        props.optionSelected('settings');
    }

    const handleDeviceMgmtOptionClick = () => {
        props.optionSelected('deviceMgmt');
    }

    const handleHotelsOptionClick = () => {
        props.optionSelected('hotels');
    }

    const loadHotels = async () => {
        if (!loading) {
            setLoading(true);
            let results = undefined, res;
            try {
                results = await APICall('/hotel', { method: 'GET' });
                setLoading(false);
                res = results.data.map((h) => { return { name: h.name, id: h.hotel_id, _id: h._id } });
            } catch (error) {
                enqueueSnackbar('Error getting hotels', { variant: 'error' });
            }
            setHotels(res);
        }
    }

    const handleHotelSelection = (hotel) => {
        console.log('hotel=', hotel, ',context=', ctx);
        ctx.setHotel(hotel);
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
            <Selector menuName="Hotels" items={hotels} onSelectEntry={(value) => handleHotelSelection(value)} />
        </div>
    )
}