jest.mock('../../api', () => ({
  api: {
    fetchUsers: jest.fn(() => Promise.resolve({ data: [
      { ID: 1, Email: 'admin@demo.com', Name: 'Admin', Role: 'admin' },
      { ID: 2, Email: 'user@demo.com', Name: 'User', Role: 'user' }
    ] })),
    createUser: jest.fn(() => Promise.resolve({}))
  }
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from '../AdminPanel';

describe('AdminPanel', () => {
  it('renders users table', async () => {
    render(<AdminPanel />);
    await waitFor(() => {
      expect(screen.getByText('admin@demo.com')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('user@demo.com')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  it('renders create user form and allows typing', async () => {
    render(<AdminPanel />);
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Nuevo' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'nuevo@demo.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByDisplayValue('user'), { target: { value: 'admin' } });
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nombre').value).toBe('Nuevo');
      expect(screen.getByPlaceholderText('Email').value).toBe('nuevo@demo.com');
      expect(screen.getByPlaceholderText('Password').value).toBe('123456');
      expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
    });
  });
});
