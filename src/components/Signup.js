import React, { Component } from 'react';

class Login extends Component {

    render(){
        return (
            <div>
                <label htmlFor="email_add">Email:</label>
                <input id="email" type="text" onChange={this.props.userEmail}/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" onChange={this.props.pass}/>
                <button onClick={this.props.onsubmit}>Login</button>
            </div>
        )
    }
}

export default Login;