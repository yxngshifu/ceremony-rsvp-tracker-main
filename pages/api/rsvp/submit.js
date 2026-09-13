import { google } from 'googleapis';
import { getAuthClient } from '../sheets/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
        }

          try {
              const { guestId, name, rsvpStatus, attendees = '', contact = '', notes = '' } = req.body;

                  if (!guestId || !name || !rsvpStatus) {
                        return res.status(400).json({ error: 'Missing required fields: guestId, name, rsvpStatus' });
                            }

                                const auth = await getAuthClient();
                                    const sheets = google.sheets({ version: 'v4', auth });

                                        // Get current data to find the guest row
                                            const result = await sheets.spreadsheets.values.get({
                                                  spreadsheetId: process.env.GOOGLE_SHEETS_ID,
                                                        range: 'A:S',
                                                            });

                                                                const rows = result.data.values || [];
                                                                    let guestRowIndex = -1;

                                                                        // Find the guest row by ID (column A)
                                                                            for (let i = 1; i < rows.length; i++) {
                                                                                  if (rows[i][0] === guestId) {
                                                                                          guestRowIndex = i;
                                                                                                  break;
                                                                                                        }
                                                                                                            }
                                                                                                            
                                                                                                                if (guestRowIndex === -1) {
                                                                                                                      return res.status(404).json({ error: 'Guest not found' });
                                                                                                                          }
                                                                                                                          
                                                                                                                              // Prepare update data for columns M, P, R, S
                                                                                                                                  // M = rsvpStatus (index 12)
                                                                                                                                      // P = attendees (index 15)
                                                                                                                                          // R = contact (index 17)
                                                                                                                                              // S = notes (index 18)
                                                                                                                                              
                                                                                                                                                  const rowNumber = guestRowIndex + 1;
                                                                                                                                                      const updates = [];
                                                                                                                                                      
                                                                                                                                                          if (rsvpStatus) {
                                                                                                                                                                updates.push({
                                                                                                                                                                        range: `M${rowNumber}`,
                                                                                                                                                                                values: [[rsvpStatus]],
                                                                                                                                                                                      });
                                                                                                                                                                                          }
                                                                                                                                                                                          
                                                                                                                                                                                              if (attendees) {
                                                                                                                                                                                                    updates.push({
                                                                                                                                                                                                            range: `P${rowNumber}`,
                                                                                                                                                                                                                    values: [[attendees]],
                                                                                                                                                                                                                          });
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                              
                                                                                                                                                                                                                                  if (contact) {
                                                                                                                                                                                                                                        updates.push({
                                                                                                                                                                                                                                                range: `R${rowNumber}`,
                                                                                                                                                                                                                                                        values: [[contact]],
                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                      if (notes) {
                                                                                                                                                                                                                                                                            updates.push({
                                                                                                                                                                                                                                                                                    range: `S${rowNumber}`,
                                                                                                                                                                                                                                                                                            values: [[notes]],
                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                                                          await sheets.spreadsheets.values.batchUpdate({
                                                                                                                                                                                                                                                                                                                spreadsheetId: process.env.GOOGLE_SHEETS_ID,
                                                                                                                                                                                                                                                                                                                      requestBody: {
                                                                                                                                                                                                                                                                                                                              data: updates,
                                                                                                                                                                                                                                                                                                                                      valueInputOption: 'RAW',
                                                                                                                                                                                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                    res.status(200).json({ success: true, message: `RSVP updated for guest ${name}` });
                                                                                                                                                                                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                                                                                                                                                                                          console.error('Error updating RSVP:', error);
                                                                                                                                                                                                                                                                                                                                                              res.status(500).json({ error: 'Failed to update RSVP', message: error.message });
                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                }
