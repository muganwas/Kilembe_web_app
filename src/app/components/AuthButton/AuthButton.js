import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { Scaleloader } from 'components';
import { 
  TouchableOpacity,
  Text,
  View
} from 'react-native';

const AuthButton = ({buttonStyle, textStyle, processing, onPress, text, iconColor, iconPath, disabled=false}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={buttonStyle} >
      { processing ?
          <Scaleloader
              height={10}
              width={3}
              radius={3}
              color={'#757575'}
              borderColor={'#757575'}
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
  buttonStyle: PropTypes.number,
  textStyle: PropTypes.number,
  processing: PropTypes.bool,
  onpress: PropTypes.func,
  text: PropTypes.string,
  iconColor: PropTypes.string,
  iconPath: PropTypes.string,
  disabled: PropTypes.bool
}

export default AuthButton;
