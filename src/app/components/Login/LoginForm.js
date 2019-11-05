import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

const LoginForm = props => {
    const { emailOnChange, passwordOnChange, onSubmit } = props;
    const intl = useIntl();
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"})
    return (
        <div>
            <span><input id="email" placeholder="Email address" type="text" onChange={ emailOnChange }/></span>
            <span><input id="pass" placeholder="Password" type="password" onChange={ passwordOnChange }/></span>
            <span><button onClick={ onSubmit } type="submit" >{ loginLabel }</button></span>
        </div>
    )
}

LoginForm.propTypes = {
    emailOnChange: PropTypes.func.isRequired,
    passwordOnChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

export default LoginForm;