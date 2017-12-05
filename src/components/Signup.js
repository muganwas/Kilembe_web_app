import React, { Component } from 'react';

class Signup extends Component {

    render(){
        return (
            <div>
            <h3>Sign Up</h3>
                <label htmlFor="email_add">Email:</label>
                <input id="email" type="text" onChange={this.props.userEmail}/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" onChange={this.props.pass}/>
                <button onClick={this.props.onsignup}>Sign up</button>
            </div>
        )
    }
}

export default Signup;