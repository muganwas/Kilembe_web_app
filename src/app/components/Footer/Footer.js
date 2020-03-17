import React from 'react';
import { View, Text } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { Donate } from 'components';
import { Link } from 'react-router-dom';
import styles from './styling/styles';

const Footer = () => {
    return (
        <View style={styles.footerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.footerText}><FormattedMessage id={"site.copyrightText"} /></Text>
                <Link style={styles.link} to={'/redirect/dev'}>
                    <Text style={styles.devName}><FormattedMessage id={"dev.name"}/></Text>
                </Link> 
            </View>
            <Donate /> 
        </View>
    )
}

export default Footer;