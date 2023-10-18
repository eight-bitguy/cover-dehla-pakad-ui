import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {getInitialCards, play, openTrump} from "../Api/game";
import Cards from "../Components/cards";
import { replace } from 'connected-react-router'
import {isMyChance, removeCardFromHand, canOpenTrump} from "../JS/helper";
import Url from "../JS/url";
import MyButton from "../Components/myButton";
import {updateAllCards} from "../Redux/modules/cards";
import {updateNextChance, updateOldStakeFirstChance} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import memoizeOne from 'memoize-one';
import PageLoadable from "../Components/loadable";
import {updateFlashCard} from "../Redux/modules/uiParams";
import ScoreBoard from '../Components/scoreBoard';

const Board = PageLoadable({ loader: () => import('../Components/board') });

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

        await batch(async () => {
            this.props.dispatch(updateAllCards(cards));
            this.props.dispatch(updateNextChance(data.nextChance));
            this.props.dispatch(updateOldStakeFirstChance(data.oldStakeFirstChance));
            if (cards.oldStake && cards.oldStake.length===4) {
                this.props.dispatch(updateFlashCard(true));
            }
        });
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
        await play(room.code, data);

        this.setState({cardToPlay: null});
    };

    onClick = () => {};

    openTrumpCard = async () => {
        const {room} = this.props;
        await openTrump(room.code);
    }

    render() {
        const myChance = isMyChance();
        const showOpenTrumpButton = canOpenTrump();
        return (
            <div className='game-page-container'>
                <div className='scoreboard-outter-div'>
                    <ScoreBoard />
                </div>
                <div className='stake-container'>
                    <Board/>
                </div>
                <div className='hand-stake-container'>
                    <div className='hand-stake'>
                        <Cards
                            primaryType='hand'
                            onClickOnCard={this.onClickOnCard}
                            selectedCard={this.state.cardToPlay}
                        />
                    </div>
                </div>
                <div className={`play-button ${myChance ? '' : 'display-none'}`}>
                    <MyButton
                        label='Play'
                        onClick={this.playSelectedCard}
                        className='mt-5'/>
                </div>
                <div className={`play-button ${showOpenTrumpButton ? '' : 'display-none'}`}>
                    <MyButton
                        label='Open Trump'
                        onClick={this.openTrumpCard}
                        className='mt-5'/>
                </div>
            </div>
        );
    }
}

function mapStateToProps({room, additionalInfo, cards}) {
    return {
        room,
        additionalInfo,
        cards
    };
}

const smartMapper = memoizeOne(mapStateToProps);

export default connect(smartMapper)(GamePage)
