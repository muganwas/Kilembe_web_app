import React, { Component } from 'react';

class Header extends Component {
    render(){
        return (
            <div className="mainNav">
                <span className="link icon-home" onClick={this.props.home }></span>
                <span className="menu icon-menu">
                    <ul>
                        <li className="small icon-settings">
                            {this.props.settings}
                        </li>
                        <li className="small icon-logout">
                            {this.props.logout}
                        </li>
                    </ul>
                </span>
            </div>
        )
    }
}

export default Header;