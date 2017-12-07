import React, { Component } from 'react';

class Login extends Component {

    render(){
        return (
            <div>
            <form onSubmit={this.props.onsubmit}>
                <span><input id="email" placeholder="Email address" type="text" onChange={this.props.userEmail}/></span>
                <span><input id="pass" placeholder="Password" type="password" onChange={this.props.pass}/></span>
                <span><button type="submit" >Sign in</button></span>
            </form>
            </div>
        )
    }
}

export default Login;