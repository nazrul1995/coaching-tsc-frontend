'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { socialLogin } from '@/lib/api/auth';

type CredentialResponse = {
  credential?: string;
  clientId?: string;
};

export default function GoogleLoginButton() {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      // Send the credential JWT to backend for decoding and processing
      const res = await socialLogin({ 
        credential: credentialResponse.credential 
      } as CredentialResponse);

      if (res.success) {
        login(res.token, res.user);
      }
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log('Google login failed')}
    />
  );
}