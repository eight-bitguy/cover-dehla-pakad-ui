import React from 'react';

export default class Page extends React.Component {
    onChangeText = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };
}
