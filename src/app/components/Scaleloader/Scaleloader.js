import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { View } from 'react-native';
import { ScaleLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: #757575;
`;

const Scaleloader = ({containerStyle, height, width, radius, color, loading}) => {
  return (
    <View style={containerStyle}>
      <ScaleLoader
        css={override}
        sizeUnit={"px"}
        height={height}
        width={width}
        radius={radius}
        color={color}
        loading={loading} 
      />
    </View>
  )
}

Scaleloader.propTypes = {
  containerStyle: PropTypes.string || PropTypes.number,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Scaleloader;
