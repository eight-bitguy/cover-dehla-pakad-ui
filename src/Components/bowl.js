import React from 'react';
import connect from 'react-redux/es/connect/connect';
import ClubIcon from "../Icons/clubsIcon";
import HeartIcon from "../Icons/heartsIcon";
import DiamondIcon from "../Icons/diamondIcon";
import SpadeIcon from "../Icons/spadesIcon";

const Bowl = (props) => {

    const getIcon = () => {
        if (!props.trump) {
            return <div/>;
        }
        switch (props.trump[1]) {
            case "H":
                return <HeartIcon/>;
            case "C":
                return <ClubIcon/>;
            case "D":
                return <DiamondIcon/>;
            case "S":
                return <SpadeIcon/>;
            default:
                return <div />;
        }
    };

    return (
        <div className='bowl'>
            <div className='icon'>
                {getIcon()}
            </div>
        </div>
    );
};

function mapStateToProps({additionalInfo}) {
    return {
        trump: additionalInfo.trump
    };
}

export default connect(mapStateToProps)(Bowl);
