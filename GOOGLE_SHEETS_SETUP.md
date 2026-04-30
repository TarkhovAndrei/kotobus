# Google Sheets Integration Setup

Follow these steps to connect the order form to a Google Sheet.

## 1. Create a Google Sheet

Create a new Google Sheet with these column headers in row 1:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Product Link | Notes | Full Name | Email | Phone | Country | City | Address | ZIP | Card Last 4 | Card Holder |

## 2. Create a Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp,
    data.productLink,
    data.productNotes,
    data.fullName,
    data.email,
    data.phone,
    data.country,
    data.city,
    data.address,
    data.zip,
    data.cardLast4,
    data.cardHolder,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment**
4. Select type: **Web app**
5. Set "Execute as" to **Me**
6. Set "Who has access" to **Anyone**
7. Click **Deploy** and copy the Web App URL

## 3. Add the URL to your environment

Paste the URL in `.env.local`:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 4. Restart the dev server

```bash
npm run dev
```

Orders will now be saved to your Google Sheet automatically.
