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
import { isUndefined, isEmpty } from 'lodash';
import HotelGroups from './HotelGroups';

export default (props) => {
    return (
        <HotelGroups />
    )
}