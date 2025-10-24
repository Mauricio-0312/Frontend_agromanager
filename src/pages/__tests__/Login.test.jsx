jest.mock('../../api', () => ({
  api: {}
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import Login from '../Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login page', () => {
  it('renders login form', () => {
    render(
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <Login />
      </AuthContext.Provider>
    );
  });

  it('allows typing in email and password fields', () => {
    render(
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <Login />
      </AuthContext.Provider>
    );
    const emailInput = screen.getByPlaceholderText(/email@dominio.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('123456');
  });
});
