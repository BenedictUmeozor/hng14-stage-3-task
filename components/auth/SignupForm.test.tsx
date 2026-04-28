import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '@/components/auth/SignupForm';
import { User } from '@/types/auth';

describe('SignupForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    localStorage.clear();
  });

  it('should signup with valid credentials and create user and session', async () => {
    // Render the component
    render(<SignupForm onSuccess={mockOnSuccess} />);

    // Fill in the form
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for async operations
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });

    // Verify user was created in localStorage
    const usersJson = localStorage.getItem('habit-tracker-users');
    expect(usersJson).not.toBeNull();
    
    const users: User[] = JSON.parse(usersJson!);
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({
      email: 'newuser@example.com',
      password: 'password123',
    });
    expect(users[0].id).toBeDefined();
    expect(users[0].createdAt).toBeDefined();

    // Verify session was created in localStorage
    const sessionJson = localStorage.getItem('habit-tracker-session');
    expect(sessionJson).not.toBeNull();
    
    const session = JSON.parse(sessionJson!);
    expect(session).toEqual({
      userId: users[0].id,
      email: 'newuser@example.com',
    });
  });

  it('should show exact error message for existing email', async () => {
    // Setup: Create an existing user in localStorage
    const existingUser: User = {
      id: 'user-123',
      email: 'existing@example.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('habit-tracker-users', JSON.stringify([existingUser]));

    // Render the component
    render(<SignupForm onSuccess={mockOnSuccess} />);

    // Fill in the form with existing email
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });

    // Verify onSuccess was not called
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Verify no new user was created (still only 1 user)
    const usersJson = localStorage.getItem('habit-tracker-users');
    const users: User[] = JSON.parse(usersJson!);
    expect(users).toHaveLength(1);

    // Verify session was not created
    expect(localStorage.getItem('habit-tracker-session')).toBeNull();
  });

  it('should call onSuccess callback on successful signup', async () => {
    // Render the component
    render(<SignupForm onSuccess={mockOnSuccess} />);

    // Fill in the form
    const emailInput = screen.getByTestId('auth-signup-email');
    const passwordInput = screen.getByTestId('auth-signup-password');
    const submitButton = screen.getByTestId('auth-signup-submit');

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
    render(<SignupForm onSuccess={mockOnSuccess} />);

    // Verify all test identifiers are present
    expect(screen.getByTestId('auth-signup-email')).toBeInTheDocument();
    expect(screen.getByTestId('auth-signup-password')).toBeInTheDocument();
    expect(screen.getByTestId('auth-signup-submit')).toBeInTheDocument();
  });
});
