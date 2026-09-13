import { google } from 'googleapis';

let authClient = null;

export const getAuthClient = async () => {
    if (authClient) return authClient;

    try {
          authClient = new google.auth.GoogleAuth({
                  projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
                  clientEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                  privateKey: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });
          console.log('Google Auth initialized successfully');
          return authClient;
    } catch (error) {
          console.error('Error initializing Google Auth:', error);
          throw error;
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  try {
        const auth = await getAuthClient();
        console.log('Authentication configured successfully');
        res.status(200).json({
                success: true,
                message: 'Authentication configured',
        });
  } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
                error: 'Authentication failed',
                message: error.message,
        });
  }
}
