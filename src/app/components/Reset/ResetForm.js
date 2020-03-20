import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './styling/styles';
import { View, TextInput, Text } from 'react-native';
import { AuthButton } from 'components/';
import mainStyles from 'styles/mainStyles';

const ResetForm = ({
    feedback,
    messageId,
    resetInfo,
    dispatchEmail,
    onReset,
    online
}) => {
    const [email='', changeEmail]=useState();

    const { fetching } = resetInfo;

    const intl = useIntl();
    const pageTitle = intl.formatMessage({id:"reset.pageTitle"});
    const loginLabel = intl.formatMessage({id:"auth.loginLabel"});
    const signupLabel = intl.formatMessage({id:"auth.signupLabel"});
    const forgotPasswordLabel = intl.formatMessage({id:"auth.forgotPasswordLabel"});

    return (
        <View style={mainStyles.form}>
            <View>
                <Text style={mainStyles.titleMedium}>{ pageTitle }</Text>
            </View>
            { feedback ? 
            <Text style={mainStyles.feedBack}>
                <FormattedMessage id = { messageId } />
            </Text> : 
            null }
            <View>
                <TextInput 
                    id="email" 
                    placeholder="Email address" 
                    type="email"
                    style={styles.textInput}
                    value={email}
                    onChange={ e => changeEmail(e.target.value) }
                    onBlur={ () => dispatchEmail(email) }
                />
            </View>
            <View>
                <AuthButton
                    buttonStyle={online ? mainStyles.authSubmitButton : mainStyles.authSubmitButtonOffline}
                    textStyle={styles.submitButtonText}
                    text={forgotPasswordLabel}
                    onPress={
                        () => {
                            if(!feedback) onReset(email)
                        }
                    }
                    processing={fetching}
                    disabled={!online}
                />
            </View>
            <View style={mainStyles.alternatives}>
                <Link className="link span" to = { "/login" }>{ loginLabel }</Link> 
                <Link className="link span" to={ "/signup" }>{ signupLabel }</Link>
            </View>
        </View>
    )
}

ResetForm.propTypes = {
    feedback: PropTypes.bool,
    messageId: PropTypes.string,
    resetInfo: PropTypes.object.isRequired,
    dispatchEmail: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    online: PropTypes.bool.isRequired
}

export default ResetForm;