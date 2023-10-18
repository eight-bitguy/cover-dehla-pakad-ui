import React from 'react';
import connect from 'react-redux/es/connect/connect';
import ClubIcon from "../Icons/clubsIcon";
import HeartIcon from "../Icons/heartsIcon";
import DiamondIcon from "../Icons/diamondIcon";
import SpadeIcon from "../Icons/spadesIcon";


const ScoreBoard = (props) => {
    const {score, dehlaScore} = props;
    
    const renderDehlaTeam = (team) => {
        const renderIcons = [];
        Object.keys(dehlaScore).forEach(key => {
            const cards = dehlaScore[key];
            if (cards.length && key[0] === team) {
                for(let i = 0; i < cards.length; i++) {
                    switch (cards[i]) {
                        case "H":
                            renderIcons.push(<HeartIcon width='10' height='10'/>);
                            break;
                        case "C":
                            renderIcons.push(<ClubIcon width='10' height='10' />);
                            break;
                        case "D":
                            renderIcons.push(<DiamondIcon width='10' height='10' />);
                            break;
                        case "S":
                            renderIcons.push(<SpadeIcon width='10' height='10' />);
                            break;
                        default:
                            renderIcons.push(<div />);
                    }
                }
            }
        });
        return renderIcons;
    }

    return (
        <div className='score-board-container'>
            <div className='scoreboard-table'>
                <div className='header-row' key='A'>
                    <span className='first-text'></span>
                    <span className='text'>Your score</span>
                    <span className='text'>Opponent Score</span>
                </div>
                <div className='below-header-row' key='B'>
                    <span className='first-text'>Dehla count</span>
                    <span className='text'>{renderDehlaTeam('a')}</span>
                    <span className='text'>{renderDehlaTeam('b')}</span>
                </div>
                <div className='below-header-row' key='C'>
                    <span className='first-text'>Non dehla count</span>
                    <span className='text'>{score['a1']+score['a2']}</span>
                    <span className='text'>{score['b1']+score['b2']}</span>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps({additionalInfo}) {
    return {
        score: additionalInfo.score,
        dehlaScore: additionalInfo.dehlaScore
    };
}


export default connect(mapStateToProps)(ScoreBoard);
