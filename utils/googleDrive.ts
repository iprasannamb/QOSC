import { google } from 'googleapis';

// Google Drive API configuration
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_REFRESH_TOKEN;

// Create OAuth2 client
const getAuthClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });

  return oauth2Client;
};

// Function to upload file to Google Drive
export const uploadToDrive = async (
  file: File,
  folderPath: string,
  fileName: string
): Promise<string> => {
  try {
    // Since we're in the browser, we need to use a server-side API route
    // to handle the actual upload to Google Drive
    
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Send to our API endpoint
    const response = await fetch('/api/upload-to-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        folderPath,
        mimeType: file.type,
        base64Data,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file to Google Drive');
    }
    
    const data = await response.json();
    return data.fileUrl;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};
