import React, { useState } from 'react';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import Firebase from 'firebase/app';
import { ScaleLoader } from 'react-spinners';
import { 
    FormattedMessage, 
    useIntl
} from 'react-intl';
import { Link } from 'react-router-dom';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

const LoginForm = props => {

    const [email = '', changeEmail] = useState();
    const [password = '', changePassword] = useState();

    let { 
        dispatchEmail, 
        dispatchPassword,
        onSubmit,
        error,
        loginInfo,
        messageId, 
        thirdPartyAuthentication, 
        thirdPartyAuthHandler
    } = props;
    const { fetching } = loginInfo;
    const intl = useIntl();

    const loginPageTitle = intl.formatMessage({id:"login.pageTitle"});
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});
    const facebookLoginLabel = intl.formatMessage({id:"auth.facebookLoginLabel"});
    const googleLoginLabel = intl.formatMessage({id:"auth.googleLoginLabel"});
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();

    const localSubmit = e => { 
        e.preventDefault();
        //dispatchEmail(email);
        dispatchPassword(password);
        setTimeout(() => {
            if(!error) onSubmit(loginInfo);
        }, 1000);
    }

    return (
        <form id="login-form" onSubmit={localSubmit} className="form">
            <span>
                <h3>{ loginPageTitle }</h3>
            </span>
            { 
                error?
                <span className={ 'feedBack' }>
                    <FormattedMessage id={ messageId } />
                </span>: 
                null 
            }
            <div>
                <span>
                    <input 
                        id="email" 
                        placeholder="Email address" 
                        type="text" 
                        value = { email }
                        onBlur = { () => dispatchEmail(email) }
                        onChange = { e => changeEmail(e.target.value) }
                    />
                </span>
                <span>
                    <input 
                        id="password" 
                        placeholder="Password" 
                        type="password"
                        value = { password }
                        onBlur = { () => dispatchPassword(password) }
                        onChange = { e => changePassword(e.target.value) }
                    />
                </span>
                <span>
                    <button 
                        type="submit" 
                    >
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
                            loginLabel 
                        }
                    </button>
                </span>
            </div>
            <Link className="link span" to = { "/signup" }>{ signupLabel }</Link> 
            <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
            <span>
                <button 
                id="facebook" 
                className="icon-facebook-squared" 
                onClick={ () => thirdPartyAuthentication( fbAuth, thirdPartyAuthHandler ) }
                >
                { facebookLoginLabel }
                </button>
            </span>
            <span>
                <button 
                id="google" 
                className="icon-google" 
                onClick={ () => thirdPartyAuthentication( googleAuth, thirdPartyAuthHandler ) }
                >
                { googleLoginLabel }
                </button>
            </span>
        </form>
    )
}

LoginForm.propTypes = {
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    dispatchEmail: PropTypes.func.isRequired,
    dispatchPassword: PropTypes.func.isRequired,
    tempValStore: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.bool, 
    messageId: PropTypes.string, 
    thirdPartyAuthentication: PropTypes.func.isRequired, 
    thirdPartyAuthHandler: PropTypes.func.isRequired
}

export default LoginForm;