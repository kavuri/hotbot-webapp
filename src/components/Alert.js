/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import { red, green } from '@material-ui/core/colors';
import clsx from 'clsx';
import { isEqual } from 'lodash';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

const color = {
    error: 'red',
    success: 'green'
};

export default (props) => {
    const [state, setState] = useState({
        open: props.open,
        message: props.message,
        severity: props.severity
    });

    const handleClose = () => {
        setState({ message: '', open: false, severity: '' });
    };

    const classes = useStyles();
    let className = clsx(classes.root, state.severity);
    console.log('+++STATE=', state, className);
    return (
        <div className={classes.root}>
            <Snackbar autoHideDuration={4000} severity={state.severity} open={state.open} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={new Date().getTime()} >
                <SnackbarContent style={{backgroundColor: color[state.severity]}} message={state.message} />
            </Snackbar>
        </div>
    )
}