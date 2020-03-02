import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { ScaleLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

const ResetForm = ({
    feedback,
    email,
    messageId,
    resetInfo,
    tempValStore,
    dispatchEmail,
    onReset
}) => {

    const { fetching } = resetInfo;

    const intl = useIntl();
    const pageTitle = intl.formatMessage({id:"reset.pageTitle"});
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});

    return (
        <div className="form">
        <span>
            <h3>{ pageTitle }</h3>
        </span>
        { feedback? 
        <span className={ 'feedBack' }>
            <FormattedMessage id = { messageId } />
        </span>: 
        null }
            <span>
                <input 
                    id="email" 
                    placeholder="Email address" 
                    type="email"
                    value={email}
                    onChange={ tempValStore }
                    onBlur={ ()=>dispatchEmail(email) }
                />
            </span>
            <span>
                <button onClick={ ()=>{
                    if(!feedback)
                        onReset(email)
                } }>
                    { 
                        fetching?
                        <ScaleLoader
                            css={override}
                            sizeUnit={"px"}
                            height={10}
                            width={3}
                            radius={3}
                            color={'#757575'}
                            loading={fetching} 
                        />:
                        forgotPasswordLabel 
                    }
                </button>
            </span>
            <Link className="link span" to = { "/login" }>{ loginLabel }</Link> 
            <Link className="link span" to={ "/signup" }>{ signupLabel }</Link>
        </div>
    )
}

ResetForm.propTypes = {
    feedback: PropTypes.bool,
    email: PropTypes.string,
    messageId: PropTypes.string,
    resetInfo: PropTypes.object.isRequired,
    tempValStore: PropTypes.func.isRequired,
    dispatchEmail: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
}

export default ResetForm;