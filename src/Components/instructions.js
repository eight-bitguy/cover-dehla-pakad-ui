import React from 'react';
import TrumpIcon from "../Icons/trumpIcon";
import ClaimIcon from "../Icons/claimIcon";

const Instructions = () => {
    return (
        <div className='instruction-container'>
            <div className='instruction'>
                <div className='row'>
                    <div className='sign'>
                        <TrumpIcon/>
                    </div>
                    <div className='description'>
                        Player who has opened the trump
                    </div>
                </div>
                <div className='row'>
                    <div className='sign'>
                        <ClaimIcon/>
                    </div>
                    <div className='description'>
                        Player who is hidding trump
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
