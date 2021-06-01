import React, {useEffect} from 'react';
import './../JS/cardsJS'
import connect from 'react-redux/es/connect/connect';

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
        <div className='hand fan' data-fan='spacing: 0.28; width: 73; radius: 134px;'>
            {cards.map((card, index) =>
                <img
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
