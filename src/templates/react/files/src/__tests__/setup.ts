import '@testing-library/jest-dom';

// Mock Chrome API
global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys, callback) => {
        callback({});
      }),
      set: vi.fn((items, callback) => {
        if (callback) callback();
      }),
    },
  },
  tabs: {
    query: vi.fn((queryInfo, callback) => {
      callback([]);
    }),
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    onMessage: {
      addListener: vi.fn(),
    },
  },
} as any;
