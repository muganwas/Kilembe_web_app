import React, { Component } from 'react';

class Home extends Component {
    render(){
        return (
            <div>
                <h3>You are Home, {this.props.dname}!</h3>{this.props.logout}
                Your Email Address: {this.props.email}
            </div>
        )
    }
}

export default Home;