import React from 'react';
import Page from "../Pages/page";
import Card from "./card";

export default class Cards extends Page {
    render() {
        const { cards, onClickOnCard, selectedCard } = this.props;
        return (
            <div>
                {cards.map((card, index) =>
                    <Card
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
