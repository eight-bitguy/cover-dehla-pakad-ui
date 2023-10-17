import React from 'react';
import connect from 'react-redux/es/connect/connect';

const MiniScoreBoard = (props) => {
    const {scores} = props;

    return (
        <div className='score-board-container'>
            <div className='row' key={'A'}>
                <span className='name'>A</span>
                <span className='score'>{scores['dehla']['A'], scores['non-dehla']['A']}</span>
            </div>
            <div className='row' key={'B'}>
                <span className='name'>B</span>
                <span className='score'>{scores['dehla']['B'], scores['non-dehla']['B']}</span>
            </div>
        </div>
    );
};

function mapStateToProps(props) {
    const {
        additionalInfo: {score, dehla_score},
    } = props;

    const scores = {
        'dehla': {
            'A': dehla_score['a1']+dehla_score['a2'],
            'B': dehla_score['b1']+dehla_score['b2']
        },
        'non-dehla': {
            'A': score['a1']+score['a2'],
            'B': score['b1']+score['b2']
        }
    };

    return {
        scores
    };
}

export default connect(mapStateToProps)(MiniScoreBoard);
