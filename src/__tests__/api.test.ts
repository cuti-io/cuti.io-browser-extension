import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createShortLink, ApiError } from '../api';

vi.mock('../config', () => ({
  CONFIG: {
    API_BASE_URL: 'https://cuti.io/api',
    SHORT_URL_BASE: 'https://cuti.io',
  },
}));

describe('createShortLink', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('returns the full short URL on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ alias: 'abc123' }),
    } as Response);

    const result = await createShortLink('https://example.com/long/path', 'cuti_testkey');

    expect(result).toBe('https://cuti.io/abc123');
    expect(fetch).toHaveBeenCalledWith('https://cuti.io/api/links/v1/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer cuti_testkey',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://example.com/long/path' }),
    });
  });

  it('throws ApiError with "Invalid API key" message on 401', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 401 } as Response);
    await expect(createShortLink('https://example.com', 'bad')).rejects.toThrow(
      'Invalid API key. Check your settings.'
    );
  });

  it('throws ApiError with "Invalid API key" message on 403', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 403 } as Response);
    await expect(createShortLink('https://example.com', 'bad')).rejects.toThrow(
      'Invalid API key. Check your settings.'
    );
  });

  it('throws ApiError with "This domain is not allowed." on 403 DOMAIN_BANNED', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ code: 'DOMAIN_BANNED' }),
    } as Response);
    await expect(createShortLink('https://malware.example.com', 'cuti_k')).rejects.toThrow(
      'This domain is not allowed.'
    );
  });

  it('throws ApiError on 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 429 } as Response);
    await expect(createShortLink('https://example.com', 'cuti_k')).rejects.toThrow(
      'Too many requests — please wait a moment.'
    );
  });

  it('throws ApiError on 503', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 503 } as Response);
    await expect(createShortLink('https://example.com', 'cuti_k')).rejects.toThrow('Service temporarily unavailable.');
  });

  it('throws ApiError on unknown HTTP error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);
    await expect(createShortLink('https://example.com', 'cuti_k')).rejects.toThrow(
      'Something went wrong. Please try again.'
    );
  });

  it('throws ApiError on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(createShortLink('https://example.com', 'cuti_k')).rejects.toThrow(
      'Could not connect. Check your internet connection.'
    );
  });

  it('throws ApiError (not a generic Error) on failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 401 } as Response);
    await expect(createShortLink('https://example.com', 'bad')).rejects.toBeInstanceOf(ApiError);
  });
});
