import React from 'react';
import CardWrapper from "./cardWrapper";
import PageLoadable from "./loadable";

const Bowl = PageLoadable({ loader: () => import('./bowl') });

const Board = () => {

    return (
        <div className='board-container'>
            <div className='board'>
                <div className='row-1'>
                    <CardWrapper displayIndex={2}/>
                </div>
                <div className='row-2'>
                    <CardWrapper displayIndex={1}/>
                    <Bowl/>
                    <CardWrapper displayIndex={3}/>
                </div>
                <div className='row-3'>
                    <CardWrapper displayIndex={0}/>
                </div>
            </div>
        </div>
    );
};

export default Board;
