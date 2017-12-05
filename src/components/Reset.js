import React, { Component } from 'react';

class Reset extends Component {

    render(){
        return (
            <div>
            <h3>Fill in your email Address tor recieve password reset email</h3>
                <label htmlFor="email_add">Email:</label>
                <input id="email" type="text" onChange={this.props.userEmail}/>
                <button onClick={this.props.onsignup}>Reset Password</button>
            </div>
        )
    }
}

export default Reset;