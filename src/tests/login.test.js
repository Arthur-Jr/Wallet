import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import App from '../App';

import { renderWithRouterAndStore } from './testConfig';

const EMAIL_INPUT_TEST_ID = 'email-input';
const PASSWORD_INPUT_TEST_ID = 'password-input';
const VALID_EMAIL = 'alguem@email.com';
const VALID_PASSWORD = '123456';
let HISTORY;
let STORE;

afterEach(() => jest.clearAllMocks());

describe('Testando os elementos da página', () => {
  beforeEach(()=> {
    const { history } = renderWithRouterAndStore(<App />, '/');
    HISTORY = history;
  });

  test('A rota para esta página deve ser \'/\'', () => {
    expect(HISTORY.location.pathname).toBe('/');
  });

  test('Deve existir um titulo escrito \'Login\' ', () => {
    const title = screen.getByRole('heading', { level: 1, name: /login/i });
    expect(title).toBeInTheDocument();
  });

  test('Deve exitir uma logo', () => {
    const logo = screen.getByAltText('Wallet icon');
    expect(logo).toBeInTheDocument();
  });

  test('Deve existir um input pra senha e email', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);

    expect(email).toBeInTheDocument();
    expect(senha).toBeInTheDocument();
  });

  test('Deve existir um botão com o texto \'Entrar\'', () => {
    const button = screen.getByText(/Entrar/i);
    expect(button).toBeInTheDocument();
  });
});

describe('Testando o funcionamento do botão e dos inputs', () => {
  beforeEach(()=> {
    renderWithRouterAndStore(<App />, '/');
  });

  test('O botão de "Entrar" está desabilitado ao entrar na página', () => {
    const button = screen.getByText(/Entrar/i);
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar está desabilitado quando um email inválido é digitado', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, 'email');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'email@com@');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'emailcom@');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar está desabilitado quando uma senha inválida é digitada', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, '23456');
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar" está habilitado quando um email e uma senha válidos são passados', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeEnabled();
  });
});

describe('Testando se as informações são salvas ao fazer login', () => {
  beforeEach(()=> {
    const { store, history } = renderWithRouterAndStore(<App />, '/');
    STORE = store;
    HISTORY = history;
  });

  test('Salve o email no estado da aplicação, com a chave email, assim que o usuário logar.', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    fireEvent.click(button);

    expect(STORE.getState().user.email).toBe(VALID_EMAIL);
  });

  test('A rota deve ser mudada para \'/carteira\' após o clique no botão.', () => {
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    fireEvent.click(button);

    expect(HISTORY.location.pathname).toBe('/carteira');
  });
});
