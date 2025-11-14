import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Popup from '../Popup.vue';

// Mock Chrome API
const mockChromeStorage = {
  local: {
    get: vi.fn(),
    set: vi.fn(),
  },
};

const mockChromeTabs = {
  query: vi.fn(),
};

(global as any).chrome = {
  storage: mockChromeStorage,
  tabs: mockChromeTabs,
};

describe('Popup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the popup component', () => {
    const wrapper = mount(Popup);
    expect(wrapper.exists()).toBe(true);
  });

  it('loads count from chrome.storage on mount', async () => {
    const mockCount = 5;
    mockChromeStorage.local.get.mockImplementation((_keys, callback) => {
      callback({ count: mockCount });
    });

    const wrapper = mount(Popup);
    await wrapper.vm.$nextTick();

    expect(mockChromeStorage.local.get).toHaveBeenCalledWith(
      ['count'],
      expect.any(Function)
    );
  });

  it('increments count and saves to storage on button click', async () => {
    mockChromeStorage.local.get.mockImplementation((_keys, callback) => {
      callback({ count: 0 });
    });

    const wrapper = mount(Popup);
    await wrapper.vm.$nextTick();

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(mockChromeStorage.local.set).toHaveBeenCalledWith({ count: 1 });
  });

  it('queries current tab on mount', async () => {
    const mockTab = { id: 1, title: 'Test Tab', url: 'https://example.com' };
    mockChromeTabs.query.mockImplementation((_query, callback) => {
      callback([mockTab]);
    });

    const wrapper = mount(Popup);
    await wrapper.vm.$nextTick();

    expect(mockChromeTabs.query).toHaveBeenCalledWith(
      { active: true, currentWindow: true },
      expect.any(Function)
    );
  });
});
