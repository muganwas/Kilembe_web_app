import React, { Component } from 'react';

class LoginForm extends Component {

    render(){
        return (
            <div>
                <span><input id="email" placeholder="Email address" type="text" onChange={ this.props.handleEmail }/></span>
                <span><input id="pass" placeholder="Password" type="password" onChange={ this.props.handlePass }/></span>
                <span><button onClick={ this.props.onsubmit } type="submit" >Sign in</button></span>
            </div>
        )
    }
}

export default LoginForm;