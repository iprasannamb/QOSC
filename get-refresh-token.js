const { google } = require('googleapis');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');

// Replace with your OAuth credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = ['https://www.googleapis.com/auth/drive.file'];

async function getRefreshToken() {
  // Generate the url that will be used for authorization
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'  // Force to get refresh token
  });

  // Open the authorization url in the default browser
  console.log('Opening browser for authorization...');
  open(authorizeUrl, { wait: false });

  // Create a local server to receive the callback
  const server = http
    .createServer(async (req, res) => {
      try {
        // Get the code from the callback
        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
        const code = qs.get('code');
        
        if (code) {
          // Close the browser
          res.end('Authentication successful! You can close this window.');
          
          // Get tokens
          const { tokens } = await oauth2Client.getToken(code);
          console.log('\nRefresh Token:', tokens.refresh_token);
          console.log('\nAccess Token:', tokens.access_token);
          
          // Close the server
          server.destroy();
        }
      } catch (e) {
        res.end('Error: ' + e.message);
        console.error(e);
        server.destroy();
      }
    })
    .listen(3000, () => {
      console.log('Server listening on http://localhost:3000');
    });
  
  destroyer(server);
}

getRefreshToken();