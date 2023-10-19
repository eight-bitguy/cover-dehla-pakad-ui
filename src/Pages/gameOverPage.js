import React from 'react';
import ScoreBoard from "../Components/scoreBoard";
import Url from "../JS/url";
import GoBack from "../Components/back";


const GameOverPage = (props) => {
    return (
        <div className='game-over-container'>
            <div className='game-over'>
                <span className='text-large'>That's all folks</span>
                <ScoreBoard roomCode={props.match.params.roomCode}/>
                <div className='game-over-go-back'>
                    <GoBack url={Url.LandingPage}/>
                </div>
            </div>
        </div>
    );
};

export default GameOverPage;
