import React from 'react';
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

    let { 
        email,
        password,
        dispatchEmail, 
        dispatchPassword,
        tempValStore,
        onSubmit,
        error,
        loginInfo,
        messageId, 
        thirdPartyAuthentication, 
        thirdPartyAuthHandler, 
        fetchIdToken
    } = props;
    const { fetching } = loginInfo;
    const intl = useIntl();

    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});
    const facebookLoginLabel = intl.formatMessage({id:"auth.facebookLoginLabel"});
    const googleLoginLabel = intl.formatMessage({id:"auth.googleLoginLabel"});
    const fbAuth = new Firebase.auth.FacebookAuthProvider();
    const googleAuth = new Firebase.auth.GoogleAuthProvider();

    return (
        <div className="form">
            <span><h3>{ loginLabel }</h3></span>
            { 
                error?
                <span className={ 'feedBack' }><FormattedMessage id={ messageId } /></span>: 
                null 
            }
            <div>
                <span>
                    <input 
                        id="email" 
                        placeholder="Email address" 
                        type="text" 
                        value = { email }
                        onBlur = { ()=>dispatchEmail(email) }
                        onChange = { tempValStore }
                    />
                </span>
                <span>
                    <input 
                        id="password" 
                        placeholder="Password" 
                        type="password"
                        value = { password }
                        onBlur = { ()=>dispatchPassword(password) }
                        onChange = { tempValStore }
                    />
                </span>
                <span>
                    <button 
                        onClick={ () => {
                            if(!error)
                                onSubmit(loginInfo) 
                        } } 
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
                onClick={ ()=>thirdPartyAuthentication( fbAuth, thirdPartyAuthHandler, fetchIdToken ) }
                >
                { facebookLoginLabel }
                </button>
            </span>
            <span>
                <button 
                id="google" 
                className="icon-google" 
                onClick={ ()=>thirdPartyAuthentication( googleAuth, thirdPartyAuthHandler, fetchIdToken ) }
                >
                { googleLoginLabel }
                </button>
            </span>
        </div>
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
    thirdPartyAuthHandler: PropTypes.func.isRequired, 
    fetchIdToken: PropTypes.func.isRequired
}

export default LoginForm;