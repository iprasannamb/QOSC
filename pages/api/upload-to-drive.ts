import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// Google Drive API configuration
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_REFRESH_TOKEN;

type ResponseData = {
  fileUrl: string;
} | {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, folderPath, mimeType, base64Data } = req.body;

    if (!fileName || !folderPath || !mimeType || !base64Data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN
    });

    // Create Drive client
    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client
    });

    // Create folder path if it doesn't exist
    const folderId = await createFolderPath(drive, folderPath);

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType: mimeType
      },
      media: {
        mimeType: mimeType,
        body: buffer
      },
      fields: 'id,webViewLink'
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive');
    }

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get direct download URL
    const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

    return res.status(200).json({ fileUrl });
  } catch (error) {
    console.error('Error in upload-to-drive API:', error);
    return res.status(500).json({ error: 'Failed to upload file to Google Drive' });
  }
}

// Helper function to create folder path in Google Drive
async function createFolderPath(drive: any, folderPath: string): Promise<string> {
  const folders = folderPath.split('/').filter(Boolean);
  let parentId = 'root';
  
  for (const folderName of folders) {
    // Check if folder exists
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`,
      fields: 'files(id, name)'
    });
    
    if (response.data.files && response.data.files.length > 0) {
      // Folder exists, use its ID as parent for next folder
      parentId = response.data.files[0].id;
    } else {
      // Create new folder
      const folderResponse = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId]
        },
        fields: 'id'
      });
      
      parentId = folderResponse.data.id;
    }
  }
  
  return parentId;
}