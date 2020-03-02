import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const KLoader = ({ type, color, height, width }) => {
    return (
        <div className="loader-container">
            <Loader 
                type={ type }
                color= { color }
                height={ height }
                width={ width }
            />
        </div>
    )
}

KLoader.propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}

export default KLoader;