import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

// Google Drive API configuration
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_SECRET;
const RED