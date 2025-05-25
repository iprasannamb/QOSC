import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { google } from 'googleapis';
import fs from 'fs';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Get the uploaded file
    const file = files.file as formidable.File;
    const folderPath = fields.folderPath as string;
    const fileName = fields.fileName as string;

    // Set up Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Create or find the folder
    const folderIds = await createFolderPath(drive, folderPath);
    const folderId = folderIds[folderIds.length - 1];

    // Upload the file
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: file.mimetype || 'application/octet-stream',
      body: fs.createReadStream(file.filepath),
    };

    const driveResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: driveResponse.data.id as string,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return the file URL
    return res.status(200).json({ 
      fileUrl: driveResponse.data.webViewLink 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

// Helper function to create nested folders
async function createFolderPath(drive: any, path: string) {
  const folderNames = path.split('/').filter(Boolean);
  const folderIds = [];
  let parentId = 'root';

  for (const folderName of folderNames) {
    // Check if folder exists
    const response = await drive.files.list({
      q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    let folderId;
    if (response.data.files.length > 0) {
      // Folder exists
      folderId = response.data.files[0].id;
    } else {
      // Create folder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      };
      
      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });
      
      folderId = folder.data.id;
    }
    
    folderIds.push(folderId);
    parentId = folderId;
  }
  
  return folderIds;
}