import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { initialStateOnlyEmail } from './mockData';
import App from '../App';

import { renderWithRouterAndStore } from './testConfig';

afterEach(() => jest.clearAllMocks());
const INITIAL = initialStateOnlyEmail;

describe('Testando a página Wallet', () => {

  test('Deve ser redirecionado para a página de not found se não estiver logado', () => {
    const { history } = renderWithRouterAndStore(<App />, { route: '/carteira' });
    expect(history.location.pathname).toBe('/wallet/notFound');
  });

  test('A rota para esta página deve ser \'/carteira\'', () => {
    renderWithRouterAndStore(<App />, { route: '/carteira' }, INITIAL);
    const email = screen.queryByTestId('email-input');
    const emailField = screen.queryByTestId('email-field');
    expect(email).toBeNull();
    expect(emailField).toHaveTextContent('alguem@email.com');
  });
});

describe('Testando o footer', () => {
  test('Checando os elementos do footer', () => {
    renderWithRouterAndStore(<App />, { route: '/carteira' }, INITIAL);

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();

    const socials = screen.getAllByTestId('social-icon');
    expect(socials).toHaveLength(2);
    expect(socials[0]).toBeInTheDocument();
    expect(socials[1]).toBeInTheDocument();
  });
});

describe('Testando a página do notFound', () => {
  test('Checa os elementos da página', () => {
    const { history } = renderWithRouterAndStore(<App />, { route: '/carteira' });

    const img = screen.getByAltText('Contando dinheiro');
    const title = screen.getByRole('heading', { level: 1, name: /404 - Página não encontrada/i });
    const link = screen.getByText('Retornar para login');
    expect(img).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    userEvent.click(link);
    expect(history.location.pathname).toBe('/');
  });
});
