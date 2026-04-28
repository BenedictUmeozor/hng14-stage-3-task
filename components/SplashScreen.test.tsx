import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SplashScreen from './SplashScreen';

describe('SplashScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with test identifier "splash-screen"', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);
    
    const splashScreen = screen.getByTestId('splash-screen');
    expect(splashScreen).toBeDefined();
  });

  it('should display "Habit Tracker" branding', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);
    
    expect(screen.getByText('Habit Tracker')).toBeDefined();
  });

  it('should call onComplete callback after timeout', () => {
    const onComplete = vi.fn();
    render(<SplashScreen onComplete={onComplete} />);
    
    expect(onComplete).not.toHaveBeenCalled();
    
    // Fast-forward time by 1200ms (the duration set in the component)
    vi.advanceTimersByTime(1200);
    
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should cleanup timeout on unmount', () => {
    const onComplete = vi.fn();
    const { unmount } = render(<SplashScreen onComplete={onComplete} />);
    
    unmount();
    
    // Fast-forward time after unmount
    vi.advanceTimersByTime(1200);
    
    // onComplete should not be called after unmount
    expect(onComplete).not.toHaveBeenCalled();
  });
});
