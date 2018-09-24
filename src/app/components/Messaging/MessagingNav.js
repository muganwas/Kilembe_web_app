import React, { Component } from 'react';
import Rebase from 're-base';
import app from '../../base';
import axios from 'axios';
const usersRef = app.database().ref('users');
const base = Rebase.createClass(app.database());

class MessagingNav extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        return(
            <div>
            </div>
        )
    }

}

export default MessagingNav;