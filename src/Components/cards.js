import React from 'react';
import Page from "../Pages/page";
import Card from "./card";

export default class Cards extends Page {
    render() {
        const { cards, onClickOnCard, selectedCard } = this.props;
        return (
            <div className='my-cards' data-fan='spacing: 0.1; width: 80; radius: 80'>
                {cards.map((card, index) =>
                    <Card
                        key={`card-par-${index}`}
                        isSelected={ selectedCard===card }
                        rank={card[0]}
                        suit={card[1]}
                        index={index}
                        total={cards.length}
                        onClickOnCard={onClickOnCard}
                    />
                    )}
            </div>
        );
    }
}
