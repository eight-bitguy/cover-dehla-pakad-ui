import React from 'react';
import connect from 'react-redux/es/connect/connect';
import ScoreBoard from "./scoreBoard";
import Url from "../JS/url";
import MyButton from "./myButton";
import {replace} from "connected-react-router";


const Stats = (props) => {

    const goBack = () => {
        props.dispatch(replace(Url.GamePage(window.getRoomCode())));
    };

    const getScore = () => {
        const {roomUsers, score} = props;
        const scores = {};
        Object.keys(score).forEach(position => {
            const name = roomUsers.find(roomUser => roomUser.position === position).name;
            scores[position] = {
                name,
                score: score[position]
            }
        });
        return scores;
    };

    return (
        <div className='stats-container'>
            <div className='stats'>
                <ScoreBoard initialScores={getScore()}/>
            </div>
            <MyButton
                label='Back'
                onClick={goBack}
            />
        </div>
    );
};

function mapStateToProps({roomUsers, additionalInfo: {score}}) {
    return {
        score,
        roomUsers
    };
}

export default connect(mapStateToProps)(Stats);
