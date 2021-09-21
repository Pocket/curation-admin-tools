import React, { FC, useCallback } from 'react';
import { Button } from '@material-ui/core';

const CLIENT_ID = '';
const AUTH_URL = '';

export const Login: FC = () => {
  const handleLogin = useCallback(async () => {
    const qParams = [
      `redirect_uri=http://localhost:3000/oauth_callback`,
      `scope=profile openid`,
      `response_type=token`,
      `client_id=${CLIENT_ID}`,
      `state=foo`,
    ].join('&');
    window.location.assign(`${AUTH_URL}?${qParams}`);
  }, []);

  return (
    <Button variant="contained" color="primary" onClick={handleLogin}>
      Login with SSO
    </Button>
  );
};
