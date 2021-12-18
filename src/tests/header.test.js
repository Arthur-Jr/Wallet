import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/react';
import { response as mockData, initialStateHeader, initialStateOnlyEmail } from './mockData';
import Wallet from '../pages/Wallet';

import { renderWithRouterAndStore } from './testConfig';

const apiResponse = Promise.resolve({
  json: () => Promise.resolve(mockData),
  ok: true,
});

const mockedExchange = jest.spyOn(global, 'fetch').mockImplementation(() => apiResponse);
let STORE;

afterEach(() => jest.clearAllMocks());

describe('Testando a parte 1 do header', () => {
  beforeEach(() => {
    const initial = initialStateHeader;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
    STORE = store;
  });

  test('Deve existir um titulo escrito \'MyWallet\' ', () => {
    const title = screen.getByRole('heading', { level: 1, name: 'MyWallet' });
    expect(title).toBeInTheDocument();
  });

  test('Testa o elemento que exibe o email do usuário que fez login.', () => {
    const emailField = screen.getByTestId('email-field');

    expect(emailField).not.toHaveTextContent('');
    expect(emailField).toContainHTML(STORE.getState().user.email);
  });

  test('O campo com a despesa total gerada pela lista de gastos deve existir com o valor 0.', () => {
    const totalField = screen.getByTestId('total-field');

    const INITIAL_VALUE = 0;
    expect(totalField).toContainHTML(INITIAL_VALUE);
  });

  test('O câmbio deve ser \'BRL\'', () => {
    const exchangeField = screen.getByTestId('total-field');

    expect(exchangeField).toBeInTheDocument();
    expect(exchangeField.innerHTML).toContain('0.00 BRL');
  });
});

describe('Testando o form do header com width > 650', () => {
  beforeEach(() => {
    const initial = initialStateHeader;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
    STORE = store;
  });

  test('Um campo para adicionar o valor da despesa', async () => {
    const valueInput = await screen.findByLabelText(/valor/i);

    expect(valueInput).toBeInTheDocument();
  });

  test('Um campo para selecionar em qual moeda será registrada a despesa', async () => {
    const currencyInput = await screen.findByRole('combobox', {
      name: /moeda/i,
    });

    expect(currencyInput).toBeInTheDocument();
  });

  test('Um campo para selecionar qual método de pagamento será utilizado', async () => {
    const methodInput = await screen.findByRole('combobox', {
      name: /método/i,
    });

    const moneyOption = screen.getByRole('option', { name: /dinheiro/i });
    const creditOption = screen.getByRole('option', { name: /cartão de crédito/i });
    const debitOption = screen.getByRole('option', { name: /cartão de débito/i });

    expect(methodInput).toBeInTheDocument();
    expect(moneyOption).toBeInTheDocument();
    expect(creditOption).toBeInTheDocument();
    expect(debitOption).toBeInTheDocument();
  });

  test('Um campo para selecionar uma categoria (tag) para a despesa.', async () => {
    const tagInput = await screen.findByRole('combobox', {
      name: /tag/i,
    });
    const foodOption = screen.getByRole('option', { name: /alimentação/i });
    const funOption = screen.getByRole('option', { name: /lazer/i });
    const workOption = screen.getByRole('option', { name: /trabalho/i });
    const transportOption = screen.getByRole('option', { name: /transporte/i });
    const healthOption = screen.getByRole('option', { name: /saúde/i });

    expect(tagInput).toBeInTheDocument();
    expect(foodOption).toBeInTheDocument();
    expect(funOption).toBeInTheDocument();
    expect(workOption).toBeInTheDocument();
    expect(transportOption).toBeInTheDocument();
    expect(healthOption).toBeInTheDocument();
  });

  test('Um campo para adicionar a descrição da despesa', async () => {
    const descriptionInput = await screen.findByRole('textbox', {
      name: /descrição/i,
    });

    expect(descriptionInput).toBeInTheDocument();
  });
});

describe('Testando se as opções do campo "Moedas" estão sendo preenchidas com as siglas das moedas da API', () => {
  const initial = initialStateOnlyEmail;

  test('Um campo para selecionar em qual moeda será registrada a despesa', async () => {
    renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
    const currencyInput = await screen.findByRole('combobox', {
      name: /moeda/i,
    });

    const coinOptions = within(currencyInput).getAllByRole('option');
    const coinOptionsValues = coinOptions.map((coinOption) => coinOption.value);

    const expectedCoinOptions = [
      'USD', 'CAD', 'EUR', 'GBP', 'ARS', 'BTC', 'LTC',
      'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP',
    ];

    expect(coinOptionsValues).toEqual(expectedCoinOptions);

    expect(mockedExchange).toBeCalled();
    expect(mockedExchange).toBeCalledWith('https://economia.awesomeapi.com.br/json/all');
    expect(currencyInput).toBeInTheDocument();
  });
});

