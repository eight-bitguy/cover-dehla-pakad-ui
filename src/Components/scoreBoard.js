import React, {useEffect, useState} from 'react';
import connect from 'react-redux/es/connect/connect';
import {getScores} from "../Api/room";

const ScoreBoard = (props) => {
    const {roomCode} = props;
    const [scores, setScores] = useState({});

    useEffect(() => {
        (async () => {
            const response = await getScores(roomCode);
            setScores(response);
        })()
    }, []);

    const getRow = (position) => {
        const score = scores[position];
        return (
            <div className='row' key={position}>
                <span className='name'>{score.name}</span>
                <span className='score'>{score.score}</span>
            </div>
        );
    };

    return (
        <div className='score-board-container'>
            <div>
                {Object.keys(scores).length > 0 && Object.keys(scores).map(getRow)}
            </div>
        </div>
    );
};

export default connect()(ScoreBoard);
