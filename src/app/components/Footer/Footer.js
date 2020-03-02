import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Donate } from 'components';
import { devProfileURL } from 'misc/constants';

const Footer = () => {
    return (
        <div className="swagg">
            <FormattedMessage id={"site.copyrightText"} />
            <Link id="devLink" to={ devProfileURL }>
                <span id="devName">
                    <FormattedMessage id={"dev.name"}/>
                </span>
            </Link>   
            <Donate/>
        </div>
    )
}

export default Footer;