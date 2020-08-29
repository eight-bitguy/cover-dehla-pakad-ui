import React from 'react';
import connect from 'react-redux/es/connect/connect';
import ClubIcon from "../IMAGES/clubsIcon";
import HeartIcon from "../IMAGES/heartsIcon";
import DiamondIcon from "../IMAGES/diamondIcon";
import SpadeIcon from "../IMAGES/spadesIcon";

const Bowl = (props) => {

    const getIcon = () => {
        const {trump} = props.additionalInfo;
        if (!trump) {
            return <div/>;
        }

        switch (trump) {
            case "H":
                return <HeartIcon/>;
            case "C":
                return <ClubIcon/>;
            case "D":
                return <DiamondIcon/>;
            case "S":
                return <SpadeIcon/>
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
        additionalInfo
    };
}

export default connect(mapStateToProps)(Bowl);
