import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { response as mockData, initialStateWithExpenses } from './mockData';
import Wallet from '../pages/Wallet';

import { renderWithRouterAndStore } from './testConfig';

const apiResponse = Promise.resolve({
  json: () => Promise.resolve(mockData),
  ok: true,
});

const mockedExchange = jest.spyOn(global, 'fetch').mockImplementation(() => apiResponse);
let HISTORY;
let STORE;

afterEach(() => jest.clearAllMocks());

describe('Testando os elementos da table com width > 900', () => {
  beforeEach(() => {
    const initial = initialStateWithExpenses;
    renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
  });

  test('A tabela deve possuir um cabeçalho com os campos Descrição, Tag, Método de pagamento, Valor, Moeda, Câmbio utilizado, Valor convertido e Moeda de conversão', () => {
    const thDescricao = screen.getByRole('columnheader', { name: 'Descrição' });
    const thTag = screen.getByRole('columnheader', { name: 'Tag' });
    const thMetodo = screen.getByRole('columnheader', { name: 'Método de pagamento' });
    const thValor = screen.getByRole('columnheader', { name: 'Valor' });
    const thMoeda = screen.getByRole('columnheader', { name: 'Moeda' });
    const thCambio = screen.getByRole('columnheader', { name: 'Câmbio utilizado' });
    const thValorConvertido = screen.getByRole('columnheader', { name: 'Valor convertido' });
    const thMoedaConversao = screen.getByRole('columnheader', { name: 'Moeda de conversão' });
    const thEditarExcluir = screen.getByRole('columnheader', { name: 'Editar/Excluir' });

    expect(thDescricao).toBeInTheDocument();
    expect(thTag).toBeInTheDocument();
    expect(thMetodo).toBeInTheDocument();
    expect(thValor).toBeInTheDocument();
    expect(thMoeda).toBeInTheDocument();
    expect(thCambio).toBeInTheDocument();
    expect(thValorConvertido).toBeInTheDocument();
    expect(thMoedaConversao).toBeInTheDocument();
    expect(thEditarExcluir).toBeInTheDocument();
  });

  test('A tabela deve ser alimentada pelo estado da aplicação, que estará disponível na chave expenses que vem do reducer wallet.', () => {
    expect(screen.getAllByRole('cell', { name: 'Dez dólares' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Lazer' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Cartão de crédito' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '10.00' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Dólar Comercia' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '5.58' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '55.75' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Real' })[0]).toBeInTheDocument();

    expect(screen.getAllByRole('cell', { name: 'Vinte euros' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Trabalho' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Dinheiro' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '20.00' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Eur' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '6.57' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '131.37' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Real' })[1]).toBeInTheDocument();
  });
});

describe('Testando o botão de deletar despesa', () => {
  beforeEach(() => {
    const initial = initialStateWithExpenses;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira' }, initial);
    STORE = store
  })

  test('O botão deve estar dentro do último item da linha da tabela.', () => {
    expect(screen.getAllByTestId('delete-btn')[0]).toBeInTheDocument();
  });

  test('Ao ser clicado, o botão deleta a linha da tabela, alterando o estado global.', () => {
    const deleteBtn = screen.getAllByTestId('delete-btn')[0];
    userEvent.click(deleteBtn);

    expect(screen.getByRole('cell', { name: 'Vinte euros' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Trabalho' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Dinheiro' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '20.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Eur' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '6.57' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '131.37' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Real' })).toBeInTheDocument();

    const newExpenses = [
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: mockData,
      },
    ];

    expect(STORE.getState().wallet.expenses).toStrictEqual(newExpenses);
  });

  test('Ao clicar no botão para remover uma despesa, o valor correspondente deve ser subtraído e a despesa total deve ser atualizada no header', () => {
    const deleteBtn = screen.getAllByTestId('delete-btn')[0];
    userEvent.click(deleteBtn);

    const newExpenses = [
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: mockData,
      },
    ];

    expect(STORE.getState().wallet.expenses).toStrictEqual(newExpenses);

    const totalField = screen.getByTestId('total-field');
    expect(totalField).toContainHTML('131.37');
  });
});

describe('Testando o botão de editar despesa', () => {
  beforeEach(() => {
    const initial = initialStateWithExpenses;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira' }, initial);
    STORE = store
  })

  test('O botão deve estar dentro da linha da tabela e deve possuir `data-testid="edit-btn"`', () => {
    expect(screen.getAllByTestId('edit-btn')[0]).toBeInTheDocument();
  });

  test('Ao ser clicado, o botão habilita um formulário para editar a linha da tabela. Ao clicar em "Editar despesa" ela é atualizada e atualiza a soma de despesas no header.', async () => {
  
    const toggleEditBtn = screen.getAllByTestId('edit-btn')[0];
    userEvent.click(toggleEditBtn);

    const editButton = await screen.findByRole('button', {
      name: /Editar despesa/i,
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

    userEvent.type(valueInput, '100');
    userEvent.selectOptions(currencyInput, 'CAD');
    userEvent.selectOptions(methodInput, 'Dinheiro');
    userEvent.selectOptions(tagInput, 'Trabalho');
    userEvent.type(descriptionInput, 'Cem dólares canadenses');

    userEvent.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByRole('cell', { name: 'Cem dólares canadenses' }),
      ).toBeInTheDocument();
    });

    expect(screen.getAllByRole('cell', { name: 'Trabalho' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Dinheiro' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '100.00' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Dólar Canadens' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '4.20' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '420.41' })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: 'Real' })[0]).toBeInTheDocument();

    const newExpenses = [
      {
        id: 0,
        value: '100',
        currency: 'CAD',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Cem dólares canadenses',
        exchangeRates: mockData,
      },
      {
        id: 1,
        value: '20',
        currency: 'EUR',
        method: 'Dinheiro',
        tag: 'Trabalho',
        description: 'Vinte euros',
        exchangeRates: mockData,
      },
    ];

    expect(STORE.getState().wallet.expenses).toStrictEqual(newExpenses);
  });
});

describe('Testando os elementos da table com width < 900', () => {
  beforeEach(() => {
    global.innerWidth = 890;
    const initial = initialStateWithExpenses;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
    STORE = store;
  });

  test('Ao clicar em alguma despesa o estado \'mobileDetailsStatus\' se torna true', () => {
    const cells = screen.getAllByRole('cell');
    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeFalsy();
    userEvent.click(cells[0]);

    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeTruthy();
    const closeButton = screen.getByRole('button', { name: 'X' });
    userEvent.click(closeButton);
    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeFalsy();
  });
});

describe('Testando os elementos da table com width < 650', () => {
  beforeEach(() => {
    global.innerWidth = 640;
    const initial = initialStateWithExpenses;
    const { store } = renderWithRouterAndStore(<Wallet />, { route: '/carteira'}, initial);
    STORE = store;
  });

  test('Se ao clicar em editar o estado \'mobileDetailsStatus\' se torna falso.', () => {
    const cells = screen.getAllByRole('cell');
    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeFalsy();
    userEvent.click(cells[0]);

    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeTruthy();
    expect(STORE.getState().checkScreen.formStatus).toBeFalsy();
    const editButton = screen.getAllByTestId('edit-btn');
    userEvent.click(editButton[0]);
    expect(STORE.getState().checkScreen.mobileDetailsStatus).toBeFalsy();
    expect(STORE.getState().checkScreen.formStatus).toBeTruthy();
  });
});
