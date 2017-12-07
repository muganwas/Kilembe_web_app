import React, { Component } from 'react';

class Reset extends Component {

    render(){
        return (
            <div>
            <span><h3>Password Reset</h3></span>
            <span className={ this.props.feedback }>{this.props.message}</span>
                <span><input id="email" placeholder="Email address" type="text" onChange={this.props.userEmail}/></span>
                <span><button onClick={this.props.onReset}>Reset Password</button></span>
                <span onClick={this.props.onLogin} className="link">Sign in</span>
                <span onClick={this.props.toReg} className="link">Register</span>
            </div>
        )
    }
}

export default Reset;