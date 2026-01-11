
import { SavedStyle } from "../types";

const SHEETS_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";

/**
 * Ensures a style vault exists for the user.
 * If not, creates a new Google Sheet named 'StyleArchitect_Vault'.
 */
export async function initializeUserSheet(accessToken: string): Promise<string> {
  // Simulation bypass for demo mode
  if (accessToken.startsWith('mock_')) {
    console.log("Demo Mode: Simulating Google Sheet initialization.");
    return "demo_spreadsheet_id_" + Date.now();
  }

  // First, check if sheet exists in local cache to avoid API calls
  const cachedId = localStorage.getItem('style_architect_sheet_id');
  if (cachedId) return cachedId;

  const response = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      properties: {
        title: "StyleArchitect_Vault",
      },
      sheets: [
        {
          properties: {
            title: "Visual DNA Records",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: "TIMESTAMP" } },
                    { userEnteredValue: { stringValue: "STYLE NAME" } },
                    { userEnteredValue: { stringValue: "STYLE ID" } },
                    { userEnteredValue: { stringValue: "TONE" } },
                    { userEnteredValue: { stringValue: "BG COLOR" } },
                    { userEnteredValue: { stringValue: "TEXT COLOR" } },
                    { userEnteredValue: { stringValue: "ACCENT" } },
                    { userEnteredValue: { stringValue: "TYPOGRAPHY" } },
                    { userEnteredValue: { stringValue: "TAGS" } },
                    { userEnteredValue: { stringValue: "FULL JSON DNA" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Google Sheet vault.");
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  localStorage.setItem('style_architect_sheet_id', spreadsheetId);
  return spreadsheetId;
}

/**
 * Appends a style definition as a new row in the user's spreadsheet.
 */
export async function appendStyleToSheet(
  accessToken: string,
  spreadsheetId: string,
  style: SavedStyle
): Promise<void> {
  // Simulation bypass for demo mode
  if (accessToken.startsWith('mock_')) {
    console.log("Demo Mode: DNA Backup Simulated for " + style.styleName);
    return;
  }

  const range = "Visual DNA Records!A:J";
  const url = `${SHEETS_API_URL}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const row = [
    new Date(style.timestamp).toISOString(),
    style.styleName,
    style.styleId,
    style.overallDesignSettings.tone,
    style.visualIdentity.backgroundColor,
    style.visualIdentity.textColor,
    style.visualIdentity.accentColor,
    style.typography.heading,
    style.tags.join(", "),
    JSON.stringify(style),
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      values: [row],
    }),
  });

  if (!response.ok) {
    throw new Error("Cloud backup failed.");
  }
}
