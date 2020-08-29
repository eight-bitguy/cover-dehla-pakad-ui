import React, {useEffect} from 'react';
import 'cardsJS/dist/cards.min.js';
import 'cardsJS/dist/cards.min.css';
import connect from 'react-redux/es/connect/connect';
import {mapCardToImage} from "../JS/helper";

const Cards = (props) => {

    useEffect(() => {
        dispatchEvent(new Event('load'));
    });

    const { cards, onClickOnCard, selectedCard } = props;
    const canRender = cards && cards.length > 0;
    if (!canRender) {
        return <div className='hand fan'/>;
    }

    return (
        <div className='hand fan' data-fan='spacing: 0.28; width: 73; radius: 134;'>
            {cards.map((card, index) =>
                <img
                    data-card={card}
                    key={`card-par-${index}`}
                    className={`card ${selectedCard === card ? '-is-selected' : ''}`}
                    onClick={onClickOnCard}
                    src={require(`./../IMAGES/${mapCardToImage(card)}`)}
                />
            )}
        </div>
    );


};

function mapStateToProps({cards}, {type}) {
    return {
        cards: cards[type]
    };
}

export default connect(mapStateToProps)(Cards);
