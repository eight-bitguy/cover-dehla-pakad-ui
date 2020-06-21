import React, {PureComponent} from 'react';
import Page from "../Pages/page";

export default class MyButton extends PureComponent
{
    static TYPE_BIG_ROUND_BUTTON = 'TYPE_BIG_ROUND_BUTTON';
    static TYPE_SMALL_ROUND_BUTTON = 'TYPE_SMALL_ROUND_BUTTON';

    bigRoundButton = () => {
        const {
            label, onClick, className
        } = this.props;

        return (
            <button onClick={onClick} className={`big-round-button ${className || ''}`}>
                {label}
            </button>
        );
    };

    smallRoundButton = () => {
        const {
            label, onClick, className
        } = this.props;

        return (
            <button onClick={onClick} className={`small-round-button ${className || ''}`}>
                {label}
            </button>
        );
    };


    render() {
        const { type } = this.props;

        switch (type) {
            case MyButton.TYPE_BIG_ROUND_BUTTON:
                return this.bigRoundButton();
            case MyButton.TYPE_SMALL_ROUND_BUTTON:
                return this.smallRoundButton();
            default:
                return this.bigRoundButton();
        }
    }
}
