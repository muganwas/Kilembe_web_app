import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Donate } from 'components';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="swagg">
            <FormattedMessage id={"site.copyrightText"} />
            <Link id="devLink" to={'/redirect/dev'}>
                <span id="devName">
                    <FormattedMessage id={"dev.name"}/>
                </span>
            </Link>   
            <Donate/>
        </div>
    )
}

export default Footer;