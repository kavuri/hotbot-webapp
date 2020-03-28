import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { API_SERVER_URL } from '../Config';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default () => {
    const classes = useStyles();
    const [hotel, setHotel] = React.useState('');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const loadData = () => {
        if (!loading) {
            setLoading(true);
            // fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': 'Bearer ' + token.access_token } })
            fetch(API_SERVER_URL + '/hotel', { method: 'GET', headers: { 'Content-Type': 'application/json' } })
                .then(res => res.json())
                .then((results) => {
                    let allItems = results.map((h) => { return { 'name': h.name, '_id': h._id } });
                    console.log('All hotels=', allItems);
                    setItems(allItems);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    };

    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
        loadData();
    }, []);

    const handleChange = event => {
        setHotel(event.target.value);
    };

    return (
        <div>

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    Hotels
        </InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={hotel}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {items.map((h) => <MenuItem key={h._id} value={h._id}>{h.name}</MenuItem>)}
                </Select>
            </FormControl>

        </div>
    );
}
