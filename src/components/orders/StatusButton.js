/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { blue, orange, green, yellow, red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { isEqual, isUndefined, find } from 'lodash';

import { changeOrderStatus } from '../../utils/API';

// We can inject some CSS into the DOM.
var useStyles = makeStyles({
    button: {
        borderRadius: 6,
        border: 'solid 2px',
        color: 'black',
        height: 48,
        padding: '0 30px',
    },
    new: {
        background: orange[200],
        borderColor: orange[700],
    },
    progress: {
        background: yellow['A200'],
        borderColor: orange['A700'],
    },
    done: {
        background: green['A200'],
        borderColor: green[700],
    },
    cant_serve: {
        background: blue[200],
        borderColor: blue[700],
    },
    cancelled: {
        background: red['A200'],
        borderColor: red[700],
    },
});

const statusDispName = {
    'new': 'New Order',
    'progress': 'Progress ',
    'done': 'Completed',
    'cant_serve': 'Cant Serve',
};
const statusArr = [
    { s: 'new', name: 'New Order' },
    { s: 'progress', name: 'Progress ' },
    { s: 'done', name: 'Completed' },
    { s: 'cant_serve', name: 'Cant Serve' },
];

// function StatusButton(props) {
export default function StatusButton(props) {
    const [status, setStatus] = useState(isUndefined(props.status) ? '' : props.status)
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(props.data);
    // console.log('+++data=', data);

    const classes = useStyles();
    const className = clsx(classes.button, classes[status]);
    let dispName = isUndefined(status) ? '' : statusDispName[status];
    // console.log('-----classes[status]', classes[status]);

    const dialogOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [value, setValue] = useState(status);
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleStatusChange = async () => {
        // New status is in 'value'
        console.log('changing status to=', value);
        let order = await changeOrderStatus(data[0], value);
        setStatus(value);
        props.onStatusUpdated(value);
        setOpen(false);
    };

    return (
        <div>
            <Button className={className} onClick={dialogOpen}> {dispName} </ Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Change Status of '{data[2]}' for '{data[3]}'</DialogTitle>
                <DialogContent>
                    <RadioGroup aria-label="status" name="selectedStatus" value={value} onChange={handleChange}  >
                        {statusArr.map((s) => <FormControlLabel value={isUndefined(s) ? '' : s.s} disabled={isEqual(s.s, status)} color='primary' control={<Radio checkedIcon={<CheckCircleRoundedIcon />} />} label={isUndefined(s) ? '' : s.name} />)}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary"> Cancel </Button>
                    <Button onClick={handleStatusChange} color="primary" autoFocus> Confirm </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

StatusButton.propTypes = {
    data: PropTypes.node
};

{/* export default withStyles(styles)(StatusButton); */ }