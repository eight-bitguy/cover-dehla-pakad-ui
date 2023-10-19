import React, {useEffect} from 'react';
import './../JS/cardsJS'
import connect from 'react-redux/es/connect/connect';
import { rankMap } from '../JS/helper';


const Cards = (props) => {

    useEffect(() => {
        dispatchEvent(new Event('load-cards'));
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
                    alt={card}
                    data-card={card}
                    key={`card-par-${index}`}
                    className={`card ${selectedCard === card ? '-is-selected' : ''}`}
                    onClick={onClickOnCard}
                    src={require(`./../IMAGES/${rankMap[card[0]]}${card[1]}.svg`)}
                />
            )}
        </div>
    );


};

function mapStateToProps({cards}, {primaryType, secondaryType}) {
    let cardsToDisplay = cards[primaryType];
    if (!cardsToDisplay || cardsToDisplay.length === 0) {
        cardsToDisplay = (secondaryType && cards[secondaryType]) ? cards[secondaryType] : [];
    }

    return {
        cards: cardsToDisplay
    };
}

export default connect(mapStateToProps)(Cards);
