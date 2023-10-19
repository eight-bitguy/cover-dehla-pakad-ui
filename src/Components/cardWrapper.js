import React from 'react';
import Page from '../Pages/page';
import TrumpIcon from "../Icons/trumpIcon";
import ClaimIcon from "../Icons/claimIcon";
import connect from 'react-redux/es/connect/connect';

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

class CardWrapper extends Page {

    getCard(position) {
        for(let i = 0; i < this.props.stakeWithUser.length; i++) {
            const record = this.props.stakeWithUser[i];
            if (record[0] === position) {
                return record[1];
            }

        }
    };

    render() {
        const {
            nextChance, trumpDecidedBy, displayIndex, trumpHiddenBy, roomUsers, flashCard
        } = this.props;
    
        if (!roomUsers.length) {
            return (<div />);
        }
    
        const position = roomUsers[displayIndex].position;
        const card = this.getCard(position);
        const canFlash = flashCard && (nextChance === position);
        
        return (
            <div className={`player-card-div ${nextChance === position ? '-next-chance' : ''}`}>
                <div className={`card-and-sign-div ${displayIndex === 3 ? '-rev' : ''}`}>
                    <ShowIcon toShow={trumpHiddenBy === position} Icon={<ClaimIcon/>}/>
                    <div className='card-and-name-div'>
                        <div className={`player-name ${canFlash ? '-flash' : ''}`}>
                            {roomUsers.length ? roomUsers[displayIndex].name : ''}
                        </div>
                        <div className='card-div'>
                            {card && <img alt={position} className='card' src={require(`./../IMAGES/${rank[card[0]]}${card[1]}.svg`)} />}
                        </div>
                    </div>
                    <ShowIcon toShow={trumpDecidedBy === position} Icon={<TrumpIcon/>}/>
                </div>
            </div>
        );    
    }

};

function mapStateToProps(props) {
    const {
        roomUsers, cards: {stakeWithUser},
        additionalInfo: {nextChance, trumpDecidedBy, trumpHiddenBy, flashCard}
    } = props;

    return {
        flashCard, nextChance, trumpDecidedBy, roomUsers, trumpHiddenBy, stakeWithUser
    };
}

export default connect(mapStateToProps)(CardWrapper);
