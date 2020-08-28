import React from 'react';
import 'cardsJS/dist/cards.min.js';
import 'cardsJS/dist/cards.min.css';
import Page from "../Pages/page";
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

class Cards extends Page {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log((nextProps.cards !== this.props.cards) || nextProps.selectedCard !== this.props.selectedCard, this.props.cards.length);
        return (nextProps.cards !== this.props.cards) ;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        dispatchEvent(new Event('load'));
        console.log('fire');
    }

    render () {
        const { cards, onClickOnCard } = this.props;
        const canRender = cards && cards.length > 0;
        if (!canRender) {
            return <div />;
        }

        return (
            <div className='hand fan' data-fan='spacing: 0.2; width: 90; radius: 200;'>
                {cards.map((card, index) =>
                    <img
                        key={`card-par-${index}`}
                        className='card'
                        onClick={() => onClickOnCard(card)}
                        src={require(`./../IMAGES/${rankMap[card[0]]}${card[1]}.svg`)}
                    />
                    )}
            </div>
        );
    }
}

export default Cards;
