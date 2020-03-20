import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { View } from 'react-native';
import { ScaleLoader } from 'react-spinners';

const Scaleloader = ({borderColor, containerStyle, height, width, radius, color, loading}) => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: ${borderColor || '#757575'};
`;
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
  loading: PropTypes.bool.isRequired,
  borderColor: PropTypes.string
}

export default Scaleloader;
