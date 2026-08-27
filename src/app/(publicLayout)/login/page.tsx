'use client';
import React, { Suspense } from 'react';
import LoginContent from './LoginContent';

const Login = () => {
  return (
   <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;