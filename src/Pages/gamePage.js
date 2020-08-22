import React from 'react';
import Page from './page';
import connect from 'react-redux/es/connect/connect';
import {getInitialCards, play} from "../Api/game";
import Cards from "../Components/cards";
import {getLoggedInUser, isMyChance, myPositionInCurrentRoom, removeCardFromHand} from "../JS/helper";
import Url from "../JS/url";
import MyButton from "../Components/myButton";
import {store} from "./../index";
import {addCardsInHand, updateOldStake, updateStake} from "../Redux/modules/cards";
import {updateNextChance} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";

class GamePage extends Page {

    constructor(props) {
        super(props);

        this.state = {
            cardToPlay: null
        };
    }

    async componentDidMount() {
        const data = await getInitialCards(window.getRoomCode());
        console.log(data);
        await batch(async () => {
            await this.props.dispatch(addCardsInHand(data.initialCards));
            await this.props.dispatch(updateStake(data.initialStake));
            await this.props.dispatch(updateOldStake(data.oldStake));
            await this.props.dispatch(updateNextChance(data.nextChance));
        });

        const {additionalInfo} = this.props;
        const roomCode = additionalInfo.currentRoomCode ?? window.getRoomCode();

        if (!roomCode) {
            this.props.history.push(Url.LandingPage);
        }
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

    renderCurrentChangeNotification = () => {
        if (!isMyChance()) {
            return <div />;
        }

        return (
            <div className='row chance-notification'>
                Your chance
            </div>
        );
    };

    renderStake = () => {
        const cards = this.props.cards;
        const {additionalInfo} = this.props;
        const user = getLoggedInUser();


        return (
            <div className='row '>
                <div className='col-md-2 offset-md-0'>
                    <Cards cards={cards.oldStake} onClickOnCard={() => {}}/>
                </div>
                <div className='col-md-2 offset-md-1'>
                    <Cards cards={cards.stake} onClickOnCard={() => {}}/>
                </div>
                <div className='col-md-2 offset-md-1'>
                    <p>{`User name : ${user.name}`}</p>
                    <p>{`User position : ${myPositionInCurrentRoom()}`}</p>
                    <p>{`Next chance : ${additionalInfo.nextChance}`}</p>
                </div>

                <div className='col-md-3 offset-md-1 col-2 offset-2'>
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
            <div className='row'>
            {/*<div className='row' style={{position: 'absolute', bottom: '160px'}}>*/}
                <div className='col-md-8 offset-md-3 col-8 offset-2'>
                    <Cards cards={cards.hand} onClickOnCard={this.onClickOnCard} selectedCard={cardToPlay}/>
                </div>
            </div>
        );
    };

    renderGameInfo = () => {
    };

    render() {
        return (
            <div>
                {this.renderCurrentChangeNotification()}
                {this.renderStake()}
                {this.renderHand()}
            </div>
        );
    }
}

function mapStateToProps({cards, additionalInfo, roomUsers}) {
    return {
        cards,
        additionalInfo,
        roomUsers
    };
}

export default connect(mapStateToProps)(GamePage)
