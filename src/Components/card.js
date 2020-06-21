import React, { Component } from 'react';

class Card extends Component {
    render() {
        // const suitMap = {
        //     'S': 'Spades',
        //     'H': 'Hearts',
        //     'C': 'Clubs',
        //     'D': 'Diamonds'
        // };

        // const rankMap = {
        //     'A': 'Ace',
        //     '2': 'Deuce',
        //     '3': 'Three',
        //     '4': 'Four',
        //     '5': 'Five',
        //     '6': 'Six',
        //     '7': 'Seven',
        //     '8': 'Eight',
        //     '9': 'Nine',
        //     'T': 'Ten',
        //     'J': 'Jack',
        //     'Q': 'Queen',
        //     'K': 'King'
        // };
        //
        const {
            suit,
            rank,
            // total,
            index,
            onClickOnCard,
            isSelected
        } = this.props;
        const left = 45*index;
        // const rotate = 330 + (index*5);

        return (
            <div className={`wrapper ${isSelected ? '-is-selected' : ''}`} onClick={() => onClickOnCard(rank, suit)}>
                 <div className='card' style={{left: left}}>
                    <div className={`${suit} mark dark`}>{rank}</div>
                    {/*<div className="content ">*/}
                    {/*    <h1>{rankMap[rank]}</h1>*/}
                    {/*    <h2><sup>OF</sup><span className="dark">{suitMap[suit]}</span></h2>*/}
                    {/*</div>*/}
                    {/*<div className={`${suit} mark upside-down`}>{rank}</div>*/}
                 </div>
            </div>
        );
    }
}

export default Card;
