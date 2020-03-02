import React from 'react';
import {
    Header,
    Footer
} from 'components';

const NotFound = () => {
    return (
        <div className="container Home">
            <Header />
            <div className="content">
                <h3>Page Not Found!</h3>
            </div>
            <Footer />  
        </div>
    )
}

export default NotFound;