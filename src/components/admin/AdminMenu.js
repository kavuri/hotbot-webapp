/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function AdminMenu(props) {
    const handleGroupsOptionClick = () => {
        props.optionSelected('groups');
    }

    const handleHotelsOptionClick = () => {
        props.optionSelected('hotels');
    }

    const handleFacilitiesOptionClick = () => {
        props.optionSelected('facilities');
    }

    return (
        <div>
            <ListItem button>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Groups" onClick={handleGroupsOptionClick} />
            </ListItem>

            <ListItem button>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Hotels" onClick={handleHotelsOptionClick} />
            </ListItem>

            <ListItem button>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Facilities" onClick={handleFacilitiesOptionClick} />
            </ListItem>
        </div>
    )
}