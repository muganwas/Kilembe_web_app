import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Donate } from 'components';
import { withRouter, Link } from 'react-router-dom';
//import { devProfileURL } from 'misc/constants';

const Footer = ({history}) => {
    const goTo = location => {
        history.push(location);
    } 
    return (
        <div className="swagg">
            <FormattedMessage id={"site.copyrightText"} />
            <Link id="devLink" onClick={() => goTo(`/redirect/dev`)}>
                <span id="devName">
                    <FormattedMessage id={"dev.name"}/>
                </span>
            </Link>   
            <Donate/>
        </div>
    )
}

export default withRouter(Footer);