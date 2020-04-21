/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { isEmpty, isUndefined, } from 'lodash';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default (props) => {
    // console.log('Selector props=', props);
    const classes = useStyles();
    const [entry, setEntry] = useState('');
    const [defaultEntry, setDefaultEntry] = useState(props.defaultEntry);
    const [menuName, setMenuName] = useState(props.menuName);
    const [items, setItems] = useState(props.items);

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);

    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        setItems(props.items);
        setDefaultEntry(props.defaultEntry);
    }, [props.items, props.entry, props.defaultEntry]);

    const handleChange = event => {
        console.log('new event=', event.target)
        setEntry(event.target.value);
        if (!isEmpty(props.onSelectEntry) || !isUndefined(props.onSelectEntry)) {
            props.onSelectEntry(event.target.value);
        }
    };

    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    {menuName}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={entry}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {items.map((h) => <MenuItem key={h.id} value={h}>{h.name}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    );
}
