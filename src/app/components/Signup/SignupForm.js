import React from 'react';
import { 
    FormattedMessage, 
    useIntl
} from 'react-intl';

const SignupForm = ({
    error, 
    messageId,
    emailOnChange,
    passwordOnChange,
    confirmPasswordMatch,
    onSignup
}) => {

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
            <span><input id="email" placeholder="Email address" type="text" onBlur = { emailOnChange }/></span>
            <span><input id="pass" placeholder="Password" type="password" onBlur = { passwordOnChange }/></span>
            <span><input id="passConfirm" placeholder="Confirm Password" type="password" onBlur ={ confirmPasswordMatch }/></span>
            <span><button onClick={ ()=>onSignup }>{ signupLabel }</button></span>
            <Link className="link span" to = { "/login" }>{ loginLabel }</Link> 
            <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
        </div>
    )
}

export default SignupForm;