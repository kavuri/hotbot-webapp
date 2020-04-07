import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarStyles = {
    iconButton: {}
};

export default (props) => {
    const { classes } = props;
    const handleClick = () => {
        props.onAddClick();
        console.log("clicked on icon!");
    };

    return (
        <React.Fragment>
            <Tooltip title={"custom icon"}>
                <IconButton onClick={handleClick}>
                    <AddIcon />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
