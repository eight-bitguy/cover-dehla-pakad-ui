import React, { Component } from 'react';

class Card extends Component {
    render() {
        const rankMap = {
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
        //
        const {
            suit,
            rank,
            index,
            onClickOnCard,
            isSelected
        } = this.props;

        return (
            <div className={`wrapper ${isSelected ? '-is-selected' : ''}`} onClick={() => onClickOnCard(rank, suit)}>
                <img onClick={onClickOnCard} className='card' src={require(`./../IMAGES/${rankMap[rank]}${suit}.svg`)} height='80px' />
            </div>
        );
    }
}

export default Card;
