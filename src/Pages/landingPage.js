import React, {useEffect, useState} from 'react';
import { replace } from 'connected-react-router'
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import Ruler from "../Components/ruler";
import connect from 'react-redux/es/connect/connect';
import Url from './../JS/url';
import Room from "../Models/room";
import LogoutHeader from "../Components/LogoutHeader";

const LandingPage = (props) => {

    useEffect(() => {
        window.setRoomCode('');
    }, []);

    const [room, _setRoom] = useState(new Room());
    const [loading, setLoading] = useState(null);

    const setRoom = (e) => {
        room.set(e.target.name, e.target.value);
        _setRoom(room);
    };

    const createNewRoom = async () => {
        if (loading) {
            return ;
        }
        setLoading('create');
        await room.createNewRoom();
        setLoading(null);
        window.setRoomCode(room.get('code'));
        props.dispatch(replace(Url.JoiningGame(room.get('code'))));
    };

    const joinRoom = async () => {
        room.set('code', '111111');
        if (loading) {
            return ;
        }
        setLoading('join');
        const canJoin = await room.joinRoom();
        setLoading(null);
        if (canJoin) {
            window.setRoomCode(room.get('code'));
            props.dispatch(replace(Url.JoiningGame(room.get('code'))));
        }
    };

    return(
        <div className='landing-page-container'>
            <LogoutHeader />
            <div className='landing'>
                <div className='join-room'>
                    <div className='input'>
                        <MyInput
                            className='join-room'
                            name='code'
                            type='number'
                            onChangeText={setRoom}
                        />
                    </div>
                    <div className='button'>
                        <MyButton
                            label='Join Room'
                            onClick={joinRoom}
                            loading={loading==='join'}
                        />
                    </div>
                </div>
                <Ruler />
                <div className='create'>
                    <MyButton
                        label='Create Room'
                        onClick={createNewRoom}
                        loading={loading==='create'}
                    />
                </div>
            </div>
        </div>
    );
};

export default connect()(LandingPage)
