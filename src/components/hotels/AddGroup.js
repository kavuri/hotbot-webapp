/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
'use strict';

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { addHotelGroup } from '../../utils/API';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [group, setGroup] = useState({
        name: '',
        description: ''
    });

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddGroup = async () => {
        console.log('adding group=', group);
        let hotelGroup = await addHotelGroup(group);
        props.onGroupAdded(hotelGroup);
        setOpen(false);
    }

    const setName = (event) => {
        setGroup({ ...group, name: event.target.value });
    }

    const setDescription = (event) => {
        setGroup({ ...group, description: event.target.value });
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Hotel Group</DialogTitle>
            <DialogContent>
                <FormControl className={classes.root} noValidate autoComplete="off">
                    <TextField required id="group-name" label="Outlined" label="Group Name" variant="outlined" onChange={setName} />
                    <TextareaAutosize aria-label="minimum height" rowsMin={4} placeholder="Hotel group description" onChange={setDescription} />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary"> Cancel </Button>
                <Button onClick={handleAddGroup} color="primary"> Add </Button>
            </DialogActions>
        </Dialog>
    );
}