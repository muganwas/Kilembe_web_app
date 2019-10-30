import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Donate from '../Donate/Donate';

class Footer extends Component {
    render(){
        return (
            <div className="swagg">&copy;2018 Kilembe School
                <Link id="devLink" to="https://www.upwork.com/fl/stevenmuganwa"> Muganwas</Link>   
                <Donate/>
            </div>
        )
    }
}

export default Footer;