import { vi } from 'vitest';

vi.stubGlobal('chrome', {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  runtime: {
    openOptionsPage: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
  },
});
