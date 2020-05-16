/* Copyright (C) Kamamishu Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DeviceMgmtSteps, GuestCheckinSteps } from "./StepsData";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper
    },
    card: {
        maxWidth: 800
    },
    media: {
        height: 400, // as an example I am modifying width and height
        width: "100%",
        marginLeft: "3%"
    }
}));

const HelpCard = props => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardHeader title={props.title} />
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={props.img}
                    title={props.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {props.step}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

const HelpCardGrid = props => {
    const classes = useStyles();
    const [idx, setIdx] = React.useState(0);

    const handleMoveLeft = () => {
        let index = idx;
        if (index !== 0) {
            index--;
        }
        setIdx(index);
    };

    const handleMoveRight = () => {
        let index = idx;
        if (index !== props.items.length - 1) {
            index++;
        }
        setIdx(index);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <HelpCard
                        img={props.items[idx].img}
                        title={props.items[idx].title}
                        step={props.items[idx].step}
                        description={props.items[idx].description}
                    />
                </Grid>
                <Grid item xs={12} />
                <IconButton
                    aria-label="prev"
                    onClick={handleMoveLeft}
                    disabled={idx === 0}
                >
                    <ChevronLeftIcon />
                </IconButton>

                <IconButton
                    aria-label="next"
                    onClick={handleMoveRight}
                    disabled={idx === props.items.length - 1}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Grid>
        </div>
    );
};

export default function Help() {
    return (
        <div>
            <HelpCardGrid items={DeviceMgmtSteps} />
            <Divider variant="middle" />
            <HelpCardGrid items={GuestCheckinSteps} />
        </div>
    );
}

