import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApiKey, setApiKey } from '../storage';

// chrome global is stubbed in setup.ts
const mockSync = chrome.storage.local as unknown as {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
};

describe('getApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the stored key', async () => {
    mockSync.get.mockImplementation((_keys: string[], cb: (r: Record<string, unknown>) => void) => {
      cb({ apiKey: 'cuti_testkey' });
    });
    expect(await getApiKey()).toBe('cuti_testkey');
  });

  it('returns null when no key is stored', async () => {
    mockSync.get.mockImplementation((_keys: string[], cb: (r: Record<string, unknown>) => void) => {
      cb({});
    });
    expect(await getApiKey()).toBeNull();
  });
});

describe('setApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls chrome.storage.sync.set with the key', async () => {
    mockSync.set.mockImplementation((_data: Record<string, unknown>, cb: () => void) => {
      cb();
    });
    await setApiKey('cuti_newkey');
    expect(mockSync.set).toHaveBeenCalledWith({ apiKey: 'cuti_newkey' }, expect.any(Function));
  });
});
