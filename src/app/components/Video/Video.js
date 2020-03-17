import React from 'react';
import PropTyeps from 'prop-types';
import WebView from 'WebView';

const Video = ({uri, style}) => {
  return (
    <WebView
      style={style}
      source={{
        html: '<div>Hello world</div>'
      }}
    />
  )
}

Video.propTypes = {
  uri: PropTyeps.string.isRequired,
  style: PropTyeps.number
}

export default Video;