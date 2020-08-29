import React from 'react';
import connect from 'react-redux/es/connect/connect';
import CardWrapper from "./cardWrapper";
import Bowl from "./bowl";

const Board = () => {

    return (
        <div className='board-container'>
            <div className='board'>
                <div className='row-1'>
                    <CardWrapper displayIndex={2}/>
                </div>
                <div className='row-2'>
                    <CardWrapper displayIndex={3}/>
                    <Bowl/>
                    <CardWrapper displayIndex={1}/>
                </div>
                <div className='row-3'>
                    <CardWrapper displayIndex={0}/>
                </div>
            </div>
        </div>
    );
};

export default connect()(Board);
