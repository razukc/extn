import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Popup } from '../Popup';

describe('Popup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the popup component', () => {
    render(<Popup />);
    expect(screen.getByText(/{{projectName}}/i)).toBeInTheDocument();
  });

  it('displays initial count', () => {
    render(<Popup />);
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
  });

  it('displays increment button', () => {
    render(<Popup />);
    const button = screen.getByRole('button', { name: /increment/i });
    expect(button).toBeInTheDocument();
  });

  it('increments count on button click', async () => {
    render(<Popup />);
    const button = screen.getByRole('button', { name: /increment/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
    });
  });

  it('saves count to chrome storage on increment', async () => {
    const mockSet = vi.fn();
    global.chrome.storage.local.set = mockSet;

    render(<Popup />);
    const button = screen.getByRole('button', { name: /increment/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockSet).toHaveBeenCalledWith({ count: 1 });
    });
  });

  it('loads saved count from chrome storage', async () => {
    const mockGet = vi.fn((keys, callback) => {
      callback({ count: 5 });
    });
    global.chrome.storage.local.get = mockGet;

    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Count: 5/i)).toBeInTheDocument();
    });
  });

  it('displays current tab title when available', async () => {
    const mockQuery = vi.fn((queryInfo, callback) => {
      callback([{ title: 'Example Tab' }]);
    });
    global.chrome.tabs.query = mockQuery;

    render(<Popup />);
    
    await waitFor(() => {
      expect(screen.getByText(/Current tab: Example Tab/i)).toBeInTheDocument();
    });
  });

  it('does not display tab info when no tab is available', () => {
    const mockQuery = vi.fn((queryInfo, callback) => {
      callback([]);
    });
    global.chrome.tabs.query = mockQuery;

    render(<Popup />);
    
    expect(screen.queryByText(/Current tab:/i)).not.toBeInTheDocument();
  });
});
