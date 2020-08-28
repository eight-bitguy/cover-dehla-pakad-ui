import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {getInitialCards, play} from "../Api/game";
import Cards from "../Components/cards";
import Card from "../Models/card";
import { replace } from 'connected-react-router'
import {isMyChance, myPositionInCurrentRoom, removeCardFromHand} from "../JS/helper";
import Url from "../JS/url";
import MyButton from "../Components/myButton";
import {addCardsInHand, updateOldStake, updateStake} from "../Redux/modules/cards";
import {updateNextChance} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import Room from "../Models/room";

class GamePage extends Page {

    constructor(props) {
        super(props);
        window.setRoomCode(props.match.params.roomCode);
        this.state = {
            cardToPlay: null
        };
    }

    async componentDidMount() {
        const data = await getInitialCards('601371');
        if (!data) {
            this.props.dispatch(replace(Url.LandingPage));
            return;
        }
        await batch(async () => {
            await this.props.dispatch(addCardsInHand(data.initialCards));
            await this.props.dispatch(updateStake(data.initialStake));
            await this.props.dispatch(updateOldStake(data.oldStake));
            await this.props.dispatch(updateNextChance(data.nextChance));
        });
    };

    onClickOnCard = async (cardToPlay) => {
        this.setState({ cardToPlay });
    };

    playSelectedCard = async () => {
        const {cardToPlay} = this.state;

        if (!isMyChance() || !cardToPlay) {
            return;
        }

        removeCardFromHand(cardToPlay);
        const {room} = this.props;
        const data = { card: cardToPlay };
        await play(room.get('code'), data);

        this.setState({cardToPlay: null});
    };

    render() {
        const { cards } = this.props;
        const { cardToPlay } = this.state;
        const myChance = isMyChance();
        return (
            <div className='game-page-container'>
                <div className='hand-stake-container'>
                    <div className='hand-stake'>
                        <Cards cards={cards.get('hand')} onClickOnCard={this.onClickOnCard} selectedCard={cardToPlay}/>
                    </div>
                </div>
                <div className='stake-container'>
                    <div className='old-stake'>
                        <Cards cards={cards.get('oldStake')} onClickOnCard={() => {}}/>
                    </div>
                    <div className='stake'>
                        <Cards cards={cards.get('stake')} onClickOnCard={() => {}}/>
                    </div>
                </div>
                <div className={`play-button ${myChance ? '' : 'display-none'}`}>
                    <MyButton
                        label='Play'
                        onClick={this.playSelectedCard}
                        className='mt-5'/>
                </div>
            </div>
        );
    }
}

function mapStateToProps({cards, roomUsers, room}) {
    return {
        cards: new Card(cards),
        roomUsers,
        room: new Room(room)
    };
}

export default connect(mapStateToProps)(GamePage)
