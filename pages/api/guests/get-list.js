import { google } from 'googleapis';
import { getAuthClient } from '../sheets/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
        }

          try {
              const auth = await getAuthClient();
                  const sheets = google.sheets({ version: 'v4', auth });

                      const result = await sheets.spreadsheets.values.get({
                            spreadsheetId: process.env.GOOGLE_SHEETS_ID,
                                  range: 'A:S',
                                      });

                                          const rows = result.data.values || [];
                                              const guests = rows.slice(1).map((row) => ({
                                                    id: row[0],
                                                          category: row[1],
                                                                name: row[2],
                                                                      title: row[3],
                                                                            organisation: row[4],
                                                                                  tier: row[5],
                                                                                        seatingArea: row[6],
                                                                                              seatsOnCard: row[7],
                                                                                                    dispatched: row[8],
                                                                                                          rsvpStatus: row[12],
                                                                                                                contact: row[15],
                                                                                                                      notes: row[18],
                                                                                                                          }));
                                                                                                                          
                                                                                                                              res.status(200).json({ success: true, totalGuests: guests.length, guests });
                                                                                                                                } catch (error) {
                                                                                                                                    res.status(500).json({ error: 'Failed to fetch guest list', message: error.message });
                                                                                                                                      }
                                                                                                                                      }
