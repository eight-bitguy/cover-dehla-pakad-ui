import React from 'react';
import {getPlayerNameFromPosition, getPositionCardMapping, rankMap} from "../JS/helper";
import TrumpIcon from "../Icons/trumpIcon";
import ClaimIcon from "../Icons/claimIcon";
import connect from 'react-redux/es/connect/connect';
import {updateFlashCard} from "../Redux/modules/uiParams";
import { push } from 'connected-react-router'
import Room from "../Models/room";
import Url from "../JS/url";

const rank = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'T': '10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
};

const ShowIcon = ({toShow, Icon}) => {
    let toRender = toShow ?
        <div className='-my-trump'>{Icon}</div> :
        <div className='empty-div' />;

    return (
        <div className='icon-row'>
            {toRender}
        </div>
    );
};

const getMapping = (props) => {
    const {
        stake, oldStake, nextChance, oldStakeFirstChance, flashCard, roomStatus
    } = props;

    let mapping = getPositionCardMapping(stake, nextChance);
    if (stake && stake.length === 0 && flashCard) {
        return getPositionCardMapping(oldStake, oldStakeFirstChance);
    }

    if (roomStatus === Room.STATUS_INACTIVE) {
        props.dispatch(push(Url.GameOver(window.getRoomCode())));
    }

    return mapping;
};

const canCardFlash = (props, position) => {
    const {
        oldStake, flashCard, nextChance
    } = props;

    if (oldStake && (oldStake.length === 4) && flashCard && (nextChance === position)) {
        setTimeout(() => {
            props.dispatch(updateFlashCard(false));
        }, 3000);

        return true;
    }
    return false;
};

const CardWrapper = (props) => {
    let card, position;

    const {
        nextChance, claimingBy, trumpDecidedBy, displayIndex
    } = props;

    const mapping = getMapping(props);

    if (Object.keys(mapping).length) {
        card=mapping[displayIndex].card;
        position=mapping[displayIndex].position;
    }
    const canFlash = canCardFlash(props, position);

    return (
        <div className={`player-card-div ${nextChance === position ? '-next-chance' : ''}`}>
            <div className={`card-and-sign-div ${displayIndex === 3 ? '-rev' : ''}`}>
                <ShowIcon toShow={claimingBy === position} Icon={<ClaimIcon/>}/>
                <div className='card-and-name-div'>
                    <div className={`player-name ${canFlash ? '-flash' : ''}`}>
                        {getPlayerNameFromPosition(position)}
                    </div>
                    <div className='card-div'>
                        {card && <img className='card' src={require(`./../IMAGES/${rankMap[card[0]]}${card[1]}.svg`)} />}
                    </div>
                </div>
                <ShowIcon toShow={trumpDecidedBy === position} Icon={<TrumpIcon/>}/>
            </div>
        </div>
    );
};

function mapStateToProps(props) {
    const {
        roomUsers, cards: {stake, oldStake},
        additionalInfo: {nextChance, claimingBy, trumpDecidedBy, oldStakeFirstChance, roomStatus},
        uiParams: { flashCard },
    } = props;

    return {
        flashCard, nextChance, claimingBy, trumpDecidedBy, oldStakeFirstChance, stake, oldStake, roomUsers, roomStatus
    };
}

export default connect(mapStateToProps)(CardWrapper);
