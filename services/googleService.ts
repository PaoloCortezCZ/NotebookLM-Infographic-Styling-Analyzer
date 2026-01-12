
import { SavedStyle } from "../types";

const SHEETS_API_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files";

/**
 * Searches for an existing vault file in the user's Google Drive.
 */
async function findExistingSheet(accessToken: string): Promise<string | null> {
  // If we are in bypass mode, do not attempt to call Google Drive API
  if (accessToken === 'local_bypass_token' || accessToken.startsWith('mock_')) return null;

  const query = encodeURIComponent("name = 'StyleArchitect_Vault' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
  const url = `${DRIVE_API_URL}?q=${query}&fields=files(id, name)`;
  
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  } catch (e) {
    return null;
  }
}

/**
 * Ensures a style vault exists for the user.
 * Checks for existing file first to avoid duplicates.
 */
export async function initializeUserSheet(accessToken: string): Promise<string> {
  // Handle Developer Pass or Mock environments
  if (accessToken === 'local_bypass_token' || accessToken.startsWith('mock_')) {
    return "demo_vault_id";
  }

  // Check cache
  const cachedId = localStorage.getItem('style_architect_sheet_id');
  if (cachedId) return cachedId;

  // Search Drive for existing file
  const existingId = await findExistingSheet(accessToken);
  if (existingId) {
    localStorage.setItem('style_architect_sheet_id', existingId);
    return existingId;
  }

  // Create new if none found
  const response = await fetch(SHEETS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      properties: { title: "StyleArchitect_Vault" },
      sheets: [{
        properties: { 
          title: "Visual DNA Records",
          gridProperties: { frozenRowCount: 1 }
        },
        data: [{
          startRow: 0,
          startColumn: 0,
          rowData: [{
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
          }],
        }],
      }],
    }),
  });

  if (!response.ok) {
    // If it's a 401/403 (expected in AI Studio), degrade to demo mode silently
    if (response.status === 401 || response.status === 403) {
      console.warn("Unauthorized to create sheet. Using local demo mode.");
      return "demo_vault_id";
    }
    throw new Error("Vault creation failed.");
  }

  const data = await response.json();
  localStorage.setItem('style_architect_sheet_id', data.spreadsheetId);
  return data.spreadsheetId;
}

/**
 * Fetches all styles from the Google Sheet to restore local state.
 */
export async function fetchStylesFromSheet(accessToken: string, spreadsheetId: string): Promise<SavedStyle[]> {
  if (accessToken === 'local_bypass_token' || accessToken.startsWith('mock_') || spreadsheetId === 'demo_vault_id') {
    return [];
  }
  
  const range = "Visual DNA Records!J2:J"; // Column J contains the JSON
  const url = `${SHEETS_API_URL}/${spreadsheetId}/values/${range}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) return [];

  const data = await response.json();
  if (!data.values) return [];

  return data.values.map((row: any[]) => {
    try {
      return JSON.parse(row[0]);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Appends a style definition as a new row.
 */
export async function appendStyleToSheet(accessToken: string, spreadsheetId: string, style: SavedStyle): Promise<void> {
  if (accessToken === 'local_bypass_token' || accessToken.startsWith('mock_') || spreadsheetId === 'demo_vault_id') {
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

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ values: [row] }),
  });
}
