// popup.js

// Airtable configuration
const AIRTABLE_API_KEY  = 'patfmeHxaw3Vs5iiU.2fa91c8bffe35cbd26b95a8e7315641cf34b90b6553caf1815a0ded8c194f506';
const AIRTABLE_BASE_ID = 'app8EMe8KlU5dSbaS';
const AIRTABLE_TABLE   = 'CARDS';
const AIRTABLE_FIELD   = 'THE_URL';

// Copy text to clipboard with fallback
async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Always fetch the first record and overwrite its field; if none exists, create then overwrite
async function logToAirtable(url) {
  const headers = {
    'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    // Fetch the first record only
    const listEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}?maxRecords=1`;
    const listRes = await fetch(listEndpoint, { headers });
    const listData = await listRes.json();

    let recordId;
    if (Array.isArray(listData.records) && listData.records.length > 0) {
      // Use existing first record
      recordId = listData.records[0].id;
    } else {
      // No records: create a new one
      const createRes = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ fields: { [AIRTABLE_FIELD]: url } })
        }
      );
      const createData = await createRes.json();
      recordId = createData.id;
    }

    // Overwrite the record's URL field
    const patchEndpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}/${recordId}`;
    const patchRes = await fetch(patchEndpoint, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields: { [AIRTABLE_FIELD]: url } })
    });
    const patchData = await patchRes.json();
    if (!patchRes.ok) {
      console.error('Airtable patch failed:', patchData);
    }
  } catch (err) {
    console.error('Airtable error:', err);
  }
}

// On popup load: display URL and log to Airtable
document.addEventListener('DOMContentLoaded', () => {
  const urlDiv = document.getElementById('url');
  const copyBtn = document.getElementById('copyBtn');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = (tab && tab.url) ? tab.url : 'No active tab';
    urlDiv.textContent = url;
    if (tab && tab.url) {
      logToAirtable(url);
    }
  });

  // Copy button click handler
  copyBtn.addEventListener('click', () => {
    const text = urlDiv.textContent;
    if (text && text !== 'No active tab') {
      copyToClipboard(text).then(() => alert('URL скопирован в буфер обмена'));
    }
  });
});