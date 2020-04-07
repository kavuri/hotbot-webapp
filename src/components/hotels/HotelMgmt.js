/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import ChevronRightRoundedIcon from "@material-ui/icons/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@material-ui/icons/ChevronLeftRounded";
import IconButton from "@material-ui/core/IconButton";
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { isUndefined, isNull } from 'lodash';
import HotelGroups from './HotelGroups';
import Hotels from './Hotels';
import { Divider } from '@material-ui/core';

export default (props) => {
    const [hotelGroup, setHotelGroup] = useState({ group_id: '' });
    const [hotel, setHotel] = useState({ hotel_id: '' });

    const hotelGroupSelected = (grp) => {
        console.log('HotelMgmt:::group=', grp);
        setHotelGroup(grp);
    }

    return (
        <div>
            <Typography variant="h4">Hotel Groups</Typography>
            <HotelGroups onHotelGroupSelected={hotelGroupSelected} />
            <Typography variant="h4">Hotels </Typography>
            <Hotels key={hotelGroup.group_id} group={hotelGroup} />
        </div>
    )
}