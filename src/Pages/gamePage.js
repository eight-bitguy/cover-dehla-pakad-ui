import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {getInitialCards, play} from "../Api/game";
import Cards from "../Components/cards";
import Card from "../Models/card";
import { replace } from 'connected-react-router'
import {isMyChance, removeCardFromHand} from "../JS/helper";
import Url from "../JS/url";
import MyButton from "../Components/myButton";
import {addCardsInHand, updateOldStake, updateStake} from "../Redux/modules/cards";
import {updateNextChance} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import Room from "../Models/room";

class GamePage extends Page {

    constructor(props) {
        super(props);

        this.state = {
            cardToPlay: null
        };
    }

    async componentDidMount() {
        const data = await getInitialCards(this.props.room.get('code'));
        if (!data) {
            this.props.dispatch(replace(Url.LandingPage));
        }
        console.log(data);
        await batch(async () => {
            await this.props.dispatch(addCardsInHand(data.initialCards));
            await this.props.dispatch(updateStake(data.initialStake));
            await this.props.dispatch(updateOldStake(data.oldStake));
            await this.props.dispatch(updateNextChance(data.nextChance));
        });
    };

    onClickOnCard = async (rank, suit) => {
        const card = `${rank}${suit}`;
        this.setState({cardToPlay: card});
    };

    playSelectedCard = async () => {
        const {cardToPlay} = this.state;

        if (!isMyChance() || !cardToPlay) {
            return;
        }

        removeCardFromHand(cardToPlay);
        const {additionalInfo} = this.props;
        const data = { card: cardToPlay };
        await play(additionalInfo.currentRoomCode, data);

        this.setState({cardToPlay: null});
    };

    renderStake = () => {
        const {cards} = this.props;
        return (
            <div className=''>
                <div className=''>
                    <Cards cards={cards.get('oldStake')} onClickOnCard={() => {}}/>
                </div>
                <div className=''>
                    <Cards cards={cards.get('stake')} onClickOnCard={() => {}}/>
                </div>
                <div className=''>
                    <MyButton
                        label='Play'
                        onClick={this.playSelectedCard}
                        className='mt-5'/>
                </div>
            </div>
        );
    };

    renderHand = () => {
        const { cards } = this.props;
        const { cardToPlay } = this.state;

        return (
            <div className=''>
                <div className=''>
                    <Cards cards={cards.get('hand')} onClickOnCard={this.onClickOnCard} selectedCard={cardToPlay}/>
                </div>
            </div>
        );
    };

    render() {
        console.log(this.props);
        return (
            <div>
                {this.renderStake()}
                {this.renderHand()}
            </div>
        );
    }
}

function mapStateToProps({cards, additionalInfo, roomUsers, room}) {
    return {
        cards: new Card(cards),
        additionalInfo,
        roomUsers,
        room: new Room(room)
    };
}

export default connect(mapStateToProps)(GamePage)
