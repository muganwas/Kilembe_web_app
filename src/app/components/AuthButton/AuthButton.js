import React from 'react';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';
import Icon from '@mdi/react';
import { 
  TouchableOpacity,
  Text,
  View
} from 'react-native';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

const AuthButton = ({buttonStyle, textStyle, processing, onPress, text, iconColor, iconPath}) => {
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} >
      { processing ?
          <ScaleLoader
              css={override}
              sizeUnit={"px"}
              height={10}
              width={3}
              radius={3}
              color={'#757575'}
              loading={processing} 
          /> :
        <View style={{display:'table'}}>
              { iconPath ? 
                <Icon 
                  className='table-cell'
                  path={iconPath}
                  size={1}
                  horizontal
                  vertical
                  rotate={180}
                  color={iconColor || 'black'}
                /> : 
                null 
              }
              <Text style={textStyle}>{text}</Text>
        </View>
        
      }
    </TouchableOpacity>
  )
}

AuthButton.propTypes = {
  buttonStyle: PropTypes.object,
  textStyle: PropTypes.object,
  processing: PropTypes.bool,
  onpress: PropTypes.func,
  text: PropTypes.string,
  iconColor: PropTypes.string,
  iconPath: PropTypes.string
}

export default AuthButton;
