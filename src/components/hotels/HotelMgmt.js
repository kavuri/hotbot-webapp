/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

import { isEqual } from 'lodash';
import HotelGroups from './HotelGroups';
import Hotels from './Hotels';
import Rooms from './Rooms';

export default (props) => {
    const [hotelGroup, setHotelGroup] = useState('');
    const [hotel, setHotel] = useState('');

    const hotelGroupSelected = (grp) => {
        if (isEqual(hotelGroup, grp)) {
            // Same group has been selected. Ignore and set group =''
            grp = '';
        }
        console.log('HotelMgmt:::group=', grp);
        setHotelGroup(grp);
    }

    const hotelSelected = (htl) => {
        if (isEqual(hotel, htl)) {
            htl = '';
        }
        setHotel(htl);
    }

    return (
        <div>
            <Typography variant="h4">Hotel Groups</Typography>
            <HotelGroups onHotelGroupSelected={hotelGroupSelected} />
            {(hotelGroup != '') && <div><Typography variant="h4">Hotels </Typography>
                <Hotels key={hotelGroup.group_id} group={hotelGroup} onHotelSelected={hotelSelected} /></div>}
            {(hotel != '') && <div><Typography variant="h4">Rooms </Typography>
                <Rooms key={hotel.hotel_id} hotel={hotel} /></div>}
        </div>
    )
}