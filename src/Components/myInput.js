import React, {PureComponent} from 'react';
import Page from "../Pages/page";

export default class MyInput extends PureComponent{
    render() {
        const {
            type, id, onChangeText, className, placeholder, name
        } = this.props;

        return (
            <input
                type={type}
                id={id}
                name={name}
                onChange={onChangeText}
                className={`my-input-container ${className}`}
                placeholder={placeholder}
            />
        );
    }
}
