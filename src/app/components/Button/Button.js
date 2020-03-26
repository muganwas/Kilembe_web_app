import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from '@mdi/react';

const Button = ({iconPath, iconColor, size, text, textStyle, onPress, style, notification, notificationStyle, hoveredStyle, hoveredColor}) => {
  const [hovered=false, changeHovered]=useState();
  return (
    <View onMouseEnter={() => changeHovered(true)} onMouseLeave={() => changeHovered(false)}  style={hovered && hoveredStyle ? hoveredStyle : style}>
      { notification ? <View style={notificationStyle}></View> : null }
      <TouchableOpacity onPress={onPress} style={{display: iconPath ? 'table' : 'block'}}>
      { 
        iconPath ? 
        <Icon 
          className='table-cell'
          path={iconPath}
          size={size || 1}
          horizontal
          vertical
          rotate={180}
          color={hovered && hoveredColor ? hoveredColor : iconColor || 'black'}
        /> : 
        null 
      }
      { 
        text ?
        <Text style={textStyle}>{text}</Text> :
        null
      }
    </TouchableOpacity>
  </View>
  )
}

Button.propTypes = {
  iconPath: PropTypes.string,
  iconColor: PropTypes.string,
  size: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func,
  textStyle: PropTypes.number,
  notification: PropTypes.bool,
  notificationStyle: PropTypes.number,
  hoveredStyle: PropTypes.number,
  hoveredColor: PropTypes.string
}

export default Button;