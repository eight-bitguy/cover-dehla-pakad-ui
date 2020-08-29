import React from 'react';
import {getPlayerNameFromPosition, getPositionCardMapping, mapCardToImage} from "../JS/helper";
import TrumpIcon from "../IMAGES/trumpIcon";
import ClaimIcon from "../IMAGES/claimIcon";
import connect from 'react-redux/es/connect/connect';

const CardWrapper = (props) => {
    const {
        cards: {
            stake
        },
        additionalInfo: {
            nextChance, claimingBy, trumpDecidedBy
        },
        displayIndex
    } = JSON.parse(JSON.stringify(props));

    if (!stake.length || !nextChance) {
        return <div/>
    }

    const mapping = getPositionCardMapping(stake, nextChance);
    const card=mapping[displayIndex].card, position=mapping[displayIndex].position;

    if (!position && !card) {
        return <div />;
    }

    return (
        <div className={`player-card-div ${nextChance === position ? '-next-chance' : ''}`}>
            <div className='player-name'>{getPlayerNameFromPosition(position)}</div>
            <div className='card-div'>
                {card && <img className='card' src={require(`./../IMAGES/${mapCardToImage(card)}`)} />}
            </div>
            <div className='icon-row'>
                <div className={`trump ${trumpDecidedBy === position ? '-my-trump' : ''}`}>
                    <TrumpIcon />
                </div>
                <div className={`trump ${claimingBy === position ? '-claiming' : ''}`}>
                    <ClaimIcon />
                </div>
            </div>
        </div>
    );
};

function mapStateToProps({additionalInfo, cards, roomUsers}) {
    return {
        additionalInfo,
        cards,
        roomUsers
    };
}

export default connect(mapStateToProps)(CardWrapper);
