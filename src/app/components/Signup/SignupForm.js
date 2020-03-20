import React, { useState } from 'react';
import { 
    FormattedMessage, 
    useIntl
} from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AuthButton } from 'components/';
import styles from './styling/styles';
import mainStyles from 'styles/mainStyles';
import { View, TextInput, Text } from 'react-native';

const SignupForm = ({
    error, 
    messageId,
    dispatchEmail,
    dispatchPassword,
    confirmPasswordMatch,
    onSignup,
    signupInfo,
    online
}) => {
    const [email = '', changeEmail] = useState();
    const [password = '', changePassword] = useState();
    const [passwordConfirm='', changePasswordConfirm] = useState();

    const localSubmit = e => {
        e.preventDefault();
        if (!error) onSignup(email, password); 
    }

    const { fetching } = signupInfo;

    const intl = useIntl();
    const signupPageTitle = intl.formatMessage({id:"signup.pageTitle"});
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});

    return (
        <View style={mainStyles.form}>
            <View>
                <Text style={mainStyles.titleMedium}>{ signupPageTitle}</Text>
            </View>
            { error ?
                <Text style={mainStyles.feedBack}><FormattedMessage id={ messageId } /></Text> :
            null }
            <form onSubmit={localSubmit}>
                <View>
                    <TextInput 
                        id="email" 
                        style={styles.textInput}
                        placeholder="Email address" 
                        type="text"
                        value={email}
                        onChange = { e => changeEmail(e.target.value) }
                        onBlur = { () => dispatchEmail(email) }
                    />
                </View>
                <View>
                    <TextInput 
                        id="password" 
                        style={styles.textInput}
                        placeholder="Password" 
                        secureTextEntry={true}
                        value={password}
                        onChange = { e => changePassword(e.target.value) }
                        onBlur = { () => dispatchPassword(password) }
                    />
                </View>
                <View>
                    <TextInput 
                        id="passwordConfirm" 
                        style={styles.textInput}
                        placeholder="Confirm Password" 
                        secureTextEntry={true}
                        value={passwordConfirm}
                        onChange = { e => changePasswordConfirm(e.target.value) }
                        onBlur ={ () => confirmPasswordMatch(password, passwordConfirm) }
                    />
                </View>
                <View>
                    <AuthButton 
                        buttonStyle={online ? mainStyles.authSubmitButton : mainStyles.authSubmitButtonOffline}
                        textStyle={styles.submitButtonText}
                        processing={fetching}
                        text={signupLabel} 
                        onPress={localSubmit}
                        disabled={!online}
                    />
                </View>
            </form>
            <View style={mainStyles.alternatives}>
                <Link className="link span" to = { "/login" }>{ loginLabel }</Link> 
                <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
            </View>
        </View>
    )
}

SignupForm.propTypes = {
    email: PropTypes.string, 
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    error: PropTypes.bool, 
    messageId: PropTypes.string,
    dispatchEmail: PropTypes.func.isRequired,
    dispatchPassword: PropTypes.func.isRequired,
    confirmPasswordMatch: PropTypes.func.isRequired,
    onSignup: PropTypes.func.isRequired,
    signupInfo: PropTypes.object,
    online: PropTypes.bool
}

export default SignupForm;