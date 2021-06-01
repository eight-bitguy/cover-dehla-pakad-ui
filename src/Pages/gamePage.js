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
import {updateNextChance, updateOldStakeFirstChance} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import memoizeOne from 'memoize-one';
import PageLoadable from "../Components/loadable";
import {updateFlashCard} from "../Redux/modules/uiParams";

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

    displayStats = () => {
        console.log(this.props);
        this.props.dispatch(replace(Url.Stats));
    };

    render() {
        const myChance = isMyChance();
        return (
            <div className='game-page-container'>
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
                <div className='play-button'>
                    <MyButton
                        label='Stats'
                        onClick={this.displayStats}
                    />
                    <MyButton
                        label='Play'
                        disabled={!myChance}
                        onClick={this.playSelectedCard}
                    />
                </div>
            </div>
        );
    }
}

function mapStateToProps({room, additionalInfo}) {
    return {
        room,
        additionalInfo
    };
}

const smartMapper = memoizeOne(mapStateToProps);

export default connect(smartMapper)(GamePage)
