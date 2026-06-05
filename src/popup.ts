import { getApiKey } from './storage';
import { createShortLink, ApiError } from './api';

type StateId = 'state-no-key' | 'state-loading' | 'state-success' | 'state-error';

const ALL_STATES: StateId[] = ['state-no-key', 'state-loading', 'state-success', 'state-error'];

let lastShortUrl = '';

function showState(id: StateId): void {
  for (const stateId of ALL_STATES) {
    document.getElementById(stateId)?.classList.toggle('hidden', stateId !== id);
  }
}

function setErrorMessage(msg: string): void {
  const el = document.getElementById('error-message');
  if (el) el.textContent = msg;
}

function setShortUrl(url: string): void {
  lastShortUrl = url;
  const link = document.getElementById('short-url-link') as HTMLAnchorElement | null;
  if (link) {
    link.href = url;
    link.textContent = url;
  }
}

function openSettings(): void {
  chrome.runtime.openOptionsPage();
  window.close();
}

async function shortenCurrentTab(apiKey: string): Promise<void> {
  showState('state-loading');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url ?? '';

  if (
    !url ||
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('about:') ||
    url.startsWith('moz-extension://') ||
    url.startsWith('file://')
  ) {
    setErrorMessage('Cannot shorten browser internal pages.');
    showState('state-error');
    return;
  }

  try {
    const shortUrl = await createShortLink(url, apiKey);
    setShortUrl(shortUrl);
    showState('state-success');
    await navigator.clipboard.writeText(shortUrl).catch(() => undefined);
  } catch (err) {
    setErrorMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    showState('state-error');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Settings buttons are present in success + error states
  document.getElementById('btn-settings-success')?.addEventListener('click', openSettings);
  document.getElementById('btn-settings-error')?.addEventListener('click', openSettings);

  const apiKey = await getApiKey();

  if (!apiKey) {
    showState('state-no-key');
    document.getElementById('btn-open-settings')?.addEventListener('click', openSettings);
    return;
  }

  // "Try again" re-runs the full flow
  document.getElementById('btn-retry')?.addEventListener('click', () => {
    void shortenCurrentTab(apiKey);
  });

  // "Copy again" re-copies whatever the current short URL link shows
  document.getElementById('btn-copy-again')?.addEventListener('click', () => {
    if (lastShortUrl) void navigator.clipboard.writeText(lastShortUrl);
  });

  await shortenCurrentTab(apiKey);
});
