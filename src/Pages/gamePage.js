import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {getInitialCards, play} from "../Api/game";
import Cards from "../Components/cards";
import { replace } from 'connected-react-router'
import {isMyChance, removeCardFromHand} from "../JS/helper";
import Url from "../JS/url";
import MyButton from "../Components/myButton";
import {updateAllCards} from "../Redux/modules/cards";
import {updateNextChance} from "../Redux/modules/additionalInfo";
import Room from "../Models/room";
import Board from "../Components/board";

class GamePage extends Page {

    constructor(props) {
        super(props);
        window.setRoomCode(props.match.params.roomCode);
        this.state = {
            cardToPlay: null
        };
    }

    async componentDidMount() {
        if (!window.getRoomCode()) {
            return;
        }
        const data = await getInitialCards(window.getRoomCode());

        if (!data) {
            this.props.dispatch(replace(Url.LandingPage));
            return;
        }

        const cards = {
            hand: data.initialCards,
            oldStake: data.oldStake,
            stake: data.initialStake,
        };

        await this.props.dispatch(updateAllCards(cards));
        await this.props.dispatch(updateNextChance(data.nextChance));
    };

    onClickOnCard = async (event) => {
        const cardToPlay = event.target.dataset.card;
        if (cardToPlay !== this.state.cardToPlay) {
            this.setState({ cardToPlay });
        }
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

    onClick = () => {};

    render() {
        const myChance = isMyChance();
        return (
            <div className='game-page-container'>
                <div className='stake-container'>
                    {/*<div className='old-stake'>*/}
                    {/*    <Cards type='oldStake' onClickOnCard={this.onClick}/>*/}
                    {/*</div>*/}
                    {/*<div className='stake'>*/}
                    {/*    <Cards type='stake' onClickOnCard={this.onClick}/>*/}
                    {/*</div>*/}
                    <Board/>
                </div>
                <div className='hand-stake-container'>
                    <div className='hand-stake'>
                        <Cards type='hand' onClickOnCard={this.onClickOnCard} selectedCard={this.state.cardToPlay} />
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

function mapStateToProps({room}) {
    return {
        room: new Room(room)
    };
}

export default connect(mapStateToProps)(GamePage)
