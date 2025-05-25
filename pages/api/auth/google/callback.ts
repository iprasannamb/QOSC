import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get authorization code from query parameters
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${req.headers.origin}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(error.error_description || 'Failed to exchange code for tokens');
    }

    const { access_token, id_token } = await tokenResponse.json();

    // Get user info with the access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userInfo = await userInfoResponse.json();

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create a new user if they don't exist
    // 3. Generate a session or JWT token

    // For now, we'll just set a cookie indicating the user is logged in
    res.setHeader('Set-Cookie', [
      serialize('isLoggedIn', 'true', { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false 
      }),
      serialize('user', JSON.stringify({
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture
      }), { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: false 
      })
    ]);

    // Redirect back to the home page
    res.redirect('/');
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.redirect('/?error=authentication_failed');
  }
}