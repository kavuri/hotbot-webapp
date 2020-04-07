import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

export default (props) => {
    const handleClick = () => {
        props.onAddClick();
    };

    return (
        <React.Fragment>
            <Tooltip title={"Add"}>
                <IconButton onClick={handleClick}>
                    <AddCircleRoundedIcon />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    );
}
