import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {play, openTrump} from "../Api/game";
import Cards from "../Components/cards";
import {moveCardFromHandToStake, canOpenTrump, fetchAndStoreInitialData} from "../JS/helper";
import MyButton from "../Components/myButton";
import ScoreBoard from '../Components/scoreBoard';
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

        await fetchAndStoreInitialData(this.props.dispatch);
    };

    onClickOnCard = async (event) => {
        const cardToPlay = event.target.dataset.card;
        if (cardToPlay !== this.state.cardToPlay) {
            this.setState({ cardToPlay });
        }
    };

    playSelectedCard = async () => {
        const {cardToPlay} = this.state;

        if (!this.isMyChance() || !cardToPlay) {
            return;
        }

        this.setState({cardToPlay: null});
        moveCardFromHandToStake(cardToPlay);

        const {room} = this.props;
        const data = { card: cardToPlay };
        await play(room.code, data);
    };

    openTrumpCard = async () => {
        const {room} = this.props;
        await openTrump(room.code);
    }

    isMyChance = () => {
        const {roomUsers, additionalInfo: {nextChance}} = this.props;

        return roomUsers.length && roomUsers[0].position === nextChance;
    }

    render() {
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
                <div className={`play-button ${this.isMyChance() ? '' : 'display-none'}`}>
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

function mapStateToProps({room, additionalInfo, cards, roomUsers}) {
    return {
        room,
        additionalInfo,
        cards,
        roomUsers
    };
}

export default connect(mapStateToProps)(GamePage)
