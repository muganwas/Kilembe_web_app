import React, { useState, /*useEffect*/ } from 'react';
import PropTypes from 'prop-types';
import Firebase from 'firebase/app';
import { 
    FormattedMessage, 
    useIntl
} from 'react-intl';
import { Link } from 'react-router-dom';
import styles from './styling/styles';
import { View, TextInput, Text } from 'react-native';
import { AuthButton, Button } from 'components/';
import { SUBMIT_FORM_DELAY } from 'misc/constants';
import { mdiGoogle, mdiFacebook } from '@mdi/js';
import mainStyles from 'styles/mainStyles';

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
        thirdPartyAuthHandler,
        online,
        loggedInElsewhere,
        signOut
    } = props;
    const { fetching, tempUID } = loginInfo;
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
        // just in case there was no time to dispatch password onblur
        dispatchPassword(password);
        setTimeout(() => {
            if (!error) onSubmit(loginInfo);
        }, SUBMIT_FORM_DELAY);
    }

    return (
        <View style={mainStyles.form}>
            <View>
                <Text style={mainStyles.titleMedium}>{ loginPageTitle }</Text>
            </View>
            { 
                error ?
                <Text style={mainStyles.feedBack}>
                    <FormattedMessage id={ messageId } />
                    { 
                        loggedInElsewhere ?
                        <Button
                            style={styles.resetSessionButtonContainer}
                            textStyle={styles.resetSessionText}
                            hoveredStyle={styles.resetSessionButtonContainerOnHover}
                            text='Logout Everywhere'
                            onPress={() => signOut(true, tempUID)}
                            size={1}
                        />  :
                        null
                    }
                </Text> : 
                null 
            }
            <form onSubmit={localSubmit}>
                <View>
                    <TextInput 
                        id="email" 
                        style={styles.textInput}
                        placeholder="Email address" 
                        value = { email }
                        onBlur = { () => dispatchEmail(email) }
                        onChange = { e => changeEmail(e.target.value) }
                    />
                </View>
                <View>
                    <TextInput 
                        id="password" 
                        style={styles.textInput}
                        placeholder="Password" 
                        secureTextEntry={true}
                        value = { password }
                        onBlur = { () => dispatchPassword(password) }
                        onChange = { e => changePassword(e.target.value) }
                    />
                </View>
                <View>
                    <AuthButton
                        buttonStyle={online ? mainStyles.authSubmitButton : mainStyles.authSubmitButtonOffline}
                        textStyle={styles.submitButtonText}
                        text={loginLabel}
                        onPress={localSubmit}
                        processing={fetching}
                        disabled={!online}
                    />
                </View>
            </form>
            <View style={mainStyles.alternatives}>
                <Link className="link span" to = { "/signup" }>{ signupLabel }</Link> 
                <Link className="link span" to={ "/reset" }>{ forgotPasswordLabel }</Link>
            </View>
            <View>
                <AuthButton
                    id="facebook"
                    buttonStyle={online ? styles.facebookAuth : styles.facebookAuthOffline}
                    textStyle={styles.facebookAuthText}
                    iconPath={mdiFacebook}
                    iconColor={'white'}
                    text={facebookLoginLabel} 
                    onPress={ () => thirdPartyAuthentication( fbAuth, thirdPartyAuthHandler ) }
                    disabled={!online}
                />
            </View>
            <View>
                <AuthButton 
                    id="google"
                    buttonStyle={online ? styles.googleAuth : styles.googleAuthOffline}
                    textStyle={styles.googleAuthText}
                    iconPath={mdiGoogle}
                    iconColor={'white'}
                    text={googleLoginLabel} 
                    onPress={ () => thirdPartyAuthentication( googleAuth, thirdPartyAuthHandler ) }
                    disabled={!online}
                />
            </View>
        </View>
    )
}

LoginForm.propTypes = {
    dispatchEmail: PropTypes.func.isRequired,
    dispatchPassword: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.bool, 
    online: PropTypes.bool.isRequired,
    messageId: PropTypes.string, 
    thirdPartyAuthentication: PropTypes.func.isRequired, 
    thirdPartyAuthHandler: PropTypes.func.isRequired,
    online: PropTypes.bool.isRequired,
    loggedInElsewhere: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired
}

export default LoginForm;