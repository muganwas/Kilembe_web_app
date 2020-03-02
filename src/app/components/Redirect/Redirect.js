import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Header,
  Footer
} from 'components';

const Redirect = ({history}) => {
  useEffect(() => {
    const { location: { pathname } } = history;
    const pathnameArr = pathname.split('/');
    const redirectVar = pathnameArr.pop();
    if (redirectVar === 'dev') window.location.replace(process.env.DEV_PROFILE_URL);
    else history.push('/');
  })
  return (
    <div className="container Home">
      <Header />
        <div className="content">Redirecting...</div>
      <Footer />
    </div>
  )
}

export default withRouter(Redirect);

