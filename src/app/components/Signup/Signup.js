import React, { Component } from 'react';

class Signup extends Component {

    render(){
        return (
            <div className="form">
            <span><h3>Sign Up</h3></span>
            <span className={ this.props.feedback }>{this.props.message}</span>
                <span><input id="email" placeholder="Email address" type="text" onChange={this.props.userEmail}/></span>
                <span><input id="pass" placeholder="Password" type="password" onChange={this.props.pass}/></span>
                <span><input id="passConfirm" placeholder="Confirm Password" type="password" onChange={this.props.conPass}/></span>
                <span><button onClick={this.props.onsignup}>Sign up</button></span>
                <span onClick={this.props.onLogin} className="link">Sign in</span>
                <span onClick={this.props.reset} className="link">Forgot Passowrd</span>
            </div>
        )
    }
}

export default Signup;