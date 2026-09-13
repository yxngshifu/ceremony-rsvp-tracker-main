// Frontend utility library for Google Sheets API integration
// Handles all communication with the backend API endpoints

export const googleSheetsClient = {
    /**
       * Fetch all guests from the Google Sheet
          * @returns {Promise<Array>} Array of guest objects
             */
    fetchGuestList: async () => {
          try {
                  console.log('[googleSheetsClient] Fetching guest list...');
                  const response = await fetch('/api/guests/get-list');
                  if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                  const data = await response.json();
                  console.log('[googleSheetsClient] Guest list fetched successfully', data);
                  return data;
                } catch (error) {
                  console.error('[googleSheetsClient] Error fetching guest list:', error);
                  throw error;
                }
        },

    /**
       * Submit or update RSVP for a guest
          * @param {string} guestId - The guest's ID
             * @param {string} name - The guest's name
                * @param {string} rsvpStatus - RSVP status (e.g., 'Yes', 'No', 'Maybe')
                   * @param {string} attendees - Number of attendees (optional)
                      * @param {string} notes - Additional notes (optional)
                         * @returns {Promise<Object>} Response from the API
                            */
    submitRSVP: async (guestId, name, rsvpStatus, attendees = '', notes = '') => {
          try {
                  console.log('[googleSheetsClient] Submitting RSVP for guest:', guestId);
                  const response = await fetch('/api/rsvp/submit', {
                            method: 'POST',
                            headers: {
                                        'Content-Type': 'application/json',
                                      },
                            body: JSON.stringify({
                                        guestId,
                                        name,
                                        rsvpStatus,
                                        attendees,
                                        notes,
                                      }),
                          });
                  if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                  const data = await response.json();
                  console.log('[googleSheetsClient] RSVP submitted successfully', data);
                  return data;
                } catch (error) {
                  console.error('[googleSheetsClient] Error submitting RSVP:', error);
                  throw error;
                }
        },

    /**
       * Check the current RSVP status for a guest
          * @param {string} guestId - The guest's ID
             * @returns {Promise<Object>} Guest object with current status
                */
    checkGuestStatus: async (guestId) => {
          try {
                  console.log('[googleSheetsClient] Checking status for guest:', guestId);
                  const response = await fetch('/api/rsvp/check-status', {
                            method: 'POST',
                            headers: {
                                        'Content-Type': 'application/json',
                                      },
                            body: JSON.stringify({ guestId }),
                          });
                  if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                  const data = await response.json();
                  console.log('[googleSheetsClient] Guest status retrieved', data);
                  return data;
                } catch (error) {
                  console.error('[googleSheetsClient] Error checking guest status:', error);
                  throw error;
                }
        },

    /**
       * Test the authentication with the backend
          * @returns {Promise<Object>} Authentication status response
             */
    testAuth: async () => {
          try {
                  console.log('[googleSheetsClient] Testing authentication...');
                  const response = await fetch('/api/sheets/auth');
                  if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                          }
                  const data = await response.json();
                  console.log('[googleSheetsClient] Authentication test successful', data);
                  return data;
                } catch (error) {
                  console.error('[googleSheetsClient] Authentication test failed:', error);
                  throw error;
                }
        },
  };

export default googleSheetsClient;
