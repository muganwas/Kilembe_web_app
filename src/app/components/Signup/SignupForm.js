import React from 'react';
import { 
    FormattedMessage, 
    useIntl
} from 'react-intl';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { ScaleLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

const SignupForm = ({
    email, 
    password,
    passwordConfirm,
    error, 
    messageId,
    dispatchEmail,
    dispatchPassword,
    confirmPasswordMatch,
    tempValStore,
    onSignup,
    signupInfo
}) => {

    const { fetching } = signupInfo;

    const intl = useIntl();

    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});
    return (
        <div className="form">
        <span><h3>Sign Up</h3></span>
        { error?
            <span className={ 'feedBack' }><FormattedMessage id={ messageId } /></span>:
        null }
            <span>
                <input 
                    id="email" 
                    placeholder="Email address" 
                    type="text"
                    value={email}
                    onChange = { tempValStore }
                    onBlur = { ()=>dispatchEmail(email) }
                />
            </span>
            <span>
                <input 
                    id="password" 
                    placeholder="Password" 
                    type="password"
                    value={password}
                    onChange = { tempValStore }
                    onBlur = { ()=>dispatchPassword(password) }
                />
            </span>
            <span>
                <input 
                    id="passwordConfirm" 
                    placeholder="Confirm Password" 
                    type="password" 
                    value={passwordConfirm}
                    onChange = { tempValStore }
                    onBlur ={ ()=>confirmPasswordMatch(password, passwordConfirm) }
                />
            </span>
            <span>
                <button onClick={ ()=>{
                    if(!error)
                        onSignup(email, password);
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
                        signupLabel 
                    }
                </button>
            </span>
            <Link className="link span" to = { "/login" }>{ loginLabel }</Link> 
            <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
        </div>
    )
}

SignupForm.propTypes = {

}

export default SignupForm;