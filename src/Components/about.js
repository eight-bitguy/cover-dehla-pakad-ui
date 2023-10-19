import React from 'react';
import Url from "../JS/url";

const About = () => {
    const showOn = Url.Home;
    if (window.location.pathname !== showOn) {
        return <div />;
    }

    return (
        <div className='about-container'>
            <div className='about'>
                <span>Developed and designed by <a className='name' href="http://eightbitguy.in" target=''>eight bitguy</a></span>
            </div>
        </div>
    );
};

export default About;
