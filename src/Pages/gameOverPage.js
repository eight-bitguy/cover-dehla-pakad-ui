import React from 'react';
import ScoreBoard from "../Components/scoreBoard";
import Url from "../JS/url";
import GoBack from "../Components/back";


const GameOverPage = (props) => {
    return (
        <div className='game-over-container'>
            <div className='game-over'>
                <span className='text'>That's all folks</span>
                <div className='score-board-div'>
                    <ScoreBoard roomCode={props.match.params.roomCode}/>
                </div>
                <GoBack url={Url.LandingPage}/>
            </div>
        </div>
    );
};

export default GameOverPage;
