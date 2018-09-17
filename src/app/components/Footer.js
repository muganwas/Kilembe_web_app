import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Donate from './Donate';

class Footer extends Component {
    render(){
        return (
            <div className="swagg">&copy;2018 Kilembe School
                <Link id="devLink" to="https://www.upwork.com/freelancers/~01edb2b7356420e161"> Muganwas</Link>   
                <Donate/>
            </div>
        )
    }
}

export default Footer;