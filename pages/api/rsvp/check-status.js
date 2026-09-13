import { google } from 'googleapis';
import { getAuthClient } from '../sheets/auth';

  export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ error: 'Missing required field: guestId' });
    }

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'A:S',
});

    const rows = result.data.values || [];
    let guest = null;

    // Find the guest by ID (column A)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === guestId) {
        const row = rows[i];
        guest = {
                    id: row[0],
                    name: row[2],
                    category: row[1],
                    tier: row[5],
                    rsvpStatus: row[12],
                    seatsOnCard: row[7],
                    contact: row[15],
          };
        break;
      }
    }

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.status(200).json({ success: true, guest });
    } catch (error) {
    console.error('Error checking guest status:', error);
    res.status(500).json({ error: 'Failed to check guest status', message: error.message });
}
}
