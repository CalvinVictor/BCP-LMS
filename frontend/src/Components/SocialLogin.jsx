import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

// This component now takes functions to handle success and error from the parent
const SocialLogin = ({ onGoogleSuccess, onGoogleError }) => {
  return (
    <div className="flex flex-col items-center mb-6 w-full">
      {/* This is the official Google Login button. 
        When a user clicks it and signs in, it will call one of the functions we pass to it.
      */}
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
        width="320px"
        theme="filled_black"
        text="continue_with"
        shape="pill"
      />
    </div>
  );
};

export default SocialLogin;

