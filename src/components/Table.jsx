import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getCambio from '../globalFuncs/CambioFunc';
import '../Css/Table.css';
import MobileDetails from './MobileDetails';
import DeleteEditButtons from './DeleteEditButtons';
import { setDetailsStatus } from '../Redux/actions';
import getKeyByValue from '../globalFuncs/getObjectKeyByValue';
import Tags from '../util/Tags';
import paymentMethods from '../util/paymentMethods';

class Table extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedExpense: {},
    };

    this.handleExpenseClick = this.handleExpenseClick.bind(this);
  }

  handleExpenseClick(expense, { target }) {
    const { setDetails } = this.props;
    const PHONE_WIDTH_PX = 900;
    if (window.innerWidth < PHONE_WIDTH_PX
      && (target.tagName === 'TD' || target.tagName === 'TR')) {
      setDetails();
      this.setState({ selectedExpense: expense });
    }
  }

  createTr(expense) {
    const {
      description, tag, method, value, currency, exchangeRates, expenseId,
    } = expense;
    const { ask, name } = exchangeRates.find(({ code }) => code === currency);

    return (
      <>
        <td>{ description }</td>
        <td>{ getKeyByValue(Tags, tag) }</td>
        <td>{ getKeyByValue(paymentMethods, method) }</td>
        <td>{ Number(value).toFixed(2) }</td>
        <td>{ name.slice(0, name.indexOf('/')) }</td>
        <td>{ Number(ask).toFixed(2) }</td>
        <td>{ getCambio(value, ask).toFixed(2) }</td>
        <td>Real</td>
        <td>
          <DeleteEditButtons expenseId={ expenseId } />
        </td>
      </>
    );
  }

  render() {
    const { expenses, mobileDetailsStatus } = this.props;
    const { selectedExpense } = this.state;

    return (
      <>
        <table className="table-main">
          <thead className="thead-main">
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody className="tbody-main">
            { expenses.map((expense) => (
              <tr
                key={ expense.expenseId }
                onClick={ (e) => this.handleExpenseClick(expense, e) }
              >
                {this.createTr(expense)}
              </tr>
            )) }
          </tbody>
        </table>
        { mobileDetailsStatus
        && <MobileDetails
          expense={ selectedExpense }
          handleExit={ this.handleExpenseClick }
        /> }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  mobileDetailsStatus: state.checkScreen.mobileDetailsStatus,
});

const mapDispatchToProps = (dispatch) => ({
  setDetails: () => dispatch(setDetailsStatus()),
});

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
  setDetails: PropTypes.func.isRequired,
  mobileDetailsStatus: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
