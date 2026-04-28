import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import { User } from '@/types/auth';

describe('LoginForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    localStorage.clear();
  });

  it('should login with valid credentials and create session', async () => {
    // Setup: Create a test user in localStorage
    const testUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('habit-tracker-users', JSON.stringify([testUser]));

    // Render the component
    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Fill in the form
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for async operations
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    // Verify session was created in localStorage
    const sessionJson = localStorage.getItem('habit-tracker-session');
    expect(sessionJson).not.toBeNull();
    
    const session = JSON.parse(sessionJson!);
    expect(session).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
    });
  });

  it('should show exact error message for invalid credentials', async () => {
    // Setup: Create a test user in localStorage
    const testUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('habit-tracker-users', JSON.stringify([testUser]));

    // Render the component
    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Fill in the form with wrong password
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    // Verify onSuccess was not called
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Verify no session was created
    expect(localStorage.getItem('habit-tracker-session')).toBeNull();
  });

  it('should call onSuccess callback on successful login', async () => {
    // Setup: Create a test user in localStorage
    const testUser: User = {
      id: 'user-456',
      email: 'user@test.com',
      password: 'mypassword',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('habit-tracker-users', JSON.stringify([testUser]));

    // Render the component
    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Fill in the form
    const emailInput = screen.getByTestId('auth-login-email');
    const passwordInput = screen.getByTestId('auth-login-password');
    const submitButton = screen.getByTestId('auth-login-submit');

    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify onSuccess was called
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should have all required test identifiers present', () => {
    // Render the component
    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Verify all test identifiers are present
    expect(screen.getByTestId('auth-login-email')).toBeInTheDocument();
    expect(screen.getByTestId('auth-login-password')).toBeInTheDocument();
    expect(screen.getByTestId('auth-login-submit')).toBeInTheDocument();
  });
});
