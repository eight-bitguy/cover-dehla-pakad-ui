import React from 'react';
import {getPlayerNameFromPosition, getPositionCardMapping, mapCardToImage} from "../JS/helper";
import TrumpIcon from "../Icons/trumpIcon";
import ClaimIcon from "../Icons/claimIcon";
import connect from 'react-redux/es/connect/connect';

const CardWrapper = (props) => {
    let card, position;
    const {
        cards: {
            stake
        },
        additionalInfo: {
            nextChance, claimingBy, trumpDecidedBy
        },
        displayIndex
    } = JSON.parse(JSON.stringify(props));

    const mapping = getPositionCardMapping(stake, nextChance);

    if (Object.keys(mapping).length) {
        card=mapping[displayIndex].card;
        position=mapping[displayIndex].position;
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
