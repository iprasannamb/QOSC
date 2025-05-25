// Google OAuth configuration
export const GOOGLE_AUTH_CONFIG = {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirect_uri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/google/callback` : '',
  scope: 'email profile',
  response_type: 'code',
};

// Function to initiate Google OAuth flow
export const initiateGoogleAuth = () => {
  const { client_id, redirect_uri, scope, response_type } = GOOGLE_AUTH_CONFIG;
  
  // Create OAuth URL with parameters
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', client_id);
  authUrl.searchParams.append('redirect_uri', redirect_uri);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('response_type', response_type);
  authUrl.searchParams.append('prompt', 'select_account');
  
  // Redirect to Google's OAuth page
  window.location.href = authUrl.toString();
};