describe('Testando se o botão de "Adicionar despesa" está funcionando', () => {
  const initial = initialStateOnlyEmail;

  test('A funcionalidade do botão \'Adicionar despesa\' com o estado.', async () => {
    const { store } = renderWithRouterAndStore(<Wallet />, '/carteira', initial);

    const addButton = await screen.findByRole('button', {
      name: /adicionar despesa/i,
    });
    const valueInput = await screen.findByLabelText(/valor/i);
    const currencyInput = await screen.findByRole('combobox', {
      name: /moeda/i,
    });
    const methodInput = await screen.findByRole('combobox', {
      name: /método/i,
    });
    const tagInput = await screen.findByRole('combobox', {
      name: /tag/i,
    });
    const descriptionInput = await screen.findByRole('textbox', {
      name: /descrição/i,
    });

    userEvent.type(valueInput, '10');
    userEvent.selectOptions(currencyInput, 'USD');
    userEvent.selectOptions(methodInput, 'Cartão de crédito');
    userEvent.selectOptions(tagInput, 'Lazer');
    userEvent.type(descriptionInput, 'Dez dólares');
    userEvent.click(addButton);

    await waitFor(() => {
      expect(mockedExchange).toBeCalledTimes(2);
    });

    const expectedStateExpense = [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: mockData,
      },
    ];

    expect(store.getState().wallet.expenses).toStrictEqual(expectedStateExpense);

    userEvent.type(valueInput, '20');
    userEvent.selectOptions(currencyInput, 'EUR');
    userEvent.selectOptions(methodInput, 'Cartão de débito');
    userEvent.selectOptions(tagInput, 'Trabalho');
    userEvent.type(descriptionInput, 'Vinte euros');
    userEvent.click(addButton);

    await waitFor(() => {
      expect(mockedExchange).toBeCalledTimes(3);
    });

    const expectedStateExpense2 = [
      {
        id: 0,
        value: '10',
        currency: 'USD',
        method: 'Cartão de crédito',
        tag: 'Lazer',
        description: 'Dez dólares',
        exchangeRates: mockData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Cartão de débito',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: mockData,
      },
    ];

    expect(store.getState().wallet.expenses).toStrictEqual(expectedStateExpense2);

    const totalField = screen.getByTestId('total-field');
    expect(totalField).toContainHTML('187.12');
  });
});

describe('Testando o form do header com width < 650', () => {
  global.innerWidth = 640;
  let BUTTON;
  let FORM_SECTION;
  beforeEach(() => {
    const initial = initialStateHeader;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);

    STORE = store;
    BUTTON = screen.getByRole('button', { name: /adicionar nova despesa/i });
    FORM_SECTION = screen.queryByTestId('form-section');
  });

  test('Deve existir um botão para adicionar a despesa', () => {
    expect(BUTTON).toBeInTheDocument();
  });

  test('O form deve ter a class \'hidden-form\'', async () => {
    expect(FORM_SECTION.className).toBe('hidden-form');
  });

  test('Após clicar no botão o form deve ter a class \'form-section\'', () => {
    userEvent.click(BUTTON);
    expect(FORM_SECTION.className).toBe('form-section');
  });

  test('Deve existir dois botôes no form: \'cancelar\' e \'adicionar despesa\'', () => {
    userEvent.click(BUTTON);
    expect(FORM_SECTION.className).toBe('form-section');
    
    const add = screen.getByRole('button', { name: /adicionar despesa/i });
    const cancel = screen.getByRole('button', { name: /cancelar/i });
    expect(add).toBeInTheDocument();
    expect(cancel).toBeInTheDocument();
  });

  test('Após clicar em cancelar o state \'formStatus\' deve ser falso.', () => {
    userEvent.click(BUTTON);
    expect(STORE.getState().checkScreen.formStatus).toBeTruthy();

    const cancel = screen.getByRole('button', { name: /cancelar/i });
    userEvent.click(cancel);
    expect(STORE.getState().checkScreen.formStatus).toBeFalsy();
  });

  test('Se após clicar em adicionar despesa o state \'formStatus\' deve ser falso. ', async () => {
    userEvent.click(BUTTON);
    expect(STORE.getState().checkScreen.formStatus).toBeTruthy();

    const addButton = await screen.findByRole('button', {
      name: /adicionar despesa/i,
    });
    const valueInput = await screen.findByLabelText(/valor/i);
    const currencyInput = await screen.findByRole('combobox', {
      name: /moeda/i,
    });
    const methodInput = await screen.findByRole('combobox', {
      name: /método/i,
    });
    const tagInput = await screen.findByRole('combobox', {
      name: /tag/i,
    });
    const descriptionInput = await screen.findByRole('textbox', {
      name: /descrição/i,
    });

    userEvent.type(valueInput, '10');
    userEvent.selectOptions(currencyInput, 'USD');
    userEvent.selectOptions(methodInput, 'Cartão de crédito');
    userEvent.selectOptions(tagInput, 'Lazer');
    userEvent.type(descriptionInput, 'Dez dólares');
    userEvent.click(addButton);

    await waitFor(() => {
      expect(mockedExchange).toBeCalledTimes(2);
    });

    expect(STORE.getState().checkScreen.formStatus).toBeFalsy();
  });
});
