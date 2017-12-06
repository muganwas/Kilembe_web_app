import React, { Component } from 'react';

class Reset extends Component {

    render(){
        return (
            <div>
            <h3>Fill in your email Address tor recieve password reset email</h3>
            <div id="feedBack">{this.props.message}</div>
                <label htmlFor="email_add">Email:</label>
                <input id="email" type="text" onChange={this.props.userEmail}/>
                <button onClick={this.props.onReset}>Reset Password</button>
            </div>
        )
    }
}

export default Reset;